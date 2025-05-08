const express = require('express');
const router = express.Router();
const DetailedNote = require('../models/DetailedNote');

// List all notes
router.get('/', async (req, res) => {
  const notes = await DetailedNote.find();
  res.render('notesList', { notes });
});

// Show one note by ID
router.get('/:id', async (req, res) => {
  const note = await DetailedNote.findById(req.params.id);
  if (!note) return res.status(404).send('Note not ghghh found');
  res.render('noteDetails', { note });
});

module.exports = router;
