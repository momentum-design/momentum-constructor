const svgBuilder = require("../svgSymbolBuilder");

describe("Test svgSymbolBuilder", () => {
    test("Is interface exist", () => {
        expect(typeof svgBuilder.doBuild).toBe("function");
    });

    test("Default Parameter", () => {
        let conf = svgBuilder._conf;
        svgBuilder.doBuild();
        expect(conf.namespace).toBe("cisco");
        expect(conf.svgList.icon).toBe("all");
        expect(conf.svgList.local).toBe("all");
        expect(conf.svgList.illustration).toBe(undefined);
    });
});
