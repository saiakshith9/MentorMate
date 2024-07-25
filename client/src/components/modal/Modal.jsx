import React, { useState, useEffect, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { GlobalState } from "../../GlobalState";

const Modal = ({ popup, setPopup, course: initialCourse, id }) => {
  let state = useContext(GlobalState);

  const [course, setCourse] = useState(() => ({
    name: "",
    tutor: state.token[0],
    logo: "",
    content: [{ heading: "", type: "", url: "" }],
  }));

  useEffect(() => {
    if (initialCourse) {
      setCourse({
        name: initialCourse.name || "",
        tutor: initialCourse.tutor || "",
        logo: initialCourse.logo || "",
        content: initialCourse.content || [{ heading: "", type: "", url: "" }],
      });
    } else {
      setCourse({
        name: "",
        tutor: state.token[0],
        logo: "",
        content: [{ heading: "", type: "", url: "" }],
      });
    }
  }, [initialCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleLogoChange = (e) => {
    setCourse({ ...course, logo: e.target.value });
  };

  const handleContentChange = (index, e) => {
    const { name, value } = e.target;
    const newContent = [...course.content];
    newContent[index] = { ...newContent[index], [name]: value };
    setCourse({ ...course, content: newContent });
  };

  const addContent = () => {
    setCourse({
      ...course,
      content: [...course.content, { heading: "", type: "", url: "" }],
    });
  };

  const removeContent = (index) => {
    const newContent = course.content.filter((_, i) => i !== index);
    setCourse({ ...course, content: newContent });
  };

  const transformYouTubeUrl = (url) => {
    try {
      let newUrl = new URL(url);
      if (
        newUrl.hostname === "www.youtube.com" &&
        newUrl.pathname === "/watch"
      ) {
        let videoId = newUrl.searchParams.get("v");
        newUrl.search = "";
        newUrl.pathname = `/embed/${videoId}`;
      }
      return newUrl.href;
    } catch (error) {
      console.error("Invalid URL:", error);
      return url;
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!course.name) {
      handleError("Course name is required.");
      isValid = false;
    }
    if (!course.logo) {
      handleError("Logo URL is required.");
      isValid = false;
    }
    course.content.forEach((item, index) => {
      if (!item.heading) {
        handleError(`Heading is required for content #${index + 1}.`);
        isValid = false;
      }
      if (!item.url) {
        handleError(`File URL is required for content #${index + 1}.`);
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const transformedCourse = {
      ...course,
      content: course.content.map((item) => ({
        ...item,
        url: transformYouTubeUrl(item.url),
      })),
    };

    try {
      let url = `http://localhost:8080/course/${
        initialCourse ? `update/${id}` : "add"
      }`;
      let method = "POST";
      let response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedCourse),
      });
      response = await response.json();
      let { success, message, error, _id } = response;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          setPopup(false);
          window.location.href = `/courses`;
        }, 3500);
      } else if (error) {
        let details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (error) {
      console.error("There was an error creating the course!", error);
    }
  };

  const formContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0004",
  };

  const formStyle = {
    marginTop: "4rem",
    marginBottom: "2rem",
    backgroundColor: "#aaac",
    display: "flex",
    flexDirection: "column",
    width: "40rem",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    marginBottom: "5px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  };

  const subtitleStyle = {
    fontSize: "0.9rem",
    color: "#555",
    marginTop: "5px",
  };

  return (
    <>
      <div
        className=""
        style={{
          position: "fixed",
          inset: "0px",
          backgroundColor: "#0004",
          backdropFilter: "blur(4px)",
          zIndex: "150",
          overflowY: "scroll",
        }}
      >
        <div style={formContainerStyle}>
          <form style={formStyle} onSubmit={handleSubmit}>
            <h2>{initialCourse ? "Edit Course" : "Add Course"}</h2>
            <hr className="hr" />
            <div style={formGroupStyle}>
              <label style={labelStyle}>Course Name</label>
              <input
                style={inputStyle}
                type="text"
                name="name"
                value={course.name}
                onChange={handleChange}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Logo URL</label>
              <input
                style={inputStyle}
                type="text"
                name="logo"
                value={course.logo}
                onChange={handleLogoChange}
              />
            </div>
            {course.content.map((contentItem, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <h4>Content #{index + 1}</h4>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Heading</label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="heading"
                    value={contentItem.heading}
                    onChange={(e) => handleContentChange(index, e)}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Video URL</label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="url"
                    value={contentItem.url}
                    onChange={(e) => handleContentChange(index, e)}
                  />
                  <p style={subtitleStyle}>
                    URL should be in given format:- &nbsp;
                    <b>
                      https://www.youtube.com/watch?v=<i>rest url</i>
                    </b>
                  </p>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    style={{ ...buttonStyle, background: "#dc3545" }}
                    onClick={() => removeContent(index)}
                  >
                    Remove Content
                  </button>
                )}
                <hr className="hr" />
              </div>
            ))}
            <button
              type="button"
              style={{
                ...buttonStyle,
                background: "#28a745",
                width: "fit-content",
                alignItems: "center",
              }}
              onClick={addContent}
            >
              Add More Content
            </button>
            <div
              className="mt-5"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <button type="submit" style={buttonStyle}>
                {initialCourse ? "Update Course" : "Create Course"}
              </button>
              <button
                onClick={() => setPopup(!popup)}
                className="btn btn-danger mt-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Modal;
