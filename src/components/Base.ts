import { render, html } from 'lit-html';
import { IProps } from '../types';
import State from 'deep-state-observer';

const Context = { state: new State({}) };

export default class Base {
  props: IProps;
  el: Element;
  ctx: any;

  constructor(props: IProps = {}, tagName = 'div') {
    this.ctx = Context;
    this.props = props instanceof State ? props : Base.observable(props);
    this.el = document.createElement(tagName);
    this.created();
    this.props.subscribe('', () => {
      this.refresh();
    });
    this.mounted();
  }

  created() {}
  mounted() {}

  static observable(data) {
    return new State(data);
  }

  tpl() {
    return Base.html``;
  }

  updateProps(path: string, value, options = {}) {
    return this.props.update(path, value, options);
  }

  get(path, options = {}) {
    return this.props.get(path, options);
  }

  refresh() {
    console.log('rendering', this.constructor.name);
    Base.render(this.tpl(), this.el);
  }

  getElement() {
    return this.el;
  }

  static get render() {
    return render;
  }

  static get html() {
    return html;
  }
}
