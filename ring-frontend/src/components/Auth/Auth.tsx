import { signIn } from "next-auth/react";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import UserOperations from '../../graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from "@/src/util/types";
import { toast } from "react-hot-toast";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}


const Auth: React.FC<IAuthProps> = ({
    session,
    reloadSession,
}) => {
    const [username, setUsername] = useState("");

        // first value is  mutation function createUsername
        // second is object with data loading and error
        // inside angles, return two types, first is type of data we want back, second is type of variables
        // ref interface CreateUsername above. 
    const [createUsername, { loading, error } ] = useMutation<
        CreateUsernameData, 
        CreateUsernameVariables
    >(UserOperations.Mutations.createUsername)
        // moved data from object param that would have accessed mutation object
    
    // console.log('Here is user Data', loading, error)

    // async function will communicate with backend
    // use graphql mutation (used to create, update or delete resources)
    // and here we are updating user resource
    const onSubmit = async () => {
        // check to make sure user put input
        if (!username) return;
        try {
            // second way to access data object from mutation function:
            const { data } = await createUsername({ variables: { username } })
            
            // if no username
            if (!data?.createUsername) {
                throw new Error();
            }

            if (data.createUsername.error) {
                const { createUsername: {error}, } = data;

                toast.error(error);
                return;
            }

            toast.success('Username created!')
            
            // only Reload session to obtain username after passing error checks
            reloadSession();

        } catch (error: any) {
            toast.error(error?.message);
            console.log("onSubmit error", error); 
        }
    }
    


    return ( 
        <Center height="100vh">
            <Stack spacing={6} align='center'>
                {session ? (
                    <>
                        <Text fontSize='3xl'>Create a Username</Text>
                        <Input 
                            placeholder="Enter Username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button width='100%' onClick={onSubmit} isLoading={loading}>
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Text fontSize='3xl'>localRing</Text>
                        <Button 
                            onClick={() => signIn("google")}
                            leftIcon={<Image height='20px' src='/images/googlelogo.png' />}
                            >
                            Continue With Google
                        </Button>
                    </>
                )}
            </Stack>
        </Center>
    ) ;
};

export default Auth;
