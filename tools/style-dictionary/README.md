# momentum-constructor-style-dictionary

momentum-constructor-style-dictionary offers the format Amazon Style Dictionary.

## Install

```npm i momentum-constructor-style-dictionary```

## Usage

```
const { MomentumAbstractType } = require('momentum-constructor-common');
const { mStyleDictionary } = require('momentum-constructor-style-dictionary');
let outPath = path.join(__dirname, './output/font');
mStyleDictionary.build([{
    type: MomentumAbstractType.font,
    output: outPath
}]);
```

