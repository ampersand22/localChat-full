import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationsList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation"
import { log } from "console";
import { ConversationsData } from "@/src/util/types";
import { cache, useEffect } from "react";
import { useRouter } from "next/router";
import { ConversationPopulated } from "../../../../../ring-backend/src/util/types";

interface ConservationsWrapperProps {
  session: Session;
}

const ConversationsWrapper:React.FC<ConservationsWrapperProps> = ({ 
  session, 
}) => {

  const { 
    data: conversationsData, 
    error: conversationsError, 
    loading: conversationsLoading,
    subscribeToMore, 
  } = useQuery<ConversationsData>
  // removed null after ConversationsData because it broke
  (ConversationOperations.Queries.conversations);


  console.log('query data', conversationsData);

  const router = useRouter();
  const { 
    query: { conversationId }, 
  } = router;

  async function onViewConversation(conversationId: string) {
    router.push({ query: { conversationId } });
  };
  
  // const onViewConversation = async (
  //   conversationId: string,
  //   hasSeenLatestMessage: boolean | undefined
  // ) => {
  //   /**
  //    * 1. Push the conversationId to the router query params
  //    */
  //   router.push({ query: { conversationId } });

  //   /**
  //    * 2. Mark the conversation as read
  //    */
  //   if (hasSeenLatestMessage) return;

  //   // markConversationAsRead mutation
  //   try {
  //     await markConversationAsRead({
  //       variables: {
  //         userId,
  //         conversationId,
  //       },
  //       optimisticResponse: {
  //         markConversationAsRead: true,
  //       },
  //       update: (cache) => {
  //         /**
  //          * Get conversation participants from cache
  //          */
  //         const participantsFragment = cache.readFragment<{
  //           participants: Array<ParticipantPopulated>;
  //         }>({
  //           id: `Conversation:${conversationId}`,
  //           fragment: gql`
  //             fragment Participants on Conversation {
  //               participants {
  //                 user {
  //                   id
  //                   username
  //                 }
  //                 hasSeenLatestMessage
  //               }
  //             }
  //           `,
  //         });

  //         if (!participantsFragment) return;

  //         const participants = [...participantsFragment.participants];

  //         const userParticipantIdx = participants.findIndex(
  //           (p) => p.user.id === userId
  //         );

  //         if (userParticipantIdx === -1) return;

  //         const userParticipant = participants[userParticipantIdx];

  //         /**
  //          * Update participant to show latest message as read
  //          */
  //         participants[userParticipantIdx] = {
  //           ...userParticipant,
  //           hasSeenLatestMessage: true,
  //         };

  //         /**
  //          * Update cache
  //          */
  //         cache.writeFragment({
  //           id: `Conversation:${conversationId}`,
  //           fragment: gql`
  //             fragment UpdatedParticipant on Conversation {
  //               participants
  //             }
  //           `,
  //           data: {
  //             participants,
  //           },
  //         });
  //       },
  //     });
  //   } catch (error) {
  //     console.log("onViewConversation error", error);
  //   }
  // };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        console.log('here is subscription data', subscriptionData);
        

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  // execute subscription on mount
  useEffect(() => {
    subscribeToNewConversations()
  }, [])

  

  return (
    <Box 
    display={{ base: conversationId ? "none" : "flex", md: "flex" }}
    width={{ base: '100%', md: "400px" }} 
    bg='#f9f9f9'
    py={6}
    px={3}
    >
      {/* Skeleton Loader */}
      <ConversationsList 
        session={session} 
        conversations={conversationsData?.conversations || [] }
        onViewConversation={onViewConversation} 
      />
    </Box>
  );
};

export default ConversationsWrapper;