import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ONE_BOOK, ADD_SUMMARY } from '../queries';
import { useParams } from 'react-router-dom';
import { updateCache } from '../App';
import { useNavigate } from 'react-router-dom';

export const BookDetail = () => {
  const [newSummary, setNewSummary] = useState('');
  const id = useParams().id;
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(ONE_BOOK, {
    variables: { id },
  });

  const [addSummary] = useMutation(ADD_SUMMARY, {

    update: (cache, { data }) => {
      if(data && data.addSummary) {
        updateCache(cache, { query: ONE_BOOK, variables: { id } }, data.addSummary);
      }
    }
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  

  const navigateToBooks = () => { 
    navigate('/books');

  }

  const handleAddSummary = async (e) => {
    e.preventDefault();

    try {
      if(newSummary === '') {
        setNewSummary('No summary')
      }

      const response = await addSummary({
        variables: { id, summary: newSummary },
      });
  
      console.log("Mutation Response in book detail after adding a summary:", response);


      setNewSummary('');
    } catch (error) {
      console.error('Error adding summary:', error.message);
    }
  };

  const book = data.oneBook;

  console.log('This is the book in BookDetail component', book);

  return (
    <div className="flex-cols justify-stretch">
      <div className="flex justify-center mt-4">Title: {book.title}</div>
      <div className="flex justify-center mt-4">Published: {book.published}</div>
      <div className="flex justify-center mt-4">Author: {book.author.name}</div>
      {book.summary === "No summary" || " " ? (
        <div className="flex justify-center mt-4">
          <input
            type="text"
            value={newSummary}
            placeholder="No summary. Add one."
            onChange={(e) => setNewSummary(e.target.value)}
            
          />{' '}
          <button onClick={handleAddSummary}> Add a Summary </button>
          
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <div>Summary: {book.summary}</div>
        </div>
      )}
      <div className="flex justify-center mt-4"> 
        <button onClick={navigateToBooks}>Back to Books</button>
      </div>
    </div>

  );
};




