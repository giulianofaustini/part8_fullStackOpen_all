import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import Authors from './components/Authors'
import Books from './components/Books'
import {NewBook} from './components/NewBook'
import { LoginForm } from './components/LoginForm'
import { NavBar } from "./components/NavBar";
import './index.css'

import { ALL_BOOKS, BOOK_ADDED } from './queries'
import { ALL_AUTHORS } from './queries'
import { useQuery , useApolloClient , useSubscription } from '@apollo/client'
import { Recommended } from './components/Recommended';


export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving the same book twice
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    // Ensure allBooks is defined before concatenating
    const updatedBooks = allBooks ? uniqByName(allBooks.concat(addedBook)) : [addedBook];
    
    return {
      allBooks: updatedBooks,
    };
  });
};


const App = () => {

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      console.log(addedBook);
      window.alert(`New book added: ${addedBook.title}`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

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
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  

  if (resultBooks.loading)  {
    return <div>loading...</div>
  }
  

  if(resultAuthors.loading) {
    return <div>loading...</div>
  } 



  console.log('this is the all books result: ',resultBooks.data)  
  console.log(resultAuthors)


  const allBooks = resultBooks.data ? resultBooks.data.allBooks : [];
  

  if (!token) {
    return (
      <div>
        <LoginForm
          setToken={setToken}
        />
      </div>
    )
  }
  

  return (
    <div className="md:container md:mx-auto font-mono">
      <Router>
        <NavBar setToken={setToken} />
        <div className='flex bg-white'>
        
        </div>
        
        {resultAuthors.data && resultAuthors.data.allAuthors && (
          <Routes>
            <Route path="/" element={<Authors authors={resultAuthors.data.allAuthors} />} />
            <Route path="/Books" element={<Books books={allBooks} />} />
            <Route path="/Add_Books" element={<NewBook />} />
            <Route path="/Recommended" element={<Recommended  books={allBooks} />} />

          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;

