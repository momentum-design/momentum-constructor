/**
 * @Copyright 2022 Cisco Systems Inc. All rights reserved.
 * @Description
 * @Author Xiaole Tao <xiaolet@cisco.com>
 * @Date 2022/8/3
 * @Update 2022/8/23
 */

let fs = require("fs"),
    path = require("path"),
    cheerio = require("cheerio"),
    beautify = require("xml-beautifier"),
    baseUrl = __dirname,
    conf = {
        baseUrl,
        abstractType: ["icon", "icon-brand", "icon-colored", "illustration"],
        abstractPath: path.dirname(require.resolve("momentum-abstract")),
        blackListTags: ["symbol", "title", "desc", "use", "script"]
    };

const SMB = new Function();
Object.assign(SMB, {
    /**
     * @param {*} config - {
     * namespace: string, // default is "cisco"
     * taretFolder: string, // default is "[current folder]/dist"
     * targetSvgFile: string, // null or not set will not save svg file
     * targetIndexFile: string, // null or not set will not save index file
     * targetJsFile: string, // it is dependency of index file, default is "default.js", allow to do not save js file wehen targetIndexFile not set
     * sourceList: object, // define external svg folder
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
    setup(config) {
        config = config || {};
        conf.namespace = config.namespace || "cisco";
        conf.targetFolder = config.targetFolder || path.join(process.cwd(), "dist");
        conf.targetSvgFile = config.targetSvgFile ? path.join(conf.targetFolder, config.targetSvgFile) : null;
        conf.targetIndexFile = config.targetIndexFile ? path.join(conf.targetFolder, config.targetIndexFile) : null;
        if (config.targetIndexFile) {
            config.targetJsFile = config.targetJsFile || "default.js";
        }
        conf.targetJsFile = config.targetJsFile ? path.join(conf.targetFolder, config.targetJsFile) : null;

        conf.svgList = config.svgList || { icon: "all", local: "all" };
        conf.sourceList = config.sourceList || { local: baseUrl };

        if (!fs.existsSync(conf.targetFolder)) fs.mkdirSync(conf.targetFolder);
        conf.svgMissingList = [];
        conf.svgFullList = SMB.parseList();

        conf.viewBox = {};
        conf.symbolFill = {};
    },

    parseList() {
        let svgFullList = {};
        Object.keys(conf.svgList).forEach((item) => {
            if (conf.abstractType.includes(item)) {
                svgFullList[item] = SMB.getSvgfileList(item, conf.svgList[item], path.join(conf.abstractPath, item));
            } else {
                svgFullList[item] = SMB.getSvgfileList(item, conf.svgList[item], conf.sourceList[item] || baseUrl);
            }
        });
        return svgFullList;
    },

    getSvgfileList(type, svgList, sourcePath) {
        let nameList = [],
            idList = [],
            fileList = [];
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

        nameList.forEach((name, index) => {
            let file = path.join(sourcePath, `${name}.svg`);
            if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
                conf.svgMissingList.push(file);
            } else {
                fileList.push({ type: type, path: file, name: name, id: idList[index] || name });
            }
        });
        return fileList;
    },

    isEmptyTag($tag) {
        return JSON.stringify($tag.attr()) === "{}" && !$tag.children().length;
    },

    fetchSymbol(item) {
        let file = item.path,
            fileContent = fs.readFileSync(file, { encoding: "utf8" });

        //prifix to IDs
        fileContent = fileContent.replace(/(url\(#| id=")/g, `$1${item.id}-`);

        let $ = cheerio.load(fileContent, { normalizeWhitespace: false, xmlMode: true }),
            svg = $("svg"),
            children = svg.children(),
            symbolContent = [],
            fill;
        conf.viewBox[item.name] = svg.attr("viewBox") || `0 0 ${svg.attr("width") || 32} ${svg.attr("height") || 32}`;
        svg.find("g,circle,ellipse,image,line,path,pattern,polygon,polyline,rect,text").removeAttr("id");
        fill = svg.attr("fill") !== undefined ? ` fill="${svg.attr("fill")}"` : "";
        symbolContent.push(`<symbol id="${item.id}" viewBox="${conf.viewBox[item.name]}"${fill}>`);

        for (let i = 0; i < children.length; i++) {
            let child = children.eq(i);
            if (!conf.blackListTags.includes(children.get(i).tagName) && !SMB.isEmptyTag(child)) {
                symbolContent.push($.html(child));
            }
        }
        symbolContent.push("</symbol>");
        return beautify(symbolContent.join(""));
    },

    buildSymbol() {
        let svgContent = ['<svg xmlns="http://www.w3.org/2000/svg">'];
        Object.keys(conf.svgFullList).forEach((type) => {
            let svgList = conf.svgFullList[type];
            svgList.forEach((item) => {
                svgContent.push(SMB.fetchSymbol(item));
            });
        });
        svgContent.push("</svg>");
        return svgContent;
    },

    getSymbolSize(name) {
        let [x, y, w, h] = conf.viewBox[name].split(" "),
            size = { w: +w - +x, h: +h - +y };
        [size.h, size.w] = size.w > 180 ? [(size.h / size.w) * 180, 180] : [size.h, size.w];
        [size.w, size.h] = size.h > 100 ? [(size.w / size.h) * 100, 100] : [size.w, size.h];
        return { w: Math.round(size.w), h: Math.round(size.h) };
    },

    locatePosition(template, sub) {
        let ss = template.indexOf(`<!-- ${sub} Start Placeholder -->`),
            es = template.indexOf(`<!-- ${sub} End Placeholder -->`);
        return [ss, ss + sub.length + 28, es, es + sub.length + 26];
    },

    getSubTemplate(template, sub) {
        let [ss, se, es, ee] = SMB.locatePosition(template, sub);
        return template.slice(se, es).trimEnd();
    },

    replaceTemplate(template, sub, replaceStr) {
        let [ss, se, es, ee] = SMB.locatePosition(template, sub);
        return [template.slice(0, ss), replaceStr, template.slice(ee)].join("\n");
    },

    buildIndexPage() {
        let template = fs.readFileSync(path.join(__dirname, "template.html"), { encoding: "utf8" }),
            typeTemp = SMB.getSubTemplate(template, "Type"),
            packTemp = SMB.getSubTemplate(typeTemp, "Pack"),
            theme = { icon: "anicolor", illustration: "dark" },
            types = [];

        template = SMB.replaceTemplate(template, "Script", `<script src="${path.basename(conf.targetJsFile)}"></script>`);
        template = template.replace(/%namespace%/g, conf.namespace);
        Object.keys(conf.svgFullList).forEach((type) => {
            let svgList = conf.svgFullList[type],
                newType = typeTemp.replace(/%theme%/, theme[type] || ""),
                packs = [];
            svgList.forEach((item) => {
                let newPack = packTemp,
                    size = SMB.getSymbolSize(item.name);
                newPack = newPack.replace(/style="[^"]+"/, `style="width: ${size.w}px; height: ${size.h};"`);
                newPack = newPack.replace(/%width%/g, `style="width: ${Math.max(size.w + 10, 100)}px;"`);
                newPack = newPack.replace(/%iconRefer%/g, item.id);
                packs.push(newPack);
            });
            types.push(SMB.replaceTemplate(newType.replace(/%type%/g, type), "Pack", packs.join("\n")));
        });
        return SMB.replaceTemplate(template, "Type", types.join("\n"));
    },

    buildJSFile(svgContent) {
        return [
            `window.${conf.namespace} = window.${conf.namespace} || {};`,
            `window.${conf.namespace}.svgSymbol = [`,
            svgContent
                .join("\n")
                .split("\n")
                .map((line) => `'${line}'`)
                .join(",\n"),
            "].join('\\n');"
        ].join("\n");
    },

    saveFile(name, content, type) {
        if (name) {
            console.log(`Saving ${type} file to ${name}`);
            fs.writeFileSync(name, content, { encoding: "utf8" });
        }
    },

    doBuild(config) {
        SMB.setup(config);

        let svgContent = SMB.buildSymbol();
        conf.targetSvgFile && SMB.saveFile(conf.targetSvgFile, svgContent.join("\n"), "SVG");
        conf.targetJsFile && SMB.saveFile(conf.targetJsFile, SMB.buildJSFile(svgContent), "JS");
        conf.targetIndexFile && SMB.saveFile(conf.targetIndexFile, SMB.buildIndexPage(), "INDEX");

        if (conf.svgMissingList.length) {

            console.log(" _       __                 _            ");
            console.log("| |     / /___ __________  (_)___  ____ _");
            console.log("| | /| / / __ `/ ___/ __ \\/ / __ \\/ __ `/");
            console.log("| |/ |/ / /_/ / /  / / / / / / / / /_/ / ");
            console.log("|__/|__/\\__,_/_/  /_/ /_/_/_/ /_/\\__, /  ");
            console.log("                                /____/   ");
            
            console.error("Build finished, but some files are not found. Please check the parameter: svgList.");
            console.log(conf.svgMissingList.join("\n"));
            process.exit(1);
        }

        console.log("Build success.");
        return svgContent.join("\n");
    }
});

//export
module.exports = {
    _svgSymbolBuilder: SMB, //for unit test
    _conf: conf, //for unit test
    doBuild: SMB.doBuild
};
