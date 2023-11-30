import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { updateCache } from '../App'


export const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [summary, setSummary] = useState('')


  

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.error('Error adding book:', error.message);
    },
    update: (cache, { data }) => {
      console.log('data in the create book use mutatino in new book',data);
      if (data && data.addBook) {
        updateCache(cache, { query: ALL_AUTHORS }, data.addBook);
        updateCache(cache, { query: ALL_BOOKS }, data.addBook);
      }
    },
  
  });

  const submit = async (event) => {
    event.preventDefault();
  
    const publishedNumber = parseInt(published, 10);
  
    try {
      await createBook({
        variables: {
          title,
          author,
          published: publishedNumber,
          genres,
          summary,
        },
      });
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  
    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
    setSummary('');
  };
  

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div >
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
        <div>
          summary
          <input
          type='text'
            value={summary}
            onChange={({ target }) => setSummary(target.value)}
          />
        </div>
        <br></br>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}
