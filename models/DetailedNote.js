const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitTitle: String,
  ownerName: String,
  pdfLink: {
    type: String,
    set: function(link) {
      const match = link.match(/\/file\/d\/(.+?)\//);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
      return link; // If it's already formatted or not a Drive link
    }
  }
});


const detailedNoteSchema = new mongoose.Schema({
  notesTitle: String,
  notesCode: String,
  introTitle: String,
  units: [unitSchema]  // Array of unit objects
});

module.exports = mongoose.model('DetailedNote', detailedNoteSchema);
