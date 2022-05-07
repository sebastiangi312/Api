const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Create Item Api Tests with query parameters', () => {
  before('Before POST Api test', async () => {
    const response = await agent.get('http://localhost:8080/api/items');
    if (response.body.length > 0) {
      response.body.forEach(async (element) => {
        await agent.delete(`http://localhost:8080/api/items/${element.id}`);
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
    const response = await agent.post('http://localhost:8080/api/items').send(item);
    expect(response.status).to.equal(statusCode.CREATED);
    expect(response.body.name).to.equal(item.name);
  });
});
