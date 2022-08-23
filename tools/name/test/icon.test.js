const path = require('path');
const fs = require('fs');
const { Convertor } = require('../dist/index');

let myConvertor;
let outputPath = path.resolve(__dirname,'./output/icon');
let newIcons = [];

describe("Test Icon",()=>{

    beforeAll(() => {
        myConvertor = new Convertor({
            type: 'icon',
            output: outputPath,
            replacement: {
                fileName: {
                    pattern: /\-/g,
                    words: '@'
                }
            }
        });
        myConvertor.clean();
        myConvertor.rename();
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
