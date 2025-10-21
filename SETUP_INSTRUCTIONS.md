# Real-Time Chat App - Frontend & Backend Connection Setup

This document provides step-by-step instructions to connect your React frontend with the NestJS backend and test all authentication and CRUD operations.

## 🚀 Quick Start

### 1. Backend Setup (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Authentication Features

### JWT Authentication
- ✅ **Login**: Email/password authentication with JWT tokens
- ✅ **Register**: User registration with JWT token generation
- ✅ **Token Storage**: JWT tokens stored in localStorage
- ✅ **Auto-logout**: Automatic logout on token expiration

### Google OAuth
- ✅ **Google Login**: "Continue with Google" button on login page
- ✅ **Google Register**: "Continue with Google" button on register page
- ✅ **OAuth Callback**: Handles Google OAuth redirects with token storage

## 📊 CRUD Operations

### Chat Rooms
- ✅ **Create**: Create new chat rooms
- ✅ **Read**: List all chat rooms
- ✅ **Update**: (Available via API)
- ✅ **Delete**: (Available via API)

### Messages
- ✅ **Create**: Send messages to chat rooms
- ✅ **Read**: Load messages for specific rooms
- ✅ **Real-time**: WebSocket integration for live messaging

### Users
- ✅ **Read**: List all users
- ✅ **Profile**: User profile management

## 🧪 Testing the Connection

### 1. Test Backend Connection
```bash
node test-connection.js
```

### 2. Manual Testing Steps

#### Authentication Flow:
1. **Register**: Go to `/register` and create a new account
2. **Login**: Go to `/login` and sign in with credentials
3. **Google OAuth**: Click "Continue with Google" on login/register pages
4. **Protected Routes**: Verify you can access `/` and `/crud` only when logged in

#### CRUD Operations:
1. **Navigate to CRUD Demo**: Click "CRUD Demo" button in the chat interface
2. **Create Chat Room**: Add a new chat room
3. **Send Messages**: Select a room and send messages
4. **View Users**: See all registered users
5. **API Status**: Check the connection status indicators

## 🔧 Configuration

### Backend Configuration
- **Port**: 3000 (configurable via PORT env variable)
- **CORS**: Enabled for `http://localhost:5173`
- **Database**: Prisma with SQLite (default)

### Frontend Configuration
- **API Base URL**: `http://localhost:3000`
- **Token Storage**: localStorage
- **Auto-redirect**: On 401 errors

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend URL
   - Check that frontend is running on port 5173

2. **Authentication Not Working**
   - Verify JWT token is being stored in localStorage
   - Check browser network tab for API calls
   - Ensure backend auth endpoints are accessible

3. **Google OAuth Issues**
   - Verify Google OAuth credentials in backend
   - Check redirect URLs in Google Console
   - Ensure callback URL is properly configured

4. **CRUD Operations Failing**
   - Check backend is running on port 3000
   - Verify API endpoints are accessible
   - Check browser console for errors

### Debug Steps:
1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Check Console tab for JavaScript errors
4. Verify localStorage contains `access_token` and `user_data`

## 📁 File Structure

```
frontend/src/
├── contexts/
│   ├── AuthContext.tsx      # Authentication state management
│   ├── ChatContext.tsx       # Chat state management
│   └── SocketContext.tsx    # WebSocket connection
├── services/
│   ├── api.ts               # Axios configuration with JWT
│   ├── auth.ts              # Authentication API calls
│   ├── chat.ts              # Chat CRUD operations
│   └── users.ts             # User CRUD operations
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx    # Login with Google OAuth
│   │   ├── RegisterPage.tsx # Register with Google OAuth
│   │   └── OAuthCallback.tsx # Google OAuth callback handler
│   ├── chat/
│   │   └── ChatPage.tsx     # Main chat interface
│   └── CRUDDemo.tsx         # CRUD operations demo
└── components/
    └── layout/
        └── ProtectedRoute.tsx # Route protection
```

## 🎯 Features Implemented

### ✅ Authentication
- JWT token-based authentication
- Google OAuth integration
- Protected routes
- Automatic token refresh
- Secure logout

### ✅ CRUD Operations
- Chat room management
- Message sending/receiving
- User management
- Real-time updates
- Error handling

### ✅ UI/UX
- Modern, clean design
- Loading states
- Error messages
- Responsive layout
- Smooth animations

## 🚀 Next Steps

1. **Test All Flows**: Run through all authentication and CRUD operations
2. **Customize Styling**: Adjust colors and layout to match your brand
3. **Add Features**: Implement additional CRUD operations as needed
4. **Deploy**: Set up production environment with proper domain configuration

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify both frontend and backend are running
3. Test API endpoints directly using the test script
4. Check network connectivity between frontend and backend
