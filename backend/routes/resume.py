import os
import PyPDF2
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.resume_models import Resume
from extensions import db
import google.generativeai as genai

# Load Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

resume_bp = Blueprint("resume", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- Upload Resume ----------------
@resume_bp.route("/upload-resume", methods=["POST"])
@jwt_required()
def upload_resume():
    user_id = int(get_jwt_identity())
    
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400

    file = request.files["file"]
    filename = file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    new_resume = Resume(filename=filename, user_id=user_id)
    db.session.add(new_resume)
    db.session.commit()

    return jsonify({"message": "Uploaded successfully"})


# ---------------- Get My Resumes ----------------
@resume_bp.route("/my-resumes", methods=["GET"])
@jwt_required()
def my_resumes():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": r.id, "filename": r.filename} for r in resumes])


# ---------------- Download Resume ----------------
@resume_bp.route("/download-resume/<int:id>", methods=["GET"])
@jwt_required()
def download_resume(id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=id, user_id=user_id).first()
    if not resume:
        return jsonify({"message": "Not found"}), 404
    return send_from_directory(UPLOAD_FOLDER, resume.filename, as_attachment=True)


# ---------------- Delete Resume ----------------
@resume_bp.route("/delete-resume/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_resume(id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=id, user_id=user_id).first()
    if not resume:
        return jsonify({"message": "Not found"}), 404

    file_path = os.path.join(UPLOAD_FOLDER, resume.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(resume)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"})


# ---------------- Analyze Resume ----------------
@resume_bp.route("/analyze-resume/<int:id>", methods=["GET"])
@jwt_required()
def analyze_resume(id):
    user_id = int(get_jwt_identity())

    resume = Resume.query.filter_by(id=id, user_id=user_id).first()
    if not resume:
        return jsonify({"analysis": "Resume not found"}), 404

    filepath = os.path.join("uploads", resume.filename)

    # Read PDF safely
    text = ""
    try:
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        return jsonify({"analysis": f"Could not read resume: {str(e)}"}), 500

    if not text.strip():
        return jsonify({"analysis": "Resume is empty or unreadable"}), 400

    try:
        prompt = f"""
        You are an expert career coach.
        Analyze this resume and give:
        1. Score out of 100
        2. Strengths
        3. Missing skills
        4. Suggestions

        Resume Text:
        {text[:3000]}
        """

        # ✅ Use a supported model
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        analysis_text = response.text.strip() if response.text else "No analysis returned"
        return jsonify({"analysis": analysis_text})

    except Exception as e:
        print("Analysis error:", e)
        return jsonify({"analysis": f"Error during analysis: {str(e)}"}), 500