const AppError = require('../utils/appError');
const parser = require('../utils/parser');
const pathWalker = require('../utils/pathWalker')
const path = require('path');


exports.generate = async (req, res, next) => {
  try {
    //code to parse data
    const userId = req.params.id;
    const entities = parser.JSONToMap(req.body.data);
    let schema = {};
    await pathWalker.copyBoilerPlate(`../download/${userId}`);
    for(const entity of entities.values()) {
      schema = parser.entityToSchema(entity,entities);
      await pathWalker.generateTemplateFiles(userId, entity.name, schema);
    }
    await pathWalker.flush(`../download/`, userId);
    console.log(`generated for: ${userId} at ${new Date()}`);
    res.send(true);
  } catch (error) {
    console.log(error);
    await pathWalker.cleanUp(userId);
    next(new AppError(500, 'fail', 'failed generation'), req, res, next);
  }
};

exports.download = async (req, res, next) => {
  try {
    const userId = req.params.id;
    res.download(path.join(__dirname,`../download/${userId}.zip`), 'dbkit-rest.zip', async (err) => {
      await pathWalker.deleteAsync(path.join(__dirname,`../download/${userId}.zip`));
    });
  } catch (error) {
    console.log(error);
    next(new AppError(500, 'fail', 'failed download'), req, res, next);
  }
}
