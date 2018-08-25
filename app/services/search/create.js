const client = require('./connection');
const models = require('../../models');

const Artist = models.artist;
const Track = models.track;
const Tag = models.tag;

async function createIndices(index) {
  try {
    const resp = await client.indices.create({
      index,
    });
  } catch (e) {
    if (e.body.error.type === 'resource_already_exists_exception') {
      console.log('Index already exists. Ignoring error');
    } else {
      throw e;
    }
  }
}

async function seedData() {
  const bulk = [];
  client.index({
    index: 'musics',
  });
}
async function init() {
  await createIndices('musics');
}

init();
