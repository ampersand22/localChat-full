import { GraphQLContext, ConversationPopulated, ConversationUpdatedSubscriptionPayload } from "../../util/types";
import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        /**
         * Find all conversations that user is part of
         */
        const conversations = await prisma.conversation.findMany({
          /**
           * Below has been confirmed to be the correct
           * query by the Prisma team. Has been confirmed
           * that there is an issue on their end
           * Issue seems specific to Mongo - Thanks to Shadee
           * Merhi
           */
          // where: {
          //   participants: {
          //     some: {
          //       userId: {
          //         equals: userId,
          //       },
          //     },
          //   },
          // },
          include: conversationPopulated,
        });

        /**
         * Since above query does not work
         */
        // filter requires boolean result use !! operator
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
      } catch (error: any) {
        console.log("conversations error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any, 
      args: { participantIds: Array<string> }, 
      context: GraphQLContext 
    ): Promise<{ conversationId: string }> => {
      const { session, prisma, pubsub } = context;
      const { participantIds } = args;
      
      console.log("IDS", participantIds);
      

      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const { 
        user: { id: userId },
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        // emit a CONSERVATION_CREATED event using pubsub
        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation
        })

        return {
          conversationId: conversation.id
        };
      } catch (error) {
        console.log("createConversation error", error);
        throw new GraphQLError("Error creating conversation")
      }
    },  
  },
  Subscription: {
    // async iterator listens for events 

    // conversationCreated: {
    //   subscribe: (_: any, __: any, context: GraphQLContext) => {
    //     const { pubsub } = context;

    //     return pubsub.asyncIterator(["CONVERSATION_CREATED"])
    //   }
    // }

    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const {
            conversationCreated: { participants },
          } = payload;

          const userIsParticipant = !!participants.find(
            (p) => p.userId === session?.user?.id
          )

          return userIsParticipant

          // const userIsParticipant = userIsConversationParticipant(
          //   participants,
          //   session.user.id
          // );

          return userIsParticipant;
        }
      ),
    },
    // conversationUpdated: {
    //   subscribe: withFilter(
    //     (_: any, __: any, context: GraphQLContext) => {
    //       const { pubsub } = context;

    //       return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
    //     },
    //     (
    //       payload: ConversationUpdatedSubscriptionPayload,
    //       _: any,
    //       context: GraphQLContext
    //     ) => {
    //       const { session } = context;

    //       if (!session?.user) {
    //         throw new GraphQLError("Not authorized");
    //       }

    //       const { id: userId } = session.user;
    //       const {
    //         conversationUpdated: {
    //           conversation: { participants },
    //         },
    //       } = payload;

    //       return userIsConversationParticipant(participants, userId);
    //     }
    //   ),
    // },
    // conversationDeleted: {
    //   subscribe: withFilter(
    //     (_: any, __: any, context: GraphQLContext) => {
    //       const { pubsub } = context;

    //       return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
    //     },
    //     (
    //       payload: ConversationDeletedSubscriptionPayload,
    //       _: any,
    //       context: GraphQLContext
    //     ) => {
    //       const { session } = context;

    //       if (!session?.user) {
    //         throw new GraphQLError("Not authorized");
    //       }

    //       const { id: userId } = session.user;
    //       const {
    //         conversationDeleted: { participants },
    //       } = payload;

    //       return userIsConversationParticipant(participants, userId);
    //     }
    //   ),
    // },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participantPopulated = 
Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true,
    },
  },
});

// exporting the conversation creation with Prisma validator
export const conversationPopulated = 
Prisma.validator<Prisma.ConversationInclude>()({
  participants: {
    include: participantPopulated,
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  },
});

export default resolvers;