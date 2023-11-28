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
    <div>
      <form onSubmit={handleSubmitForm}>
        <div>
          <div>
            <input
            placeholder="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
            placeholder="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit"> LOGIN </button>
        </div>
      </form>
    </div>
  );
};
