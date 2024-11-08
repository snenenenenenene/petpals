// app/api/auth/[...nextauth]/route.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Update login streak
        try {
          const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              pets: true,
            },
          });

          if (currentUser) {
            const now = new Date();
            const lastLogin = currentUser.lastLoginDate;
            
            let newStreak = currentUser.loginStreak;
            if (lastLogin) {
              const daysSinceLastLogin = Math.floor(
                (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              if (daysSinceLastLogin === 1) {
                newStreak += 1;
              } else if (daysSinceLastLogin > 1) {
                newStreak = 1;
              }
            } else {
              newStreak = 1;
            }

            // Update user and create pet if needed
            await prisma.user.update({
              where: { id: user.id },
              data: {
                lastLoginDate: now,
                loginStreak: newStreak,
                pets: {
                  create: currentUser.pets.length === 0 ? {
                    name: "New Pet",
                    type: "dog",
                    hunger: 100,
                    happiness: 100,
                    energy: 100,
                    hygiene: 100,
                  } : undefined,
                },
              },
            });
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        // Create initial pet for new user
        await prisma.pet.create({
          data: {
            userId: user.id,
            name: "New Pet",
            type: "dog",
            hunger: 100,
            happiness: 100,
            energy: 100,
            hygiene: 100,
          },
        });
      } catch (error) {
        console.error("Error creating initial pet:", error);
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};