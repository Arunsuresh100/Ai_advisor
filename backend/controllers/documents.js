const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique name to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File Filter (PDF/DOC only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single('file');

// @desc    Upload Single Document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    try {
      const newDoc = await Document.create({
        user: req.user.id,
        name: req.file.originalname, // Store original name as display name initially
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      res.status(201).json({
        success: true,
        data: newDoc
      });
    } catch (error) {
      console.error('Upload Error:', error);
      // Clean up uploaded file if database save fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ success: false, message: 'Server Error during upload' });
    }
  });
};

// @desc    Get All Documents for User
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('Fetch Docs Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Download Document
// @route   GET /api/documents/:id/download
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Ensure user owns the document
    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const filePath = path.join(__dirname, '..', doc.path);

    if (fs.existsSync(filePath)) {
      res.download(filePath, doc.originalName);
    } else {
      res.status(404).json({ success: false, message: 'File not found on server' });
    }
  } catch (err) {
    console.error('Download Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete Document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const filePath = path.join(__dirname, '..', doc.path);

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await doc.deleteOne();

    res.status(200).json({ success: true, message: 'Document removed' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
