const Problem = require('../models/problem');
const {getLanguageId, submitBatch, submitToken} = require('../utils/problemUtility');
const User = require('../models/user');
const Submission = require('../models/submission');
const SolutionVideo = require('../models/solutionVideo');

const createProblem = async (req,res) => {

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try {

        for (const {language, completeCode} of referenceSolution) {
            
            const languageId = getLanguageId(language);
            
            //format:
            //source_code, language_id, stdin, expected_output
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            
            const resultToken = submitResult.map((value) => value.token); //making an array of tokens, from submitResult to resultToken
            
            const testResult = await submitToken(resultToken);

            // console.log(testResult);

            for (const test of testResult) {
                if (test.status_id != 3) {
                    if (test.status_id == 4) 
                        return res.status(400).send('Wrong Answer');
                    if (test.status_id == 5) 
                        return res.status(400).send('Time Limit Exceeded');
                    if (test.status_id == 6) 
                        return res.status(400).send('Compilation Error');
                    if (test.status_id > 6) 
                        return res.status(400).send('Runtime Error');
                }
            }
        }

        //now we can store it in our DB

        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.data._id
        })

        res.status(201).send('Problem created successfully!');
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).send('Please check your input data and try again.');
        } else {
            res.status(500).send('Failed to create problem. Please try again.');
        }
    }
}

const updateProblem = async (req,res) => {

    const {id} = req.params;
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try {
        if (!id) 
            return res.status(400).send('Problem ID is required');
        
        const prevData = await Problem.findById(id);

        if (!prevData) 
            return res.status(404).send('Problem not found');

        for (const {language, completeCode} of referenceSolution) {
            
            const languageId = getLanguageId(language);
            
            //format:
            //source_code, language_id, stdin, expected_output
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            
            const resultToken = submitResult.map((value) => value.token); //making an array of tokens, from submitResult to resultToken
            
            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id != 3) {
                    if (test.status_id == 4) 
                        return res.status(400).send('Wrong Answer');
                    if (test.status_id == 5) 
                        return res.status(400).send('Time Limit Exceeded');
                    if (test.status_id == 6) 
                        return res.status(400).send('Compilation Error');
                    if (test.status_id > 6) 
                        return res.status(400).send('Runtime Error');
                }
            }
        }

        const newData = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators: true, new: true}) //new -> will return the new updated object

        res.status(200).send(newData);

    }
    catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}

const deleteProblem = async (req,res) => {
    const {id} = req.params;
    try {
        if (!id) 
            return res.status(400).send('ID Is Missing');

        const deletedProb = await Problem.findByIdAndDelete(id);

        if (!deletedProb) 
            return res.status(400).send("Problem Doesn't Exist");

        res.send('Successfully Deleted');

    }
    catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}

const getProblemById = async (req,res) => {
    const {id} = req.params;
    try {
        if (!id) 
            return res.status(400).send('ID Missing');

        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

        if (!getProblem)
            return res.status(400).send("Problem Doesn't Exist");
        
        //get the video url here
        const video = await SolutionVideo.findOne({problemId: id});

        if (video) {
            const responseData = {
                ...getProblem.toObject(),
                secureUrl: video.secureUrl,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration
            }

            return res.status(200).send(responseData);
        }
            
        res.status(200).send(getProblem);
    }
    catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
}

const getAllProblem = async (req,res) => {
    try {
        const allProblems = await Problem.find({}).select('_id title difficulty tags');

        if (allProblems.length == 0)
            return res.status(400).send('Problems Not Found');

        res.status(200).send(allProblems);
    }
    catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
}

const allSolvedProblemByUser = async (req,res) => {
    try {
        const userId = req.data._id;
        const user = await User.findById(userId).populate({
            path: 'problemSolved',
            select: '_id title difficulty tags'
        });

        res.status(200).send(user.problemSolved);
    }
    catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
}

const submittedProblem = async (req,res) => {
    try {
        const userId = req.data._id;
        const problemId = req.params.pid;

        const result = await Submission.find({userId, problemId});

        if (result.length == 0) 
            return res.send('No Submissins Found');
        
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);    
    }
}

module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, allSolvedProblemByUser, submittedProblem};
