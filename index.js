const pathWalker = require('./src/utils/pathWalker');
const path = require('path');

process.on('uncaughtException', async err => {
    console.log('UNCAUGHT EXCEPTION!!!');
    console.log(err);
    // await pathWalker.deleteAsync(path.join(__dirname,`./src/download`));
    // await pathWalker.deleteAsync(path.join(__dirname,`./src/stub/tmp`));
    // process.exit(1);
});

process.on('unhandledRejection', async err => {
    console.log('UNHANDLED REJECTION!!!');
    console.log(err);
    // await pathWalker.deleteAsync(path.join(__dirname,`./src/download`));
    // await pathWalker.deleteAsync(path.join(__dirname,`./src/stub/tmp`));
    // server.close(() => {
    //     process.exit(1);
    // });
});

const app = require('./app');

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});