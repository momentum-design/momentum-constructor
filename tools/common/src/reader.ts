import { MomentumAbstractType, IFile, IFileFilter } from './types';
const path = require('path');
const fs = require('fs');
const momentum_path = path.dirname(require.resolve('momentum-abstract'));

class Reader {

    getRegFromNames(fileNameList:string[]) {
        return new RegExp(`^(${fileNameList.join(')|(')})$`)
    }

    isInList(name:string, whiteList:RegExp[]) {
        return whiteList.some((reg)=>{
            return reg.test(name);
        });
    }

    isNotInList(name:string, blackList:RegExp[]) {
        return blackList.every((reg)=>{
            return !reg.test(name);
        });
    }

    path(momentumType:MomentumAbstractType) {
        return path.resolve(momentum_path, momentumType.toString());
    }

    list(momentumType:MomentumAbstractType, filter?:IFileFilter):string[] {
        const folder = this.path(momentumType);
        let fileNameList=[];
        if(fs.existsSync(folder)) {
            fileNameList = fs.readdirSync(folder);
        }
        if(filter) {
            if(filter.blacklist) {
                fileNameList = fileNameList.filter((name) => {
                    return this.isNotInList(name, filter.blacklist);
                });
            }
            if(filter.whitelist) {
                fileNameList = fileNameList.filter((name) => {
                    return this.isInList(name, filter.whitelist);
                });
            }
        }
        return fileNameList;
    }

    files(momentumType:MomentumAbstractType, filter?:IFileFilter): Record<string, IFile> {
        const files = {};
        const folder = this.path(momentumType);
        const list = this.list(momentumType, filter);
        list.forEach((fileName)=>{
            const filePath = path.join(folder, fileName);
            const ext = path.extname(fileName);
            files[fileName] = {
                path: filePath,
                content: this.convetContent(fs.readFileSync(filePath), ext),
                name: path.basename(fileName, ext),
                fullName: fileName,
                extensionName: ext
            }
        });
        return files;
    }

    convetContent(content:any, ext:string) {
        switch(ext.toLocaleLowerCase()) {
            case '.svg':
                return content.toString();
            case '.json':
                return JSON.parse(content);
            default:
                return content;
        }
    }

}
export const reader = new Reader();