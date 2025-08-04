const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        requried: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        requried: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'c++', 'java']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending'
    },
    runtime: {
        type: Number,
        default: 0
    },
    memory: {
        type: Number,
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    passedTestCases: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

submissionSchema.index({userId: 1, problemId: 1});

const Submission = mongoose.model('submission', submissionSchema);

module.exports = Submission;
