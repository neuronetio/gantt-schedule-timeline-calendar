import DeepState from 'deep-state-observer';
import dayjs from 'dayjs';
import type { Config, Locale, Period } from '../gstc';
import { lithtml } from '@neuronet.io/vido';
import * as vido from '@neuronet.io/vido';
export declare const mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
export declare function prepareState(userConfig: Config): {
    config: unknown;
};
export declare function stateFromConfig(userConfig: Config): DeepState;
export declare function wasmStateFromConfig(userConfig: Config, wasmFile?: string): Promise<any>;
declare function clone(object: object): unknown;
export declare const publicApi: {
    name: string;
    GSTCID: (originalId: string) => string;
    isGSTCID: (id: string) => boolean;
    sourceID: (id: string) => string;
    fromArray(array: any): Record<string, any>;
    stateFromConfig: typeof stateFromConfig;
    wasmStateFromConfig: typeof wasmStateFromConfig;
    merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
    mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
    clone: typeof clone;
    lithtml: typeof lithtml;
    html: typeof lithtml;
    vido: typeof vido;
    date(time?: any, utcMode?: boolean, localeConfig?: Locale): dayjs.Dayjs;
    setPeriod(period: Period): number;
    dayjs: typeof dayjs;
};
export {};
//# sourceMappingURL=public.d.ts.map