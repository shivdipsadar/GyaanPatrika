import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Navbar from "./components/Navbar";
import AdminQuizzes from "./pages/AdminQuizzes";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import SolveQuiz from "./pages/SolveQuiz";
import ResultPage from "./pages/ResultPage"; 
import Leaderboard from "./pages/Leaderboard";

function App() {
  const location = useLocation();

  // 👇 define routes where navbar should be hidden
  const hideNavbarRoutes = ["/solve-quiz"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.some((route) =>
        location.pathname.startsWith(route)
      ) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <Dashboard />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedAdminRoute>
              <AdminQuizzes />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/create-quiz"
          element={
            <ProtectedAdminRoute>
              <CreateQuiz />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/edit-quiz/:id"
          element={
            <ProtectedAdminRoute>
              <EditQuiz />
            </ProtectedAdminRoute>
          }
        />

        {/* Solve Quiz Route */}
        <Route
          path="/solve-quiz/:id"
          element={
            <ProtectedUserRoute>
              <SolveQuiz />
            </ProtectedUserRoute>
          }
        />

        {/* Result Page Route */}
        <Route
          path="/result/:attemptId"
          element={
            <ProtectedUserRoute>
              <ResultPage />
            </ProtectedUserRoute>
          }
        />

        {/* ✅ Leaderboard Page Route */}
        <Route
          path="/leaderboard/:quizId"
          element={
            <ProtectedUserRoute>
              <Leaderboard/>
            </ProtectedUserRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
