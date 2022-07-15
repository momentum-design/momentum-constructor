const path = require('path');
const fs = require('fs');
const {naming } = require('../dist/index');
let packagePath = require.resolve('momentum-abstract');
/*
naming.color({
    input: path.resolve(packagePath, '../color'),
    output: path.resolve(__dirname,'./output/color'),
    flat: true
});
*/

naming.icon({
    input: path.resolve(packagePath, '../icon'),
    output: path.resolve(__dirname,'./output/icon'),
    replacement: {
        pattern: /\-/g,
        words: '@'
    }
});
