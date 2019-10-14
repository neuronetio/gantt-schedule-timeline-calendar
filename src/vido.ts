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

  function getActions(instance) {
    return directive(function actionsDirective(createFunctions, props) {
      return function partial(part) {
        for (const create of createFunctions) {
          if (typeof create === 'function') {
            const exists = actions.find(action => action.instance === instance);
            if (!exists) {
              const componentAction = { create, update() {}, destroy() {} };
              const element = part.committer.element;
              if (typeof element.__vido__ !== 'undefined') delete element.__vido__;
              actions.push({ instance, componentAction, element, props });
            } else {
              exists.props = props;
            }
          }
        }
      };
    });
  }

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
    actions(componentActions, props) {},

    createComponent(component, props) {
      const instance = component.name + ':' + componentId++;
      const componentInstance = getComponentInstance(instance);
      function update() {
        vido.updateTemplate();
      }
      const destroyable = [];
      function onDestroy(fn) {
        destroyable.push(fn);
      }
      const vidoInstance = { ...vido, update, onDestroy, instance, actions: getActions(instance) };
      let firstMethods, methods;
      if (props) {
        firstMethods = component(props, vidoInstance);
      } else {
        firstMethods = component(vidoInstance);
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
      actions = actions.filter(action => {
        if (action.instance === instance && typeof action.componentAction.destroy === 'function') {
          action.componentAction.destroy(action.element, action.props);
        }
        return action.instance !== instance;
      });
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

    executeActions() {
      for (const action of actions) {
        if (typeof action.element.__vido__ === 'undefined') {
          if (typeof action.componentAction.create === 'function') {
            const result = action.componentAction.create(action.element, action.props);
            action.element.__vido__ = { props: action.props };
            if (typeof result !== 'undefined') {
              if (typeof result.update === 'function') {
                action.componentAction.update = result.update;
              }
              if (typeof result.destroy === 'function') {
                action.componentAction.destroy = result.destroy;
              }
            }
          }
        } else {
          if (typeof action.componentAction.update === 'function') {
            action.componentAction.update(action.element, action.props);
          }
        }
      }
      for (const action of actions) {
        action.element.__vido__ = { instance: action.instance, props: action.props };
      }
    },

    render() {
      render(components[app].update(), element);
      vido.executeActions();
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
