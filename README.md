# 🌍 TripMap - Your Personal Travel Journey

A stunning, modern travel management application that helps you track, visualize, and relive your adventures around the world. Built with React, Firebase, and enhanced with beautiful maps, TripMap transforms how you document and explore your travel memories.

## 🚀 **Core Features**

### 🗺️ **Interactive World Map**
- **Leaflet Integration**: Beautiful, responsive maps with OpenStreetMap tiles
- **Smart Markers**: Color-coded markers for visited vs. planned trips
- **Dynamic Centering**: Automatically centers map on your trips
- **Rich Popups**: Interactive popups with trip details and quick actions
- **Real-time Updates**: Map automatically adjusts as you add/edit trips

### 📍 **Smart City Validation**
- **OpenCage Geocoding**: Real-time city search with 5 suggestions
- **Coordinate Storage**: Automatically stores latitude/longitude for map display
- **Global Coverage**: Supports cities worldwide with accurate data
- **User-Friendly**: Simple search interface with instant results

### 🎯 **Trip Management System**
- **Complete CRUD**: Create, read, update, and delete trips seamlessly
- **Rich Media**: Upload and display trip images with Cloudinary integration
- **Flexible Status**: Mark trips as "Visited" or "Future Trip"
- **Date Management**: Start and end date tracking with duration calculation
- **Descriptive Content**: Add detailed descriptions to capture memories

### 🔐 **Secure Authentication**
- **Email/Password**: Traditional authentication with validation
- **Google Sign-in**: One-click authentication for convenience
- **Password Recovery**: Secure password reset flow
- **Protected Routes**: User-specific data access
- **Real-time Security**: Firebase Realtime Database with user rules

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all devices and screen sizes
- **Modern UI**: Beautiful, consistent design using Tailwind CSS
- **Touch-Friendly**: Intuitive mobile navigation and interactions
- **Accessibility**: Proper contrast, focus states, and keyboard navigation

---

## 🛠️ **Technical Architecture**

### **Frontend Stack**
- **React 19**: Modern React with hooks and functional components
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **React Icons**: Comprehensive icon library for UI elements
- **React Hot Toast**: Beautiful toast notifications for user feedback

### **Backend & Services**
- **Firebase Authentication**: Secure user management
- **Firebase Realtime Database**: Real-time data synchronization
- **Cloudinary**: Cloud image storage and optimization
- **OpenCage Geocoding**: City search and coordinate retrieval

### **Development Tools**
- **Vite**: Lightning-fast build tool and dev server
- **ESLint**: Code quality and consistency
- **Git**: Version control and collaboration

---

## 📱 **User Experience Features**

### **Dashboard & Navigation**
- **Responsive Navbar**: Clean navigation with mobile hamburger menu
- **Quick Actions**: Easy access to add trips and view map
- **Statistics Cards**: Visual overview of trip counts and status
- **Search & Filter**: Find trips quickly with smart filtering

### **Trip Management**
- **Beautiful Forms**: Modern, intuitive forms for adding/editing trips
- **Image Upload**: Drag-and-drop image upload with previews
- **Validation**: Real-time form validation with helpful feedback
- **Success States**: Clear confirmation and next steps

### **Interactive Elements**
- **Hover Effects**: Subtle animations and visual feedback
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account
- Cloudinary account (for image uploads)
- OpenCage API key (for geocoding)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/younesbaanise/tripmap.git
   cd trip-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   
   # Cloudinary Configuration
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
   
   # OpenCage Geocoding
   VITE_OPENCAGE_API_KEY=your_opencage_api_key
   ```

4. **Firebase Setup**
   
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google Sign-in)
   - Create a Realtime Database
   - Set up security rules for user-specific data access

5. **Cloudinary Setup**
   
   - Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
   - Create an unsigned upload preset for secure image uploads
   - Configure your cloud name and upload preset

6. **OpenCage Setup**
   
   - Sign up at [OpenCage](https://opencagedata.com/) for geocoding API
   - Get your API key for city search functionality

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to `http://localhost:5173` to explore TripMap!

---

## 🔧 **Firebase Configuration**

### **Authentication Setup**
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Email/Password authentication
3. Enable Google Sign-in
4. Configure authorized domains

### **Realtime Database Setup**
1. Go to Firebase Console → Realtime Database
2. Create database in test mode for development
3. Set up security rules for user-specific data access

### **Database Security Rules**
```json
{
  "rules": {
    "trips": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```