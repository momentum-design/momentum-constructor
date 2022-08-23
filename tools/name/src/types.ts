import { MomentumAbstractType, IFile } from 'momentum-constructor-common';

export interface IReplacement {
    token: IReplacementItem;
    fileName: IReplacementItem;
};

export interface IReplacementItem {
    pattern: string | RegExp;
    words: string | any;
};

export interface IOptions {
    type: MomentumAbstractType;
    output?:string;
    replacement?:  IReplacement;
    flat?:boolean;
}
