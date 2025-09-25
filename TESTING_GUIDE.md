# 🧪 Frontend-Backend Testing Guide

## 🚀 **Quick Start Testing Instructions**

### **Step 1: Start Both Servers**

#### Backend Server (Terminal 1):
```bash
# From project root directory
npm run dev
# Should show: ✅ Server running on port 5000
```

#### Frontend Server (Terminal 2):
```bash
# Open NEW terminal/command prompt
cd frontend
npm start
# Should open browser at http://localhost:3000
```

---

## 🧪 **Complete Testing Workflow**

### **Test 1: User Registration** ✅
1. **Open**: `http://localhost:3000`
2. **Click**: "Register" button
3. **Fill Form**:
   ```
   Name: Test User
   Email: test@example.com
   Password: password123
   ```
4. **Expected Result**: Success message, redirected to login

### **Test 2: User Login** ✅
1. **Click**: "Login" button
2. **Fill Form**:
   ```
   Email: test@example.com
   Password: password123
   ```
3. **Expected Result**: 
   - Welcome message with user name
   - "Report Issue" button appears
   - JWT token stored in localStorage

### **Test 3: Report Issue** ✅
1. **Click**: "Report Issue" (after login)
2. **Fill Form**:
   ```
   Title: Broken streetlight
   Description: Street light not working on Main St
   Location: Main Street, Downtown
   ```
3. **Expected Result**: Issue created successfully

### **Test 4: View Issues Dashboard** ✅
1. **Click**: "Issues Dashboard"
2. **Expected Result**:
   - List of all reported issues
   - Shows title, description, location, status
   - Shows who reported each issue

### **Test 5: Admin Panel (Admin Only)** ✅
1. **Login as Admin**: 
   ```
   Email: harsh@example.com
   Password: [your password]
   ```
2. **Click**: "Admin Panel" (should appear for admin)
3. **Test Status Update**:
   - Find an issue
   - Change status from "open" → "in-progress" → "resolved"
4. **Expected Result**: Status updates in real-time

---

## 🔍 **API Endpoint Testing (Manual)**

### **Using Browser Dev Tools Console:**

#### Test 1: Check API Connection
```javascript
// Open browser dev tools (F12) and run:
fetch('http://localhost:5000')
  .then(res => res.text())
  .then(data => console.log(data));
// Should log: "Welcome to Community Platform API 🚀"
```

#### Test 2: Test Registration API
```javascript
fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'API Test User',
    email: 'apitest@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Test 3: Test Login API
```javascript
fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'apitest@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  localStorage.setItem('testToken', data.token);
});
```

#### Test 4: Test Create Issue API
```javascript
const token = localStorage.getItem('testToken');
fetch('http://localhost:5000/api/issues', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'API Test Issue',
    description: 'Testing issue creation via API',
    location: 'Test Location'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🐛 **Common Issues & Solutions**

### **Problem 1: CORS Errors**
**Symptoms**: 
- Console shows "CORS policy" errors
- API calls fail from frontend

**Solution**:
- Backend has CORS enabled: ✅ `app.use(cors())`
- Check backend is running on port 5000

### **Problem 2: "Cannot connect to backend"**
**Symptoms**: 
- Network errors in console
- API calls timeout

**Solution**:
```bash
# Check if backend is running
curl http://localhost:5000
# Should return: "Welcome to Community Platform API 🚀"
```

### **Problem 3: Authentication Fails**
**Symptoms**: 
- Login returns 401 errors
- Token not being sent

**Solution**:
- Check JWT_SECRET in .env file
- Verify token storage in localStorage
- Check Authorization header format: `Bearer <token>`

### **Problem 4: MongoDB Connection Issues**
**Symptoms**: 
- Server crashes on startup
- Database operations fail

**Solution**:
```bash
# Check MongoDB is running
net start | findstr -i mongo
# Should show: "MongoDB Server (MongoDB)"
```

---

## 📊 **Feature Checklist**

### **✅ Working Features**
- [x] User Registration
- [x] User Login with JWT
- [x] Issue Creation (with location)
- [x] Issues Dashboard (public view)
- [x] Admin Panel (status updates)
- [x] Role-based access control
- [x] Responsive UI
- [x] Error handling

### **🔄 Frontend-Backend Integration**
- [x] API service configuration
- [x] Authentication flow
- [x] Protected routes
- [x] Real-time status updates
- [x] Data persistence

---

## 🎯 **Success Criteria**

### **Basic Functionality Test:**
1. ✅ Can register new user
2. ✅ Can login with credentials  
3. ✅ Can create issues with location
4. ✅ Can view all issues
5. ✅ Admin can update issue status

### **Technical Integration Test:**
1. ✅ Frontend connects to backend APIs
2. ✅ JWT authentication working
3. ✅ Database operations successful
4. ✅ CORS properly configured
5. ✅ Error handling implemented

---

## 🚀 **Demo Preparation**

### **For Professor Demo:**
1. **Prepare Test Data**:
   - 2-3 user accounts (1 admin, 2 regular users)
   - 4-5 sample issues with different statuses

2. **Demo Flow**:
   - Show registration → login flow
   - Create new issue as regular user
   - Switch to admin account
   - Update issue status
   - Show real-time updates

3. **Code Walkthrough**:
   - Show backend API endpoints
   - Demonstrate authentication middleware
   - Explain database schema
   - Show frontend-backend integration

---

## 📞 **Quick Troubleshooting Commands**

```bash
# Check if ports are in use
netstat -ano | findstr :5000  # Backend
netstat -ano | findstr :3000  # Frontend

# Restart MongoDB (if needed)
net stop MongoDB
net start MongoDB

# Clear browser cache/localStorage
# Dev Tools → Application → Storage → Clear

# Reset database (if needed)
mongosh communityDB --eval "db.dropDatabase()"
```

---

**🎉 Your Community Engagement Platform is ready for full testing!**

**Backend**: http://localhost:5000 ✅  
**Frontend**: http://localhost:3000 ✅  
**Database**: MongoDB connected ✅