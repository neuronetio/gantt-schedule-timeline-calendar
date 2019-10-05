export default function Example(input = {}) {
  return core => {
    const componentName = 'Example';

    let className;
    core.onDestroy(
      core.state.subscribe('classNames', () => {
        className = core.api.getClass(componentName);
        core.render();
      })
    );
    const action = element => (element.style['color'] = 'red');
    return props => core.html`<div class="${className}" data-action="${core.action(action)}">Example</div>`;
  };
}
