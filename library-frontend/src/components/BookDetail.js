import { useQuery } from "@apollo/client";
import { ONE_BOOK } from "../queries";
import { useParams } from "react-router-dom";
import { useState } from "react";


export const BookDetail = () => {

  const [newSummary , setNewSummary] = useState('')
    
  const id = useParams().id;

  const { loading, error, data } = useQuery(ONE_BOOK, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const book = data.oneBook;

  console.log("This is the book in BookDetail component", book);

  const handleAddSummary = () => {
    
  }

  return (
    <div>
      <div>Title: {book.title}</div>
      <div>Published: {book.published}</div>
      <div>Author: {book.author.name}</div>
      {book.summary === null ? (
        <div>
          <input
            type="text"
            value={newSummary}
            placeholder="Add a summary"
            onChange={(e) => setNewSummary(e.target.value)}
          />{" "}
          <button onClick={handleAddSummary}>Add Summary</button>
        </div>
      ) : (
        <div>Summary: {book.summary}</div>
      )}
    </div>
  );
};
