import { SlotName } from '../gstc';
import { htmlResult } from '@neuronet.io/vido';
export declare type TooltipPlacement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end' | 'bottom' | 'bottom-start' | 'bottom-end';
export declare type TooltipTrigger = 'pointerdown' | 'pointerenter';
export declare type TooltipShow = (event: PointerEvent, data: any) => htmlResult;
export declare type TooltipMove = (event: PointerEvent, data: any) => htmlResult;
export declare type TooltipHide = (event: PointerEvent, data: any) => void;
export interface TooltipConfig {
    placement: TooltipPlacement;
    trigger: TooltipTrigger;
    show: TooltipShow;
    move: TooltipMove;
    hide: TooltipHide;
}
export declare type AttachTo = {
    [element in SlotName]?: TooltipConfig;
};
export interface Options {
    enabled: boolean;
    attachTo: AttachTo;
}
export declare function Plugin(options?: Options): (vidoInstance: any) => () => void;
//# sourceMappingURL=tooltip.d.ts.map