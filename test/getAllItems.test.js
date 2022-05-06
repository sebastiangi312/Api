const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));
const { listPublicEventsSchema } = require('../schema/ItemsSchema.schema');

const urlBase = 'http://localhost';
const api = 'api/items';
let oldData = [];

describe('/ GET', () => {
  beforeEach('Back up old data', async () => {
    oldData = [];

    const { body } = await agent.get(`${urlBase}:8080/${api}`);
    for (const item of body) {
      const oldItem = await agent.delete(`${urlBase}:8080/${api}/${item.id}`);
      oldData.push(oldItem.body);
    }

    const resp = await agent.get(`${urlBase}:8080/${api}`);
    expect(resp.body.length).equal(0);
  });

  it('should return an empty array if the DB is empty', async () => {
    const response = await agent.get(`${urlBase}:8080/${api}`);
    expect(response.status).to.equal(statusCode.OK);

    const { body } = response;
    expect(body.length).to.equal(0);
  });

  it('Should return an array with one Items if the DB has only One Items', async () => {
    const newItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.post(`${urlBase}:8080/${api}`, newItem);

    const response = await agent.get(`${urlBase}:8080/${api}`);
    expect(response.status).to.equal(statusCode.OK);

    const { body } = response;
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
    await agent.post(`${urlBase}:8080/${api}`, firstNewItem);
    await agent.post(`${urlBase}:8080/${api}`, secondNewItem);

    const { body } = await agent.get(`${urlBase}:8080/${api}`);
    expect(body.length).to.equal(2);

    body.forEach((item) => {
      expect(item).to.be.jsonSchema(listPublicEventsSchema);
    });

    const firstItem = body[0];
    expect(firstItem.name).equal(firstNewItem.name);
    expect(firstItem.sellIn).equal(firstNewItem.sellIn);
    expect(firstItem.quality).equal(firstNewItem.quality);
    expect(firstItem.type).equal(firstNewItem.type);

    const secondItem = body[1];
    expect(secondItem.name).equal(secondNewItem.name);
    expect(secondItem.sellIn).equal(secondNewItem.sellIn);
    expect(secondItem.quality).equal(secondNewItem.quality);
    expect(secondItem.type).equal(secondNewItem.type);
  });

  afterEach('Restore Old Data', async () => {
    const { body } = await agent.get(`${urlBase}:8080/${api}`);
    for (const item of body) {
      await agent.delete(`${urlBase}:8080/${api}/${item.id}`);
    }

    const resp = await agent.get(`${urlBase}:8080/${api}`);
    expect(resp.body.length).equal(0);

    for (const item of oldData) {
      await agent.post(`${urlBase}:8080/${api}`, item);
    }
  });
});
