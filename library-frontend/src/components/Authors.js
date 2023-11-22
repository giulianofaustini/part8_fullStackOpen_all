import React, { useState } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";

const Authors = ({ authors, show }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show || !authors) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
   const bornNumber = parseInt(born, 10); 
    editAuthor({ variables: { name, born: bornNumber } });
    setName("");
    setBorn("");
  };

  console.log("from authors page to say authors", authors);

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name:{" "}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          born:{" "}
          <input
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
