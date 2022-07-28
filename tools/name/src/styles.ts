import { IReplacementItem } from './types';

export const styles: Record<string, IReplacementItem> = {
    dash: {
        pattern: /\_/g,
        words: '-'
    }
}
