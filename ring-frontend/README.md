localRing - Next/GraphQL/MongoDB/Prisma

Building a social media app with messaging, profiles, events, and maps for local independent
wrestling companies to promote their shows, dates, and locations to users. I'm doing this solo
while working two jobs... so it might take a while. Starting with messaging function, then maps,
then events.

Issues.
1. Hard time finding best way to use GraphQL.
2. Enabling apollo subscriptions
3. had to add binaryTargets into prisma schema
4. Fix babel with 
    {
        "extends": ["next/babel", "next/core-web-vitals"]
    }
5. In Modal, data?.searchUsers && ... doesn't have clappers after the &&,
    when I try it, it breaks the code. --> FIXED
6. There's just so much to GraphQL and TS. Understand better after receiving help but there's a lot to it.

Wins.
1. Loving the Next.js
2. Using prisma for GQL to communicate with Next frontend.
3. Have a moderate grasp on TS syntax to request specific queries from API
4. Snippets. That's the win. Snippets.


To Do List
1. Create separate type files in util on frontend



What to remember with Prisma?:
1. Remember to recompile dev when changing variables or environments
2. add in binaryTargets, with "native, darwin"
3. Run npx prisma generate --schema=sr
c/prisma/schema.prisma in terminal to connect

S/O Shad Merhi, Caleb Hollingsworth for help. 
