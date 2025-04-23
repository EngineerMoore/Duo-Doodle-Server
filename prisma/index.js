const bcrypt = require("bcrypt");
const { PrismaPg } = require("@prisma/adapter-pg")
const { PrismaClient } = require("../generated/prisma/client");
const { withAccelerate } = require('@prisma/extension-accelerate');

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends(withAccelerate()).$extends({
  model: {
    user: {
      async signUp(username, email, firstName, lastName, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { 
            username,
            email,
            firstName,
            lastName,
            password: hash
          },
        });
        return user;
      },

      async login(email, password) {
        const user = await prisma.user.findUniqueOrThrow({ where: { email }, });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error(`Invalid password`);
        return user;
      },
    },
  },
});

module.exports = prisma