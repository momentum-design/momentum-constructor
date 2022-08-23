# momentum-constructor-svgsymbol

Build to svgsymbol and generate index page of icons.

## Usage

Require `svgSymbolBuilder.js` and run `doBuild()` to build icons to svg symbol file or JS version of symbol.

Also, `svgSymbolBuilder.doBuild(parameters)` will return the svg symbol content as a string.

## Parameters
```Javascript
{
   namespace: string, // default is "cisco"
   taretFolder: string, // default is "[current folder]/dist"
   targetSvgFile: string, // default is "icons.svg"
   targetJsFile: string, // default is "icons.js"
   targetIndexFile: string, // default is "index.html"
   sourceList: object, // define external svg folder
     {
         customType1: pathToFile,
         customType2: pathToFile,
         ...
     }
   svgList: object, define icon list
     {
         type: {icon list} | [icon list] | "all", // momentum type is "icon", "icon-brand", "icon-colored", "illustration"
         icon: ["iconName", "iconName", ...], // use iconName as icon id
         "icon-colored": {"iconName": "icon id", "iconName": "icon id", ...},  // specified icon id
         illustration: [], // empty list will build nothing for this type
         customType1: "all" //"all" means build all svg under the relative path
         customType2: {"iconName": "icon id"} // build svg from custom folder
     }
}
```

## Example

Require the tool, to provide path parameters, require node path module too.
```javascript

const svgBuilder = require("./svgSymbolBuilder");
const path = require("path");

// Example: Do build with parameters
svgBuilder.doBuild({
    namespace: "icons1",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: "icons1.svg",
    targetJsFile: "icons1.js",
    targetIndexFile: "icon1.html",
    sourceList: {
        local: __dirname
    },
    svgList: {
        icon: { // Provide a list 
            alert_bold: "v2_notification_bold_32",
            annotate_bold: "v2_annotate_bold_32",
            announcement_bold: "v2_feedback_bold_32",
            appearance_bold: "v2_appearance_bold_32",
            applause_bold: "v2_emoji_applaud_bold_32",
            application_regular: "v2_share_application",
            applications_bold: "v2_applications_bold_32",
            apps_bold: "apps_bold",
            apps_filled: "v2_apps_filled_32"
        },
        "icon-colored": "all", //special string "all" will build all svg under type into dist.
        "icon-brand": [], // empty list will do nothing of this type
        illustration: {}, // empty object will do nothing of this type
        local: "all" // will found local svg from sourceList.local
    }
});
```
