import type { NextPage, NextPageContext } from "next";
import { Inter } from 'next/font/google';
import { Box } from "@chakra-ui/react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Chat from "../components/Chat/Chat";
import Auth from "../components/Auth/Auth";
import { Session } from 'next-auth';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession();

  const reloadSession = () => { 
    // this is used to refetch session after reload update.
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  console.log("Here is data", session);

  return  (
    <Box>
      {/* {session?.user.username} */}
      {session?.user?.username ? (
        <Chat session={session}/> 
      ) : ( <Auth session={session} reloadSession={reloadSession} />
    )}
    </Box>
  );
};

// need to have serversideProps to help with rendering
// make sure to use context and return object with props
export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  };
}
