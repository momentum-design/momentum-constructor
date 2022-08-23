/**
 * This is example to show you how to build svg symbol with svgSymbolBuilder.
 * @Copyright 2022 Cisco Systems Inc. All rights reserved.
 * @Description
 * @Author Xiaole Tao <xiaolet@cisco.com>
 * @Date 2022/8/8
 * @Update 2022/8/8
 */

const svgBuilder = require("./svgSymbolBuilder"),
    path = require("path");

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