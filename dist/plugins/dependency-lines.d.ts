import { Vido } from '../gstc';
export interface Options {
    type?: 'straight';
    propertyName?: string;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
