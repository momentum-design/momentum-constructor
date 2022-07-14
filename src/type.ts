export type IPackageItem = {
    name: string;
    localVersion:string;
    onlineVersion?:string;
    filePath: string;
    fileContent: any;
};

export type IActionProcessArgs = {
    token?: string;
    tokenWebex?:string;
    tokenNpm?:string;
    actor?: string;
    diffOnly?:boolean;
}

export type IProcessArgs = IActionProcessArgs | Record<string, string>;
