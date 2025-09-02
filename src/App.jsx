import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { TripProvider } from "./contexts/TripContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Trips from "./pages/Trips";
import AddTrip from "./pages/AddTrip";
import EditTrip from "./pages/EditTrip";
import ForgetPassword from "./pages/ForgetPassword";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TripProvider>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />

            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgetPassword />} />

              {/* Protected routes */}
              <Route
                path="/trips"
                element={
                  <PrivateRoute>
                    <Trips />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/add-trip"
                element={
                  <PrivateRoute>
                    <AddTrip />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/edit-trip/:tripId"
                element={
                  <PrivateRoute>
                    <EditTrip />
                  </PrivateRoute>
                }
              />

              {/* Catch all route - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </TripProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
