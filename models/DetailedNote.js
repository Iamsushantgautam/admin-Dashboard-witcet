const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitTitle: String,
  ownerName: String,
  pdfLink: String
});

const detailedNoteSchema = new mongoose.Schema({
  notesTitle: String,
  notesCode: String,
  introTitle: String,
  units: [unitSchema]  // Array of unit objects
});

module.exports = mongoose.model('DetailedNote', detailedNoteSchema);
