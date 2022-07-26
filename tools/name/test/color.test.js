const path = require('path');
const fs = require('fs');
const { naming } = require('../dist/index');
let packagePath = require.resolve('momentum-abstract');

let convertor;
let outputPath = path.resolve(__dirname,'./output/color');
let newIcons = [];

describe("Test Color",()=>{

    beforeAll(() => {
        convertor = naming.color({
            input: path.resolve(packagePath, '../color'),
            output: outputPath,
            replacement: {
                token: {
                    pattern: /\-/g,
                    words: '@'
                },
                fileName: {
                    pattern: /core/g,
                    words: '@'
                }
            },
            flat: true
        });
        convertor.clean();
        convertor.convert();
        convertor.save();
        newIcons = fs.readdirSync(outputPath);
    });

    test('Color: Test convert', () => {
        expect(Object.keys(convertor.files).length).toBeGreaterThan(0);
    });

    test('Color: has replace file name', () => {
        let hasNoConvert = newIcons.some((fileName)=>{
            return /core/.test(fileName);
        });
        expect(hasNoConvert).toBe(false);
    });

});
