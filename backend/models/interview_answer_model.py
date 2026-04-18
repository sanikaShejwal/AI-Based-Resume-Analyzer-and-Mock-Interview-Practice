from extensions import db

class InterviewAnswer(db.Model):
    __tablename__ = "interview_answers"

    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer)
    question = db.Column(db.Text)
    answer = db.Column(db.Text)
    score = db.Column(db.Integer)