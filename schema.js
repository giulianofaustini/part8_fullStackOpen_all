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
    summary: String
  }
  type Author {
    name: String!
    bookCount: Int
    books: [Book]
    id: ID!
    born: Int
    nationality: String
  }
type Query {
    bookCount: Int!
    allBooks(author: String, genres: [String]): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    booksInGenre(genres: [String]): [Book!]!
    oneBook(id: ID!): Book!
    oneAuthor(id: ID!): Author!
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
      summary: String
    ): Book!

  
    addAuthor(
      name: String!
    ): Author
  
    editAuthor(
      name: String!
      setBornTo: Int
      setNationalityTo: String
    ): Author

    addSummary(
      summary: String
      id: ID!
    ): Book

  }
  type Subscription {
    bookAdded: Book!
  }

`

module.exports = typeDefs

