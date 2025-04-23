// must include the.js b/c of ESM file extension
const prisma = require('../src/index.js')
const { faker } = require('@faker-js/faker');

// don't forget to add prisma seed script to package.json
const seed = async (numUsers = 5) => {

  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  }));
  
  await prisma.user.createMany({ data: users });
}

seed()
  .then( async () => await prisma.$disconnect() )
  .catch( async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })