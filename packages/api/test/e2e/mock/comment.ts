import faker from 'faker';

export const COMMENT = () => {
  return {
    id: faker.datatype.uuid(),
    createdAt: faker.date.soon(),
    name: faker.name.firstName(),
    avatar: faker.image.avatar(),
    ip: faker.internet.ip(),
    comment: faker.lorem.words()
  };
};
