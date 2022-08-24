# momentum-constructor-svgsymbol

Build to svgsymbol and generate index page of icons.

## Install

```npm i momentum-constructor-svgsymbol```

## Usage

```javascript
const svgSymbolBuilder = require("momentum-constructor-svgsymbol");
svgSymbolBuilder.doBuild({

})
```
Require `momentum-constructor-svgsymbol` and calling `doBuild` method with parameters, allow to save build result to svg symbol file or JS file, and generete index file, also, the methon will return the svg symbol content as string.

## Parameters
```Javascript
{
   namespace: string, // default is "cisco"
   taretFolder: string, // default is "[current folder]/dist"
   targetSvgFile: string, // null or not set will not save svg file
   targetIndexFile: string, // null or not set will not save index file
   targetJsFile: string, // it is dependency of index file, default is "default.js", allow to do not save js file wehen targetIndexFile not set
   sourceList: object, // define external svg folder
     {
         customType1: pathToFile,
         customType2: pathToFile,
         ...
     },
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

const svgBuilder = require("momentum-constructor-svgsymbol");
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
