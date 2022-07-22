import { Icon, Color } from './convertor';
import { IOptions } from './types';

class Name {

    icon(options:IOptions) {
        return new Icon(options);
    }

    color(options:IOptions) {
        return new Color(options);
    }

};
export const naming = new Name();