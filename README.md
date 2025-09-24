# Community Engagement and Resource Platform

## 🏛️ Overview
A full-stack MERN application that enables citizens to report community issues and allows government officials to manage and resolve them efficiently.

## ✨ Features
- 🔐 **User Authentication**: Secure registration and login
- 📝 **Issue Reporting**: Citizens can report problems with location details
- 📊 **Public Dashboard**: View all community issues with status tracking
- 👨‍💼 **Admin Panel**: Government officials can update issue status
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing

### Frontend
- **React.js** with functional components
- **CSS3** for responsive styling
- **Fetch API** for backend communication

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Git (for cloning)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Shah-04/Community-Engagement-and-Resource-Platform.git
   cd Community-Engagement-and-Resource-Platform
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create .env file
   echo "MONGO_URI=mongodb://127.0.0.1:27017/communityDB" > .env
   echo "JWT_SECRET=your_jwt_secret_here" >> .env
   echo "PORT=5000" >> .env
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start React development server
   npm start
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🔗 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Issues Management
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue (authenticated)
- `PUT /api/issues/:id/status` - Update issue status (admin only)

## 👥 User Roles

### Regular Users
- Register and login
- Report community issues
- View all reported issues

### Admin Users
- All regular user features
- Update issue status (open → in-progress → resolved)
- Access admin management panel

## 📱 Usage Guide

1. **Register/Login**: Create account or sign in
2. **Report Issue**: Submit community problems with location
3. **View Dashboard**: Browse all reported issues
4. **Admin Actions**: (Admin only) Update issue status

## 🔧 Development

### Project Structure
```
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions
├── frontend/
│   └── src/
│       ├── components/  # React components
│       └── services/    # API integration
└── README.md
```

### Available Scripts
```bash
npm run dev      # Start backend with nodemon
npm start        # Start backend in production
npm test         # Run tests (if configured)
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  timestamps: true
}
```

### Issues Collection
```javascript
{
  title: String,
  description: String,
  location: String,
  status: String (open/in-progress/resolved),
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## 🔒 Security Features
- Password encryption with bcrypt
- JWT token authentication
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization

## 🎓 Educational Purpose
This project was developed as a college assignment to demonstrate:
- Full-stack web development skills
- RESTful API design
- Database integration
- User authentication
- Frontend-backend communication

## 📄 License
This project is for educational purposes.

## 🤝 Contributing
This is an educational project. Feel free to fork and experiment!

## 📞 Support
For issues or questions related to this project, please check the `PROJECT_STATUS.md` file for detailed documentation.

---

**Status**: ✅ Complete and Ready for Demonstration
**Last Updated**: September 24, 2025
