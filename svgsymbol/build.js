/**
 * This is example to show you how to build svg symbol with svgSymbolBuilder.
 * @Copyright 2022 Cisco Systems Inc. All rights reserved.
 * @Description
 * @Author Xiaole Tao <xiaolet@cisco.com>
 * @Date 2022/8/23
 * @Update 2022/8/23
 */

const svgBuilder = require("momentum-constructor-svgsymbol"),
    path = require("path"),
    fs = require("fs");

svgBuilder.doBuild({ targetFolder: __dirname, targetJsFile: "icons.js", targetIndexFile: "icons.html", svgList: { icon: "all" } });
svgBuilder.doBuild({ targetFolder: __dirname, targetJsFile: "color.js", targetIndexFile: "color.html", svgList: { "icon-colored": "all" } });
svgBuilder.doBuild({ targetFolder: __dirname, targetJsFile: "brand.js", targetIndexFile: "brand.html", svgList: { "icon-brand": "all" } });
svgBuilder.doBuild({ targetFolder: __dirname, targetJsFile: "illus.js", targetIndexFile: "illus.html", svgList: { illustration: "all" } });

fs.unlinkSync(path.join(__dirname, "icons.svg"));

