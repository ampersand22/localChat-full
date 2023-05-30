import nextAuth from "next-auth";

// declare interface to extend User and Session in next-auth
// what is done here will be combined with what's already in next-auth
declare module 'next-auth' {
    interface Session {
        user: User;
    }

    interface User {
        id: string;
        username: string;
        image: string
    }
}