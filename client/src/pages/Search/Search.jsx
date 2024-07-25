import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const coursesParam = queryParams.get("courses");

    if (coursesParam) {
      try {
        const parsedCourses = JSON.parse(coursesParam);
        setCourses(parsedCourses);
      } catch (error) {
        console.error("Error parsing courses:", error);
      }
    }
  }, [location.search]);

  return (
    <>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Search Results</h2>
        </div>
        <hr className="hr" />
        {courses.length === 0 && (
          <h3>No Course found with the given keyword</h3>
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
      </div>
    </>
  );
};

export default Search;
