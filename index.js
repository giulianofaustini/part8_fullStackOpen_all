require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");

const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

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
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          return Book.find({ author: author.id });
        }
      }
      if (args.genres) {
        return Book.find({ genres: { $in: args.genres } });
      }
      return Book.find({});
    },

    authorCount: async () => {
      const count = await Author.collection.countDocuments();
      return count;
    },

    allAuthors: async () => {
      const authors = await Author.find({});
      return Promise.all(authors.map(async author => {
        const bookCount = await Book.countDocuments({ author: author.id });
        return {
          ...author.toObject(),
          bookCount,
          id: author.id.toString(),
        };
      }));
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError("User validation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            validationErrors: error.errors,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    addAuthor: async (root, args, context) => {
      if (args.name.length < 3) {
        throw new GraphQLError(
          "Author name must be at least 3 characters long",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
            },
          }
        );
      }

      const author = new Author({ ...args });
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      try {
        await author.save();
        return author;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Author validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              validationErrors: error.errors,
            },
          });
        } else {
          throw new GraphQLError("Author failed to save", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              error: error.message,
            },
          });
        }
      }
    },

    addBook: async (root, args, context) => {
      if (args.title.length < 3) {
        throw new GraphQLError(
          "Book title must be at least 2 characters long",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
            },
          }
        );
      }
      let author = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new GraphQLError("Author validation failed", {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args,
                validationErrors: error.errors,
              },
            });
          } else {
            throw new GraphQLError("Author failed to save", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                error: error.message,
              },
            });
          }
        }
      }

      try {
        const book = new Book({ ...args, author: author.id });
        const currentUser = context.currentUser;
        if (!currentUser) {
          throw new GraphQLError("Not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        }
        await book.save();
        return book;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Book validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              validationErrors: error.errors,
            },
          });
        } else {
          throw new GraphQLError("Book failed to save", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              error: error.message,
            },
          });
        }
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      try {
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Author validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              validationErrors: error.errors,
            },
          });
        } else {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              error: error.message,
            },
          });
        }
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id).populate(
        "favoriteGenre"
      );
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
