import { IOptions } from '../types';
import { Convertor } from './convertor';
const path = require('path');

export class Color extends Convertor{

    constructor (options:IOptions) {
        super(options);
    }

    isEndNode(item):boolean {
        return (typeof item.hex === 'string' && item.rgba!==undefined)
        || (item.colors !==undefined && item.type!==undefined);
    }

    convert() {
        this.list().filter((fileName)=>{
            return /.json$/i.test(fileName);
        }).forEach((fileName)=>{
            const json = this.readJson(path.join(this.options.input, fileName));
            let newJson = this.options.flat ?  this.flat(json, this.isEndNode): json;
            this.loopName(newJson, this.isEndNode);
            this.save(path.join(this.options.output, fileName), JSON.stringify(newJson,null,'\t'));
        });
    }
}
