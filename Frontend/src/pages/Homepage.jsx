import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { logoutUser } from "../authSlice";
import axiosClient from "../utils/axiosClient";
import ErrorBox from "../components/ErrorBox";


const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case 'easy' : return 'badge-success'
        case 'medium' : return 'badge-warning'
        case 'hard' : return 'badge-error'
        default : return 'badge-neutral'
    }
}

function Homepage () {
    
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all'
    });

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/allproblems');
                setProblems(data);
            }
                    catch (error) {
            console.error('Error fetching problems: ' + error.message);
            setError('Failed to fetch problems');
        }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/solvedproblems');
                setSolvedProblems(data);
            }
                    catch (error) {
            console.error('Error fetching solved problems: ' + error.message);
            setError('Failed to fetch solved problems');
        }
        };

        fetchProblems();
        if (user)
            fetchSolvedProblems();
    }, [user])
    
    const handleLogout = () => {
        dispatch(logoutUser());
        setSolvedProblems([]);
        // Clear any existing errors when logging out
        setError(null);
        // Show logout popup
        if (window.popupManager) {
            window.popupManager.showLogout();
        }
    }

    //each problem go through these 3 filters, if all 3 matched then only it will be selected, if return 1 then selected otherwise not
    const filteredProblems = problems.filter((problem) => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const statusMatch = filters.status === 'all' || solvedProblems.some(sp => sp._id===problem._id);

        return difficultyMatch && tagMatch && statusMatch;
    });

    return (
        <div className="min-h-screen bg-base-200">
            
            {/* Navigation Bar */}
            <nav className="bg-base-100 shadow-lg px-4">
                <div className="container mx-auto navbar">
                    <div className="flex-1">
                        <NavLink to="/" className="btn btn-ghost text-xl"> LittCode </NavLink>
                    </div>

                    {user?.role==='admin' ? (<button className="btn btn-primary mx-10" onClick={() => navigate('/adminpanel')}>Admin Panel</button>): (<></>)}

                    <div className="flex-none gap-4">

                        <div className="dropdown dropdown-end">

                            <div tabIndex={0} className="btn btn-ghost text-lg">
                                {user?.firstName}
                            </div>

                        <ul className="mt-3 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto p-4">
                
                {/* Error Display */}
                {error && (
                    <div className="mb-6">
                        <ErrorBox 
                            error={error} 
                            onClose={() => setError(null)}
                            variant="error"
                        />
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">

                    <select
                        className="select select-bordered"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value='all'>All Problems</option>
                        <option value='solved'>Solved Problems</option>
                    </select>

                    <select
                        className="select"
                        value={filters.difficulty}
                        onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                    >
                        <option value='all'>All Difficulties</option>
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>hard</option>
                    </select>

                    <select
                        className="select"
                        value={filters.tag}
                        onChange={(e) => setFilters({...filters, tag: e.target.value})}
                    >
                        <option value='all'>All Tags</option>
                        <option value='Array'>Array</option>
                        <option value='LinkedList'>Linked List</option>
                        <option value='Graph'>Graph</option>
                        <option value='DP'>DP</option>
                        <option value='Numbers'>Numbers</option>
                    </select>
                </div>

                {/* Problems List */}
                <div className="grid gap-4">

                    {filteredProblems.map(problem => (
                            
                        <div key={problem._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">

                                <h2 className="card-title justify-between">
                                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                                        {problem.title}
                                    </NavLink>

                                    {solvedProblems.some(sp => sp._id===problem._id) && (
                                    <div className="badge badge-success gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Solved
                                    </div>
                                )}
                                </h2>
                                
                                <div className="flex gap-2">
                                    <div className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </div>

                                    <div className="badge badge-info ">
                                        {problem.tags}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            
        </div>
    );
}

export default Homepage
