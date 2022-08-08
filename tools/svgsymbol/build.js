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
        svgSource: path.resolve(packagePath, "../icon"),
        targetFolder: path.resolve(baseUrl, "dist"),
        targetSvgFile: path.resolve(baseUrl, "dist/icons.svg"),
        targetJsFile: path.resolve(baseUrl, "dist/icons.js"),
        targetIndexFile: path.resolve(baseUrl, "dist/index.html"),
        blackListTags: ["symbol", "title", "desc", "use", "script"],
        viewBox: {}
    };

let svgBuilder = {
    initialize: function () {
        if (!fs.existsSync(conf.targetFolder)) fs.mkdirSync(conf.targetFolder);
        conf.svgFileList = svgBuilder.getSvgfileList(conf.svgSource);
    },

    getSvgfileList: function (iconPath) {
        return fs
            .readdirSync(iconPath)
            .filter((name) => fs.statSync(path.resolve(iconPath, name)).isFile() && name.match(/^(.*)\.svg$/))
            .map((name) => name.replace(/\.svg$/, ""));
    },

    isEmptyTag: function ($tag) {
        return JSON.stringify($tag.attr()) === "{}" && !$tag.children().length;
    },

    fetchSymbol: function (type, name, refer) {
        let file = path.resolve(conf.svgSource, name + ".svg"),
            fileContent = fs.readFileSync(file, { encoding: "utf8" }),
            $ = cheerio.load(fileContent, { normalizeWhitespace: false, xmlMode: true }),
            svg = $("svg"),
            children = svg.children(),
            symbolContent = [];

        conf.viewBox[name] = svg.attr("viewBox") || `0 0 ${svg.attr("width") || 32} ${svg.attr("height") || 32}`;
        svg.find("g,circle,ellipse,image,line,path,pattern,polygon,polyline,rect,text").removeAttr("id");
        symbolContent.push('<symbol id="' + refer + '" viewBox="' + conf.viewBox[name] + '">');

        for (let i = 0; i < children.length; i++) {
            let child = children.eq(i);
            if (!conf.blackListTags.includes(children.get(i).tagName) && !svgBuilder.isEmptyTag(child)) {
                symbolContent.push($.html(child));
            }
        }
        symbolContent.push("</symbol>");
        return beautify(symbolContent.join(""));
    },

    buildSymbol: function () {
        let svgContent = ['<svg xmlns="http://www.w3.org/2000/svg">'];
        conf.svgFileList.forEach(function (name) {
            svgContent.push(svgBuilder.fetchSymbol("svgfile", name, name));
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
        conf.svgFileList.forEach(function (name) {
            let refer = name;
            indexContent.push('<div class="icon-pack">');
            indexContent.push('<div class="title">' + refer + "</div>");
            indexContent.push('<svg style="width: 32px; height: 32px;"><use xlink:href="#' + refer + '"/></svg>');
            indexContent.push("</div>");
        });
        indexContent.push("</body></html>");
        indexContent.push('<script src="icons.js"></script>');
        indexContent.push("<script>");
        indexContent.push(
            'document.body.insertAdjacentHTML("afterBegin", "<div style=\\"height:0;position:absolute;\\">" + window.namespace.svgSymbol + \'</div>\');'
        );
        indexContent.push('var cl=["Yellow","GreenYellow","Lime","DarkSlateGray","BlueViolet"];');
        indexContent.push("window.setInterval(function(){cl.push(cl.shift());document.styleSheets[0].cssRules[1].style.fill=cl[0];},15000);");
        indexContent.push('document.body.addEventListener("click",function(e){if(e.target.localName==="input"){e.target.select()}});');
        indexContent.push("</script>");
        return indexContent;
    },

    buildJSFile: function (svgContent) {
        return [
            "window.namespace = window.namespace || {};",
            "window.namespace.svgSymbol = [",
            svgContent
                .join("\n")
                .split("\n")
                .map((line) => "'" + line + "'")
                .join(",\n"),
            "].join('\\n');"
        ].join("\n");
    },

    doBuild: function () {
        svgBuilder.initialize();
        let svgContent = svgBuilder.buildSymbol();

        console.log("Saving builded file to ", conf.targetSvgFile);
        fs.writeFileSync(conf.targetSvgFile, svgContent.join("\n"), { encoding: "utf8" });
        console.log("Saving JS file to ", conf.targetJsFile);
        fs.writeFileSync(conf.targetJsFile, svgBuilder.buildJSFile(svgContent), { encoding: "utf8" });
        console.log("Saving index file to ", conf.targetIndexFile);
        fs.writeFileSync(conf.targetIndexFile, svgBuilder.buildIndexPage().join("\n"), { encoding: "utf8" });

        console.log("Build success.");
    }
};

svgBuilder.doBuild();
