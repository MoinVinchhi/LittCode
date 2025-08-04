const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    tags: {
        type: String,
        enum: ['Array', 'LinkedList', 'Graph', 'DP', 'Numbers'],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                enum: ['C++', 'Java', 'JavaScript'],
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }
        },

    ],
    referenceSolution: [
        {
            language: {
                type: String,
                enum: ['C++', 'Java', 'JavaScript'],
                required: true
            },
            completeCode: {
                type: String,
                required: true
            }
        },
    ],
    problemCreator: {
        type: Schema.Types.ObjectId, //creator's _id
        ref: 'user', //who's objectId (which schema model)
        required: true
    }
});

const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;
