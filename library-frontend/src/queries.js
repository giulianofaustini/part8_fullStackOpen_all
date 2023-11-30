import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation login ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        value
    }
}
`

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
        ...BookDetails
    }
}
fragment BookDetails on Book {
    title
    published
    author {
        name
    }
    genres
    summary
    id
}
`


export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
        born
        id
      }
      id
      genres
      summary
    }
  }
`;

export const ONE_BOOK = gql`
  query oneBook($id: ID!) {
    oneBook(id: $id) {
      title
      published
      author {
        name
        born
        id
      }
      id
      genres
      summary
    }
  }
`;  


export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      id
      born
    }
  }
`;


export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $genres: [String!]!, $published: Int, $summary: String) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
        summary: $summary
    ) {
        title
        author {
          name
          born
          id
        }
        published
        genres
        summary
        id
    }
}
`


export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int! ) {
    editAuthor ( name: $name, setBornTo: $born) {
        name
        born
        id
    }
}
`

export const USER = gql`
query {
    me {
        username
        favoriteGenre
    }
}
`

export const BOOKS_IN_GENRE = gql`
  query booksInGenre($genre: String!) {
    allBooks(genres: [$genre]) {
      title
      author {
        name
      }
    }
  }
`;

