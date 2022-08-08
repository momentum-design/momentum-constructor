# momentum-constructor-svgsymbol
Build to svgsymbol and generate index page of icons.

### Using
Run `build.js` with node to get momentum icons symbol file.
See `index.html` to found demo how to use symbol.

### Using for own icons
```Javascript
packagePath = require.resolve("momentum-abstract"),  //remove this line if you'll using your own icons.
conf = {
    svgSource: path.resolve(packagePath, "../icon"),  //change this path to your own svg folder
```
