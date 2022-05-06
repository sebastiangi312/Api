const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-json-schema'));
const { listPublicEventsSchema } = require('../schema/ItemsSchema.schema');

const urlBase = 'http://localhost';
const api = 'api/items';
let oldData = [];

describe('Get All items', () => {
  beforeEach('', async () => {
    oldData = [];
    const response = await agent.get(`${urlBase}:8080/${api}`);
    const { body } = response;

    for (const item of body) {
      const oldItem = agent.delete(`${urlBase}:8080/${api}/${item.id}`);
      oldData.push(oldItem.body);
    }
    await Promise.all(oldData);
    const resp = await agent.get(`${urlBase}:8080/${api}`);
    expect(resp.body.length).equal(0);
  });

  describe('When there is at least One Element', () => {
    it('', async () => {
      await agent.post(`${urlBase}:8080/${api}`, {
        name: 'Miel',
        sellIn: 20,
        quality: 35,
        type: 'AGED'
      });

      const response = await agent.get(`${urlBase}:8080/${api}`);

      expect(response.status).to.equal(statusCode.OK);

      const { body } = response;

      body.forEach((item) => {
        expect(item).to.be.jsonSchema(listPublicEventsSchema);
      });

      expect(body[0].name).equal('Miel');
      expect(body[0].sellIn).equal(20);
      expect(body[0].quality).equal(35);
      expect(body[0].type).equal('AGED');
    });
  });

  describe('When there is no Elements', () => {
    it('', async () => {
      const response = await agent.get(`${urlBase}:8080/${api}`);

      expect(response.status).to.equal(statusCode.OK);

      const { body } = response;

      expect(body.length).to.equal(0);
    });
  });

  afterEach('', async () => {
    const response = await agent.get(`${urlBase}:8080/${api}`);
    const { body } = response;
    for (let index = 0; index < body.length; index += 1) {
      const item = body[index];
      await agent.delete(`${urlBase}:8080/${api}/${item.id}`);
    }

    const resp = await agent.get(`${urlBase}:8080/${api}`);
    expect(resp.body.length).equal(0);

    for (let index = 0; index < oldData.length; index += 1) {
      const item = oldData[index];
      await agent.post(`${urlBase}:8080/${api}`, item);
    }
  });
});
