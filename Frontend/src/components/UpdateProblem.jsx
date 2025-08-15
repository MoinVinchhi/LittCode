import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ConfirmationModal from './ConfirmationModal';
import ErrorBox from './ErrorBox';
import { Edit, Home } from 'lucide-react';

const UpdateProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/allproblems');
      setProblems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to fetch problems. Please try again.');
      // Error popup is handled by axiosClient interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (problem) => {
    if (!problem) {
      if (window.popupManager) {
        window.popupManager.showError('Problem not found');
      }
      return;
    }
    setSelectedProblem(problem);
    setShowConfirmModal(true);
  };

  const confirmUpdate = () => {
    setShowConfirmModal(false);
    if (selectedProblem) {
      // Navigate to problem details page with edit mode
      navigate(`/problem/${selectedProblem._id}?mode=edit`);
      // Show info popup
      if (window.popupManager) {
        window.popupManager.showUpdate('Redirecting to edit mode...');
      }
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
          onClick={() => {
            setError(null);
            fetchProblems();
          }}
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
        <h1 className="text-3xl font-bold">Update Problems</h1>
        <button 
          onClick={handleGoHome}
          className="btn btn-primary btn-outline flex items-center gap-2"
        >
          <Home size={20} />
          LittCode
        </button>
      </div>

      {/* Admin Note */}
      <div className="alert alert-info shadow-lg mb-6">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">Admin Note</h3>
            <div className="text-sm">
              Select a problem to update. You will be redirected to the problem details page where you can modify the title, description, difficulty, tags, test cases, and code templates.
            </div>
          </div>
        </div>
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
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdate(problem)}
                      className="btn btn-sm btn-warning flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmUpdate}
        title="Update Problem"
        message={`Are you sure you want to update "${selectedProblem?.title}"? You will be redirected to the problem details page where you can make your changes.`}
        confirmText="Update Problem"
        cancelText="Cancel"
        type="info"
        customIcon={<Edit className="w-8 h-8 text-blue-500" />}
      />
    </div>
  );
};

export default UpdateProblem;
