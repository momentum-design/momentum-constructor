import { IPackageItem } from './type';
import { getProcessArgs } from './args';
import { Webex } from './webex';
import { Packages } from './packages';

const npmPublish = require("@jsdevtools/npm-publish");
const processArgs = getProcessArgs();

async function publish(packageItem: IPackageItem) {
    if(processArgs.tokenNpm) {
        //const myPackage = require(packageItem.filePath);
        console.log(`Trying to publish ${packageItem.name}`);
        const result = await npmPublish({
            token: processArgs.tokenNpm,
            package: packageItem.filePath,
            checkVersion: true
        });
        if(result.type !=='none' && result.type !=='lower') {
            const webex = new Webex(processArgs);
            webex.message(`${ packageItem.name } published a new version ${ packageItem.localVersion }.\nhttps://www.npmjs.com/package/${ packageItem.name }`);
        } else {
            console.log(`${ packageItem.name } has no new version!`);
        }
    }
};

Packages.packageItems.forEach((packageItem)=>{
    publish(packageItem);
});

