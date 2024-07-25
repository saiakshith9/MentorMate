import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home.jsx";
import Sign from "./Sign/Sign.jsx";
import Course from "./Course/Course.jsx";
import MyCourses from "./MyCourses/MyCourses.jsx";
import Search from "./Search/Search.jsx";
import Reset from "./Reset/Reset.jsx";

const Page = () => {
  return (
    <Routes>
      <Route path="/" exact Component={Home} />

      <Route path="/search" exact Component={Search} />

      <Route path="/courses" exact Component={MyCourses} />
      <Route path="/courses/:id" exact Component={Course} />

      <Route path="/register" exact Component={Sign} />

      <Route path="/reset" exact Component={Reset} />
    </Routes>
  );
};

export default Page;
