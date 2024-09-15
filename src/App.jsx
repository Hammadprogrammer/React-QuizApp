import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionState, setQuestionState] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        shuffleAnswers(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function shuffleAnswers(question) {
    const answers = [
      ...question.incorrectAnswers,
      question.correctAnswer,
    ];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    setShuffledAnswers(answers);
  }

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert("Please select an answer!");
      return;
    }

    if (selectedAnswer === questions[questionState].correctAnswer) {
      setScore(score + 1);
    }

    if (questionState < questions.length - 1) {
      setQuestionState(questionState + 1);
      setSelectedAnswer(null);
      shuffleAnswers(questions[questionState + 1]);
    } else {
      setIsQuizComplete(true);
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[questionState];

    return (
      <Paper
        elevation={4}
        style={{
          padding: "40px",
          marginTop: "30px",
          maxWidth: "650px",
          margin: "0 auto",
          backgroundColor: "#fff4e6",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom style={{ color: "#444", fontWeight: "bold" }}>
          Question {questionState + 1} of {questions.length}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: "20px", color: "#555" }}>
          {currentQuestion.question.text}
        </Typography>

        <FormControl component="fieldset" style={{ width: "100%" }}>
          <RadioGroup
            aria-label="quiz-answers"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            {shuffledAnswers.map((answer, index) => (
              <FormControlLabel
                key={index}
                value={answer}
                control={<Radio />}
                label={answer}
                style={{
                  marginBottom: "15px",
                  color: "#333",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "10px 15px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNextQuestion}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#5c6bc0",
            borderRadius: "10px",
            color: "#fff",
          }}
        >
          {questionState < questions.length - 1 ? "Next" : "Finish Quiz"}
        </Button>
      </Paper>
    );
  };

  const renderQuizResult = () => (
    <Paper
      elevation={4}
      style={{
        padding: "40px",
        marginTop: "30px",
        maxWidth: "650px",
        margin: "0 auto",
        backgroundColor: "#e3f2fd",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: "#1e88e5", fontWeight: "bold" }}>
        Quiz Completed!
      </Typography>
      <Typography variant="h5" style={{ marginBottom: "20px", color: "#444" }}>
        Your score: {score} / {questions.length}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => window.location.reload()}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#8e24aa",
          borderRadius: "10px",
          color: "#fff",
        }}
      >
        Restart Quiz
      </Button>
    </Paper>
  );

  return (
    <Box
      p={4}
      style={{
        textAlign: "center",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "20px",
        color: "#444",
      }}
    >
      <Typography variant="h3" gutterBottom style={{ fontWeight: "bold", color: "#444" }}>
        Quiz App
      </Typography>

      {loading && <CircularProgress style={{ color: "#1e88e5" }} />}

      {!loading && questions.length > 0 && !isQuizComplete && renderQuestion()}

      {isQuizComplete && renderQuizResult()}
    </Box>
  );
}

export default App;
