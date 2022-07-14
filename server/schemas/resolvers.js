const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate("savedBooks");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      console.log('addUser');
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (
      parent,
      { authors, title, bookId, description, image, link },
      context
    ) => {
      if (context.user) {
        const books = await Book.create({
          username: context.user.username,
          authors: [authors],
          bookId: bookId,
          description: description,
          title: title,
          image: image,
          link: link,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { books: books._id } },
          { new: true }
        );

        return books;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, {bookId}, context) => {
      if (context.user) {
    
       const books = await Book.findByIdAndDelete(
          { bookId: bookId }
        );
    
        return books;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;
