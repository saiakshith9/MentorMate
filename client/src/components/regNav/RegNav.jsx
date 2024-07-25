import React from "react";
import { Link } from "react-router-dom";

const RegNav = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <h2>You need to be Logged In to access this material</h2>
      <br />
      <Link to="/register">
        <button>Signin/ Signup</button>
      </Link>
      <br />
      <br />
      <h5 style={{ color: "#555" }}>
        If you're already logged in, please wait for a while...
      </h5>
    </div>
  );
};

export default RegNav;
