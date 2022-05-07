const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Delete Item Api Tests with query parameters', () => {
  before('Before DELETE Api test', async () => {
    const response = await agent.get('http://localhost:8080/api/items');
    if (response.body.length > 0) {
      response.body.forEach(async (element) => {
        await agent.delete(`http://localhost:8080/api/items/${element.id}`);
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
    const variable = await agent.post('http://localhost:8080/api/items').send(item);
    const { id } = variable.body;
    const response = await agent.del(`http://localhost:8080/api/items/${id}`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.equal(item.name);
  });

  it('Consume DELETE Service should throw NOTFOUND_ERROR', async () => {
    const response = await agent.del('http://localhost:8080/api/items/1').ok(() => true);
    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });
});
