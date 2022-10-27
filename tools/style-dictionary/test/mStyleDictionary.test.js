const { MomentumAbstractType, mfs } = require('momentum-constructor-common');
const { mStyleDictionary } = require('../dist/index');
const path = require('path');
const fs = require('fs');

describe("momentum-constructor-style-dictionary build",()=>{

    test('test build Color', () => {
        let outPath = path.join(__dirname, './output/color');
        mfs.clean(outPath);
        mStyleDictionary.build([{
            type: MomentumAbstractType.color,
            output: outPath
        }]);
        let list = fs.readdirSync(outPath);
        expect(Object.keys(list).length).toBeGreaterThan(0);
    });

    test('test build font', () => {
        let outPath = path.join(__dirname, './output/font');
        mfs.clean(outPath);
        mStyleDictionary.build([{
            type: MomentumAbstractType.font,
            output: outPath
        }]);
        let list = fs.readdirSync(outPath);
        expect(Object.keys(list).length).toBeGreaterThan(0);
    });
    
});
