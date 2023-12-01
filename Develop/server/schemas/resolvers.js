// importS
const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models');
const { signToken } = require('../utils/auth');

// resolvers
const resolvers = {
    // Queries
    Query: {
        user: async (_parent, _args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('No user found with these credentials, please sign up or try again');
        }
    },

    // Mutations
    Mutation: {
        // adding a user
        addUser: async(_parent, { username, email, password }) => {
            // create a user and their token
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        // logging in a user
        userLogin: async(_parent, { email, password }) => {
            // find a user by their email
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('incorrect username or password');
            }
            // check the password
            const userPass = await user.isCorrectPassword(password);

            if (!userPass) {
                throw new AuthenticationError('incorrect username or password');
            }

            // create a token
            const token = signToken(user);
            console.log("user successfully logged in");
            return { token, user };

        },

        // saving a book
        saveBook: async (_parent, { input }, context) => {
            // if the user is logged in  
            if (context.user) {
                // add the book to the user's savedBooks array
                return User.findOneAndUpdate(
                    // find the user by their id
                    { _id: context.user._id },
                    // add the book to the array
                    { $addToSet: { savedBooks: input } },
                    // return the updated user
                    { new: true }
                )
            }
        },

        // delete a book
        deleteBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                // remove the book from the user's savedBooks array
                const newBookArray = await User.findOneAndUpdate(
                    // find the user by their id
                    { _id: context.user._id },
                    // remove the book from the array
                    { $pull: { savedBooks: { bookId } } },
                    // return the updated user
                    { new: true }
                )
                // return the updated array with the book removed
                return newBookArray;
            }
        },

    },
};

module.exports = resolvers;