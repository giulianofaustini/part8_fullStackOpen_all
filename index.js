require("dotenv").config();

const { startStandaloneServer } = require("@apollo/server/standalone");
const { ApolloServer } = require("@apollo/server");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
mongoose.set("strictQuery", false);
const User = require("./models/User");


const jwt = require("jsonwebtoken");


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
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});


