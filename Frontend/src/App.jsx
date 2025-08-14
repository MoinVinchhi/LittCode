import { Routes, Route, Navigate, useLocation } from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import CreateProblem from "./components/CreateProblem";
import UpdateProblem from "./components/UpdateProblem";
import DeleteProblem from "./components/DeleteProblem";
import Videos from "./components/Videos";
import UploadVideo from "./components/UploadVideo";
import ProblemPage from "./pages/ProblemPage";
import { useAuthCleanup } from "./hooks/useAuthCleanup";
import PopupManager from "./components/PopupManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  //check if user is authenticated or not -> checkAuth()
  const { user, isAuthenticated, loading } = useSelector ((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Use the cleanup hook to clear messages on public routes
  useAuthCleanup();

  useEffect(() => {
    // Only check auth if we're not on public routes
    const currentPath = location.pathname;
    const publicRoutes = ['/login', '/signup'];
    
    if (!publicRoutes.includes(currentPath)) {
      dispatch(checkAuth());
    }
  }, [dispatch, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-xl "></span>
      </div>
    );
  }

  return(
    <>
      <PopupManager />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="colored"
      />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to='/login' />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to='/' /> : <Signup />} />
        <Route path="/adminpanel" element={isAuthenticated && user?.role==='admin' && <AdminPanel />} />
        <Route path="/adminpanel/create" element={isAuthenticated && user?.role==='admin' ? <CreateProblem /> : <Homepage />} />
        <Route path="/adminpanel/update" element={isAuthenticated && user?.role==='admin' ? <UpdateProblem /> : <Homepage />} />
        <Route path="/adminpanel/delete" element={isAuthenticated && user?.role==='admin' ? <DeleteProblem /> : <Homepage />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role==='admin' ? <Videos /> : <Homepage />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role==='admin' ? <UploadVideo /> : <Homepage />} />
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </>
  );
}

export default App
