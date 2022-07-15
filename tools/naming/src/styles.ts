import { IReplacement } from './types';

export const styles: Record<string, IReplacement> = {
    dash: {
        pattern: /\_/g,
        words: '-'
    }
}