import { MomentumAbstractType, IReplacementItem, IFileFilter } from 'momentum-constructor-common';

export interface IStyleDictionaryEndNode {
    value: any
}

export interface mStyleDictionaryConfig {
    output: string;
    type: MomentumAbstractType,
    replacement?: IReplacementItem,
    filter?: IFileFilter
}