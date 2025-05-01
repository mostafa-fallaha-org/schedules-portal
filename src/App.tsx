import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
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
                <Login onLogin={setUser} />
              )
            }
          />
          <Route
            path="/instructor"
            element={
              user?.role === "instructor" ? (
                <InstructorDashboard instructorId={user.user_id} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student"
            element={
              user?.role === "student" ? (
                <StudentDashboard studentId={user.user_id} />
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
