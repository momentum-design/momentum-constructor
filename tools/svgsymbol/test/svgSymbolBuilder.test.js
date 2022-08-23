const svgBuilder = require("../svgSymbolBuilder");

describe("Test interface",()=>{

    test('read color path', () => {
        expect(typeof svgBuilder.doBuild === "function").toBeTruthy();
    });
});
