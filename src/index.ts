import { html, render } from 'lit-html';
import { Options } from './types';
import State from 'deep-state-observer';

export default function GSTC(options: Options) {
  const state = {
    one: { two: { three: { four: { five: 'Rafał' } } } }
  };

  const comp = (name) => html`
    <div class="lit">Hello ${name}!</div>
  `;

  const comp1 = (one) =>
    html`
      <div class="one">${comp(one.two.three.four.five)}</div>
    `;

  const app = (state) => html`
    <div class="app">${comp1(state.one)}</div>
  `;

  render(app(state), options.element);
  setTimeout(() => {
    state.one.two.three.four.five = 'Yeeeaaahh';
    console.log('should rerender');
    render(app(state), options.element);
  }, 1000);
}
