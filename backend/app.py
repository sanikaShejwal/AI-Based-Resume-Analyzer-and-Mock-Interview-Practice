
import os
from routes.interview_routes import interview_bp
from dotenv import load_dotenv
load_dotenv()
print("API KEY:", os.getenv("GEMINI_API_KEY"))
from models.resume_models import Resume
from flask import Flask
from flask_jwt_extended import jwt_required
from routes.resume import resume_bp
from flask import Flask, request, jsonify
from extensions import db
from flask_cors import CORS
from flask import send_from_directory
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

# ✅ IMPORTANT → import models for table creation
from models.user import User




# ---------------- APP ----------------
app = Flask(__name__)
CORS(app)
app.register_blueprint(resume_bp)
app.register_blueprint(interview_bp) 
# ---------------- CONFIG ----------------
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:root@localhost/placement_ai"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "supersecretkey"
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs("uploads", exist_ok=True)


# ---------------- INIT ----------------
db.init_app(app)
jwt = JWTManager(app)


# ---------------- ROUTES ----------------

# Home
@app.route("/")
def home():
    return {"message": "Backend running 🚀"}


# ======================================
# ✅ REGISTER
# ======================================
@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email & password required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "User already exists"}), 409

    hashed_pw = generate_password_hash(password)

    new_user = User(
        email=email,
        password=hashed_pw
    )

    db.session.add(new_user)
    db.session.commit()

    # Automatically log in after register → generate token
    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "message": "User registered successfully",
        "access_token": token
    }), 201

# ======================================
# ✅ LOGIN
# ======================================
# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))  # string

    return jsonify({
        "message": "Login success",
        "access_token": token
    })


# ---------------- PROFILE ----------------
@app.route("/profile")
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())  # back to int
    user = User.query.get(user_id)

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/download-resume")
@jwt_required()
def download_resume():
    return send_from_directory("uploads", "resume.pdf", as_attachment=True)


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)