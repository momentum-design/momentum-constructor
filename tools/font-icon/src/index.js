const { generateFonts } = require("@momentum-ui/webfonts-generator");
const fs = require('fs').promises;
const fg = require('fast-glob');
const xml2js = require('xml2js')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production';
const NAME = 'momentum-construtor-font-icon';
const configFile = './momentum-construtor-font-icon.config.js';

async function getFiles(pattern) {
  const filenames = await fg(pattern, {
    onlyFiles: true,
  });

  return filenames;
}

function processStringPattern(tokenRegExp) {
  return new RegExp(tokenRegExp.source, tokenRegExp.flags);
}

async function getIconsInFile(file, tokenRegExp) {
  const content = await fs.readFile(file, 'utf-8');
  const processedtokenRegExp = processStringPattern(tokenRegExp);
  const matches = content.matchAll(processedtokenRegExp);
  return [...matches].map(m => m[1]);
}

async function getContentIcons(content, tokenRegExp) {
  const contentFiles = await getFiles(content);

  const contentIcons = new Set();
  for (const file of contentFiles) {
    const icons = await getIconsInFile(file, tokenRegExp);
    icons.forEach(i => contentIcons.add(i));
  }

  return [...contentIcons].sort();
}

function replaceLast(str, ch, cr) {
  const lp = str.lastIndexOf(ch);
  return `${str.substring(0, lp)}${cr}${str.substring(lp + 1)}`;
}

async function generateSVGPattern(svgPath, content, tokenRegExp, isProd) {
  if (!isProd) {
    return `${svgPath}/*.svg`;
  }

  const contentIcons = await getContentIcons(content, tokenRegExp);

  return `{${
    contentIcons
      .map(icon => replaceLast(icon, '-', '_'))
      .map(icon => `${svgPath}/${icon}.svg`)
      .join(',')
  }}`;
}

async function generateIconsJson(fontName, fontPath, tokenPath) {
  const svgFontFile = `${fontPath}/${fontName}.svg`;
  const svgFont = await loadSvgFont(svgFontFile);
  const startCodepoint = 0xf101;
  const glyphs = svgFont.svg.defs[0].font[0].glyph.map((g, i) => {
    const glyph = g['$'];
    const name = replaceLast(glyph['glyph-name'], '_', '-');

    const codePointHex = (startCodepoint + i).toString(16);
    return [`icon-${name}`, codePointHex]
  })
  
  return Object.fromEntries(glyphs);
}

async function writeIconsJson(iconsJson, tokenPath) {
  const tokenFile = path.resolve(tokenPath, 'icons.json')
  await fs.writeFile(tokenFile, JSON.stringify(iconsJson, null, 2), 'utf-8');
}

async function loadSvgFont(file) {
  const svgFile = await fs.readFile(file, 'utf-8')
  return await xml2js.parseStringPromise(svgFile);
}

async function build(_config, _isProd = isProd, _dry = false){
  let config = _config;
  try {
    if (!config) {
      config = require(path.resolve(configFile));
    }
  } catch(e) {
    console.error(`Please run 'npx ${NAME} --i', before build!`)
    return
  }

  const { svgPath, fontName, fontPath, content, tokenRegExp, tokenPath } = config;
  const svgPattern = await generateSVGPattern(svgPath, content, tokenRegExp, _isProd);
  await generateFonts(fontName, svgPattern, fontPath, {ts: Date.now(), fontHeight: 1000});

  const iconsJson = await generateIconsJson(fontName, fontPath);
  return _dry ? iconsJson : await writeIconsJson(iconsJson, tokenPath);
}

async function init(_dry = false) {
  const pattern = /tw-icon-([\w-]+)/g;
  const config = {
    svgPath: 'node_modules/momentum-abstract/icon',
    fontName: 'momentum-ui-icons-rebrand',
    fontPath: '.',
    content: ['src/**/*.{ts,scss,html}'],
    tokenRegExp: {
      help: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
      source: pattern.source,
      flags: pattern.flags
    },
    tokenPath: '.', 
  }
  
  return _dry ? config : await fs.writeFile(configFile, `module.exports = ${JSON.stringify(config, null, 2)}`, 'utf-8');
}

module.exports = {
  build,
  init
} 
