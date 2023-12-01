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
    }
}
