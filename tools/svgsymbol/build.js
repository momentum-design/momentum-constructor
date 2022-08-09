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
const momentum_path = require.resolve('momentum-abstract');
const momentum_icon_path  =  path.resolve(momentum_path, '../icon');
const momentum_illustration_path  =  path.resolve(momentum_path, '../illustration');

// Example1: Direct dobuild with parameters
svgBuilder.doBuild({
    namespace: "icons1",
    svgSource: momentum_icon_path,
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

// Example2: Setup and dobuild
svgBuilder.setup({
    namespace: "icons2",
    svgSource: momentum_icon_path,
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

// Example3: No svgList, dobuild all icons, only JS symbol file
svgBuilder.doBuild({
    svgSource: momentum_illustration_path,
    namespace: "icons3",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: null,
    targetJsFile: "icons3.js",
    targetIndexFile: "icon3.html",
    svgList: null
});
