const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('../src/routes/userAuthRoute');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemRoute');
const submitRouter = require('./routes/submitRoute');
const aiRouter = require('./routes/aiChatRoute');
const videoRouter = require('./routes/videoRoute');
const healthRouter = require('./routes/healthRoute')
const cors = require('cors');
const { startHealthCheckCron } = require('./utils/cron');

const allowedOrigins = [
    process.env.FRONTEND_URI,
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed from this origin: ' + origin), false);
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);
app.use('/health', healthRouter);

const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log('DB Connected Successfully')

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
        console.log("Server Is Listening On PORT: " + PORT);
        startHealthCheckCron(PORT);
        });
    }
    catch (err) {
        console.log("Error: " + err.message);
    }
}

InitializeConnection();
