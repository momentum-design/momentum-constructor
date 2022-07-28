export interface IReplacement {
    token: IReplacementItem;
    fileName: IReplacementItem;
};

export interface IReplacementItem {
    pattern: string | RegExp;
    words: string | any;
};

export interface IOptions {
    input: string;
    output:string;
    replacement?:  IReplacement;
    flat?:boolean;
}

export interface IFile {
    path: string;
    content: any;
}
