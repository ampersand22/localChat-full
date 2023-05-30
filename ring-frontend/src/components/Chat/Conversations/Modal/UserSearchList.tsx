import { SearchedUser } from "@/src/util/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";

// avatar will be custom profile pic

interface UserSearchListProps {
  users: Array<SearchedUser>
  participants: Array<SearchedUser>;
  addParticipant:(user: SearchedUser) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ 
  users,
  participants,
  addParticipant, 
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack 
            key={user.id}
            direction="row"
            align="center"
            spacing={4}
            py={2}
            px={4}
            borderRadius={4}
            _hover={{ bg: "#cfdbd5" }}  
            >
              <Avatar src="" />
              <Flex justify='space-between' align="center" width='100%'>
                <Text color="black">{user.username}</Text>
                <Button 
                  bg="brand.secondary" 
                  _hover={{ bg: "#f7f0f5" }} 
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  )
};

export default UserSearchList;
