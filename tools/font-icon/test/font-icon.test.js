const fontIcon = require('../src')

describe("Font icon: ",()=>{
    test('Init', async () => {
        const config = await fontIcon.init(true)
        expect(config).toBeDefined();
    });

    // tw-icon-arrow-down-bold
    // tw-icon-arrow-up-filled
    test('Build', async () => {
        const config = await fontIcon.init(true)
        config.content = ['tools/**/font-icon.test.js']
        const iconsJson = await fontIcon.build(config, true, true);
        expect(iconsJson).toHaveProperty('icon-arrow-down-bold')
        expect(iconsJson).toHaveProperty('icon-arrow-up-filled')
    })
});
