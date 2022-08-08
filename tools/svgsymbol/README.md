# momentum-constructor-svgsymbol
Build to svgsymbol and generate index page of icons.

## Using
Require `svgSymbolBuilder.js` and run `doBuild()` to build icons to svg symbol file or JS version of symbol.

## Example
Require the tool, to provide path parameters, require node path module too.
```javascript
const svgBuilder = require("./svgSymbolBuilder"),
    path = require("path");
```

### Example1: Direct dobuild with parameters
```javascript
svgBuilder.doBuild({
    namespace: "icons1",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: "icons1.svg",
    targetJsFile: "icons1.js",
    targetIndexFile: "icon1.html",
    svgList: {
        accessibility_bold: "v2_accessibility_bold_32",
        admin_bold: "v2_admin_bold_32",
        alert_bold: "v2_notification_bold_32",
        annotate_bold: "v2_annotate_bold_32",
        announcement_bold: "v2_feedback_bold_32",
        appearance_bold: "v2_appearance_bold_32",
        applause_bold: "v2_emoji_applaud_bold_32",
        application_regular: "v2_share_application",
        applications_bold: "v2_applications_bold_32",
        apps_bold: "v2_apps_bold_32",
        apps_filled: "v2_apps_filled_32"
    }
});
```

### Example2: Setup and dobuild
```javascript
svgBuilder.setup({
    namespace: "icons2",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: "icons2.svg",
    targetJsFile: "icons2.js",
    targetIndexFile: "icon2.html",
    svgList: [
        "pause_bold",
        "pen_bold",
        "phone_bold",
        "pin-muted_bold",
        "pin_bold",
        "play_bold",
        "plus_bold",
        "poll_bold",
        "pop-in_bold",
        "pop-out_bold",
        "private-circle_bold",
        "q-a_bold"
    ]
});
svgBuilder.doBuild();
```

### Example3: No svgList, dobuild all icons, only JS symbol file
```javascript
svgBuilder.doBuild({
    namespace: "icons3",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: null,
    targetJsFile: "icons3.js",
    targetIndexFile: "icon3.html",
    svgList: null
});
```