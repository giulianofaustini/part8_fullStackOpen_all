import React from 'react'
import { USER } from '../queries'
import { useQuery } from '@apollo/client'

export const Recommended = ({ books }) => {

const user = useQuery(USER, {
    onError: (error) => {
      console.error('Error fetching user:', error.message);
    },
})

console.log('This is the books from recommended: ',books)

if (user.loading)  {
    return <div>loading...</div>
  }
  

console.log('This is the user from recommended: ',user)

const favoriteGenre = user.data.me.favoriteGenre

console.log('This is the favorite genre: ',favoriteGenre)   

const booksInFavoriteGenre = books.filter(book => book.genres.includes(favoriteGenre)).map(book => <li key={book.title}>{book.title} </li>)

console.log('These are book suggestions in recommended as for favorite genre: ', booksInFavoriteGenre)   
  return (
    <div>
        <h1>Your fav genre: { favoriteGenre} </h1>
        <h3>Books in your favorite genre:</h3>
        { booksInFavoriteGenre }



    </div>
  )
}
