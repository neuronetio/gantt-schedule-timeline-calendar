import State from 'deep-state-observer';
import dayjs from 'dayjs';
import { Config, Period } from '../gstc';
import { lithtml } from '@neuronet.io/vido';
export declare const mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
export declare function prepareState(userConfig: Config): {
    config: unknown;
};
export declare function stateFromConfig(userConfig: Config): State;
export declare function wasmStateFromConfig(userConfig: Config, wasmFile?: string): Promise<any>;
export declare const publicApi: {
    fromArray(array: any): {};
    stateFromConfig: typeof stateFromConfig;
    wasmStateFromConfig: typeof wasmStateFromConfig;
    merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
    lithtml: typeof lithtml;
    html: typeof lithtml;
    date(time: any): dayjs.Dayjs;
    setPeriod(period: Period): number;
    dayjs: typeof dayjs;
    name: string;
};
//# sourceMappingURL=public.d.ts.map