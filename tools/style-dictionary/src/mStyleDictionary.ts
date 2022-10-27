import { MomentumAbstractType, mfs, mconvert } from 'momentum-constructor-common';
import { mStyleDictionaryConfig } from './types';

class MStyleDictionary {

    regObject = /^\[Object Object\]$/i;

    _isOjbect(obj:any) {
        return this.regObject.test(Object.prototype.toString.call(obj));
    }

    _checkColor(root:any) {
        Object.keys(root).forEach((key)=>{
            const node = root[key];
            if(typeof node.hex === 'string' && node.rgba!==undefined) {
                root[key] = {
                    value: node
                }
            } else if (typeof node.colors !==undefined && node.type!==undefined) {
                root[key] = {
                    value: node.colors
                }
            } else if(this._isOjbect(node)) {
                root[key] = this._checkColor(node);
            }            
        });
        return root;
    }

    _checkFont(root:any) {
        Object.keys(root).forEach((key)=>{
            const node = root[key];
            if(typeof node.fontSize === 'number' && typeof node.lineHeight==='number') {
                root[key] = {
                    value: node
                }
            } else if(this._isOjbect(node)) {
                root[key] = this._checkFont(node);
            }            
        });
        return root;
    }

    updateContent(content: any, type:MomentumAbstractType):any {
        switch(type) {
            case MomentumAbstractType.color:
                return this._checkColor(content);
            case MomentumAbstractType.font:
                return this._checkFont(content);
            default:
                return content;
        }
    }

    build(configs: mStyleDictionaryConfig[]) {
        configs.forEach((config:mStyleDictionaryConfig)=>{
            let source = mfs.read(config.type, config.filter);
            if(config.type === MomentumAbstractType.color) {
                source = mconvert.flat(source, MomentumAbstractType.color);
            }
            if(config.replacement) {
                source = mconvert.renameToken(source, config.replacement, config.type);
            }
            Object.keys(source).forEach((key)=>{
                source[key].content = this.updateContent(source[key].content, config.type);
            });
            mfs.saveFiles(source, config.output);
        });
    }

}

export const mStyleDictionary = new MStyleDictionary();
