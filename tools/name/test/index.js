const path = require('path');
const { naming } = require('../dist/index');
let packagePath = require.resolve('momentum-abstract');

const a = naming.color({
    input: path.resolve(packagePath, '../color'),
    output: path.resolve(__dirname,'./output/color'),
    replacement: {
        token: {
            pattern: /\-/g,
            words: '@'
        },
        fileName: {
            pattern: /c/g,
            words: 'a'
        }
    },
    flat: true
}).save();

/*
naming.icon({
    input: path.resolve(packagePath, '../icon'),
    output: path.resolve(__dirname,'./output/icon'),
    replacement: {
        fileName: {
            pattern: /\-/g,
            words: '@'
        }
    }
}).rename();
*/
