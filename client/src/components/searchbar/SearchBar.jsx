import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./SearchBar.css";

const SearchBar = () => {
  const [value, setValue] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Send search query to the backend
      const response = await fetch("http://localhost:8080/course/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: value }),
      });
      const data = await response.json();

      if (data.success) {
        // Redirect to /search with search results
        const queryParams = new URLSearchParams({
          courses: JSON.stringify(data.courses),
        }).toString();
        window.location.href = `/search?${queryParams}`;
      } else {
        // Handle errors
        console.error("Search failed:", data.message);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <Form onSubmit={handleSearch}>
      <Form.Group className="search-bar" controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Search a course"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" className="button">
          Submit
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SearchBar;
