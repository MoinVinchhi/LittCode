import { Routes, Route, Navigate } from "react-router";
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

function App() {

  //check if user is authenticated or not -> checkAuth()
  const { user, isAuthenticated, loading } = useSelector ((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-xl "></span>
      </div>
    );
  }

  return(
    <>
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
