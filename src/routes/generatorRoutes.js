const express = require('express');
const router = express.Router();
const generatorController = require('../controllers/generatorController');

router
    .route('/generate/:id')
    .post(generatorController.generate)

router
    .route('/download/:id')
    .get(generatorController.download)

module.exports = router;