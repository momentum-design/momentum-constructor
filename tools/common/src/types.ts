export enum MomentumAbstractType {
    color = 'color',
    font = 'font',
    illustration = 'illustration',
    icon = 'icon',
    'icon-colored' = 'icon-colored',
    'icon-brand' = 'icon-brand',
    sonic = 'sonic'
}

export interface IFile {
    path: string;
    content: any;
    contentCode?: string;
    name: string;
    fullName: string;
    extensionName: string;
}

export interface IFileFilter {
    whitelist?: RegExp[],
    blacklist?: RegExp[],
}