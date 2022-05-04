const _Template_ = require('../models/_template_Model');
const base = require('./baseController');

exports.getAll = base.getAll(_Template_);
exports.get = base.getOne(_Template_);
exports.update = base.updateOne(_Template_);
exports.delete = base.deleteOne(_Template_);
exports.create = base.createOne(_Template_);