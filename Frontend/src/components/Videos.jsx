import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink, useNavigate } from 'react-router';
import ConfirmationPopup from './ConfirmationPopup';
import { Trash2, Home } from 'lucide-react';

const Videos = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/allproblems');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const problem = problems.find(p => p._id === id);
    setSelectedProblem(problem);
    setShowConfirmPopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/video/delete/${selectedProblem._id}`);
      setProblems(problems.filter(problem => problem._id !== selectedProblem._id));
      setShowConfirmPopup(false);
      setSelectedProblem(null);
      
      // Show success popup
      if (window.popupManager) {
        window.popupManager.showDelete();
      }
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <ErrorBox 
            error={error} 
            onClose={() => setError(null)}
            variant="error"
          />
        </div>
        <button 
          onClick={() => setError(null)}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with LittCode button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Upload And Delete</h1>
        <button 
          onClick={handleGoHome}
          className="btn btn-primary btn-outline flex items-center gap-2"
        >
          <Home size={20} />
          LittCode
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-1/12">#</th>
              <th className="w-4/12">Title</th>
              <th className="w-2/12">Difficulty</th>
              <th className="w-3/12">Tags</th>
              <th className="w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <th>{index + 1}</th>
                <td>{problem.title}</td>
                <td>
                  <span className={`badge ${
                    problem.difficulty === 'Easy' 
                      ? 'badge-success' 
                      : problem.difficulty === 'Medium' 
                        ? 'badge-warning' 
                        : 'badge-error'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className="badge badge-outline">
                    {problem.tags}
                  </span>
                </td>
                <td>
                  <div className="flex flex-row space-x-4">
                    <NavLink to={`/admin/upload/${problem._id}`}>
                        <button className="btn btn-sm btn-success">
                            Upload
                        </button>
                    </NavLink>
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={confirmDelete}
        title="Delete Video"
        message={`Are you sure you want to delete the video for "${selectedProblem?.title}"? This action cannot be undone.`}
        confirmText="Delete Video"
        cancelText="Cancel"
        type="danger"
        icon={<Trash2 className="w-8 h-8 text-red-500" />}
      />
    </div>
  );
};

export default Videos;

