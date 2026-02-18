const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();
const { 
    uploadDocument, 
    getDocuments, 
    downloadDocument, 
    deleteDocument 
} = require('../controllers/documents');

// Apply protection to all routes
router.use(protect);

router.route('/')
    .get(getDocuments);

router.route('/upload')
    .post(uploadDocument);

router.route('/:id')
    .delete(deleteDocument);

router.route('/:id/download')
    .get(downloadDocument);

module.exports = router;
