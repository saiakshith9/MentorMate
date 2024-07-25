import React, { useState } from "react";
import "./Reset.css";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../components/utils";
import "react-toastify/dist/ReactToastify.css";

const Reset = () => {
  const [step, setStep] = useState(1); // 1: Username, 2: Security Question, 3: New Password
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/auth/info/user/${username}`
      );
      const data = await response.json();
      if (data.success) {
        setSecurityQuestion(data.user.question);
        setSecurityAnswer(data.user.answer);
        setIsUsernameSubmitted(true);
        setStep(2);
        handleSuccess("User found! Please answer the security question");
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError("An error occurred.");
    }
  };

  const handleSecurityAnswerSubmit = (e) => {
    e.preventDefault();
    if (userAnswer === securityAnswer) {
      setIsAnswerCorrect(true);
      setStep(3);
      handleSuccess("Security answer is correct. Proceed to reset password.");
    } else {
      handleError("Security answer is incorrect. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/auth/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: newPassword,
          answer: userAnswer,
        }),
      });
      const data = await response.json();
      if (data.success) {
        handleSuccess(
          "Password reset successful! Redirecting you to Login Page"
        );
        setTimeout(() => {
          window.location.href = "/register";
        }, 2500);
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError("An error occurred.");
    }
  };

  return (
    <>
      <div className="reset-body">
        <div className="reset-form">
          <h1>Reset Password</h1>
          <hr className="hr" />
          <form onSubmit={handleUsernameSubmit} className="reset-form-input">
            <h5>Enter your username</h5>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isUsernameSubmitted}
            />
            <button type="submit" disabled={isUsernameSubmitted}>
              Submit
            </button>
          </form>

          {step >= 2 && (
            <form
              onSubmit={handleSecurityAnswerSubmit}
              className="reset-form-input"
            >
              <h5>Security Question :- {securityQuestion}</h5>
              <input
                type="text"
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isAnswerCorrect}
              />
              <button type="submit" disabled={isAnswerCorrect}>
                Submit
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="reset-form-input">
              <h5>Enter New Password</h5>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit">Reset Password</button>
            </form>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Reset;
