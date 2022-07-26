# momentum-constructor
constructor tools for momentum-abstract

# Icon

```
const naming = require('momentum-contructor-naming');
const path = require('path');
let packagePath = require.resolve('momentum-abstract');
naming.icon({
    input: path.resolve(packagePath, '../icon'),
    output: path.resolve(__dirname,'./output/icon'),
    replacement: {
        fileName: {
            pattern: /\-/g,
            words: '@'
        }
    }
}).rename();
```

# Color

### Export files

```
const naming = require('momentum-contructor-naming');
const path = require('path');
let packagePath = require.resolve('momentum-abstract');
naming.color({
    input: path.resolve(packagePath, '../color'),
    output: path.resolve(__dirname,'./output/color'),
    flat: true, // default false
    replacement: {
        token: {
            pattern: /\-/g,
            words: '@'
        },
        fileName: {
            pattern: /c/g,
            words: 'a'
        }
    }
}).save();
```

### Get Json

```
const naming = require('momentum-contructor-naming');
const path = require('path');
let packagePath = require.resolve('momentum-abstract');
let files = naming.color({
    input: path.resolve(packagePath, '../color'),
    output: path.resolve(__dirname,'./output/color'),
    flat: true, // default false
    replacement: {
        token: {
            pattern: /\-/g,
            words: '@'
        },
        fileName: {
            pattern: /c/g,
            words: 'a'
        }
    }
}).convert();

Object.values(files).forEach((file)=>{
    /*
        your code
        file.content
        file.path
    */
});

```