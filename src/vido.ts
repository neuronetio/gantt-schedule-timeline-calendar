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

export default function Vido(state, api) {
  let componentId = 0;
  const components = {};
  let actions = [];

  let app, element;

  let shouldUpdateCount = 0;
  const resolved = Promise.resolve();

  const vido = {
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
    actions: directive(function actionsDirective(componentActions, props) {
      return function partial(part) {
        if (typeof componentActions !== 'undefined') {
          for (const componentAction of componentActions) {
            actions.push({ componentAction, element: part.committer.element, props });
          }
        }
      };
    }),

    createComponent(component, props) {
      const instance = componentId++;
      const componentInstance = getComponentInstance(instance);
      function update() {
        vido.updateTemplate();
      }
      const destroyable = [];
      function onDestroy(fn) {
        destroyable.push(fn);
      }
      const instancevido = { ...vido, update, onDestroy, instance };
      let firstMethods, methods;
      if (props) {
        firstMethods = component(props, instancevido);
      } else {
        firstMethods = component(instancevido);
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
        if (typeof action.element.__vido__ === 'undefined') {
          if (typeof action.componentAction.create === 'function') {
            action.componentAction.create(action.element, action.props);
          }
        } else {
          if (typeof action.componentAction.update === 'function') {
            action.componentAction.update(action.element, action.props);
          }
        }
      }
      for (const action of actions) {
        action.element.__vido__ = { props: action.props };
      }
      actions = [];
    }
  };

  function getComponentInstance(instance) {
    return {
      instance,
      destroy() {
        return vido.destroyComponent(instance);
      },
      update() {
        return vido.updateTemplate();
      },

      html(props = {}) {
        return components[instance].update(props);
      }
    };
  }

  return vido;
}
