const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));

const urlBase = 'http://localhost';
const api = 'api/items';
let oldData = [];

describe('/:id Update', () => {
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

  it('Should return an 201 code if the item was update In DB if The update is Full', async () => {
    const oldItem = {
      name: 'Miel',
      sellIn: 20,
      quality: 35,
      type: 'AGED'
    };
    await agent.post(`${urlBase}:8080/${api}`, oldItem);
    const getResponse = await agent.get(`${urlBase}:8080/${api}`);
    expect(getResponse.body.length).equal(1);

    const newItem = {
      name: 'Chocolate',
      sellIn: 1,
      quality: 10,
      type: 'LEGENDARY'
    };
    const item = getResponse.body[0];
    const putResponse = await agent.put(`${urlBase}:8080/${api}/${item.id}`, newItem);
    expect(putResponse.status).to.equal(statusCode.CREATED);

    const { body } = await agent.get(`${urlBase}:8080/${api}`);
    const itemDB = body[0];
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
    await agent.post(`${urlBase}:8080/${api}`, oldItem);
    const getResponse = await agent.get(`${urlBase}:8080/${api}`);
    expect(getResponse.body.length).equal(1);

    const newItem = {
      sellIn: 30,
      quality: 10,
      type: 'LEGENDARY'
    };
    const item = getResponse.body[0];
    const putResponse = await agent.put(`${urlBase}:8080/${api}/${item.id}`, newItem);
    expect(putResponse.status).to.equal(statusCode.CREATED);

    const { body } = await agent.get(`${urlBase}:8080/${api}`);
    const itemDB = body[0];
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
    await agent.delete(`${urlBase}:8080/${api}/1200000`, newItem).ok((res) => res.status < 500)
      .then((response) => {
        expect(response.notFound).equals(true);
      });
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
