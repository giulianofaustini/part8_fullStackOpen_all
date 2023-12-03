import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { updateCache } from '../App'


export const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [summary, setSummary] = useState('')


  

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.error('Error adding book:', error.message);
    console.error('Detailed error:', error.graphQLErrors);
    console.error('Network error:', error.networkError);;
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

    if(summary === '') {
      setSummary('No summary')
    }
  
    try {
      await createBook({
        variables: {
          title,
          author,
          published: publishedNumber,
          genres,
          summary: summary === '' ? 'No summary' : summary,
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
    <div className="container flex justify-center ml-20">
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" >
      <form   onSubmit={submit}>
        <div className="mt-4 block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50 ">
         { }
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
            className='bg-red-50'
          />
        </div>
        <div className="mt-4 block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50">
         
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
            className='bg-red-50'
          />
        </div>
        <div className="mt-4 block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50">
         
          <input
          type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            placeholder='published'
            className='bg-red-50'
          />
        </div>
        <div className="mt-4 block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50">
          
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            placeholder='genre'
            className='bg-red-50'
          />
          <button className='bg-red-100 rounded-tl-lg  border border-bg-gray-100' onClick={addGenre} type="button">
            {} add the genre{ }
          </button>
        </div>
        <div className="mt-4 block w-full b-red-100rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50">{genres.join(' ')}</div>
        <div className=" mt-4 block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:italic placeholder:opacity-50">
          
          <textarea
          type='text'
            value={summary}
            onChange={({ target }) => setSummary(target.value)}
            placeholder='summary'
            className='bg-red-50'
          /> 
        </div>
        <br></br>
        <button type="submit">CREATE BOOK</button>
      </form>
    </div>
    </div>
  )
}
