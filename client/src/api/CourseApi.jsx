import React, { useEffect, useState } from "react";

const CourseApi = () => {
  const [courses, setCourses] = useState([]);

  const getCourse = async () => {
    try {
      let res = await fetch("http://localhost:8080/course/all");
      res = await res.json();

      if (res.error) console.log(res.error);

      setCourses(res.courses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  return {
    courses: [courses, setCourses],
  };
};

export default CourseApi;
