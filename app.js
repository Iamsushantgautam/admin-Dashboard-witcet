const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require('connect-mongo');


dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // your MongoDB connection string
    ttl: 14 * 24 * 60 * 60 // = 14 days
  }),
  cookie: { secure: false } // change to true if using HTTPS
}));





mongoose.connect(process.env.MONGO_URI).then(() => console.log("Mongo Connected"));

const adminRoutes = require("./routes/admin");
app.use(adminRoutes);

const updatesRoutes = require("./routes/updates");
app.use('/updates', updatesRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
