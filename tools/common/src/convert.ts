import path from 'path';
import { IFile, MomentumAbstractType, IReplacementItem } from './types';

class Convert {

    regObject = /^\[Object Object\]$/i;

    private isOjbect(obj:any) {
        return this.regObject.test(Object.prototype.toString.call(obj));
    }

    private getEndCheckFunc(momentumType:MomentumAbstractType):(item:any)=>boolean {
        switch(momentumType) {
            case MomentumAbstractType.color:
                return (item)=>{
                    return (typeof item.hex === 'string' && item.rgba!==undefined) || (item.colors !==undefined && item.type!==undefined);
                }
            case MomentumAbstractType.font:
                return (item)=>{
                    return typeof item.fontSize === 'number';
                }
            default:
                return (item)=>{
                    return !Array.isArray(item) && !this.isOjbect(item);
                }
        }
    }

    renameFile(mometnumFiles: Record<string, IFile>, replacement: IReplacementItem): Record<string, IFile>  {
        const ret = {};
        Object.keys(mometnumFiles).forEach((shortPath)=>{
            const mfile:IFile = mometnumFiles[shortPath];
            const name = mfile.name.replace(replacement.pattern, replacement.words);
            const fullName = `${name}.${mfile.extensionName}`;
            const newShortPath = path.join(`${path.dirname(shortPath)}`, fullName);
            ret[newShortPath] = {
                path: path.join(mfile.dir, fullName),
                dir: mfile.dir,
                name: name,
                fullName: fullName,
                extensionName: mfile.extensionName,
                content: mometnumFiles[shortPath].content
            }
        });
        return ret;
    }

    renameToken(mometnumFiles: Record<string, IFile>, replacement: IReplacementItem, momentumType:MomentumAbstractType): Record<string, IFile>  {
        const _check = this.getEndCheckFunc(momentumType);
        Object.values(mometnumFiles).forEach((mfile)=>{
            this._renameToken(mfile.content, replacement, _check);
        });
        return mometnumFiles;
    }

    flat(mometnumFiles: Record<string, IFile>, momentumType:MomentumAbstractType): Record<string, IFile>  {
        const _check = this.getEndCheckFunc(momentumType);
        Object.values(mometnumFiles).forEach((mfile)=>{
            if(this.isOjbect(mfile.content)) {
                Object.keys(mfile.content).forEach((key)=>{
                    const _newJson = {};
                    this._flat(_newJson , mfile.content[key], _check);
                    mfile.content[key] = _newJson;
                });
            }
        });
        return mometnumFiles;
    }

    private _flat(ret:Record<string,any>, json:any, isEndNode:(item:any)=>boolean) {
        Object.keys(json).forEach((key)=>{
            if(isEndNode(json[key])) {
                ret[key] = json[key];
            } else if(json[key]){
                this._flat(ret, json[key], isEndNode);
            }
        });
    }

    private _renameToken(json:any, replacement: IReplacementItem, isEndNode:(item:any)=>boolean) {
        Object.keys(json).forEach((key)=>{
            const newKey = key.replace(replacement.pattern, replacement.words);
            if(newKey!==key) {
                json[newKey] = JSON.parse(JSON.stringify(json[key]));
                delete json[key];
            }
            if(!isEndNode(json[newKey]) && this.isOjbect(json[newKey])) {
                this._renameToken(json[newKey], replacement, isEndNode);
            }
        });
    }

};

export const mconvert = new Convert();