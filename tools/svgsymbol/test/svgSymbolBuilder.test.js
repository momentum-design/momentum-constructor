const svgBuilder = require("../svgSymbolBuilder");

describe("Test svgSymbolBuilder", () => {
    test("Is interface exist", () => {
        expect(typeof svgBuilder.doBuild).toBe("function");
    });

    test("Default Parameter", () => {
        let SMB = svgBuilder._svgSymbolBuilder;
        SMB.doBuild();
        expect(SMB.conf.namespace).toBe("cisco");
        expect(SMB.conf.svgList.icon).toBe("all");
        expect(SMB.conf.svgList.local).toBe("all");
        expect(SMB.conf.svgList.illustration).toBe(undefined);
    });

    test("Default Parameter", () => {
        let SMB = svgBuilder._svgSymbolBuilder;
        SMB.doBuild();
        expect(SMB.conf.namespace).toBe("cisco");
        expect(SMB.conf.svgList.icon).toBe("all");
        expect(SMB.conf.svgList.local).toBe("all");
        expect(SMB.conf.svgList.illustration).toBe(undefined);
    });
});
