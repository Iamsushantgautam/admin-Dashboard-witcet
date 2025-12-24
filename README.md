# Admin Panel

A comprehensive admin panel built with Node.js, Express, and MongoDB for managing notes, users, and updates with authentication and file upload capabilities.

## Features

- **User Authentication**: Secure login system with session management
- **Notes Management**: Create, read, update, and delete notes with various fields
- **Detailed Notes**: Advanced note management with additional metadata
- **Updates System**: Post updates with images, PDFs, and custom timestamps
- **File Upload**: Cloudinary integration for image storage
- **Responsive UI**: Bootstrap-based responsive design with sidebar navigation
- **Session Management**: MongoDB-backed session storage

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session with MongoDB store
- **File Storage**: Cloudinary
- **Frontend**: EJS templating, Bootstrap 5, Custom CSS
- **Security**: bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for file uploads)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
admin-panel/
├── app.js                 # Main application file
├── models/                # Mongoose models
│   ├── User.js           # User schema
│   ├── Note.js           # Note schema
│   ├── DetailedNote.js   # Detailed note schema
│   └── Update.js         # Update schema
├── routes/                # Route handlers
│   ├── admin.js          # Admin routes
│   ├── detailnotesroutes.js # Detailed notes routes
│   └── updates.js        # Updates routes
├── views/                 # EJS templates
│   ├── partials/         # Reusable components
│   │   └── navbar.ejs    # Navigation bar
│   ├── admin-home.ejs    # Admin dashboard
│   ├── login.ejs         # Login page
│   ├── notesList.ejs     # Notes listing
│   ├── add-notes.ejs     # Add note form
│   ├── updatesList.ejs   # Updates listing
│   ├── addUpdate.ejs     # Add update form
│   └── ...
├── public/                # Static assets
│   └── style.css         # Custom styles
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Admin Dashboard
- `GET /admin` - Admin dashboard

### Notes Management
- `GET /notes` - List all notes
- `GET /notes/add` - Add note form
- `POST /notes/add` - Create new note
- `GET /notes/edit/:id` - Edit note form
- `POST /notes/edit/:id` - Update note
- `POST /notes/delete/:id` - Delete note

### Detailed Notes
- `GET /detailed-notes` - List detailed notes
- `GET /detailed-notes/add` - Add detailed note form
- `POST /detailed-notes/add` - Create detailed note
- `GET /detailed-notes/edit/:id` - Edit detailed note
- `POST /detailed-notes/edit/:id` - Update detailed note
- `POST /detailed-notes/delete/:id` - Delete detailed note

### Updates
- `GET /updates` - List all updates
- `GET /updates/add` - Add update form
- `POST /updates/add` - Create new update
- `GET /updates/edit/:id` - Edit update form
- `POST /updates/edit/:id` - Update update
- `POST /updates/delete/:id` - Delete update

## Database Models

### User
```javascript
{
  email: String,
  password: String // Hashed with bcrypt
}
```

### Note
```javascript
{
  title: String,
  notesCode: String,
  notesPagePath: String,
  imagePath: String,
  quantumTitle: String,
  quantumImagePath: String,
  quantumLink: String,
  tag: String,
  pyqLink: String,
  pyqTitle: String,
  pyqImage: String
}
```

### Update
```javascript
{
  title: String,      // Required
  description: String, // Required
  date: Date,         // Required
  time: String,       // Required
  imageUrl: String,   // Optional
  pdfLink: String,    // Optional
  createdAt: Date     // Auto-generated
}
```

## Features Overview

### Responsive Design
- Mobile-friendly sidebar navigation
- Bootstrap 5 components
- Custom CSS for enhanced UI

### File Management
- Image upload to Cloudinary
- Direct URL input for images
- PDF link integration
- Modal image viewing

### Security
- Password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware

### User Experience
- Intuitive form designs
- Confirmation dialogs for deletions
- Toast notifications for actions
- Loading states and error handling

## Development

### Adding New Features
1. Create/update models in the `models/` directory
2. Add routes in the `routes/` directory
3. Create EJS templates in the `views/` directory
4. Update navigation in `views/partials/navbar.ejs`

### Code Style
- Use ES6+ syntax
- Follow Express.js best practices
- Maintain consistent naming conventions
- Add proper error handling

## Deployment

1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Set up Cloudinary credentials
4. Deploy to platforms like Heroku, Vercel, or DigitalOcean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.