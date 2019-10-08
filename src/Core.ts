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
  const components = new WeakMap();
  const templates = new WeakMap();
  let actions = [];

  let app, element;

  function getAction(instance, props = {}) {
    return directive(fn => part => {
      if (typeof fn === 'function') {
        actions.push({ fn, element: part.committer.element, props });
      }
    });
  }

  let shouldUpdateCount = 0;
  const resolved = Promise.resolve();

  const core = {
    state,
    api,
    html,
    svg,
    render,
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
    action: element => {},

    createComponent(component, props) {
      const instance = { name: component.name, props };
      const componentInstance = getComponentInstance(instance);
      let oneTimeUpdate;
      function render(props) {
        if (!oneTimeUpdate) {
          return (oneTimeUpdate = function() {
            core.updateTemplate(instance, props);
          });
        }
        core.updateTemplate(instance, props);
      }
      const destroyable = [];
      const onDestroy = fn => destroyable.push(fn);
      const instanceCore = { ...core, render, onDestroy, instance, action: getAction(instance) };
      let methods;
      if (props) {
        methods = component(props, instanceCore);
      } else {
        methods = component(instanceCore);
      }
      if (typeof methods === 'function') {
        const destroy = () => {
          destroyable.forEach(d => d());
        };
        methods = { update: methods, destroy };
      } else {
        const originalDestroy = methods.destroy;
        const destroy = () => {
          destroyable.forEach(d => d());
          originalDestroy();
        };
        methods = { ...methods, destroy };
      }
      components.set(instance, methods);
      oneTimeUpdate();
      return componentInstance;
    },

    destroyComponent(instance) {
      const methods = components.get(instance);
      if (typeof methods.destroy === 'function') {
        methods.destroy();
      }
      components.delete(instance);
      templates.delete(instance);
    },
    updateTemplate(instance, props, flush = true) {
      const methods = components.get(instance);
      if (methods) {
        const result = methods.update(props);
        templates.set(instance, result);
        if (flush) {
          shouldUpdateCount++;
          const currentShouldUpdateCount = shouldUpdateCount;
          resolved.then(() => {
            if (currentShouldUpdateCount === shouldUpdateCount) {
              this.flush(instance);
              shouldUpdateCount = 0;
            }
          });
        }
      }
    },
    componentTemplate(instance) {
      return templates.get(instance);
    },
    createApp(instance, el) {
      element = el;
      const App = this.createComponent(instance);
      app = App.instance;
      this.flush();
      return App;
    },

    flush(instance) {
      if (app) {
        this.updateTemplate(app, {}, false);
        render(this.componentTemplate(app), element);
        for (const action of actions) {
          action.fn(action.element, action.props);
        }
        actions = [];
      }
    }
  };
  function getComponentInstance(instance) {
    return {
      instance,
      destroy() {
        return core.destroyComponent(instance);
      },
      update(props) {
        return core.updateTemplate(instance, props);
      },

      html(props) {
        core.updateTemplate(instance, props, false);
        return core.componentTemplate(instance);
      }
    };
  }

  return core;
}
