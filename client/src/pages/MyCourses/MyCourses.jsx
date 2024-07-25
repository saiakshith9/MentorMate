import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../GlobalState";
import Modal from "../../components/modal/Modal";
import RegNav from "../../components/regNav/RegNav";

const MyCourses = () => {
  let state = useContext(GlobalState);
  let [isLogged] = state.UserApi.isLogged;
  let [isTutor] = state.UserApi.isTutor;
  let [courses] = state.UserApi.courses;
  let [popup, setPopup] = useState(false);

  useEffect(() => {}, [courses]); // Added dependency array to avoid infinite loop

  return (
    <>
      <div className="container">
        {!isLogged ? (
          <RegNav />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>My Courses</h2>
              {isTutor && (
                <button
                  onClick={() => {
                    setPopup(!popup);
                  }}
                >
                  Add Course
                </button>
              )}
            </div>
            <hr className="hr" />
            {courses.length === 0 && (
              <h3>You need to Add Courses to view them</h3>
            )}
            <div className="courses row row-cols-lg-3 row-cols-md-2 row-cols-sm-1">
              {courses.map((course) => (
                <div className="listing p-4" key={course._id}>
                  <a href={`/courses/${course._id}`}>
                    <div className="card col listing-card">
                      <div className="card-img">
                        <img
                          src={course.logo || "https://via.placeholder.com/150"}
                          className="card-img-top"
                          alt={`${course.name} logo`}
                        />
                      </div>
                      <div className="card-img-overlay overlay"></div>
                      <div className="card-body listing-body m-1">
                        <h5 className="card-title">
                          <b>{course.name}</b>
                        </h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">
                          Tutor - <i>{course.tutor.name}</i>
                        </h6>
                        <p className="card-text">
                          {/* You can add more course details here */}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {popup && <Modal popup={popup} setPopup={setPopup} />}
          </>
        )}
      </div>
    </>
  );
};

export default MyCourses;
