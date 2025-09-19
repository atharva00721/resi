import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // For JWT strategy, we need to find or create the user in the database
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    // Create user if they don't exist in database
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    });
  }

  return user;
}
