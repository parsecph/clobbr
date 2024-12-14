import { faker } from '@faker-js/faker';

export const COMMENT = () => {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.soon(),
    name: faker.person.firstName(),
    avatar: faker.image.avatar(),
    ip: faker.internet.ip(),
    comment: faker.lorem.words()
  };
};
