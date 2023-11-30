import React, { useState } from 'react';
import { BOOKS_IN_GENRE } from '../queries'
import { useQuery } from '@apollo/client';


const Books = ({ books }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);



  const booksInGenreQuery = useQuery( BOOKS_IN_GENRE, {
    skip: selectedGenre === null,
    onError: (error) => {
      console.error('Error fetching books in genre query', error.message)
    },
    variables: { genre : selectedGenre},
  })


  

  console.log('This is books by genres in Books component', booksInGenreQuery)


  const getGenres = (books) => books.flatMap((b) => b.genres);

  const allGenres = getGenres(books)
  console.log('this is the getGenres to show the flat map:', allGenres);
  const newGenres = [...new Set(allGenres)];


  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  const filteredBooks = selectedGenre ? books.filter((b) => b.genres.includes(selectedGenre)) : books;


  return (
    <div>
      <div className='grid grid-cols-5 gap-2  border-b-8  '>
        {newGenres.map((genre) => (
          <button className='bg-white rounded-tl-lg transition delay-150 duration-300 ease-in-out hover:scale-125 border border-bg-gray-100' key={genre} onClick={() => handleGenreClick(genre)}>
            {genre}
          </button>
        ))}
        <div>
          <button className='bg-white ' onClick={() => setSelectedGenre(null)}>Show All</button>
        </div>
      </div>

      <ul className="mt-5 list-none grid grid-cols-3 gap-4 justify-evenly">
        {filteredBooks.map((b) => (
          <li key={b.title}>
            {b.title} by {b.author.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;



// import React, { useState } from 'react';


// const Books = ({ books }) => {
//   const [selectedGenre, setSelectedGenre] = useState(null);


//   const getGenres = (books) => books.flatMap((b) => b.genres);
  

//   const allGenres = getGenres(books)
//   console.log('this is the getGenres to show the flat map:', allGenres);
//   const newGenres = [...new Set(allGenres)];

//   const handleGenreClick = (genre) => {
//     setSelectedGenre(genre);
//   };



//   const filteredBooks = selectedGenre ? books.filter((b) => b.genres.includes(selectedGenre)) : books;


//   return (
//     <div>
//       <h2>Books</h2>
//       <div>
//         {newGenres.map((genre) => (
//           <button key={genre} onClick={() => handleGenreClick(genre)}>
//             {genre}
//           </button>
//         ))}
//         <div>
//           <button onClick={() => setSelectedGenre(null)}>Show All</button>
//         </div>
//       </div>

//       <ul style={{ listStyleType: 'none' }}>
//         {filteredBooks.map((b) => (
//           <li key={b.title}>
//             {b.title} by {b.author.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Books;
