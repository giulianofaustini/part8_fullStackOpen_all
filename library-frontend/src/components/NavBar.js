import React from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <div>
      <Link to={"/"}>Author</Link>
      <Link to={"/Books"}>Books</Link>
      <Link to={"/Add_Books"}>Add Books</Link>
      <Link to={"/Recommended"}>Recommended</Link>
    </div>
  );
};
