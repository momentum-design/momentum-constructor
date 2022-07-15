import { IOptions } from '../types';
import { Convertor } from './convertor';
const mkdirp = require('mkdirp');
const path = require('path');

export class Icon extends Convertor{

    constructor (options:IOptions) {
        super(options);
    }
    
    convert() {
        mkdirp.sync(this.options.output);
        this.list().filter((fileName)=>{
            return /.svg$/i.test(fileName);
        }).forEach((word)=>{
            this.rename(
                path.join(this.options.input, word),
                path.join(this.options.output, this.replace(word))
            );
        });
    }

}