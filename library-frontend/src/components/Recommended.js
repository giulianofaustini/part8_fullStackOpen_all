import React from 'react';
import { USER, BOOKS_IN_GENRE } from '../queries';
import { useQuery } from '@apollo/client';

export const Recommended = ({ books }) => {
  const userQuery = useQuery(USER, {
    onError: (error) => {
      console.error('Error fetching user:', error.message);
    },
  });

  const favoriteGenre = userQuery.data && userQuery.data.me.favoriteGenre;

  const booksInGenreQuery = useQuery(BOOKS_IN_GENRE, {
    onError: (error) => {
      console.error('Error fetching books in genre:', error.message);
    },
    variables: { genre: favoriteGenre },
  });

  const booksInFavoriteGenre = booksInGenreQuery.data && booksInGenreQuery.data.allBooks.map((book) => ( <li key={book.title}>{book.title}</li> ));

  return (
    <div>
      <h1>Your fav genre: {favoriteGenre}</h1>
      <h3>Books in your favorite genre:</h3>
      {booksInFavoriteGenre} by {booksInGenreQuery.data && booksInGenreQuery.data.allBooks[0].author.name}
    </div>
  );
};

