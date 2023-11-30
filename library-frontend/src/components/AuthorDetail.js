import React from "react";
import { useNavigate } from "react-router-dom";
import { EDIT_AUTHOR, ALL_AUTHORS, ONE_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const AuthorDetail = () => {
  const navigate = useNavigate();
  const id = useParams().id;

  const navigateToHome = () => {
    navigate("/");
  };

  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const { loading, error, data } = useQuery(ONE_AUTHOR, {
    variables: { id },
  });

  console.log("from authorDetail to say data in order to check to get the books", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.oneAuthor;

  console.log("Author data:", author);


  const submit = (event) => {
    event.preventDefault();

    const bornNumber = parseInt(born, 10);
    editAuthor({
      variables: { name: author.name, born: bornNumber },
    });
    setBorn("");
  };

  return (
      <div>
        <div>
          <h1>{author.name}</h1>
        </div>
        <div>
          <h1>born in {author.born}</h1>
        </div>
        <div>
            authored books:
        </div>
        <div>
          {author.books.map((book) => (
            <li key={book.title}>{book.title}</li>
          ))}
      </div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Born:{" "}
          <input
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </div>

        <button type="submit">Update author</button>
      </form>
      <button onClick={navigateToHome}>BACK</button>
    </div>
  );
};


