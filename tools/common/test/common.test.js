const { mcommon } = require('../dist/index');

describe("momentum-constructor-common common",()=>{

    test('getRegFromNames', () => {
        expect(mcommon.getRegFromNames(['core.json','theme.json'])).toBeTruthy();
    });

    test('getRegFromNamesSafe', () => {
        expect(mcommon.getRegFromNamesSafe(['core.json','theme.json'])).toBeTruthy();
    });

    test('isInList', () => {
        expect(mcommon.isInList('core.json', [/\.json$/])).toBe(true);
    });

    test('isNotInList', () => {
        expect(mcommon.isNotInList('core.json', [/\.svg$/])).toBe(true);
    });

    test('isFilted', () => {
        expect(mcommon.isFilted('core.json', {
            blacklist: [/a.json$/i],
            whitelist: [/.json$/i]
        })).toBe(true);
    });
    
});
