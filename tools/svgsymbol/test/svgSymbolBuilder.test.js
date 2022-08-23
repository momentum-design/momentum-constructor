const svgBuilder = require("../svgSymbolBuilder");

describe("Test interface",()=>{

    test('Is interface exist', () => {
        expect(typeof svgBuilder.doBuild === "function").toBeTruthy();
    });
});
