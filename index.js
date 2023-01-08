const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const authRouter = require('./authRouter/authRouter');

const logOK = chalk.bgGreen.whiteBright;
const logERROR = chalk.bgRed.white;

const PORT = process.env.PORT || 3000;
const MONGO_URL = 'mongodb://0.0.0.0:27017/auth_roles';

const app = express();
app.use(express.json());
app.use('/api', authRouter);

const start = async () => {
    try {
        mongoose.set({ strictQuery: false });
        await mongoose.connect(MONGO_URL);

        app.listen(PORT, () =>
            console.log(logOK(`Server started at http://localhost:${PORT}`))
        );
    } catch (err) {
        console.log(err.message);
    }
};

start();
