const { MomentumAbstractType, mfs, mcommon } = require('../dist/index');
const path = require('path');
const fs = require('fs');

describe("momentum-constructor-common fileSystem",()=>{

    test('read color path', () => {
        expect(mfs.path(MomentumAbstractType.color)).toBeTruthy();
    });

    test('read icon path', () => {
        expect(mfs.path(MomentumAbstractType.icon)).toBeTruthy();
    });

    test('test list colors', ()=> {
        let files = mfs.list(MomentumAbstractType.color);
        expect(files.length).toBeGreaterThan(0);
    });

    test('test list icons', ()=> {
        let files = mfs.list(MomentumAbstractType.icon);
        expect(files.length).toBeGreaterThan(0);
    });

    test('test filter.whitelist', ()=> {
        const reg = mcommon.getRegFromNames(['core.json','theme.json']);
        let files = mfs.list(MomentumAbstractType.color, {
            whitelist: reg
        });
        expect(files.length).toBe(2);
    });

    test('test filter.blacklist', ()=> {
        let reg = mcommon.getRegFromNames(['core.json']);
        let files = mfs.list(MomentumAbstractType.color, {
            blacklist: reg
        });
        expect(files.indexOf('core.json')).toBe(-1);
    });

    test('test filter.blacklist & whitelist', ()=> {
        let reg = mcommon.getRegFromNames(['core.json','theme.json']);
        let files = mfs.list(MomentumAbstractType.color, {
            blacklist: reg,
            whitelist: [/.json$/i]
        });
        expect(files.length).toBeGreaterThan(0);
    });

    test('test read color', ()=> {
        let files = mfs.read(MomentumAbstractType.color);
        expect(Object.keys(files).length).toBeGreaterThan(0);
    });

    test('test read icon-brand', ()=> {
        let files = mfs.read(MomentumAbstractType['icon-brand']);
        expect(Object.keys(files).length).toBeGreaterThan(0);
    });

    test('test save', ()=> {
        let outPath = path.join(__dirname, './output/save');
        mfs.clean(outPath);
        mfs.save(outPath, MomentumAbstractType['icon-brand']);
        let list = fs.readdirSync(outPath);
        expect(Object.keys(list).length).toBeGreaterThan(0);
    });

    test('test saveFiles', ()=> {
        let outPath = path.join(__dirname, './output/saveFiles');
        mfs.clean(outPath);
        let files = mfs.read(MomentumAbstractType['icon-colored']);
        mfs.saveFiles(files, outPath);
        let list = fs.readdirSync(outPath);
        expect(Object.keys(list).length).toBeGreaterThan(0);
    });

    test('test saveFiles font', ()=> {
        let outPath = path.join(__dirname, './output/saveFiles');
        mfs.clean(outPath);
        let files = mfs.read(MomentumAbstractType.font);
        mfs.saveFiles(files, outPath);
        let list = fs.readdirSync(outPath);
        expect(Object.keys(list).length).toBeGreaterThan(0);
    });
    
});
