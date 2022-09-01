# momentum-constructor-common

momentum-constructor-common is a tool to offer common modules for momentum-constructor-packages.

## Install

```npm i momentum-constructor-common```

## Usage

You can go to ```./test``` to check the detail usage.

# mfs

```mfs``` is a file system mode in momentum-constructor-common.

```
import { mfs } from 'momentum-constructor-common';
```

or

```
const { mfs } = require('momentum-constructor-common');
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
const pathString = mfs.path(MomentumAbstractType.color);
```

+ read momentum-abstract/icon path

```
const pathString = mfs.path(MomentumAbstractType.icon);
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
const files = mfs.list(MomentumAbstractType.color);
```

+ read momentum-abstract/color list with filter

```
let files = mfs.list(MomentumAbstractType.color, {
    whitelist: [/.json$/i]
});
```

## read

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
let files = mfs.read(MomentumAbstractType.color);
```

# mcommon

```mcommon``` is a common mode in momentum-constructor-common.

```
import { mcommon } from 'momentum-constructor-common';
```

or

```
const { mcommon } = require('momentum-constructor-common');
```

## getRegFromNames

Create a regular expression using an array of filenames.

### arguments

|  name        | type                 | description                    |
| :----------- | :------------------: | :----------------------------  |
| fileNameList | string[]             | The list of file name          |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| RegExp               | RegExp for filter              |

## getRegFromNamesSafe

getRegFromNamesSafe has the same arguments and return with getRegFromNames. RegExp has a max-length limitation, we do some check in this function.

# mconvert

```mconvert``` offers the feature to convert momentum files'name and content.

```
import { mconvert } from 'momentum-constructor-common';
```

or

```
const { mconvert } = require('momentum-constructor-common');
```

## renameFile

rename all the files

### arguments

|  name         | type                 | description                    |
| :------------ | :------------------: | :----------------------------  |
| mometnumFiles | Record<string, IFile>| the file from mfs.read         |
| replacement   | IReplacementItem     | replacement                    |

### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| Record<string, IFile>| RegExp for filter              |

## renameToken

rename the token in the content

### arguments

|  name         | type                 | description                    |
| :------------ | :------------------: | :----------------------------  |
| mometnumFiles | Record<string, IFile>| the file from mfs.read         |
| replacement   | IReplacementItem     | replacement                    |
| momentumType  | MomentumAbstractType | The data type                  |
### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| Record<string, IFile>| RegExp for filter              |

## flat

flat the content

### arguments

|  name         | type                 | description                    |
| :------------ | :------------------: | :----------------------------  |
| mometnumFiles | Record<string, IFile>| the file from mfs.read         |
| momentumType  | MomentumAbstractType | The data type                  |
### return

| type                 | description                    |
| :------------------: | :----------------------------  |
| Record<string, IFile>| RegExp for filter              |



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
| sonic        |  sound effect                  |


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

### IReplacementItem

|  prop        | type            | description        |
| :----------- | :------------:  | :----------------  |
| pattern      | string | RegExp | which part you want to replace |
| words        | string | any    | the new wording |
