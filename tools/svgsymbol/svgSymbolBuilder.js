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
    packagePath = require.resolve("momentum-abstract"),
    conf = {
        blackListTags: ["symbol", "title", "desc", "use", "script"],
        isMissedFile: false
    };

const svgSymbolBuilder = new Function();

Object.assign(svgSymbolBuilder, {
    /**
     * @param {*} config - {
     *    namespace: string, default is "cisco"
     *    taretFolder: string, default is "[root]/tools/svgsymbol/dist"
     *    targetSvgFile: string, default is "icons.svg"
     *    targetJsFile: string, default is "icons.js"
     *    targetIndexFile: string, default is "index.html"
     *    svgList: array | object, default is all icons.
     *            ["iconName", "iconName", ...] or
     *            {"iconName": "icon id", "iconName": "icon id", ...} or
     *            leave it null to build all icons
     * }
     */
    setup: function (config) {
        config = config || {};
        config.svgSource = config.svgSource || path.dirname(__dirname);
        conf.namespace = config.namespace || "cisco";
        conf.targetFolder = config.targetFolder || path.resolve(baseUrl, "dist");
        conf.targetSvgFile = config.targetSvgFile === null ? null : path.resolve(conf.targetFolder, config.targetSvgFile || "icons.svg");
        conf.targetJsFile = config.targetJsFile === null ? null : path.resolve(conf.targetFolder, config.targetJsFile || "icons.js");
        conf.targetIndexFile = config.targetIndexFile === null ? null : path.resolve(conf.targetFolder, config.targetIndexFile || "index.html");

        conf.svgList = config.svgList || {};

        if (!fs.existsSync(conf.targetFolder)) fs.mkdirSync(conf.targetFolder);
        conf.svgFileList = svgSymbolBuilder.getSvgfileList();
    },

    getSvgfileList: function () {
        let fileList,
            idList = [];
        if (Array.isArray(conf.svgList) && conf.svgList.length > 0) {
            fileList = conf.svgList;
        } else if (!Array.isArray(conf.svgList) && typeof conf.svgList === "object" && Object.getOwnPropertyNames(conf.svgList).length > 0) {
            fileList = Object.keys(conf.svgList);
            idList = Object.values(conf.svgList);
        } else {
            fileList = fs
                .readdirSync(conf.svgSource)
                .filter((name) => fs.statSync(path.resolve(conf.svgSource, name)).isFile() && name.match(/^(.*)\.svg$/))
                .map((name) => name.replace(/\.svg$/, ""));
        }
        return fileList.map((name, index) => {
            return { icon: name, id: idList[index] || name };
        });
    },

    isEmptyTag: function ($tag) {
        return JSON.stringify($tag.attr()) === "{}" && !$tag.children().length;
    },

    fetchSymbol: function (name, id) {
        let file = path.resolve(conf.svgSource, name + ".svg"),
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
            viewbox = svg.attr("viewBox") || `0 0 ${svg.attr("width") || 32} ${svg.attr("height") || 32}`;
        svg.find("g,circle,ellipse,image,line,path,pattern,polygon,polyline,rect,text").removeAttr("id");
        symbolContent.push('<symbol id="' + id + '" viewBox="' + viewbox + '">');

        for (let i = 0; i < children.length; i++) {
            let child = children.eq(i);
            if (!conf.blackListTags.includes(children.get(i).tagName) && !svgSymbolBuilder.isEmptyTag(child)) {
                symbolContent.push($.html(child));
            }
        }
        symbolContent.push("</symbol>");
        return beautify(symbolContent.join(""));
    },

    buildSymbol: function () {
        let svgContent = ['<svg xmlns="http://www.w3.org/2000/svg">'];
        conf.svgFileList.forEach(function (item) {
            svgContent.push(svgSymbolBuilder.fetchSymbol(item.icon, item.id));
        });
        svgContent.push("</svg>");
        return svgContent;
    },

    buildIndexPage: function () {
        let indexContent = [
            "<!DOCTYPE html>",
            '<html lang="en"><head><meta charset="UTF-8"><title>Lib Icons Index</title>',
            "<style>",
            "svg{display:block;margin:4px auto 0;}",
            "symbol{transition-property:fill;transition-duration:.5s;fill:BlueViolet;}",
            ".icon-pack{border: 1px solid #666;border-radius: 10px;width: 100px;height: 80px;display: inline-block;overflow: hidden;margin: 5px;background: #a1a1a1cc;}",
            ".title {font: 9pt/9pt arial;text-align: center;background: #CCC;padding: 3px 0 0;height: 30px;}",
            'body{background:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8"><path fill="rgb(192,192,192)" d="M0 0L4 0L4 8L8 8L8 4L0 4Z"/></svg>\') repeat}',
            "</style>",
            "</head><body>"
        ];
        conf.svgFileList.forEach(function (item) {
            let refer = item.id;
            indexContent.push('<div class="icon-pack">');
            indexContent.push('<div class="title">' + refer + "</div>");
            indexContent.push('<svg style="width: 32px; height: 32px;"><use xlink:href="#' + refer + '"/></svg>');
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

    buildJSFile: function (svgContent) {
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

    saveFile: function (name, content, type) {
        if (name) {
            console.log(`Saving ${type} file to ${name}`);
            fs.writeFileSync(name, content, { encoding: "utf8" });
        }
    },

    doBuild: function (config) {
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
