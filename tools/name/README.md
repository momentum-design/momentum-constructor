# momentum-constructor-name

momentum-constructor-name is a tool to format momentum-abstract's token name or file name.

## Install

```npm i momentum-constructor-name```

## Usage

```
const convertors = require('momentum-constructor-name');
const path = require('path');
let packagePath = require.resolve('momentum-abstract');
let files = convertors.color({
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

## Convertors

You can use ```convertors[type]()``` to create the instance to start work.

+ usage

```
const convertors = require('momentum-constructor-name');
const path = require('path');
let packagePath = require.resolve('momentum-abstract');
myConvertor = convertors.color({
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
});
```

### Types

|  type        | file name  | token name |
| :----------- | :--------: | :--------: |
| icon         |      ✓     |      ✗     |
| illustration |      ✓     |      ✗     |
| color        |      ✓     |      ✓     |

### Options

+ IOption

|  prop        | type        | description                    |
| :----------- | :---------: | :----------------------------: |
| input        | string      |  the source file directory     |
| output       | string      |  the output directory          |
| flat         | boolean     |  if remove extra layer in json |
| replacement  | ojbect      |  the rules of replacement      |

+ replacement

|  prop        | type         | description        |
| :----------- | :---------:  | :----------------: |
| token        | IReplacement | rule for token     |
| fileName     | IReplacement | rule for file name |

+ IReplacementItem

|  prop        | type              | description             |
| :----------- | :--------------:  | :---------------------: |
| pattern      | string | RegExp   | Define what is replaced |
| words        | string | function | Define new words        |

## method

### convert

This method will return a json object. The key of return object is file path while the value is file content. And this method will update the property 'files' of the instance.

+ usage

```
myConvertor.convert();

Object.values(myConvertor.files).forEach((file)=>{
    /*
        your code
        file.content
        file.path
    */
});
```

### rename

Rename all the files under input foldirectoryder and save them into output directory. This method will not change the token name.

+ usage

```
myConvertor.rename();
```

### save

Rename all the files under input directory and save them into output directory. This method will change the token name.

+ usage

```
myConvertor.save();
```

### clean

Clear the output directory. If the directory does not exist, create one.

+ usage

```
myConvertor.clean();
```