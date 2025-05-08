const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Note = require("../models/Note");
const DetailedNote = require("../models/DetailedNote");

const router = express.Router();

// Middleware for auth
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}

// Login Routes
router.get("/login", (req, res) => res.render("login"));
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    req.session.userId = user._id;
    return res.redirect("/");
  }
  res.send("Invalid credentials");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Profile Routes
router.get("/profile", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("profile", { user });
});

router.post("/profile", isAuthenticated, async (req, res) => {
  const { email, password } = req.body;
  const update = { email };
  if (password && password.trim() !== "") {
    update.password = await bcrypt.hash(password, 10);
  }
  await User.findByIdAndUpdate(req.session.userId, update);
  res.redirect("/profile");
});

// Dashboard
router.get("/dashboard", isAuthenticated, async (req, res) => {
  const notes = await Note.find();
  res.render("dashboard", { notes });
});

// Add Note Page
router.get("/add-notes", isAuthenticated, (req, res) => {
  res.render("add-notes");
});

// Convert Drive Image Link
function convertGoogleDriveLink(link) {
  const match = link.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : link;
}

// Convert Google Drive link to direct download link
function convertGoogleDriveDownloadLink(link) {
  const match = link.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : link;
}


// Detailed Notes
router.get("/detailNotesForm", (req, res) => {
  res.render("detailNotesForm");
});

// Show detailed notes list
router.get("/detailednotes", async (req, res) => {
  try {
    const notes = await DetailedNote.find();
    res.render("detailedNotesList", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Server Error");
  }
});

// If you want to support "/detailedNotesList"
router.get("/detailedNotesList", async (req, res) => {
  try {
    const notes = await DetailedNote.find();
    res.render("detailedNotesList", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Server Error");
  }
});

// Add detailed note
router.post("/detailednotes", async (req, res) => {
  try {
    const { notesTitle, notesCode, introTitle, units } = req.body;
    const formattedUnits = Array.isArray(units) ? units : Object.values(units);
    const newNote = new DetailedNote({ notesTitle, notesCode, introTitle, units: formattedUnits });
    await newNote.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving detailed note:", err);
    res.status(500).send("Server Error");
  }
});

// Edit detailed note
router.get("/detailednotes/edit/:id", async (req, res) => {
  try {
    const note = await DetailedNote.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");
    res.render("editDetailedNote", { note });
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).send("Server Error");
  }
});

router.post("/detailednotes/edit/:id", async (req, res) => {
  try {
    const { notesTitle, notesCode, introTitle, units } = req.body;
    const formattedUnits = Array.isArray(units) ? units : Object.values(units);
    await DetailedNote.findByIdAndUpdate(req.params.id, {
      notesTitle, notesCode, introTitle, units: formattedUnits
    });
    res.redirect("/detailednotes");
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).send("Server Error");
  }
});

// Delete detailed note
router.post("/detailednotes/delete/:id", async (req, res) => {
  try {
    await DetailedNote.findByIdAndDelete(req.params.id);
    res.redirect("/detailednotes");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Server Error");
  }
});

// Add regular note
router.post("/add-note", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      notesCode,
      notesPagePath,
      imagePath,
      quantumTitle,
      quantumImagePath,
      quantumLink,
      tag,
      pyqLink,
      pyqTitle,
      pyqImage
    } = req.body;

    // Format Google Drive links
    const formattedImagePath = convertGoogleDriveLink(imagePath);
    const formattedQuantumImagePath = convertGoogleDriveLink(quantumImagePath);
    const formattedQuantumLink = convertGoogleDriveDownloadLink(quantumLink);
    const formattedPyqLink = convertGoogleDriveDownloadLink(pyqLink);

    const newNote = new Note({
      title,
      notesCode,
      notesPagePath,
      imagePath: formattedImagePath,
      quantumTitle,
      quantumImagePath: formattedQuantumImagePath,
      quantumLink: formattedQuantumLink,
      tag,
      pyqLink: formattedPyqLink,
      pyqTitle,
      pyqImage
    });

    await newNote.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit regular note
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("edit", { note });
});

router.post("/edit/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/dashboard");
});

// Delete regular note
router.get("/delete/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

// Admin Home
router.get("/", isAuthenticated, async (req, res) => {
  const notes = await Note.find();
  res.render("admin-home", { notes, count: notes.length });
});

// Search, Quantum, PYQ
router.get("/pyq", async (req, res) => {
  try {
    const notesWithPyq = await Note.find({ pyqLink: { $exists: true, $ne: "" } });
    res.render("pyq", { notes: notesWithPyq });
  } catch (err) {
    res.status(500).send("Error loading PYQ notes.");
  }
});

router.get("/quantum", async (req, res) => {
  try {
    const quantum = await Note.find({ quantumLink: { $exists: true, $ne: "" } });
    res.render("quantum", { notes: quantum });
  } catch (err) {
    res.status(500).send("Error loading quantum.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await DetailedNote.findById(req.params.id);
    res.render("viewDetailedNote", { note });
  } catch (error) {
    res.status(404).send("Note not found");
  }
});
router.get("/notesList", async (req, res) => {
  const notes = await DetailedNotes.find();
  res.render("notesList", { notes });
});

router.get("/search", isAuthenticated, async (req, res) => {
  const query = req.query.q;
  const notes = await Note.find({
    $or: [
      { title: new RegExp(query, "i") },
      { tag: new RegExp(query, "i") },
    ],
  });
  res.render("search-results", { notes });
});

module.exports = router;
