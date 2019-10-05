import { render, html, directive } from 'lit-html';

export default function Core(state, api) {
  const components = new WeakMap();
  const templates = new WeakMap();
  let elements = {};

  let app, element;

  function getAction(instance) {
    return directive(fn => part => {
      fn(part.committer.element);
    });
  }

  const core = {
    state,
    api,
    html,
    render,
    directive,
    action: element => {},

    createComponent(instance) {
      const componentInstance = {
        instance,
        destroy() {
          return self.destroyComponent(instance);
        },
        update(props) {
          return self.updateTemplate(instance, props);
        },
        html() {
          return self.componentTemplate(instance);
        }
      };
      let oneTimeUpdate;
      let render = (props = {}) => (oneTimeUpdate = () => this.updateTemplate(instance, props));
      const destroyable = [];
      const onDestroy = fn => destroyable.push(fn);
      const instanceCore = { ...core, render, onDestroy, instance };
      instanceCore.action = getAction(instance);
      let methods = instance(instanceCore);
      console.log(methods);
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
      console.log(methods.update({}));
      components.set(instance, methods);
      oneTimeUpdate();
      instanceCore.render = (props = {}) => this.updateTemplate(instance, props, true, instance);
      const self = this;
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
      templates.set(instance, methods.update(props));
      if (flush) this.flush(instance);
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
    beforeUpdate(name, element) {},
    afterUpdate(name, element) {},
    _beforeUpdate() {
      for (const name in elements) {
        const namedElements = elements[name];
        for (const element of namedElements) {
          this.beforeUpdate(name, element);
        }
      }
    },
    _afterUpdate() {
      for (const name in elements) {
        const namedElements = elements[name];
        for (const element of namedElements) {
          this.afterUpdate(name, element);
        }
      }
      elements = {};
    },
    flush(instance) {
      if (app) {
        this._beforeUpdate();
        this.updateTemplate(app, {}, false);
        render(this.componentTemplate(app), element);
        this._afterUpdate();
      }
    }
  };

  return core;
}
