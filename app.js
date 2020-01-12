const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const app = express();

app.use(express.json({extended: true}));
app.use(cors());
app.use('/api/auth', require('./routes/auth.router'));
app.use('/api/squad', require('./routes/squad.router'));

const PORT = config.get('port');

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`app listen on ${PORT}`));
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

start();
