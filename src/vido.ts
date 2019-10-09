import { render, html, directive, svg } from 'lit-html';
//import { asyncAppend } from 'lit-html/directives/async-append';
//import { asyncReplace } from 'lit-html/directives/async-replace';
import { cache } from 'lit-html/directives/cache';
import { classMap } from 'lit-html/directives/class-map';
import { guard } from 'lit-html/directives/guard';
import { ifDefined } from 'lit-html/directives/if-defined';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { until } from 'lit-html/directives/until';

export default function Core(state, api) {
  let componentId = 0;
  const components = {};
  let actions = [];

  let app, element;

  let shouldUpdateCount = 0;
  const resolved = Promise.resolve();

  const core = {
    state,
    api,
    html,
    svg,
    directive,
    //asyncAppend,
    //asyncReplace,
    cache,
    classMap,
    guard,
    ifDefined,
    repeat,
    styleMap,
    unsafeHTML,
    until,
    action: directive(function action(fn, props) {
      return function partial(part) {
        if (typeof fn === 'function') {
          actions.push({ fn, element: part.committer.element, props });
        }
      };
    }),

    createComponent(component, props) {
      const instance = componentId++;
      const componentInstance = getComponentInstance(instance);
      let oneTimeUpdate;
      function update() {
        core.updateTemplate();
      }
      const destroyable = [];
      function onDestroy(fn) {
        destroyable.push(fn);
      }
      const instanceCore = { ...core, update, onDestroy, instance };
      let firstMethods, methods;
      if (props) {
        firstMethods = component(props, instanceCore);
      } else {
        firstMethods = component(instanceCore);
      }
      if (typeof firstMethods === 'function') {
        const destroy = () => {
          destroyable.forEach(d => d());
        };
        methods = { update: firstMethods, destroy };
      } else {
        const originalDestroy = methods.destroy;
        const destroy = () => {
          destroyable.forEach(d => d());
          originalDestroy();
        };
        methods = { ...firstMethods, destroy };
      }
      components[instance] = methods;
      return componentInstance;
    },

    destroyComponent(instance) {
      if (typeof components[instance].destroy === 'function') {
        components[instance].destroy();
      }
      delete components[instance];
    },

    updateTemplate() {
      shouldUpdateCount++;
      const currentShouldUpdateCount = shouldUpdateCount;
      const self = this;
      resolved.then(function flush() {
        if (currentShouldUpdateCount === shouldUpdateCount) {
          self.render();
          shouldUpdateCount = 0;
        }
      });
    },

    createApp(instance, el) {
      element = el;
      const App = this.createComponent(instance);
      app = App.instance;
      this.render();
      return App;
    },

    render() {
      render(components[app].update(), element);
      for (const action of actions) {
        action.fn(action.element, action.props);
      }
      actions = [];
    }
  };

  function getComponentInstance(instance) {
    return {
      instance,
      destroy() {
        return core.destroyComponent(instance);
      },
      update() {
        return core.updateTemplate();
      },

      html(props = {}) {
        return components[instance].update(props);
      }
    };
  }

  return core;
}
