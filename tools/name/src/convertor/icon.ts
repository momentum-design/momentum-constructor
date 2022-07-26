import { IOptions } from '../types';
import { Convertor } from './convertor';
const path = require('path');

export class Icon extends Convertor{

    constructor (options:IOptions) {
        super(options);
        this.fileFilter = /.svg$/i;
    }

}