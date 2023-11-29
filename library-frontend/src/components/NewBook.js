import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'


export const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  
 
    const [createBook] = useMutation(CREATE_BOOK, {
      update: (cache, { data: { addBook } }) => {
        const allBooksData = cache.readQuery({ query: ALL_BOOKS });
        cache.writeQuery({
          query: ALL_BOOKS,
          data: {
            allBooks: [...allBooksData.allBooks, addBook],
          },
        });
        const allAuthorsData = cache.readQuery({ query: ALL_AUTHORS });
        const newAuthor = addBook.author;
        const authorExists = allAuthorsData.allAuthors.some(
          (author) => author.id === newAuthor.id
        );
    
        if (!authorExists) {
          cache.writeQuery({
            query: ALL_AUTHORS,
            data: {
              allAuthors: [...allAuthorsData.allAuthors, newAuthor],
            },
          });
        }
      },
    });
  
  const submit = async (event) => {
    event.preventDefault();
  
    const publishedNumber = parseInt(published, 10);
  
    try {
      const { data } = await createBook({
        variables: {
          title,
          author,
          published: publishedNumber,
          genres,
        },
      });
  
      const newBook = data.addBook;
  
     
      props.updateCacheWith(newBook);
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  
    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };
  

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
          type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}
