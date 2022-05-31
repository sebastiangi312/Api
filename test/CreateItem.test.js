const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

const apiURL = 'http://api:8081/api/items';

describe('Create Item Api Tests with query parameters', () => {
  before('Before POST Api test', async () => {
    const response = await agent.get(`${apiURL}`);
    if (response.body.length > 0) {
      response.body.forEach(async (element) => {
        await agent.delete(`${apiURL}/${element.id}`);
      });
    }
  });

  it('Consume POST Service with item', async () => {
    const item = {
      name: 'Chocolatina',
      sellIn: 15,
      quality: 35,
      type: 'NORMAL'
    };
    const response = await agent.post(`${apiURL}`).send(item);
    expect(response.status).to.equal(statusCode.CREATED);
    expect(response.body.name).to.equal(item.name);
  });
});
