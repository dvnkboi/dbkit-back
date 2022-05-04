const express = require('express');
const router = express.Router();
const _template_Controller = require('../controllers/_template_Controller');

router
    .route('/_template_/')
    .get(_template_Controller.getAll)
    .put(_template_Controller.create);

router
    .route('/_template_/:id')
    .get(_template_Controller.get)
    .patch(_template_Controller.update)
    .delete(_template_Controller.delete);

module.exports = router;