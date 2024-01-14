import { ApolloServer, gql } from "apollo-server";


const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String
  }
  type Tweet {
    id: ID!
    text: String!
    userId: ID!
    author: User!
  }

  type Query {
    getTweet(id: ID!): Tweet
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
    allUsers: [User]!
  }
  type Mutation {
    postTweet(text: String! userId: ID): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

let Tweets = [
  {
    id: "1",
    text: "hello world",
    userId: "1000001"
  },
  {
    id: "2",
    text: "bye world",
    userId: "1000002"
  }
]
const Users = [
  {
    id: "1000001",
    firstName: 'ByungChan',
    lastName: 'Kang'
  },
  {
    id: "1000002",
    firstName: 'nico',
    lastName: 'las'
  }
]

const resolvers = {
  Query: {
    tweet(root, {id}) {
      console.log(id);
      return Tweets.find(tweet => tweet.id === id);
    },
    allTweets() {
      return Tweets;
    },
    allUsers() {
      return Users;
    }
  },
  Mutation: {
    postTweet(root, {text}) {
      const newTweet = {
        id: Tweets.length + 1,
        text: text,
      }
      Tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, {id}) {
      let isDeleted = false;
      Tweets = Tweets.filter(item => {
        if (item.id !== id) {
          isDeleted = true;
          console.log('deleted!');
          return true;
        }
        return false;
      });
      console.log("does not deleted");
      return isDeleted;
    }
  },
  User: {
    fullName(root) {
      console.log(root);
      return `${root.firstName} ${root.lastName}`;
    }
  },
  Tweet: {
    author(root) {
      return Users.find(user => user.id === root.userId);
    }
  }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`Running on ${url}`);
})