import DeepState from 'deep-state-observer';

export interface IOptions {
  element: Element;
  state: DeepState;
  onDestroy: (state: DeepState) => {};
}

export interface IProps {
  [key: string]: any;
  [id: number]: any;
}

export interface IComponentOptions {
  props?: IProps;
  tagName?: string;
}
