import { IPackageItem } from './type';

const https = require('https');
const path = require('path');
const fs = require('fs');
const path_packages = path.resolve(__dirname,'../tools');
const write = require('write');

class PackagesFactory {

    packageItems:IPackageItem[];

    constructor() {
        this.init();
    }

    private init() {
        this.packageItems=[];
        const list =fs.readdirSync(path_packages);
        list.forEach((folder)=>{
            const packagePath = path.join(folder, 'package.json');
            if(fs.existsSync(packagePath)) {
                const _package = require(packagePath);
                this.packageItems.push({
                    name: _package.name,
                    localVersion:_package.version,
                    filePath: packagePath,
                    fileContent: _package
                });
            }
        });
    }

    async update() {
        await this.updateVersion();
    }

    private updateVersion():Promise<any> {
        return new Promise<any>((resolve, reject)=>{
            let todo = this.packageItems.length;
            const _callback = ()=>{
                todo--;
                if(todo<=0) {
                    resolve(1);
                }
            };
            this.packageItems.forEach((_package)=>{
                this.getOnlineVersion(_package.name)
                .then((data)=>{
                    const online = JSON.parse(data); 
                    if(online && online.latest) {
                        _package.onlineVersion = online.latest;
                        const nextOnlineVersion =  this.nextVersion(_package.onlineVersion);
                        if(this.ifUpdateLocalVersion(_package.onlineVersion, nextOnlineVersion)) {
                            _package.localVersion =  _package.fileContent.version = nextOnlineVersion;
                            write.sync(_package.filePath, JSON.stringify(_package.fileContent, null, '\t'), { overwrite: true });
                        }   
                    }
                })
                .finally(()=>{
                    _callback();
                });
            });
        });
    }

    private ifUpdateLocalVersion(localVersion:string, nextOnlineVersion:string):boolean {
        const _local = localVersion.split('.');
        const _online = nextOnlineVersion.split('.');
        if(_local.length!==_online.length || localVersion === nextOnlineVersion) {
            return false;
        } else {
            for(let i=0;i<_online.length;i++) {
                // do not update
                if(+_local[i] > +_online[i]) {
                    return false;
                }
            }
            return true;
        }
    }

    private getOnlineVersion(package_name):Promise<any> {
        return new Promise((resolve, reject)=>{
            https.get(`https://registry.npmjs.org/-/package/${ package_name }/dist-tags`, (res) => {
                console.log('statusCode:', res.statusCode);
                res.on('data', (d) => {
                    resolve(d);
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    }

    private nextVersion(version: string, addIndex:number=2):string {
        const arr:any[] = version.split('.');
        if(arr.length>2) {
            arr[addIndex] = parseInt(arr[addIndex])+1;
            for(let i=+addIndex+1;i<arr.length;i++) {
                arr[i] = 0;
            }
        }
        return arr.join('.');
    }

}

export const Packages = new PackagesFactory();
