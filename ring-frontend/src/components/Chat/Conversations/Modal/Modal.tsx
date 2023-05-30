import { 
  CreateConversationData, 
  CreateConversationInput, 
  SearchedUser, 
  SearchUsersData, 
  SearchUsersInput 
} from "@/src/util/types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, Modal, Stack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from '../../../../graphql/operations/user';
import ConversationOperations from '../../../../graphql/operations/conversation';
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";

interface ModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
} 

const ConversationModal: React.FC<ModalProps> = ({ 
  session, 
  isOpen, 
  onClose
 }) => {
  const { user: { id: userId },
  } = session;

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  // useLazyQuery is the async 
  const [searchUsers, { data, error, loading }] = useLazyQuery<
  SearchUsersData,
  SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  // remember to pass in types with hooks
  const [createConversation, { loading: createConversationLoading }] = 
  useMutation<
  CreateConversationData, 
  CreateConversationInput
  >(ConversationOperations.Mutations.createConversation)

  const onCreateConversation = async () => {
    // type clash for participantIds, need to give each one an ID, so map it.
    const participantIds = [userId, ...participants.map(p => p.id)];

    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
        }
      });

      if (!data?.createConversation) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;
      
      router.push({ query: { conversationId } });

      /*****
       * Clear state and close modal
       * on successful creation
       */
      setParticipants([]);
      setUsername("");
      onClose();

    } catch (error: any) {
      console.log('onCreateConversation error', error);
      toast.error(error?.message);
    }
  };

  // const onUpdateConversation = async (conversation: ConversationPopulated) => {
  //   const participantIds = participants.map((p) => p.id);

  //   try {
  //     const { data, errors } = await updateParticipants({
  //       variables: {
  //         conversationId: conversation.id,
  //         participantIds,
  //       },
  //     });

  //     if (!data?.updateParticipants || errors) {
  //       throw new Error("Failed to update participants");
  //     }

  //     /**
  //      * Clear state and close modal
  //      * on successful update
  //      */
  //     setParticipants([]);
  //     setUsername("");
  //     onClose();
  //   } catch (error) {
  //     console.log("onUpdateConversation error", error);
  //     toast.error("Failed to update participants");
  //   }
  // };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // search user query
    searchUsers({ variables: { username } })    
  }

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter(p => p.id !== userId));
  };

  

  // const onConversationClick = () => {
  //   if (!existingConversation) return;

  //   const { hasSeenLatestMessage } =
  //     getUserParticipantObject(existingConversation);

  //   onViewConversation(existingConversation.id, hasSeenLatestMessage);
  //   onClose();
  // };

  /**
   * If a conversation is being edited,
   * update participant state to be that
   * conversations' participants
   */
  // useEffect(() => {
  //   if (editingConversation) {
  //     setParticipants(
  //       editingConversation.participants.map((p) => p.user as SearchedUser)
  //     );
  //     return;
  //   }
  // }, [editingConversation]);

  // /**
  //  * Reset existing conversation state
  //  * when participants added/removed
  //  */
  // useEffect(() => {
  //   setExistingConversation(null);
  // }, [participants]);

  // /**
  //  * Clear participant state if closed
  //  */
  // useEffect(() => {
  //   if (!isOpen) {
  //     setParticipants([]);
  //   }
  // }, [isOpen]);

  // if (searchUsersError) {
  //   toast.error("Error searching for users");
  //   return null;
  // }




  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input 
                  placeholder="Enter a username" 
                  value={username} 
                  onChange={event => setUsername(event.target.value)} 
                />
                <Button type="submit" disabled={!username} isLoading={loading} bg="#ebc999">
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList 
                users={data.searchUsers} 
                addParticipant={addParticipant}
                participants={participants}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants 
                  participants={participants} 
                  removeParticipant={removeParticipant} 
                />
                <Button
                  bg="brand.secondary"
                  width="100%"
                  mt={4}
                  py={2}
                  px={4}
                  isLoading={createConversationLoading}
                  _hover={{ bg: "brand.platinum"}}
                  onClick={onCreateConversation}
                >
                  Create Conversation</Button>
              </>
            )}
          </ModalBody>
          </ModalContent>
      </Modal>
    </>
  )
};

export default ConversationModal;
