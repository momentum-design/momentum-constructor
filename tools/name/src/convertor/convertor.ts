
import { IOptions, IReplacementItem } from '../types';
import { reader, IFile } from 'momentum-constructor-common';
const fs = require('fs');
const path = require('path');
const write = require('write');
const regIsFoldPath = new RegExp(path.sep + '$');
const regIsConvertFile = /^.json$/i;

export class Convertor {

    options:IOptions;
    folderPath: string;
    files: Record<string, IFile>;
    fileFilter:RegExp;
    isCustomPath:boolean = false;

    constructor (options:IOptions) {
        this.options = options;
        this.fileFilter =  /.(svg|json|js)$/i; // default
        this.files = {};
        this.folderPath = reader.path(this.options.type);
        if(this.options.output && !regIsFoldPath.test(this.options.output)) {
            this.options.output += path.sep;
        }
    }

    clean() {
        fs.mkdirSync(this.options.output, {
            recursive: true,
            force: true
        });
    }

    //need override
    isEndNode(item):boolean {
        return !Array.isArray(item) && !this.isOjbect(item);
    }

    flat(json:any):Record<string,any> {
        const ret = {};
        this._flat(ret, json);
        return  ret;
    }

    convert() {
        this.files = {};
        const files = reader.files(this.options.type, {
            whitelist: [this.fileFilter]
        });
        Object.values(files).forEach((file)=>{
            if(regIsConvertFile.test(file.extensionName) && this.isOjbect(file.content)) {
                let newJson = this.options.flat ? this.flat(file.content): file.content;
                this.renameTokenKeys(newJson);
                file.content = newJson;
            }
            const newName = this.replace(file.fullName, this.options.replacement?.fileName);
            const ext = path.extname(newName);
            this.files[newName] = Object.assign(file, {
                path: path.join(this.options.output, newName),
                name: path.basename(newName, ext),
                fullName: newName,
                extensionName: ext
            });
        });
        return this.files;
    }

    rename() {
        if(this.options.output) {
            if(!fs.existsSync(this.options.output)) {
                this.clean();
            }
            reader.list(this.options.type, {
                whitelist: [this.fileFilter]
            }).forEach((fileName)=>{
                fs.copyFileSync(
                    path.join(this.folderPath, fileName),
                    path.join(this.options.output, fileName)
                );
                fs.renameSync(
                    path.join(this.options.output, fileName),
                    path.join(this.options.output, this.replace(fileName, this.options.replacement?.fileName))
                );
            });
        }
    }

    save() {
        if(this.options.output) {
            if(Object.keys(this.files).length===0) {
                this.convert();
            }
            Object.values(this.files).forEach((file)=>{
                write.sync(file.path, JSON.stringify(file.content,null,'\t'), { overwrite: true });
            });
        }
    }

    protected renameTokenKeys(json:any) {
        Object.keys(json).forEach((key)=>{
            const newKey = this.replace(key, this.options.replacement?.token);
            if(newKey!==key) {
                json[newKey] = JSON.parse(JSON.stringify(json[key]));
                delete json[key];
            }
            if(!this.isEndNode(json[newKey]) && json[newKey]) {
                this.renameTokenKeys(json[newKey]);
            }
        });
    }

    protected _flat(ret:Record<string,any>, json:any) {
        Object.keys(json).forEach((key)=>{
            if(this.isEndNode(json[key])) {
                ret[key] = json[key];
            } else if(json[key]){
                this._flat(ret, json[key]);
            }
        });
    }

    protected replace(name:string, replacement: IReplacementItem):string {
        if(replacement) {
            return name.replace(replacement.pattern, replacement.words);
        }
        return name;
    }

    private isOjbect(obj:any) {
        return Object. prototype. toString. call(obj) === '[Object Object]';
    }

}