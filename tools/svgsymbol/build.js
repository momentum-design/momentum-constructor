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
    namespace: "example",
    targetFolder: path.resolve(__dirname, "dist"),
    targetSvgFile: "example.svg",
    targetJsFile: "example.js",
    targetIndexFile: "example.html",
    sourceList: {
        local: __dirname
    },
    svgList: {
        icon: { // Provide a list 
            no_this_file_test: "v2_test_file_not_exist",
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
        illustration: {
                "sharing-content-320_black": "v2_sharing-content-320_black",
                "sharing-content-320_white": "v2_sharing-content-320_white",
                "people-headshot-wavy-hair-m-120_black": "v2_people_headshot_black_72",
                "people-headshot-wavy-hair-m-120_white": "v2_people_headshot_white_72",
                "people-headshot-wavy-hair-s-60_black": "v2_people_headshot_black_48",
                "people-headshot-wavy-hair-s-60_white": "v2_people_headshot_white_48"  
        },
        local: "all" // will found local svg from sourceList.local
    }
});