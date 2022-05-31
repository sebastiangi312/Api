const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

const apiURL = 'http://api:8081/api/items';

describe('Delete Item Api Tests with query parameters', () => {
  before('Before DELETE Api test', async () => {
    const response = await agent.get(`${apiURL}`);
    if (response.body.length > 0) {
      response.body.forEach(async (element) => {
        await agent.delete(`${apiURL}/${element.id}`);
      });
    }
  });

  it('Consume DELETE Service with item', async () => {
    const item = {
      name: 'Quipitos',
      sellIn: 3,
      quality: 35,
      type: 'NORMAL'
    };
    const variable = await agent.post(`${apiURL}`).send(item);
    const { id } = variable.body;
    const response = await agent.del(`${apiURL}/${id}`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.equal(item.name);
  });

  it('Consume DELETE Service should throw NOTFOUND_ERROR', async () => {
    const response = await agent.del(`${apiURL}/1`).ok(() => true);
    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });
});
