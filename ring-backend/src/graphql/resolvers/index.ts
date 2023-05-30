import userResolvers from './user';
import merge from 'lodash.merge';
import conversationResolvers from './conversation';
import messageResolvers from './message';
// import scalarResolvers from './scalars';

// using merge in object with lodash.merge for resolvers
const resolvers = merge({}, userResolvers, conversationResolvers, messageResolvers )

export default resolvers;