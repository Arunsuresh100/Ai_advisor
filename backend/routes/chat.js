
const express = require('express');
const { queryAdvisor } = require('../controllers/chat');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All chat routes are protected
router.use(protect);

// Basic query
router.post('/query', queryAdvisor);

// History and Session Management
const { getChatHistory, createNewChat, getChatMessages, deleteChat, clearChatHistory } = require('../controllers/chat');
router.get('/history', getChatHistory);
router.post('/new', createNewChat);
router.get('/:id', getChatMessages);
router.delete('/history/clear', clearChatHistory);
router.delete('/:id', deleteChat);

module.exports = router;
