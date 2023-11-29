import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import Authors from './components/Authors'
import Books from './components/Books'
import {NewBook} from './components/NewBook'
import { LoginForm } from './components/LoginForm'
import { NavBar } from "./components/NavBar";

import { ALL_BOOKS } from './queries'
import { ALL_AUTHORS } from './queries'
import { useQuery , useApolloClient} from '@apollo/client'
import { Recommended } from './components/Recommended';

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
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


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
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
        />
      </div>
    )
  }
  

  return (
    <div>
      <Router>
        <NavBar />
        <button onClick={logout}>logout</button>
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

