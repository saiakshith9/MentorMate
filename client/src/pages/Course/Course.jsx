import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Course.css";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import Loading from "../../components/loading/Loading.jsx";
import Modal from "../../components/modal/Modal";
import { GlobalState } from "../../GlobalState";
import RegNav from "../../components/regNav/RegNav";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../components/utils.js";

let Course = () => {
  let state = useContext(GlobalState);
  let [isLogged] = state.UserApi.isLogged;
  let [isTutor] = state.UserApi.isTutor;
  let [isOwner, setIsOwner] = useState(false);
  let [course, setCourse] = useState(null);
  let [progress, setProgress] = useState(null);
  let [popup, setPopup] = useState(false);
  let [refresh, setRefresh] = useState(false);
  let [userId, setUserId] = useState(state.token[0]);
  let [selectedContent, setSelectedContent] = useState("");
  let [activeItem, setActiveItem] = useState(null);
  let params = useParams();
  let id = params.id;

  useEffect(() => {
    let fetchCourse = async () => {
      try {
        let url = `http://localhost:8080/course/${id}`;
        let res = await fetch(url);
        let data = await res.json();
        setCourse(data.course);
        setSelectedContent(data.course.content[0]?.url || "");
        setIsOwner(data.course.tutor._id === userId);
        if (userId) {
          url = `http://localhost:8080/progress/${userId}/${id}`;
          res = await fetch(url);
          data = await res.json();
          setProgress(data.progress);
          setActiveItem(data.progress.contentProgress[0].contentId);
        }
        setUserId(state.token[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [state, refresh]);

  if (!course) {
    return <Loading />;
  }

  let { name, tutor, content } = course;

  let enroll = async () => {
    let data = {
      userId: userId,
      courseId: id,
    };

    try {
      let url = `http://localhost:8080/progress/enroll`;
      let method = "POST";
      let response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      response = await response.json();

      let { success, message, error } = response;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          window.location.href = `/courses/${id}`;
        }, 3500);
      } else if (error) {
        let details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (error) {
      console.error("There was an error enrolling in the course!", error);
    }
  };

  let updateProgress = async () => {
    let data = {
      userId: userId,
      courseId: id,
      contentId: activeItem,
    };

    try {
      let url = `http://localhost:8080/progress/update`;
      let method = "POST";
      let response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      response = await response.json();

      let { success, message, error, updateProgress } = response;
      if (success) {
        handleSuccess(message);
        setProgress(updateProgress);
        setTimeout(() => {
          setRefresh(!refresh);
        }, 1500);
      } else if (error) {
        let details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (error) {
      console.error("There was an error updating the course!", error);
    }
  };

  let handleContentClick = (url, id) => {
    setSelectedContent(url);
    setActiveItem(id); // Set the active item ID
  };

  let chunkArray = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  let contentChunks = chunkArray(content, 5);

  return (
    <>
      <div className="container-sm">
        {!isLogged ? (
          <RegNav />
        ) : (
          <>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "space-between",
                }}
              >
                <h1>{name}</h1>
                <h4 style={{ color: "#555" }}>{tutor.name}</h4>
              </div>
              <hr className="hr" />
            </div>

            <>
              {isTutor && !isOwner ? (
                <div className="error-box">
                  <div style={{ width: "fit-content" }}>
                    <h3>Access Denied!</h3>
                    <hr className="hr" />
                  </div>
                  <p>Please login as Learner to access this course.</p>
                  <p>
                    Only the learners and the owner can access the contents of
                    the course.
                  </p>
                </div>
              ) : (
                <>
                  {!isOwner && progress === undefined ? (
                    <div className="error-box">
                      <div style={{ width: "fit-content" }}>
                        <h3>Please Enroll First!</h3>
                        <hr className="hr" />
                      </div>
                      <p>
                        You need to be enrolled in the course to access its
                        course materials.
                      </p>
                      <button className="button" onClick={enroll}>
                        Enroll
                      </button>
                      <p style={{ marginTop: "3rem" }}>
                        If already enrolled, please wait for a while...
                      </p>
                    </div>
                  ) : (
                    <div className="course-content">
                      <div className="list">
                        <Accordion defaultActiveKey="0">
                          {contentChunks.map((chunk, chunkIndex) => (
                            <Accordion.Item
                              eventKey={chunkIndex.toString()}
                              key={chunkIndex}
                            >
                              <Accordion.Header>{`Lecture ${
                                chunkIndex + 1
                              }`}</Accordion.Header>
                              <Accordion.Body>
                                <ListGroup>
                                  {chunk.map((item) => {
                                    const isCompleted =
                                      progress?.contentProgress.find(
                                        (p) => p.contentId === item._id
                                      )?.completed;

                                    return (
                                      <ListGroup.Item
                                        action
                                        key={item._id}
                                        onClick={() =>
                                          handleContentClick(item.url, item._id)
                                        }
                                        className={`${
                                          item._id === activeItem
                                            ? "list-group-item-active"
                                            : ""
                                        } ${isCompleted ? "completed" : ""}`}
                                      >
                                        {item.heading}
                                      </ListGroup.Item>
                                    );
                                  })}
                                </ListGroup>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </div>
                      <div className="display">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            margin: "0 !important",
                          }}
                          className="buttons"
                        >
                          {userId === course.tutor._id && (
                            <button
                              onClick={() => {
                                setPopup(!popup);
                              }}
                              style={{
                                marginBottom: "2rem",
                                backgroundColor: "lightblue",
                              }}
                            >
                              Edit Course
                            </button>
                          )}
                          {!isTutor && (
                            <button
                              style={{
                                marginBottom: "1rem",
                                backgroundColor: "#42ac12",
                                borderColor: "#38910e",
                                color: "white",
                              }}
                              onClick={updateProgress}
                            >
                              Mark as Complete
                            </button>
                          )}
                        </div>
                        <iframe
                          className="content-window"
                          src={selectedContent}
                          title="Course Content"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          </>
        )}
      </div>
      {popup && (
        <Modal popup={popup} setPopup={setPopup} course={course} id={id} />
      )}
      <ToastContainer />
    </>
  );
};

export default Course;
