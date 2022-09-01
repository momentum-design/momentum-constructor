const { MomentumAbstractType, mfs, mconvert } = require('../dist/index');

describe("momentum-constructor-common convert",()=>{

    test('renameFile', () => {
        let files = mfs.read(MomentumAbstractType['icon-colored']);
        files = mconvert.renameFile(files, {
            pattern: /\-/g,
            words: '@'
        });
        let names = Object.values(files).map((file)=>{
            return file.name;
        });
        expect(/\-/.test(names.join(''))).toBe(false);
    });

    test('renameToken', () => {
        let files = mfs.read(MomentumAbstractType.color);
        files = mconvert.renameToken(files, {
            pattern: /\-/,
            words: '@'
        });
        firstFile = Object.values(files).find(()=>{
            return true;
        });
        expect(firstFile).toBeTruthy();
    });

    test('flat', () => {
        let files = mfs.read(MomentumAbstractType.color);
        files = mconvert.flat(files, MomentumAbstractType.color);
        firstFile = Object.values(files).find(()=>{
            return true;
        });
        expect(firstFile).toBeTruthy();
    });
    
});
