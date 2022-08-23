const path = require('path');
const fs = require('fs');
const { Convertor } = require('../dist/index');
let myConvertor;
let outputPath = path.resolve(__dirname,'./output/color');
let newIcons = [];

describe("Test Color",()=>{

    beforeAll(() => {
        myConvertor = new Convertor({
            type: 'color',
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
        myConvertor.clean();
        myConvertor.convert();
        myConvertor.save();
        newIcons = fs.readdirSync(outputPath);
    });

    test('Color: Test convert', () => {
        expect(Object.keys(myConvertor.files).length).toBeGreaterThan(0);
    });

    test('Color: has replace file name', () => {
        let hasNoConvert = newIcons.some((fileName)=>{
            return /core/.test(fileName);
        });
        expect(hasNoConvert).toBe(false);
    });

});
