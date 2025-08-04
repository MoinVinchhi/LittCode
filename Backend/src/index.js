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
const cors = require('cors');


app.use(cors ({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());


app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);


const InitializeConnection = async () => {
    try {
        await Promise.all[main(), redisClient.connect()];
        console.log('DB Connected Successfully')

        app.listen(process.env.PORT, () => {
        console.log("Server Is Listening On PORT: " + process.env.PORT);
        })
    }
    catch (err) {
        console.log("Error: " + err.message);
    }
}

InitializeConnection();
