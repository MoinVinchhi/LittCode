const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { getLanguageId, submitBatch, submitToken } = require('../utils/problemUtility');

const submitCode = async (req,res) => {
    try {
        const userId = req.data._id;
        const problemId = req.params.id;

        let {code, language} = req.body;

        if (!userId || !problemId || !code || !language) 
            return res.status(400).send('Some Field Missing');

        if (language == 'cpp')
            language = 'c++';

        // fetch problem from DB
        const problem = await Problem.findById(problemId);

        // first store the submission in DB, with pending status
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            passedTestCases: 0,
            status: 'pending',
            totalTestCases: problem.hiddenTestCases.length
        })

        // submit code to Judge0
        const languageId = getLanguageId(language);

        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        // update the submission (submittedResult)
        let status = 'accepted';
        let passedTC = 0;
        let runtime = 0;
        let memory = 0;
        let errMsg = '';

        for (const test of testResult) {
            if (test.status_id == 3) {
                passedTC++;
                runtime = Math.max(runtime, parseFloat(test.time));
                memory = Math.max(memory, test.memory);
            }
            else {
                if (test.status_id == 4) {
                    status = 'error';
                    errMsg = test.stderr;
                }
                else 
                    status = 'wrong';
            }
        }

        // store the result in DB
        submittedResult.status = status;
        submittedResult.passedTestCases = passedTC;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errMsg;

        await submittedResult.save(); //here we already have the reference of the obj, so only .save()

        // we will add problemId in user schema's problemSolved, if it is not present there
        if (!req.data.problemSolved.includes(problemId)){
            req.data.problemSolved.push(problemId);
            await req.data.save();
        }

        const accepted = (status == 'accepted');

        res.status(201).json({
            accepted,
            totalTestCases: submittedResult.totalTestCases,
            passedTestCases: submittedResult.passedTestCases,
            runtime,
            memory
        });
    }
    catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);
    }
}

const runCode = async (req,res) => {
    try {
        const userId = req.data._id;
        const problemId = req.params.id;

        let {code, language} = req.body;

        if (!userId || !problemId || !code || !language) 
            return res.status(400).send('Some Field(s) Missing');

        if (language == 'cpp')
            language = 'c++';

        // fetch problem from DB
        const problem = await Problem.findById(problemId);

        // submit code to Judge0
        const languageId = getLanguageId(language);

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        let passedTestCases = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                passedTestCases++;
                runtime = Math.max(runtime, parseFloat(test.time));
                memory = Math.max(memory, test.memory);
            }
            else if (test.status_id > 3) {
                status = false;
                errorMessage = test.stderr;
            }
        }

        res.status(201).json({
            success: status,
            testCases: testResult,
            runtime,
            memory
        });
    }
    catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);
    }
}

module.exports = {submitCode, runCode};
