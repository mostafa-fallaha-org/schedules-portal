import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === "instructor" ? "/instructor" : "/student"}
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/instructor"
            element={
              user?.role === "instructor" ? (
                <InstructorDashboard
                  instructorId={user.user_id}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student"
            element={
              user?.role === "student" ? (
                <StudentDashboard
                  studentId={user.user_id}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
