from extensions import db

class InterviewResult(db.Model):
    __tablename__ = "interview_results"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    score = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)
    time_taken = db.Column(db.Integer)   
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())