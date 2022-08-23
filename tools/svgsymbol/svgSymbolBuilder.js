/**
 * @Copyright 2022 Cisco Systems Inc. All rights reserved.
 * @Description
 * @Author Xiaole Tao <xiaolet@cisco.com>
 * @Date 2022/8/3
 * @Update 2022/8/5
 */

let fs = require("fs"),
    path = require("path"),
    cheerio = require("cheerio"),
    beautify = require("xml-beautifier"),
    baseUrl = __dirname,
    conf = {
        abstractType: ["icon", "icon-brand", "icon-colored", "illustration"],
        abstractPath: path.dirname(require.resolve("momentum-abstract")),
        blackListTags: ["symbol", "title", "desc", "use", "script"]
    };

const svgSymbolBuilder = new Function();

Object.assign(svgSymbolBuilder, {
    /**
     * @param {*} config - {
     *    namespace: string, default is "cisco"
     *    taretFolder: string, default is "[current folder]/dist"
     *    targetSvgFile: string, default is "icons.svg"
     *    targetJsFile: string, default is "icons.js"
     *    targetIndexFile: string, default is "index.html"
     *    sourceList: object, customer svg path.
     *      {
     *          customType: pathToFile
     *          ...
     *      }
     *    svgList: object, default is all icons.
     *      {
     *          type|customType: {icon list}|[icon list]|"all",
     *          icon: ["iconName", "iconName", ...],
     *          "icon-colored": {"iconName": "icon id", "iconName": "icon id", ...},
     *          customType: "all"
     *      }
     * }
     */
    setup: function(config) {
        config = config || {};
        conf.namespace = config.namespace || "cisco";
        conf.targetFolder = config.targetFolder || path.join(process.cwd(), "dist");
        conf.targetSvgFile = config.targetSvgFile === null ? null : path.join(conf.targetFolder, config.targetSvgFile || "icons.svg");
        conf.targetJsFile = config.targetJsFile === null ? null : path.join(conf.targetFolder, config.targetJsFile || "icons.js");
        conf.targetIndexFile = config.targetIndexFile === null ? null : path.join(conf.targetFolder, config.targetIndexFile || "index.html");

        conf.svgList = config.svgList || { icon: "all", local: "all" };
        conf.sourceList = config.sourceList || { local: baseUrl };

        if (!fs.existsSync(conf.targetFolder)) fs.mkdirSync(conf.targetFolder);
        conf.svgFullList = svgSymbolBuilder.parseList();

        conf.viewBox = {};
        conf.symbolFill = {};
    },

    parseList() {
        let svgFullList = {};
        Object.keys(conf.svgList).forEach((item) => {
            if (conf.abstractType.includes(item)) {
                svgFullList[item] = svgSymbolBuilder.getSvgfileList(item, conf.svgList[item], path.join(conf.abstractPath, item));
            } else {
                svgFullList[item] = svgSymbolBuilder.getSvgfileList(item, conf.svgList[item], conf.sourceList[item] || baseUrl);
            }
        });
        return svgFullList;
    },

    getSvgfileList: function(type, svgList, sourcePath) {
        let nameList = [],
            idList = [];
        if (Array.isArray(svgList) && svgList.length > 0) {
            nameList = svgList;
        } else if (!Array.isArray(svgList) && typeof svgList === "object" && Object.getOwnPropertyNames(svgList).length > 0) {
            nameList = Object.keys(svgList);
            idList = Object.values(svgList);
        } else if (svgList === "all") {
            nameList = fs
                .readdirSync(sourcePath)
                .filter((name) => fs.statSync(path.resolve(sourcePath, name)).isFile() && name.match(/^(.*)\.svg$/))
                .map((name) => name.replace(/\.svg$/, ""));
        }
        return nameList.map((name, index) => {
            return { type: type, path: path.join(sourcePath, name + ".svg"), icon: name, id: idList[index] || name };
        });
    },

    isEmptyTag: function($tag) {
        return JSON.stringify($tag.attr()) === "{}" && !$tag.children().length;
    },

    fetchSymbol: function(item) {
        let file = item.path,
            fileContent;

        if (fs.existsSync(file) && fs.statSync(file).isFile()) {
            fileContent = fs.readFileSync(file, { encoding: "utf8" });
        } else {
            console.error("Missing file: " + file);
            conf.isMissedFile = true;
            return "";
        }

        let $ = cheerio.load(fileContent, { normalizeWhitespace: false, xmlMode: true }),
            svg = $("svg"),
            children = svg.children(),
            symbolContent = [],
            fill;
        conf.viewBox[item.icon] = svg.attr("viewBox") || `0 0 ${svg.attr("width") || 32} ${svg.attr("height") || 32}`;
        svg.find("g,circle,ellipse,image,line,path,pattern,polygon,polyline,rect,text").removeAttr("id");
        fill = ["icon-brand", "icon-colored", "illustration"].includes(item.type) ? ' fill="' + svg.attr("fill") + '"' : "";
        symbolContent.push('<symbol id="' + item.id + '" viewBox="' + conf.viewBox[item.icon] + '"' + fill + ">");

        for (let i = 0; i < children.length; i++) {
            let child = children.eq(i);
            if (!conf.blackListTags.includes(children.get(i).tagName) && !svgSymbolBuilder.isEmptyTag(child)) {
                symbolContent.push($.html(child));
            }
        }
        symbolContent.push("</symbol>");
        return beautify(symbolContent.join(""));
    },

    buildSymbol: function() {
        let svgContent = ['<svg xmlns="http://www.w3.org/2000/svg">'];
        Object.keys(conf.svgFullList).forEach((type) => {
            let svgList = conf.svgFullList[type];
            svgList.forEach((item) => {
                svgContent.push(svgSymbolBuilder.fetchSymbol(item));
            });
        });
        svgContent.push("</svg>");
        return svgContent;
    },

    getSymbolSize: function(name) {
        let size = svgSymbolBuilder.getSize(name);
        [size.h, size.w] = size.w > 180 ? [(size.h / size.w) * 180, 180] : [size.h, size.w];
        [size.w, size.h] = size.h > 100 ? [(size.w / size.h) * 100, 100] : [size.w, size.h];
        return ' style="width: ' + size.w + "px; height: " + size.h + 'px;"';
    },

    getContainerWidth: function(name) {
        let size = svgSymbolBuilder.getSize(name);
        return size.w > 100 ? ' style="width: ' + (size.w > 180 ? 180 : size.w) + 'px"' : "";
    },

    getSize: function(name) {
        let [x, y, w, h] = conf.viewBox[name].split(" ");
        return { w, h };
    },

    buildIndexPage: function() {
        let indexContent = [
            "<!DOCTYPE html>",
            '<html lang="en"><head><meta charset="UTF-8"><title>Lib Icons Index</title>',
            "<style>",
            "svg{display:block;margin:10px auto;}",
            ".icon-type-icon svg{transition-property:fill;transition-duration:.5s;fill:BlueViolet;}",
            ".icon-pack{border: 1px solid #666;border-radius: 10px;width: 100px;display: inline-block;overflow: hidden;margin: 5px;background: #444;}",
            ".icon-type-icon .icon-pack{background: #a1a1a1cc;}",
            ".title {font: 9pt/9pt arial;text-align: center;background: #CCC;padding: 6px 2px;}",
            ".icon-pack-title{font: bold 40px/50px Verdana;border-top: 3px solid #333;margin: 20px 10px 10px;}",
            'body{background:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8"><path fill="rgb(192,192,192)" d="M0 0L4 0L4 8L8 8L8 4L0 4Z"/></svg>\') repeat}',
            "</style>",
            "</head><body>"
        ];
        Object.keys(conf.svgFullList).forEach((type) => {
            let svgList = conf.svgFullList[type];
            indexContent.push('<div class="icon-type-' + type + '"><div class="icon-pack-title">' + type + "</div>");
            svgList.forEach((item) => {
                indexContent.push('<div class="icon-pack"' + svgSymbolBuilder.getContainerWidth(item.icon) + ">");
                indexContent.push('<div class="title">' + item.id + "</div>");
                indexContent.push("<svg " + svgSymbolBuilder.getSymbolSize(item.icon) + '><use xlink:href="#' + item.id + '"/></svg>');
                indexContent.push("</div>");
            });
            indexContent.push("</div>");
        });
        indexContent.push("</body></html>");
        indexContent.push('<script src="' + conf.targetJsFile + '"></script>');
        indexContent.push("<script>");
        indexContent.push(
            'document.body.insertAdjacentHTML("afterBegin", "<div style=\\"width:0;height:0;position:absolute;right:0;\\">" + window.' +
                conf.namespace +
                ".svgSymbol + '</div>');"
        );
        indexContent.push('var cl=["Yellow","GreenYellow","Lime","DarkSlateGray","BlueViolet"];');
        indexContent.push("window.setInterval(function(){cl.push(cl.shift());document.styleSheets[0].cssRules[1].style.fill=cl[0];},15000);");
        indexContent.push("</script>");
        return indexContent;
    },

    buildJSFile: function(svgContent) {
        return [
            "window." + conf.namespace + " = window." + conf.namespace + " || {};",
            "window." + conf.namespace + ".svgSymbol = [",
            svgContent
                .join("\n")
                .split("\n")
                .map((line) => "'" + line + "'")
                .join(",\n"),
            "].join('\\n');"
        ].join("\n");
    },

    saveFile: function(name, content, type) {
        if (name) {
            console.log(`Saving ${type} file to ${name}`);
            fs.writeFileSync(name, content, { encoding: "utf8" });
        }
    },

    doBuild: function(config) {
        if (!conf.targetFolder || typeof config === "object") {
            svgSymbolBuilder.setup(config);
        }

        let svgContent = svgSymbolBuilder.buildSymbol();

        svgSymbolBuilder.saveFile(conf.targetSvgFile, svgContent.join("\n"), "SVG");
        svgSymbolBuilder.saveFile(conf.targetJsFile, svgSymbolBuilder.buildJSFile(svgContent), "JS");
        svgSymbolBuilder.saveFile(conf.targetIndexFile, svgSymbolBuilder.buildIndexPage().join("\n"), "INDEX");

        if (conf.isMissedFile) {
            console.error("Build finished, but some files are not found. Please check the parameter: svgList.");
            process.exit(1);
        }

        console.log("Build success.");
        return svgContent.join("\n");
    }
});

module.exports = {
    setup: svgSymbolBuilder.setup,
    doBuild: svgSymbolBuilder.doBuild
};
