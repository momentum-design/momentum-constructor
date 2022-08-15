const { MomentumAbstractType, reader } = require('../dist/index');

describe("Test reader.path",()=>{

    test('read color path', () => {
        expect(reader.path(MomentumAbstractType.color)).toBeTruthy();
    });

    test('read icon path', () => {
        expect(reader.path(MomentumAbstractType.icon)).toBeTruthy();
    });

});

describe("Test reader.list",()=>{

    test('test list colors', ()=> {
        let files = reader.list(MomentumAbstractType.color);
        expect(files.length).toBeGreaterThan(0);
    });

    test('test list icons', ()=> {
        let files = reader.list(MomentumAbstractType.icon);
        expect(files.length).toBeGreaterThan(0);
    });

    test('test filter.whitelist', ()=> {
        const reg = reader.getRegFromNames(['core.json','theme.json']);
        let files = reader.list(MomentumAbstractType.color, {
            whitelist: [reg]
        });
        expect(files.length).toBe(2);
    });

    test('test filter.blacklist', ()=> {
        const reg = reader.getRegFromNames(['core.json']);
        let files = reader.list(MomentumAbstractType.color, {
            blacklist: [reg]
        });
        expect(files.indexOf('core.json')).toBe(-1);
    });

    test('test filter.blacklist & whitelist', ()=> {
        const coreReg = reader.getRegFromNames(['core.json']);
        const themeReg = reader.getRegFromNames(['theme.json']);
        let files = reader.list(MomentumAbstractType.color, {
            blacklist: [coreReg, themeReg],
            whitelist: [/.json$/i]
        });
        expect(files.length).toBeGreaterThan(0);
    });

});

describe("Test reader.files",()=>{

    test('test read color', ()=> {
        let files = reader.files(MomentumAbstractType.color);
        expect(Object.keys(files).length).toBeGreaterThan(0);
    });

    test('test read icon-brand', ()=> {
        let files = reader.files(MomentumAbstractType['icon-brand']);
        expect(Object.keys(files).length).toBeGreaterThan(0);
    });
});

