import { threadId } from 'worker_threads';
import { IPackageItem } from './type';

const PACKAGE_FOLDER = 'tools'
const https = require('https');
const path = require('path');
const fs = require('fs');
const path_packages = path.resolve(__dirname,`../${PACKAGE_FOLDER}`);
const write = require('write');
const { exec } = require('child_process');

class PackagesFactory {

    packageItems:IPackageItem[];

    constructor() {
        this.init();
    }

    private init() {
        this.packageItems=[];
        const list =fs.readdirSync(path_packages);
        list.forEach((folder)=>{
            const packagePath = path.join(path_packages, folder, 'package.json');
            if(fs.existsSync(packagePath)) {
                const _package = require(packagePath);
                this.packageItems.push({
                    name: _package.name,
                    folder: path.join(PACKAGE_FOLDER, folder,'/'),
                    localVersion:_package.version,
                    filePath: packagePath,
                    fileContent: _package
                });
            }
        });
    }

    async build() {
        await this.buildPackage();
    }

    private getDiffList(): Promise<any> {
        return new Promise((resolve, reject)=>{
            exec('git diff --name-only HEAD~ HEAD', (err, stdout, stderr) => {
                let files = stdout ? stdout.split('\n'): null;
                if(files && files.length>0) {
                    files.forEach((file)=>{
                        this.packageItems.forEach((pkg)=>{
                            if(file.indexOf(pkg.folder)!==-1) {
                                pkg.hasDiff = true;
                            }
                        });
                    });
                }
                resolve(1);
            });
        });
    }

    private buildPackage(): Promise<any> {
        return new Promise((resolve, reject)=>{
            let todo = this.packageItems.length;
            const _callback = ()=>{
                todo--;
                if(todo<=0) {
                    resolve(1);
                }
            };
            this.packageItems.forEach((_package)=>{
                console.log(`building ${ _package.name}`);
                if(_package.fileContent.scripts && _package.fileContent.scripts.build) {
                    exec(`cd ${ path.relative(process.cwd(), path.dirname(_package.filePath)) } && npm run build`, (err, stdout, stderr) => {
                        _callback();
                    });
                } else {
                    _callback();
                }
            });
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
            this.getDiffList().then(()=>{
                this.packageItems.forEach((_package)=>{
                    if(_package.hasDiff) {
                        console.log(`check ${_package.name} verison...`);
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
                    } else {
                        _callback();
                    }
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
