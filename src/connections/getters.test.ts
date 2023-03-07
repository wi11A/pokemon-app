const { callDetailsAPI, callListAPI } = require('./getters');

test('Check List API returns 898 pokemon', async () => {
  const data = await callListAPI();
  expect(data).toBe('');
});