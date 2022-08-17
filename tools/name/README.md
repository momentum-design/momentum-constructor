# momentum-constructor-name

momentum-constructor-name is a tool to format momentum-abstract's token name or file name.

## [Release Nots](./ReleaseNote.md)

## Install

```npm i momentum-constructor-name```

## Usage

### import

```
    const { Convertor } = require('momentum-constructor-name');
```

or

```
    import { Convertor } from 'momentum-constructor-name';
```


## Convertors

You can use ```Convertor``` to create the instance to start work.

+ usage

```
const { Convertor } = require('momentum-constructor-name');
const path = require('path');
myConvertor = new Convertor({
    type: 'color',
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

### Options

+ IOption

|  prop        | type                    | description                    |
| :----------- | :---------------------: | :---------------------------- |
| type          | MomentumAbstractType   |  Check in [momentum-constructor-common](https://github.com/momentum-design/momentum-constructor/tree/main/tools/common#enum)    |
| output       | string                  |  the output directory          |
| flat         | boolean                 |  if remove extra layer in json |
| replacement  | ojbect                  |  the rules of replacement      |

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

Rename all the files and save them into output directory. This method will not change the token name.

+ usage

```
myConvertor.rename();
```

### save

Rename all the files and save them into output directory. This method will change the token name.

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
