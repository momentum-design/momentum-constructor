export interface IReplacement {
    pattern: string | RegExp;
    words: string | any;
};

export interface IOptions {
    input: string;
    output:string;
    replacement?:  IReplacement;
    style?:string;
    flat?:boolean;
}
