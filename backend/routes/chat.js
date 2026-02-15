
const express = require('express');
const { queryAdvisor } = require('../controllers/chat');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All chat routes are protected
router.use(protect);

router.post('/query', queryAdvisor);

module.exports = router;
