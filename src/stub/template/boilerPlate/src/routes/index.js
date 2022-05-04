//import all js files in current folder and export themas routes
const fs = require('fs');
const routes = {};

fs.readdirSync(__dirname).forEach(file => {
    if (file.indexOf('.js') >= 0 && file !== 'index.js') {
        routes[file.replace('.js','')] = require('./' + file);
    }
});

module.exports = routes;