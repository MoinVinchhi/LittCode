const express = require('express');
const healthRouter = express.Router();
const { checkHealth } = require('../controllers/health')

healthRouter.get('/', checkHealth);

module.exports = healthRouter;
