const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));

const apiURL = 'http://api:8081/api/items';
const oldData = [];

describe('/quality POST', () => {
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

  it('should reduce quality and sellIn if the item Type is Normal', async () => {
    const item = {
      sellIn: 30,
      quality: 10,
      type: 'NORMAL'
    };
    const postResponse = await agent.post(`${apiURL}`).send(item);
    await agent.post(`${apiURL}/quality`);
    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];

    expect(postResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.sellIn).equal(item.sellIn - 1);
    expect(itemDB.quality).equal(item.quality - 1);
  });

  it('should increase quality and reduce sellIn if the item Type is AGED', async () => {
    const item = {
      sellIn: 30,
      quality: 10,
      type: 'AGED'
    };
    const postResponse = await agent.post(`${apiURL}`).send(item);
    await agent.post(`${apiURL}/quality`);
    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];

    expect(postResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.sellIn).equal(item.sellIn - 1);
    expect(itemDB.quality).equal(item.quality + 1);
  });

  it('should stay the same if the item Type is LEGENDARY', async () => {
    const item = {
      sellIn: 30,
      quality: 10,
      type: 'LEGENDARY'
    };
    const postResponse = await agent.post(`${apiURL}`).send(item);
    await agent.post(`${apiURL}/quality`);
    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];

    expect(postResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.sellIn).equal(item.sellIn);
    expect(itemDB.quality).equal(item.quality);
  });

  it('should increase quality by 3 if the item Type is TICKETS', async () => {
    const item = {
      sellIn: 5,
      quality: 10,
      type: 'TICKETS'
    };
    const postResponse = await agent.post(`${apiURL}`).send(item);
    await agent.post(`${apiURL}/quality`);
    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];

    expect(postResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.sellIn).equal(item.sellIn - 1);
    expect(itemDB.quality).equal(item.quality + 3);
  });

  after('Restore Old Data', async () => {
    const { body } = await agent.get(`${apiURL}`);
    body.forEach(async (item) => {
      await agent.delete(`${apiURL}/${item.id}`);
    });
    oldData.forEach(async (item) => {
      await agent.post(`${apiURL}`).send(item);
    });
  });
});
