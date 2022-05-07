const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Get Item Api Tests with query parameters', () => {
  before('Before GET Api test', async () => {
    const response = await agent.get('http://localhost:8080/api/items');
    if (response.body.length > 0) {
      response.body.forEach(async (element) => {
        await agent.delete(`http://localhost:8080/api/items/${element.id}`);
      });
    }
  });

  it('Consume GET Service with item', async () => {
    const item = {
      name: 'Galletas',
      sellIn: 10,
      quality: 35,
      type: 'NORMAL'
    };
    const variable = await agent.post('http://localhost:8080/api/items').send(item);
    const { id } = variable.body;
    const response = await agent.get(`http://localhost:8080/api/items/${id}`);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.equal(item.name);
  });

  it('Consume GET Service should throw NOTFOUND_ERROR', async () => {
    const response = await agent.get('http://localhost:8080/api/items/500').ok(() => true);
    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });
});
