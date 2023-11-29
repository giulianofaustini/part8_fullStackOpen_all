import React from "react";
import { Link } from "react-router-dom";

import { client } from "../index";

export const NavBar = ({setToken}) => {


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div  className="h-10 my-5 flex space-x-10 justify-center">
      <Link to={"/"}>Author</Link>
      <Link to={"/Books"}>Books</Link>
      <Link to={"/Add_Books"}>Add Books</Link>
      <Link to={"/Recommended"}>Recommended</Link>
      <button className='flex transition delay-150 duration-300 ease-in-out hover:scale-125  text-black' onClick={logout}>logout</button>
    </div>
  );
};
