const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser({limit: '50mb'}));
app.use(cors());
app.use('/api/auth', require('./routes/auth.router'));
app.use('/api/squad', require('./routes/squad.router'));
app.use('/api/statistic', require('./routes/statistic.router'));
app.use('/api/document-creator', require('./routes/document.router'));
app.use('/api/rank', require('./routes/rank.router'));

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
