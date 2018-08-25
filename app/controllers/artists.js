const _ = require('lodash');
const models = require('../models');

const helper = require('./helper');

const Artist = models.artist;
const Track = models.track;
const Tag = models.tag;

function getModel(name) {
  if (!name) {
    throw new Error('Model name is required');
  }
  switch (name) {
    case 'tracks':
      return models.track.scope('withTags');
    case 'tags':
      return models.tag;
    default:
      return null;
  }
}

function getFindAttributes(model) {
  const attr = {};
  switch (model) {
    case 'tracks':
      attr.include = [{
        model: getModel('tags'),
      }];
      break;
    case 'tags':
      return models.tag;
    default:
      return null;
  }
}
module.exports = {
  async readAll(req, res, next) {
    try {
      const modelName = req.query._embed;
      const embeddableModels = ['tracks'];
      const attr = {};
      if (embeddableModels.indexOf(modelName) !== -1) {
        attr.include = [{
          model: getModel(modelName),
        }];
      }
      const artists = await Artist.findAll(attr);
      helper.basicJsonResponse(res, artists, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },
  async read(req, res, next) {
    try {
      const modelName = req.query._embed;
      const embeddableModels = ['tracks'];
      const attr = {};
      if (embeddableModels.indexOf(modelName) !== -1) {
        attr.include = [{
          model: getModel(modelName),
        }];
      }
      const artist = await Artist.findOne(_.extend({
        where: {
          id: req.params.id,
        },
      }, attr));
      helper.basicJsonResponse(res, artist, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },


  async trackFromTags(req, res, next) {
    try {
      const q = req.query.tag;
      const tags = await Tag.find({
        where: {
          name: q,
        },
        include: [{
          model: Track,
          include: [{ model: Artist }],
          through: { attributes: [] },
        }],
      });
      helper.basicJsonResponse(res, tags, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },
}
;
