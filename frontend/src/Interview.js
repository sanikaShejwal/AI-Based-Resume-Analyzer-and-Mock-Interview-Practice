import React, { useState, useEffect } from "react";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [finalScore, setFinalScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [totalTime, setTotalTime] = useState(0);

  // ✅ number of questions (already in your UI)
  const [numQuestions, setNumQuestions] = useState(5);

  // ⏱ TIMER
  useEffect(() => {
    if (!questions.length || finalScore !== null) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
      setTotalTime((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, questions, finalScore]);

  // START INTERVIEW
  const startInterview = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/get-questions?count=${numQuestions}`
      );
      const data = await res.json();

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers([]);
      setFinalScore(null);
      setTimeLeft(120);
      setTotalTime(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Backend not running!");
    }
  };

  // NEXT QUESTION
  const nextQuestion = () => {
  const updatedAnswers = [
    ...answers,
    {
      question: questions[currentIndex]?.question,
      answer: answer
    }
  ];

  setAnswers(updatedAnswers);
  setAnswer("");
  setTimeLeft(120);

  if (currentIndex + 1 < questions.length) {
    setCurrentIndex((prev) => prev + 1);
  } else {
    calculateScore(updatedAnswers);
  }
};
  // SCORE + SAVE (✅ ONLY CHANGE HERE)
 const calculateScore = async (answersList) => {
  let score = 0;

  answersList.forEach((item) => {
    const ans = item.answer;

    if (ans.length < 20) score += 3;
    else if (ans.length < 50) score += 6;
    else score += 9;
  });

  setFinalScore(score);

  try {
    await fetch("http://localhost:5000/save-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        score,
        time_taken: totalTime,
        total_questions: questions.length,
        answers: answersList, // ✅ now structured
      }),
    });
  } catch (error) {
    console.error("Error saving result:", error);
  }
};

  // ---------------- STYLES ----------------
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f7f9fc",
      paddingTop: 50,
      paddingBottom: 50,
    },
    card: {
      backgroundColor: "white",
      padding: 30,
      borderRadius: 15,
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      maxWidth: 650,
      width: "90%",
      textAlign: "center",
      marginBottom: 30,
    },
    button: {
      backgroundColor: "#1e3a8a",
      color: "white",
      border: "none",
      padding: "12px 25px",
      margin: "10px 5px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 15,
    },
    textarea: {
      width: "90%",
      maxWidth: 600,
      padding: 12,
      borderRadius: 10,
      border: "1px solid #ccc",
      resize: "vertical",
      fontSize: 15,
      marginTop: 15,
    },
    questionHeader: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 10,
      color: "#1e3a8a",
    },
    timerBarContainer: {
      height: 8,
      width: "90%",
      maxWidth: 600,
      backgroundColor: "#ddd",
      borderRadius: 4,
      margin: "15px auto",
    },
    timerBar: {
      height: "100%",
      backgroundColor: "#1e3a8a",
      borderRadius: 4,
      transition: "width 1s linear",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#1e3a8a", marginBottom: 30 }}>
        🎤 Mock Interview
      </h1>

      {/* START SCREEN */}
      {!questions.length && (
        <div style={styles.card}>
          <h3>Select Number of Questions</h3>

          <input
            type="number"
            min="1"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            style={{
              padding: "8px",
              margin: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "80px",
              textAlign: "center",
            }}
          />

          <br />

          <button style={styles.button} onClick={startInterview}>
            Start Interview
          </button>

          <button
            style={{ ...styles.button, backgroundColor: "#4CAF50" }}
            onClick={() => (window.location.href = "/history")}
          >
            View History
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {questions.length > 0 && finalScore === null && (
        <div style={styles.card}>
          <h3 style={styles.questionHeader}>
            Question {currentIndex + 1} of {questions.length}
          </h3>

          <p>{questions[currentIndex]?.question}</p>

          <div style={styles.timerBarContainer}>
            <div
              style={{
                ...styles.timerBar,
                width: `${(timeLeft / 120) * 100}%`,
              }}
            />
          </div>

          <h4>⏱ Time Left: {timeLeft}s</h4>

          <textarea
            style={styles.textarea}
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />

          <br />

          <button style={styles.button} onClick={nextQuestion}>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      )}

      {/* RESULT */}
      {finalScore !== null && (
        <div style={styles.card}>
          <h2 style={{ color: "#4CAF50" }}>
            🎉 Interview Completed
          </h2>

          <h3>Final Score: {finalScore}</h3>
          <h4>⏱ Time Used: {totalTime} seconds</h4>

          <button
            style={styles.button}
            onClick={() => (window.location.href = "/history")}
          >
            View History
          </button>
        </div>
      )}
    </div>
  );
}

export default Interview;