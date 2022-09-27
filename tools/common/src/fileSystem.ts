import { MomentumAbstractType, IFile, IFileFilter } from './types';
import { mcommon } from './common';

const path = require('path');
const fs = require('fs');
const momentum_path = path.dirname(require.resolve('momentum-abstract'));

class MomentumFileSystem {

    private scan(folder:string, root:string, filter?:IFileFilter):Record<string, string> {
        let data = {};
        if(fs.existsSync(folder)) {
            const list = fs.readdirSync(folder);
            list.forEach((fileName)=>{
                const _path = path.join(folder, fileName);
                const stat = fs.lstatSync(_path);
                const _shortPath = path.relative(root, _path);
                if(stat.isDirectory()) {
                    Object.assign(data, this.scan(_path, root, filter));
                } else if(stat.isFile() && mcommon.isFilted(_shortPath, filter)) {
                    data[_shortPath] = _path;
                }
            });
        }
        return data;
    }

    path(momentumType:MomentumAbstractType):string {
        return path.resolve(momentum_path, momentumType.toString());
    }

    list(momentumType:MomentumAbstractType, filter?:IFileFilter):string[] {
        const folder = this.path(momentumType);
        return Object.keys(this.scan(folder, folder, filter));
    }

    read(momentumType:MomentumAbstractType, filter?:IFileFilter): Record<string, IFile> {
        const files = {};
        const folder = this.path(momentumType);
        const data = this.scan(folder, folder, filter);
        Object.keys(data).forEach((fileName)=>{
            const ext = path.extname(fileName);
            files[fileName] = {
                path: data[fileName],
                dir: path.dirname(data[fileName]),
                name: path.basename(fileName, ext),
                fullName: fileName,
                extensionName: ext,
                content: this.convetContent(fs.readFileSync(data[fileName]), ext)
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

    reconvetContent(content:any, ext:string) {
        console.log(ext);
        switch(ext.toLocaleLowerCase()) {
            case '.json':
                return JSON.stringify(content, null, '\t');
            default:
                return content;
        }
    }

    clean(dest:string) {
        fs.mkdirSync(dest, {
            recursive: true,
            force: true
        });
    }

    save(dest:string, momentumType:MomentumAbstractType, filter?:IFileFilter) {
        const folder = this.path(momentumType);
        const data = this.scan(folder, folder, filter);

        Object.keys(data).forEach((fileName)=>{
            const _destPath = path.join(dest, fileName);
            const _dir = path.dirname(_destPath);
            if(!fs.existsSync(_dir)){
                this.clean(_dir);
            }
            fs.copyFileSync(data[fileName],_destPath);
        });
    }

    saveFiles(files: Record<string, IFile>, dest?:string) {
        if(dest) {
            Object.values(files).forEach((file:IFile)=>{
                if(!fs.existsSync(dest)){
                    this.clean(dest);
                }
                fs.writeFileSync(path.join(dest, file.fullName), this.reconvetContent(file.content, file.extensionName));
            });
        } else {
            Object.values(files).forEach((file:IFile)=>{
                if(!fs.existsSync(file.dir)){
                    this.clean(file.dir);
                }
                fs.writeFileSync(file.path, this.reconvetContent(file.content, file.extensionName));
            });
        }
    }

}
export const mfs = new MomentumFileSystem();