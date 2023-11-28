import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { ALL_BOOKS } from './queries'
import { ALL_AUTHORS } from './queries'
import { useQuery } from '@apollo/client'

const App = () => {
  

  const resultBooks = useQuery(ALL_BOOKS, {
    onError: (error) => {
      console.error('Error fetching books:', error.message);
    },
  });

  const resultAuthors = useQuery(ALL_AUTHORS, {
    onError: (error) => {
      console.error('Error fetching authors:', error.message);
    },
  });

  const [page, setPage] = useState('authors')
  
  if (resultBooks.loading)  {
    return <div>loading...</div>
  }
  

  if(resultAuthors.loading) {
    return <div>loading...</div>
  } 



  console.log('this is the all books result: ',resultBooks.data)  
  console.log(resultAuthors)


  const allBooks = resultBooks.data ? resultBooks.data.allBooks : [];
  

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {!resultBooks.loading && !resultAuthors.loading && (
        <div>
          <Authors authors={resultAuthors.data.allAuthors} show={page === 'authors'} />
          <Books books={allBooks} show={page === 'books'} />
          <NewBook show={page === 'add'} />
        </div>
      )}
    </div>
  )
}

export default App
