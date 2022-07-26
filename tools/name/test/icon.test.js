const path = require('path');
const fs = require('fs');
const { naming } = require('../dist/index');
let packagePath = require.resolve('momentum-abstract');

let convertor;
let outputPath = path.resolve(__dirname,'./output/icon');
let newIcons = [];

describe("Test Icon",()=>{

    beforeAll(() => {
        convertor = naming.icon({
            input: path.resolve(packagePath, '../icon'),
            output: outputPath,
            replacement: {
                fileName: {
                    pattern: /\-/g,
                    words: '@'
                }
            }
        });
        convertor.clean();
        convertor.rename();
        newIcons = fs.readdirSync(outputPath);
    });

    test('Icon: Test convert', () => {
        expect(Object.keys(newIcons).length).toBeGreaterThan(0);
    });

    test('Icon: has replace file name', () => {
        let hasNoConvert = newIcons.some((fileName)=>{
            return /\-/.test(fileName);
        });
        expect(hasNoConvert).toBe(false);
    });

});

