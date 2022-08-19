# momentum-constructor-font-icon

## Why

- A tool for building the icon webfont from svg files, with support for content based filtering; so we could easy provide full set icons for developing and build optimized bundle for production.


## Get started

- ```npm install momentum-abstract```
- ```npm install momentum-constractor-font-icon```
- ```npx momentum-constructor-font-icon -i``` to generate the default config file
- ```npx momentum-constructor-font-icon``` to build the fonts
- For production ```NODE_ENV=production npx momentum-constructor-font-icon```

## Configuration
- svgPath: The path for the svg files
- fontName: The name for the generated font file
- fontPath: The path for the font file
- content: The glob pattern to load the source files to gather the used icon tokens
- tokenRegExp the the regural expression to extract the token from the source files; it's in a special format which could be used to rebuild back the js RegExp, ```new RegExp(source, flags) ```
    - source: ```/tw-icon-([\w-]+)/g.source```
    - flags: ```/tw-icon-([\w-]+)/g.flags```
- tokenPath: The path for the generated token file

```json
  "svgPath": "node_modules/momentum-abstract/icon",
  "fontName": "momentum-ui-icons-rebrand",
  "fontPath": ".",
  "content": [
    "src/**/*.{ts,scss,html}"
  ],
  "tokenRegExp": {
    "help": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
    "source": "tw-icon-([\\w-]+)",
    "flags": "g"
  },
  "tokenPath": "."
```