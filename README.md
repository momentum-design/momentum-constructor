# momentum-constructor

We published momentum-abstract to offer the data from Momentum Design. In order to use momentum-abstract to build your own application, you need build Momentum Desgin data to the files you can use.

momentum-constructor contains building tools for momentum-abstract.

## Tools

All the momentum-constructor package is under ```./tools```. 

+ All tools need to be available in sustainable integration tools

+ Input and output should be configable.

### [momentum-constructor-common](./tools/common/README.md)

Common modules, including reading momentum-abstract files and momentum-abstract types.

### [momentum-constructor-name](./tools/name/README.md)

A tool to rename files or json node.

### [momentum-constructor-svgsymbol](./tools/svgsymbol/README.md)

A tool to build icons into svg symbol.

## Contribute

1. Folk momentum-constructor, edit the repo in your own repo and then send pull request. Please rebase commits before sending PR.

2. We assume your new package name is ```momentum-constructor-new```, create folder named ```new``` under ```./tools```.

3. Add publishConfig in your ```package.json```.

```
	"publishConfig": {
		"access": "public"
	}
```

4. We use jest for unit test.

5. Do not forget to add document and put your README.md 's link here.

## Version control

1. If we find any updates under your package folder, we will try to get the next version of your package from NPM server and update the version in ```package.json```.

2. If you do not want to use update the version number, you can add ```[skip ci]```  as a part of the commit title. Be careful to use this feature, it will skip all the CI.

3. We run a job twice a day to check our packages under ```./tools```. If the version number is greater than npm server's version, we will run npm publish.

## commit

The title should be like ```feat(add): detail update```

### commit types

+ feat
+ doc
+ test
+ fix
