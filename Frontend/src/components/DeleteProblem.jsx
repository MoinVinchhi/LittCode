import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import ConfirmationModal from './ConfirmationModal';
import ErrorBox from './ErrorBox';
import { Trash2, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

const DeleteProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDelete = async (id) => {
    const problem = problems.find(p => p._id === id);
    if (!problem) {
      if (window.popupManager) {
        window.popupManager.showError('Problem not found');
      }
      return;
    }
    setSelectedProblem(problem);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProblem) return;
    
    try {
      setDeleteLoading(true);
      await axiosClient.delete(`/problem/delete/${selectedProblem._id}`);
      setProblems(problems.filter(problem => problem._id !== selectedProblem._id));
      setShowConfirmModal(false);
      setSelectedProblem(null);
      setError(null);
      
      // Success popup is shown by PopupManager
    } catch (err) {
      console.error('Error deleting problem:', err);
      setError('Failed to delete problem. Please try again.');
      // Error popup is handled by axiosClient interceptor
    } finally {
      setDeleteLoading(false);
      setShowConfirmModal(false);
      setSelectedProblem(null);
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
        <h1 className="text-3xl font-bold">Delete Problems</h1>
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
                  <div className="flex space-x-2">
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Delete Problem"
        message={`Are you sure you want to delete "${selectedProblem?.title}"? This action cannot be undone and will permanently remove the problem and all associated data.`}
        confirmText="Delete Problem"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
        customIcon={<Trash2 className="w-8 h-8 text-red-500" />}
      />
    </div>
  );
};

export default DeleteProblem;

