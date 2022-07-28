import { Icon, Color } from './convertor';
import { IOptions } from './types';

class Convertors {

    icon(options:IOptions) {
        return new Icon(options);
    }

    color(options:IOptions) {
        return new Color(options);
    }

    illustration(options:IOptions) {
        return new Icon(options);
    }

};
export const convertors = new Convertors();