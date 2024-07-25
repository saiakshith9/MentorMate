import React, { createContext, useEffect, useState } from "react";
import UserApi from "./api/UserApi";
import CourseApi from "./api/CourseApi";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    let temp = localStorage.getItem("id");
    if (temp) {
      let refresh = async () => {
        let user = await fetch(`http://localhost:8080/auth/info/${temp}`);
        user = await user.json();
        setToken(user._id);

        setTimeout(() => {
          refresh();
        }, 10 * 60 * 1000);
      };
      refresh();
    }
  });

  const state = {
    token: [token, setToken],
    UserApi: UserApi(token),
    CourseApi: CourseApi(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
