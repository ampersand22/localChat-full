import { Stack, Button, Box, Text, Flex } from "@chakra-ui/react";
import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { SearchedUser } from "../../../../util/types";

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {  

  return (
    <Flex direction="row" mt={8} flexWrap="wrap" gap="10px">
      {participants.map((participant) => (
        <Stack
          key={participant.id}
          direction="row"
          align="center"
          bg="gray.200"
          border="1px solid gray"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <IoIosCloseCircleOutline
            size={25}
            cursor="pointer"
            onClick={() => removeParticipant(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
};
export default Participants;