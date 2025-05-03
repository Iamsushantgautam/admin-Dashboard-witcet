const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Admin route to add notes
router.get('/detailnotes', noteController.renderAddNotePage);
router.post('/detailnotes', noteController.addNote);

// Route to view note details
router.get('/note/:id', noteController.viewNoteDetails);

module.exports = router;
