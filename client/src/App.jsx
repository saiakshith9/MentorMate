import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import Navbar from "./components/navbar/Navbar";
import Page from "./pages/Page";
import "./App.css";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <div className="content">
            <Navbar />
            <Page />
          </div>
        </Router>
      </DataProvider>
    </>
  );
}

export default App;
