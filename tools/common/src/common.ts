import { IFileFilter } from "./types";
import { Blob } from "buffer";

class Common {

    MAX_REG_LENGTH = 250 * 256;

    getRegFromNames(fileNameList:string[]): RegExp[] {
        return [new RegExp(`^(${fileNameList.join(')|(')})$`)];
    }

    getRegFromNamesSafe(fileNameList:string[]): RegExp[] {
        const size = new Blob(fileNameList).size;
        if(size>=this.MAX_REG_LENGTH && fileNameList.length>1) {
            const mid = Math.ceil(fileNameList.length/2);
            return this.getRegFromNamesSafe(fileNameList.slice(0,mid))
            .concat(this.getRegFromNamesSafe(fileNameList.slice(mid)));
        } else {
            return this.getRegFromNames(fileNameList);
        }
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

    isFilted(fileName:string, filter?:IFileFilter):boolean {
        if(filter) {
            let isNotInBlackList = !filter.blacklist || this.isNotInList(fileName, filter.blacklist);
            let isInWhitelist = !filter.whitelist || this.isInList(fileName, filter.whitelist);
            return isNotInBlackList && isInWhitelist;
        }
        return true;
    }

}

export const mcommon = new Common();