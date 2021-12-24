import { prisma } from '../../lib/prisma'
//const prisma = new PrismaClient()

async function transfer(from, to, amount) {
  return await prisma.$transaction(async (prisma) => {
    // 1. Decrement amount from the sender.
    const sender = await prisma.account.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        email: from,
      },
    })
    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`)
    }
    // 3. Increment the recipient's balance by amount
    const recipient = prisma.account.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        email: to,
      },
    })
    return recipient
  })
}

async function main() {
  // This transfer is successful
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
  // This transfer fails because Alice doesn't have enough funds in her account
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect()
  })