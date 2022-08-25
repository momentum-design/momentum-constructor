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

    isRightFile(fileName:string, filter?:IFileFilter):boolean {
        if(filter) {
            let isNotInBlackList = !filter.blacklist || this.isNotInList(fileName, filter.blacklist);
            let isInWhitelist = !filter.whitelist || this.isInList(fileName, filter.whitelist);
            return isNotInBlackList && isInWhitelist;
        }
        return true;
    }

    scanFile(parent:string, root:string, data:Record<string, string>, filter?:IFileFilter) {
        if(fs.existsSync(parent)) {
            const list = fs.readdirSync(parent);
            list.forEach((fileName)=>{
                const _path = path.join(parent, fileName);
                const stat = fs.lstatSync(_path);
                const _shortPath = path.relative(root, _path);
                if(stat.isDirectory()) {
                    this.scanFile(_path, root, data, filter);
                } else if(stat.isFile() && this.isRightFile(_shortPath, filter)) {
                    data[_shortPath] = fileName;
                }
            });
        }
    }

    list(momentumType:MomentumAbstractType, filter?:IFileFilter):string[] {
        const folder = this.path(momentumType);
        const data = {};
        this.scanFile(folder, folder, data, filter);
        return Object.keys(data);
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