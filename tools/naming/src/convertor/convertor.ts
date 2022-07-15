import { IOptions } from '../types';
import { styles } from '../styles';
const fs = require('fs');
const path = require('path');
const write = require('write');

export class Convertor {

    options:IOptions;

    constructor (options:IOptions) {
        this.options = options;
    }

    protected list():any[] {
        if(fs.existsSync(this.options.input)) {
            return fs.readdirSync(this.options.input);
        }
        return [];
    }

    protected makeDir(p:string) {
        const _s = path.sep || '/';
        const arr = p.split(_s);
        //let _path = arr[]

    }

    protected rename(oldPath, newPath) {
        fs.renameSync(oldPath, newPath);
    }

    protected save(path:string, content:string) {
        write.sync(path, content, { overwrite: true });
    }

    protected loopName(json:any,eot:(item:any)=>boolean) {
        Object.keys(json).forEach((key)=>{
            const newKey = this.replace(key);
            if(newKey!==key) {
                json[newKey] = JSON.parse(JSON.stringify(json[key]));
                delete json[key];
            }
            if(!eot(json[newKey]) && json[newKey]) {
                this.loopName(json[newKey], eot);
            }
        });
    }

    private _flat(ret:Record<string,any>, json:any,eot:(item:any)=>boolean) {
        Object.keys(json).forEach((key)=>{
            if(eot(json[key])) {
                ret[key] = json[key];
            } else if(json[key]){
                this._flat(ret, json[key], eot);
            }
        });
    }

    protected flat(json:any, eot:(item:any)=>boolean):Record<string,any> {
        const ret = {};
        this._flat(ret, json, eot);
        return  ret;
    }

    protected replace(name:string):string {
        if(this.options.replacement) {
            return name.replace(this.options.replacement.pattern, this.options.replacement.words);
        }
        const _styleName = this.options.style;
        if(_styleName && styles[_styleName]) {
            return name.replace(styles[_styleName].pattern, styles[_styleName].words);
        }
        return name;
    }

    protected readJson(path:string):any {
        return JSON.parse(fs.readFileSync(path));
    }

    convert() {}

}