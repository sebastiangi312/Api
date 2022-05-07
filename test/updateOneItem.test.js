const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));

const apiURL = 'http://localhost:8080/api/items';
const oldData = [];

describe('/:id Update', () => {
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

  it('Should return an 201 code if the item was update In DB if The update is Full', async () => {
    const oldItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.post(`${apiURL}`, oldItem);
    const getResponse = await agent.get(`${apiURL}`);
    const newItem = {
      name: 'Chocolate',
      sellIn: 1,
      quality: 10,
      type: 'LEGENDARY'
    };
    const item = getResponse.body[0];
    const putResponse = await agent.put(`${apiURL}/${item.id}`, newItem);

    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];
    expect(putResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.name).equal(newItem.name);
    expect(itemDB.sellIn).equal(newItem.sellIn);
    expect(itemDB.quality).equal(newItem.quality);
    expect(itemDB.type).equal(newItem.type);
  });

  it('Should return an 201 code if the item was update In DB if The update is partially', async () => {
    const oldItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.post(`${apiURL}`, oldItem);
    const getResponse = await agent.get(`${apiURL}`);

    const newItem = {
      sellIn: 30,
      quality: 10,
      type: 'LEGENDARY'
    };
    const item = getResponse.body[0];
    const putResponse = await agent.put(`${apiURL}/${item.id}`, newItem);

    const { body } = await agent.get(`${apiURL}`);
    const itemDB = body[0];
    expect(getResponse.body.length).equal(1);
    expect(putResponse.status).to.equal(statusCode.CREATED);
    expect(itemDB.name).equal(oldItem.name);
    expect(itemDB.sellIn).equal(newItem.sellIn);
    expect(itemDB.quality).equal(newItem.quality);
    expect(itemDB.type).equal(newItem.type);
  });

  it('Should return a 404 code if the item is not found in DB', async () => {
    const newItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.delete(`${apiURL}/1200000`, newItem).ok((res) => res.status < 500)
      .then((response) => {
        expect(response.notFound).equals(true);
      });
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
