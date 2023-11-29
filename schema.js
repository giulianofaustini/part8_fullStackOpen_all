const typeDefs = `
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String!
    bookCount: Int
    id: ID!
    born: Int
  }
type Query {
    bookCount: Int!
    allBooks(author: String, genres: [String]): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    booksInGenre(genres: [String]): [Book!]!
    me: User
  }
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
  
    login(
      username: String!
      password: String!
    ): Token
  
    addBook(
      title: String!
      published: Int
      author: String!
      genres: [String!]!
    ): Book!
    
    addAuthor(
      name: String!
    ): Author
  
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
  type Subscription {
    bookAdded: Book!
  }

`

module.exports = typeDefs