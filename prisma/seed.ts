import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "test123";
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test1@example.com",
      passwordHash: passwordHash,
      image: null,
    },
  });

  const deck = await prisma.deck.create({
    data: {
      name: "Basic English Words",
      isQuizNormal: true,
      isQuizReversed: true,
      isQuizTyping: false,
      isQuizRandomized: true,
      isPrivate: false,
      userId: user.id,
      cards: {
        create: [
          {
            front: "Hello",
            back: "Cześć",
            context: "Hello, my name is Vladyslav.",
          },
          {
            front: "Goodbye",
            back: "Do widzenia",
            context: "Goodbye, see you tomorrow.",
          },
          {
            front: "Please",
            back: "Proszę",
            context: "Can you help me, please?",
          },
          {
            front: "Thank you",
            back: "Dziękuję",
            context: "Thank you for your help.",
          },
          {
            front: "Sorry",
            back: "Przepraszam",
            context: "Sorry, I’m late.",
          },
          {
            front: "Yes",
            back: "Tak",
            context: "Yes, I like this idea.",
          },
          {
            front: "No",
            back: "Nie",
            context: "No, I don’t want coffee.",
          },
          {
            front: "Friend",
            back: "Przyjaciel",
            context: "He is my best friend.",
          },
          {
            front: "Book",
            back: "Książka",
            context: "I am reading a new book.",
          },
          {
            front: "Food",
            back: "Jedzenie",
            context: "The food in this restaurant is delicious.",
          },
        ],
      },
    },
    include: { cards: true },
  });

  console.log(
    `Seeded user ${user.email} with deck '${deck.name}' and ${deck.cards.length} cards.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
