import React, { useState } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";
import Select from "react-select";

const Authors = ({ authors, show }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show || !authors) {
    return null;
  }

  const options = authors.map((a)=> ({ value: a.name, label: a.name }))

  const submit = (event) => {
    event.preventDefault();

if(selectedAuthor) {
  const bornNumber = parseInt(born, 10); 
  editAuthor({ variables: { name: selectedAuthor.value, born: bornNumber } });
  setSelectedAuthor(null);
  setBorn("");
}
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
          <Select
          placeholder="Select author"
            value={selectedAuthor}
            onChange={(setSelectedAuthor)}
            options={options}
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
