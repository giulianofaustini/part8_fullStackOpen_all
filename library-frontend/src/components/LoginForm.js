import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client";

import React, { useState, useEffect } from "react";

export const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error("Error fetching books:", error.message);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");

    if (token) {
      setToken(token);
    }
  }, [setToken]);

  useEffect(() => {
    if(result.data) {
        const token = result.data.login.value
        setToken(token)
        localStorage.setItem('library-user-token', token)
    }
  } , [result.data, setToken])



  const handleSubmitForm = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div className="flex justify-center mt-12">
      <form onSubmit={handleSubmitForm}>
        <div>
          <div className="mt-5 rounded-md border-2 border-red-100 rounded-full  ">
            <input
            placeholder="Julian or Noora"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="mt-2 rounded-md border-2 border-red-100 rounded-full ">
            <input
            placeholder="secret"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button className="text-red-100 hover:text-red-300" type="submit"> LOGIN </button>
        </div>
      </form>
    </div>
  );
};
