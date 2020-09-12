const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const routes = require('./routes/index');
const app = express();
const cors = require('cors');
const path = require('path');
app.use(cors());
const port = 3000;

app.use(require('morgan')('combined', {stream: logger.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// accept the routes of form '/user/..'
app.use('/user', routes(router));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Caught exception: ${err}\n` +
        `Exception origin: ${origin}`)
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})

module.exports = app; // export app for testing
