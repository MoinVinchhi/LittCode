const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, allSolvedProblemByUser, submittedProblem} = require('../controllers/userProblem');

//create
problemRouter.post('/create', adminMiddleware, createProblem);

//update
problemRouter.put('/update/:id', adminMiddleware, updateProblem);

//delete
problemRouter.delete('/delete/:id', adminMiddleware, deleteProblem);


//fetch
problemRouter.get('/problemid/:id', userMiddleware, getProblemById);
problemRouter.get('/allproblems', userMiddleware, getAllProblem);
problemRouter.get('/solvedproblems', userMiddleware, allSolvedProblemByUser);
problemRouter.get('/submittedproblem/:pid', userMiddleware, submittedProblem);


module.exports = problemRouter;
