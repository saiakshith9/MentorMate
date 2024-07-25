import React from "react";

const Loading = () => {
  return (
    <div
      className="container"
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: "5rem",
      }}
    >
      <div
        className="spinner-border text-success"
        role="status"
        style={{
          width: "10rem",
          height: "10rem",
          borderWidth: "0.75rem",
          filter: "drop-shadow(0 0 0.2rem #317e0c)",
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
