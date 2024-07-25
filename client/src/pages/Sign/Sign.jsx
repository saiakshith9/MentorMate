import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../components/utils.js";
import "./Sign.css";
import { Link } from "react-router-dom";

const Sign = () => {
  const [addClass, setAddClass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    question: "",
    answer: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    let formData2 = { ...formData };
    formData2[name] = value;
    setFormData(formData2);
  };

  const handleSubmit = async (task, type) => {
    if (task == "signup") {
      if (
        !formData.name ||
        !formData.username ||
        !formData.password ||
        !formData.question ||
        !formData.answer
      ) {
        return handleError("Please enter all the fields");
      }
    } else {
      if (!formData.username || !formData.password) {
        return handleError("Please enter all the fields");
      }
    }
    try {
      const url = `http://localhost:8080/auth/${task}/${type}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      
      let { success, message, error, _id } = res;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("id", _id);
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else if (error) {
        let details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="body">
        <div className={`formContainer ${addClass}`}>
          <div className="form-container sign-up-container">
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <h1 className="title">Create Account</h1>
              <input
                onChange={handleChange}
                type="text"
                placeholder="Enter Your Name"
                name="name"
                value={formData.name}
              />
              <input
                onChange={handleChange}
                type="email"
                placeholder="Enter Your Email"
                name="username"
                value={formData.username}
              />
              <input
                onChange={handleChange}
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
              />
              <select name="question" defaultValue="0" onChange={handleChange}>
                <option value="0" disabled="disabled">
                  --- Select Security Question ---
                </option>
                <option value="Name of your 1st school?">
                  Name of your 1st school?
                </option>
                <option value="What is your Favorite Food?">
                  What is your Favorite Food?
                </option>
                <option value="Which city were you born in?">
                  Which city were you born in?
                </option>
              </select>
              <input
                onChange={handleChange}
                type="text"
                placeholder="Enter Answer"
                name="answer"
                value={formData.answer}
              />
              <div className="buttons mt-3">
                <button
                  type="submit"
                  className="mt-3 button"
                  onClick={() => {
                    handleSubmit("signup", "learner");
                  }}
                >
                  Learner Sign Up
                </button>
                <button
                  type="submit"
                  className="mt-3 tutor button"
                  onClick={() => {
                    handleSubmit("signup", "tutor");
                  }}
                >
                  Tutor Sign Up
                </button>
              </div>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <h1 className="title">Welcome Back!</h1>
              <input
                onChange={handleChange}
                type="email"
                placeholder="Enter Your Email"
                name="username"
                value={formData.username}
              />
              <input
                onChange={handleChange}
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
              />
              <div className="buttons mt-3">
                <button
                  type="submit"
                  className="mt-3 button"
                  onClick={() => {
                    handleSubmit("login", "learner");
                  }}
                >
                  Learner Sign In
                </button>
                <button
                  type="submit"
                  className="mt-3 tutor button"
                  onClick={() => {
                    handleSubmit("login", "tutor");
                  }}
                >
                  Tutor Sign In
                </button>
              </div>
              <div className="mt-5">
                <Link to="/reset">Forgot Password?</Link>
              </div>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay-div">
              <div className="overlay-panel overlay-left">
                <h2>New Here?</h2>
                <p>
                  Enter your personal details and start your journey with us.
                </p>
                <button
                  className="ghost mt-3 button"
                  id="signIn"
                  onClick={() => setAddClass()}
                >
                  Sign Up
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h2>Already Have an Account?</h2>
                <p>Login to access your dashboard.</p>
                <button
                  className="ghost mt-3 button"
                  id="signUp"
                  onClick={() => setAddClass("right-panel-active")}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Sign;
