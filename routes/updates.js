const express = require('express');
const router = express.Router();
const Update = require('../models/Update');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration (replace with your actual config)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'updates',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});

const upload = multer({ storage: storage });

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// List all updates
router.get('/', requireAuth, async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    res.render('updatesList', { updates });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show add update form
router.get('/add', requireAuth, (req, res) => {
  res.render('addUpdate');
});

// Handle add update
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { title, description, date, time, imageUrl, pdfLink } = req.body;

    const newUpdate = new Update({
      title,
      description,
      date,
      time,
      imageUrl,
      pdfLink
    });

    await newUpdate.save();
    res.redirect('/updates');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show edit update form
router.get('/edit/:id', requireAuth, async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).send('Update not found');
    }
    res.render('editUpdate', { update });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Handle edit update
router.post('/edit/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, date, time, imageUrl, pdfLink } = req.body;
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).send('Update not found');
    }

    update.title = title;
    update.description = description;
    update.date = date;
    update.time = time;
    update.imageUrl = imageUrl;
    update.pdfLink = pdfLink;

    await update.save();
    res.redirect('/updates');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete update
router.post('/delete/:id', requireAuth, async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    res.redirect('/updates');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;