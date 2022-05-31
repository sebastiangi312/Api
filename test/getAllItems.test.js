const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));
const { listPublicEventsSchema } = require('../schema/ItemsSchema.schema');

const apiURL = 'http://api:8081/api/items';
const oldData = [];

describe('/ GET', () => {
  before('', async () => {
    const { body } = await agent.get(`${apiURL}`);
    body.forEach(async (item) => {
      const oldItem = await agent.delete(`${apiURL}/${item.id}`);
      oldData.push(oldItem.body);
    });
  });

  beforeEach('Back up old data', async () => {
    const { body } = await agent.get(`${apiURL}`);
    body.forEach(async (item) => {
      await agent.delete(`${apiURL}/${item.id}`);
    });
  });

  it('should return an empty array if the DB is empty', async () => {
    const response = await agent.get(`${apiURL}`);
    const { body } = response;

    expect(response.status).to.equal(statusCode.OK);
    expect(body.length).to.equal(0);
  });

  it('Should return an array with one Items if the DB has only One Items', async () => {
    const newItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.post(`${apiURL}`).send(newItem);
    const response = await agent.get(`${apiURL}`);
    const { body } = response;

    expect(response.status).to.equal(statusCode.OK);
    body.forEach((item) => {
      expect(item).to.be.jsonSchema(listPublicEventsSchema);
    });
    expect(body[0].name).equal(newItem.name);
    expect(body[0].sellIn).equal(newItem.sellIn);
    expect(body[0].quality).equal(newItem.quality);
    expect(body[0].type).equal(newItem.type);
  });

  it('Should return an array with the Items if the DB has Items', async () => {
    const firstNewItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    const secondNewItem = {
      name: 'Miel2',
      sellIn: 35,
      quality: 35,
      type: 'NORMAL'
    };
    await agent.post(`${apiURL}`).send(firstNewItem);
    await agent.post(`${apiURL}`).send(secondNewItem);
    const { body } = await agent.get(`${apiURL}`);
    const firstItem = body[0];
    const secondItem = body[1];

    expect(body.length).to.equal(2);
    body.forEach((item) => {
      expect(item).to.be.jsonSchema(listPublicEventsSchema);
    });
    expect(firstItem.name).equal(firstNewItem.name);
    expect(firstItem.sellIn).equal(firstNewItem.sellIn);
    expect(firstItem.quality).equal(firstNewItem.quality);
    expect(firstItem.type).equal(firstNewItem.type);

    expect(secondItem.name).equal(secondNewItem.name);
    expect(secondItem.sellIn).equal(secondNewItem.sellIn);
    expect(secondItem.quality).equal(secondNewItem.quality);
    expect(secondItem.type).equal(secondNewItem.type);
  });

  after('Restore Old Data', async () => {
    const { body } = await agent.get(`${apiURL}`);
    body.forEach(async (item) => {
      await agent.delete(`${apiURL}/${item.id}`);
    });
    oldData.forEach(async (item) => {
      await agent.post(`${apiURL}`).send(item);
    });
    const getResponse = await agent.get(`${apiURL}`);
    await Promise.all(getResponse.body);
  });
});
