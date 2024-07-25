import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import Loading from "../../components/loading/Loading";

const Home = () => {
  const [showComponent1, setShowComponent1] = useState(true);

  const state = useContext(GlobalState);
  let [courses] = state.CourseApi.courses;

  useEffect(() => {
    const timer = setTimeout(() => setShowComponent1(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <img src="/logo.png" alt="Logo" className="hero-image" />
        <div className="hero-content">
          Welcome to MentorMate, the ultimate platform where learners and tutors
          connect, collaborate, and explore a universe of knowledge! Whether
          you're looking to teach a new course or embark on a learning journey,
          MentorMate makes it easy and fun. Create engaging courses, enroll in
          exciting classes, and track your progress effortlessly. Built with the
          latest technology, our user-friendly interface ensures a smooth and
          interactive experience. Dive into the MentorMate community today and
          unlock your potential!
        </div>
      </div>
      <br />
      <br />
      <br />
      <div>
        <h1>All Courses</h1>
        <hr className="hr" />
      </div>
      {!courses || !courses.length ? (
        <>
          {showComponent1 ? (
            <Loading />
          ) : (
            <h3>No Courses available right now.</h3>
          )}
        </>
      ) : (
        <>
          <div className="courses row row-cols-lg-3 row-cols-md-2 row-cols-sm-1">
            {courses.map((course) => (
              <div className="listing p-4" key={course._id}>
                <Link to={`/courses/${course._id}`}>
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
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
