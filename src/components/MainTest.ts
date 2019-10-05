import Base from './Base';

export default class MainTest extends Base {
  tpl() {
    return Base.html`<div class="main-test">MainTest is added ${this.get('name')}!!!!</div>`;
  }
}
