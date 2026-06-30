import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutTimer from "./pages/WorkoutTimer";
import BMICalculator from "./pages/BMICalculator";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AIChatPage from "./pages/AIChatPage";
import Notifications from "./pages/Notifications";
import './App.css'; 


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <ExerciseLibrary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <WorkoutTimer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bmi"
            element={
              <ProtectedRoute>
                <BMICalculator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <AIChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
