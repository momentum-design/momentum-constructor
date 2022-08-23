# momentum-constructor-common

momentum-constructor-common is a tool to offer common modules for momentum-constructor-packages.

## Install

```npm i momentum-constructor-common```

## Usage

You can go to ```./test``` to check the detail usage.

# reader

```
import { reader } from 'momentum-constructor-common';
```

or

```
const { reader } = require('momentum-constructor-common');
```

## path

Get the full path of where you installed momentum-abstract.

### arguments

|  name        | type                 | description                    |
| :----------- | :------------------: | :----------------------------  |
| momentumType | MomentumAbstractType | The data type                  |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| string               | the folder path                |

### usage

+ read momentum-abstract/color path

```
const pathString = reader.path(MomentumAbstractType.color);
```

+ read momentum-abstract/icon path

```
const pathString = reader.path(MomentumAbstractType.icon);
```

## list

Get a file name list from momentum-abstract.

### arguments

|  name        | type                 | description                    |
| :----------- | :------------------: | :----------------------------  |
| momentumType | MomentumAbstractType | The data type                  |
| filter       | IFileFilter          | blacklist and whitelist        |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| string[]             | file name list                 |

### usage

+ read momentum-abstract/color list

```
const files = reader.list(MomentumAbstractType.color);
```

+ read momentum-abstract/color list with filter

```
const coreReg = reader.getRegFromNames(['core.json']);
const themeReg = reader.getRegFromNames(['theme.json']);
let files = reader.list(MomentumAbstractType.color, {
    blacklist: [coreReg, themeReg],
    whitelist: [/.json$/i]
});
```

## files

Get a list of files from momentum-abstract.

### arguments

|  name        | type                 | description                    |
| :----------- | :------------------: | :----------------------------  |
| momentumType | MomentumAbstractType | The data type                  |
| filter       | IFileFilter          | blacklist and whitelist        |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| Record<string, IFile>| Hash Object for files          |

### usage

+ read momentum-abstract/color json files

```
let files = reader.files(MomentumAbstractType.color);
```

## getRegFromNames

Create a regular expression using an array of filenames.

### arguments

|  name        | type                 | description                    |
| :----------- | :------------------: | :----------------------------  |
| fileNameList | string[]             | The list of file nam           |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| RegExp               | RegExp for filter              |

# Types

```
import { MomentumAbstractType } from 'momentum-constructor-common';
```

or

```
const { MomentumAbstractType } = require('momentum-constructor-common');
```

## Enum

### MomentumAbstractType ( * for reserved name, not use)

|  name        | description                    |
| :----------- | :----------------------------  |
| color        |  color tokens                  |
| font         |  font tokens                   |
| illustration |  illustration icons            |
| icon         |  normal icons                  |
| icon-colored |  colored icons                 |
| icon-brand   |  brand icons                   |
| audio (*)    |  sound effect                  |


## Interface & Type

### IFile

|  prop        | type        | description                    |
| :----------- | :---------: | :----------------------------  |
| path         | string      |  the full file path            |
| content      | any         |  file content                  |
| contentCode  | ?string     |  code type                     |
| name         | string      |  file name without extension   |
| fullName     | string      |  file name with extension      |
| extensionName| string      |  extension such as '.svg'      |

+ rule for reading content

|  file type   | content type  |
| :----------- | :-----------: |
| .svg         | string        |
| .json        | json ojbect   |
| default      | buffer[]      |

### IFileFilter

|  prop        | type         | description        |
| :----------- | :---------:  | :----------------  |
| whitelist    | RegExp[]     | only return files whose filename matches the condition           |
| blacklist    | RegExp[]     | only return files whose filename does not match the condition    |
