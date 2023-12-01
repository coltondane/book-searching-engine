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

        }
    }
}
