import React, { useEffect, useState } from "react";

const UserApi = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      let res = await fetch(`http://localhost:8080/auth/info/${token}`);

      res = await res.json();

      setIsLogged(true);

      res.role === 1 ? setIsTutor(true) : setIsTutor(false);

      setUser(res);

      setCourses(res.courses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return {
    isLogged: [isLogged, setIsLogged],
    isTutor: [isTutor, setIsTutor],
    courses: [courses, setCourses],
    user: [user, setUser],
  };
};

export default UserApi;
