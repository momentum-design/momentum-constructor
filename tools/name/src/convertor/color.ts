import { IOptions } from '../types';
import { Convertor } from './convertor';
const path = require('path');

export class Color extends Convertor{

    constructor (options:IOptions) {
        super(options);
        this.fileFilter =  /.(json)$/i;
    }

    isEndNode(item):boolean {
        return (typeof item.hex === 'string' && item.rgba!==undefined)
        || (item.colors !==undefined && item.type!==undefined);
    }

    flat(json:any) {
        Object.keys(json).forEach((key)=>{
            json[key] = super.flat(json[key]);
        });
        return json;
    }
    
}
