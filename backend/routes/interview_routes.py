from flask import Blueprint, request, jsonify
from models.question_model import Question
import random
from models.interview_result_model import InterviewResult
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.interview_answer_model import InterviewAnswer

interview_bp = Blueprint("interview", __name__)

# ✅ GET MULTIPLE QUESTIONS
@interview_bp.route("/get-questions", methods=["GET"])
def get_questions():
    count = int(request.args.get("count", 5))

    questions = Question.query.all()

    if len(questions) < count:
        return jsonify({"error": "Not enough questions"})

    selected = random.sample(questions, count)

    question_list = [
        {"id": q.id, "question": q.question} for q in selected
    ]

    return jsonify({"questions": question_list})


# ✅ SAVE RESULT + ANSWERS
@interview_bp.route("/save-result", methods=["POST"])
@jwt_required()
def save_result():
    data = request.json

    total_score = data.get("score")   # ✅ interview score
    time_taken = data.get("time_taken")
    total_questions = data.get("total_questions", 5)
    answers = data.get("answers", [])

    user_id = int(get_jwt_identity())

    # ✅ 1. Save interview result
    result = InterviewResult(
        user_id=user_id,
        score=total_score,
        total_questions=total_questions,
        time_taken=time_taken
    )

    db.session.add(result)
    db.session.commit()  # VERY IMPORTANT

    # ✅ 2. Save each answer
    for item in answers:
        ans_text = item.get("answer", "")

        # ✅ simple scoring logic
        if len(ans_text) < 20:
            ans_score = 3
        elif len(ans_text) < 50:
            ans_score = 6
        else:
            ans_score = 9

        ans = InterviewAnswer(
            interview_id=result.id,
            question=item.get("question"),
            answer=ans_text,
            score=ans_score
        )

        db.session.add(ans)

    db.session.commit()  # ✅ SAVE ALL ANSWERS

    return jsonify({"message": "Result & answers saved"})


# ✅ GET RESULTS
@interview_bp.route("/results", methods=["GET"])
@jwt_required()
def get_results():
    user_id = int(get_jwt_identity())

    results = InterviewResult.query.filter_by(user_id=user_id).all()

    data = []
    for r in results:
        data.append({
            "score": r.score,
            "time_taken": r.time_taken,
            "date": str(r.created_at) if r.created_at else ""
        })

    return jsonify({"results": data})