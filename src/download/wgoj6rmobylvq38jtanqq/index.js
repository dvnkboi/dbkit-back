const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');


const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('Your password', '')
  .replace('<USER>', process.env.DATABASE_USER)
  .replace('Your username:','')
  .replace('<DATABASE>',process.env.DATABASE_NAME)
  .replace('Your database','');


// Connect the database
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

//if some unhandled exception occurs, shut down server
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});