/*
const naming = require('@momentum-contractor/naming');
naming.color({
    input: '',
    output: '',
    replacement:[//,''],
    style:'',
    flat:true
});
*/

import { Icon, Color } from './convertor';
import { IOptions } from './types';

class Name {

    icon(options:IOptions) {
        new Icon(options).convert();
    }

    color(options:IOptions) {
        new Color(options).convert();
    }

};
export const naming = new Name();