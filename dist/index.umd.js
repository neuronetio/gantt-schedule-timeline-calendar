(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.GSTC = factory());
}(this, (function () { 'use strict';

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * Brands a function as a directive factory function so that lit-html will call
     * the function during template rendering, rather than passing as a value.
     *
     * A _directive_ is a function that takes a Part as an argument. It has the
     * signature: `(part: Part) => void`.
     *
     * A directive _factory_ is a function that takes arguments for data and
     * configuration and returns a directive. Users of directive usually refer to
     * the directive factory as the directive. For example, "The repeat directive".
     *
     * Usually a template author will invoke a directive factory in their template
     * with relevant arguments, which will then return a directive function.
     *
     * Here's an example of using the `repeat()` directive factory that takes an
     * array and a function to render an item:
     *
     * ```js
     * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
     * ```
     *
     * When `repeat` is invoked, it returns a directive function that closes over
     * `items` and the template function. When the outer template is rendered, the
     * return directive function is called with the Part for the expression.
     * `repeat` then performs it's custom logic to render multiple items.
     *
     * @param f The directive factory function. Must be a function that returns a
     * function of the signature `(part: Part) => void`. The returned function will
     * be called with the part object.
     *
     * @example
     *
     * import {directive, html} from 'lit-html';
     *
     * const immutable = directive((v) => (part) => {
     *   if (part.value !== v) {
     *     part.setValue(v)
     *   }
     * });
     */
    const directive = (f) => ((...args) => {
        const d = f(...args);
        // @ts-ignore
        d.isDirective = true;
        return d;
    });
    class Directive {
        constructor() {
            this.isDirective = true;
            this.isClass = true;
        }
        // @ts-ignore
        body(part) {
        }
        runPart(part) {
            return this.body(part);
        }
    }
    const isDirective = (o) => {
        return o !== undefined && o !== null &&
            // tslint:disable-next-line:no-any
            typeof o.isDirective === 'boolean';
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * True if the custom elements polyfill is in use.
     */
    const isCEPolyfill = window.customElements !== undefined &&
        window.customElements.polyfillWrapFlushCallback !==
            undefined;
    /**
     * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
     * into another container (could be the same container), before `before`. If
     * `before` is null, it appends the nodes to the container.
     */
    const reparentNodes = (container, start, end = null, before = null) => {
        while (start !== end) {
            const n = start.nextSibling;
            container.insertBefore(start, before);
            start = n;
        }
    };
    /**
     * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
     * `container`.
     */
    const removeNodes = (container, start, end = null) => {
        while (start !== end) {
            const n = start.nextSibling;
            container.removeChild(start);
            start = n;
        }
    };

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * A sentinel value that signals that a value was handled by a directive and
     * should not be written to the DOM.
     */
    const noChange = {};
    /**
     * A sentinel value that signals a NodePart to fully clear its content.
     */
    const nothing = {};

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An expression marker with embedded unique key to avoid collision with
     * possible text in templates.
     */
    const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
    /**
     * An expression marker used text-positions, multi-binding attributes, and
     * attributes with markup-like text values.
     */
    const nodeMarker = `<!--${marker}-->`;
    const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
    /**
     * Suffix appended to all bound attribute names.
     */
    const boundAttributeSuffix = '$lit$';
    /**
     * An updatable Template that tracks the location of dynamic parts.
     */
    class Template {
        constructor(result, element) {
            this.parts = [];
            this.element = element;
            const nodesToRemove = [];
            const stack = [];
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
            const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            // Keeps track of the last index associated with a part. We try to delete
            // unnecessary nodes, but we never want to associate two different parts
            // to the same index. They must have a constant node between.
            let lastPartIndex = 0;
            let index = -1;
            let partIndex = 0;
            const { strings, values: { length } } = result;
            while (partIndex < length) {
                const node = walker.nextNode();
                if (node === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    continue;
                }
                index++;
                if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                    if (node.hasAttributes()) {
                        const attributes = node.attributes;
                        const { length } = attributes;
                        // Per
                        // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                        // attributes are not guaranteed to be returned in document order.
                        // In particular, Edge/IE can return them out of order, so we cannot
                        // assume a correspondence between part index and attribute index.
                        let count = 0;
                        for (let i = 0; i < length; i++) {
                            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                                count++;
                            }
                        }
                        while (count-- > 0) {
                            // Get the template literal section leading up to the first
                            // expression in this attribute
                            const stringForPart = strings[partIndex];
                            // Find the attribute name
                            const name = lastAttributeNameRegex.exec(stringForPart)[2];
                            // Find the corresponding attribute
                            // All bound attributes have had a suffix added in
                            // TemplateResult#getHTML to opt out of special attribute
                            // handling. To look up the attribute value we also need to add
                            // the suffix.
                            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                            const attributeValue = node.getAttribute(attributeLookupName);
                            node.removeAttribute(attributeLookupName);
                            const statics = attributeValue.split(markerRegex);
                            this.parts.push({ type: 'attribute', index, name, strings: statics });
                            partIndex += statics.length - 1;
                        }
                    }
                    if (node.tagName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                }
                else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                    const data = node.data;
                    if (data.indexOf(marker) >= 0) {
                        const parent = node.parentNode;
                        const strings = data.split(markerRegex);
                        const lastIndex = strings.length - 1;
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        for (let i = 0; i < lastIndex; i++) {
                            let insert;
                            let s = strings[i];
                            if (s === '') {
                                insert = createMarker();
                            }
                            else {
                                const match = lastAttributeNameRegex.exec(s);
                                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                    s = s.slice(0, match.index) + match[1] +
                                        match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                                }
                                insert = document.createTextNode(s);
                            }
                            parent.insertBefore(insert, node);
                            this.parts.push({ type: 'node', index: ++index });
                        }
                        // If there's no text, we must insert a comment to mark our place.
                        // Else, we can trust it will stick around after cloning.
                        if (strings[lastIndex] === '') {
                            parent.insertBefore(createMarker(), node);
                            nodesToRemove.push(node);
                        }
                        else {
                            node.data = strings[lastIndex];
                        }
                        // We have a part for each match found
                        partIndex += lastIndex;
                    }
                }
                else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                    if (node.data === marker) {
                        const parent = node.parentNode;
                        // Add a new marker node to be the startNode of the Part if any of
                        // the following are true:
                        //  * We don't have a previousSibling
                        //  * The previousSibling is already the start of a previous part
                        if (node.previousSibling === null || index === lastPartIndex) {
                            index++;
                            parent.insertBefore(createMarker(), node);
                        }
                        lastPartIndex = index;
                        this.parts.push({ type: 'node', index });
                        // If we don't have a nextSibling, keep this node so we have an end.
                        // Else, we can remove it to save future costs.
                        if (node.nextSibling === null) {
                            node.data = '';
                        }
                        else {
                            nodesToRemove.push(node);
                            index--;
                        }
                        partIndex++;
                    }
                    else {
                        let i = -1;
                        while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                            // Comment node has a binding marker inside, make an inactive part
                            // The binding won't work, but subsequent bindings will
                            // TODO (justinfagnani): consider whether it's even worth it to
                            // make bindings in comments work
                            this.parts.push({ type: 'node', index: -1 });
                            partIndex++;
                        }
                    }
                }
            }
            // Remove text binding nodes after the walk to not disturb the TreeWalker
            for (const n of nodesToRemove) {
                n.parentNode.removeChild(n);
            }
        }
    }
    const endsWith = (str, suffix) => {
        const index = str.length - suffix.length;
        return index >= 0 && str.slice(index) === suffix;
    };
    const isTemplatePartActive = (part) => part.index !== -1;
    /**
     * Used to clone existing node instead of each time creating new one which is
     * slower
     */
    const markerNode = document.createComment('');
    // Allows `document.createComment('')` to be renamed for a
    // small manual size-savings.
    const createMarker = () => markerNode.cloneNode();
    /**
     * This regex extracts the attribute name preceding an attribute-position
     * expression. It does this by matching the syntax allowed for attributes
     * against the string literal directly preceding the expression, assuming that
     * the expression is in an attribute-value position.
     *
     * See attributes in the HTML spec:
     * https://www.w3.org/TR/html5/syntax.html#elements-attributes
     *
     * " \x09\x0a\x0c\x0d" are HTML space characters:
     * https://www.w3.org/TR/html5/infrastructure.html#space-characters
     *
     * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
     * space character except " ".
     *
     * So an attribute is:
     *  * The name: any character except a control character, space character, ('),
     *    ("), ">", "=", or "/"
     *  * Followed by zero or more space characters
     *  * Followed by "="
     *  * Followed by zero or more space characters
     *  * Followed by:
     *    * Any character except space, ('), ("), "<", ">", "=", (`), or
     *    * (") then any non-("), or
     *    * (') then any non-(')
     */
    const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An instance of a `Template` that can be attached to the DOM and updated
     * with new values.
     */
    class TemplateInstance {
        constructor(template, processor, options) {
            this.__parts = [];
            this.template = template;
            this.processor = processor;
            this.options = options;
        }
        update(values) {
            let i = 0;
            for (const part of this.__parts) {
                if (part !== undefined) {
                    part.setValue(values[i]);
                    part.commit();
                }
                i++;
            }
        }
        _clone() {
            // There are a number of steps in the lifecycle of a template instance's
            // DOM fragment:
            //  1. Clone - create the instance fragment
            //  2. Adopt - adopt into the main document
            //  3. Process - find part markers and create parts
            //  4. Upgrade - upgrade custom elements
            //  5. Update - set node, attribute, property, etc., values
            //  6. Connect - connect to the document. Optional and outside of this
            //     method.
            //
            // We have a few constraints on the ordering of these steps:
            //  * We need to upgrade before updating, so that property values will pass
            //    through any property setters.
            //  * We would like to process before upgrading so that we're sure that the
            //    cloned fragment is inert and not disturbed by self-modifying DOM.
            //  * We want custom elements to upgrade even in disconnected fragments.
            //
            // Given these constraints, with full custom elements support we would
            // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
            //
            // But Safari does not implement CustomElementRegistry#upgrade, so we
            // can not implement that order and still have upgrade-before-update and
            // upgrade disconnected fragments. So we instead sacrifice the
            // process-before-upgrade constraint, since in Custom Elements v1 elements
            // must not modify their light DOM in the constructor. We still have issues
            // when co-existing with CEv0 elements like Polymer 1, and with polyfills
            // that don't strictly adhere to the no-modification rule because shadow
            // DOM, which may be created in the constructor, is emulated by being placed
            // in the light DOM.
            //
            // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
            // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
            // in one step.
            //
            // The Custom Elements v1 polyfill supports upgrade(), so the order when
            // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
            // Connect.
            const fragment = isCEPolyfill ?
                this.template.element.content.cloneNode(true) :
                document.importNode(this.template.element.content, true);
            const stack = [];
            const parts = this.template.parts;
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            let partIndex = 0;
            let nodeIndex = 0;
            let part;
            let node = walker.nextNode();
            // Loop through all the nodes and parts of a template
            while (partIndex < parts.length) {
                part = parts[partIndex];
                if (!isTemplatePartActive(part)) {
                    this.__parts.push(undefined);
                    partIndex++;
                    continue;
                }
                // Progress the tree walker until we find our next part's node.
                // Note that multiple parts may share the same node (attribute parts
                // on a single element), so this loop may not run at all.
                while (nodeIndex < part.index) {
                    nodeIndex++;
                    if (node.nodeName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                    if ((node = walker.nextNode()) === null) {
                        // We've exhausted the content inside a nested template element.
                        // Because we still have parts (the outer for-loop), we know:
                        // - There is a template in the stack
                        // - The walker will find a nextNode outside the template
                        walker.currentNode = stack.pop();
                        node = walker.nextNode();
                    }
                }
                // We've arrived at our part's node.
                if (part.type === 'node') {
                    const part = this.processor.handleTextExpression(this.options);
                    part.insertAfterNode(node.previousSibling);
                    this.__parts.push(part);
                }
                else {
                    this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                }
                partIndex++;
            }
            if (isCEPolyfill) {
                document.adoptNode(fragment);
                customElements.upgrade(fragment);
            }
            return fragment;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    let policy;
    /**
     * Turns the value to trusted HTML. If the application uses Trusted Types the
     * value is transformed into TrustedHTML, which can be assigned to execution
     * sink. If the application doesn't use Trusted Types, the return value is the
     * same as the argument.
     */
    function convertConstantTemplateStringToTrustedHTML(value) {
        // tslint:disable-next-line
        const w = window;
        // TrustedTypes have been renamed to trustedTypes
        // (https://github.com/WICG/trusted-types/issues/177)
        const trustedTypes = (w.trustedTypes || w.TrustedTypes);
        if (trustedTypes && !policy) {
            policy = trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
        }
        return policy ? policy.createHTML(value) : value;
    }
    const commentMarker = ` ${marker} `;
    /**
     * Used to clone existing node instead of each time creating new one which is
     * slower
     */
    const emptyTemplateNode = document.createElement('template');
    /**
     * The return type of `html`, which holds a Template and the values from
     * interpolated expressions.
     */
    class TemplateResult {
        constructor(strings, values, type, processor) {
            this.strings = strings;
            this.values = values;
            this.type = type;
            this.processor = processor;
        }
        /**
         * Returns a string of HTML used to create a `<template>` element.
         */
        getHTML() {
            const l = this.strings.length - 1;
            let html = '';
            let isCommentBinding = false;
            for (let i = 0; i < l; i++) {
                const s = this.strings[i];
                // For each binding we want to determine the kind of marker to insert
                // into the template source before it's parsed by the browser's HTML
                // parser. The marker type is based on whether the expression is in an
                // attribute, text, or comment position.
                //   * For node-position bindings we insert a comment with the marker
                //     sentinel as its text content, like <!--{{lit-guid}}-->.
                //   * For attribute bindings we insert just the marker sentinel for the
                //     first binding, so that we support unquoted attribute bindings.
                //     Subsequent bindings can use a comment marker because multi-binding
                //     attributes must be quoted.
                //   * For comment bindings we insert just the marker sentinel so we don't
                //     close the comment.
                //
                // The following code scans the template source, but is *not* an HTML
                // parser. We don't need to track the tree structure of the HTML, only
                // whether a binding is inside a comment, and if not, if it appears to be
                // the first binding in an attribute.
                const commentOpen = s.lastIndexOf('<!--');
                // We're in comment position if we have a comment open with no following
                // comment close. Because <-- can appear in an attribute value there can
                // be false positives.
                isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                    s.indexOf('-->', commentOpen + 1) === -1;
                // Check to see if we have an attribute-like sequence preceding the
                // expression. This can match "name=value" like structures in text,
                // comments, and attribute values, so there can be false-positives.
                const attributeMatch = lastAttributeNameRegex.exec(s);
                if (attributeMatch === null) {
                    // We're only in this branch if we don't have a attribute-like
                    // preceding sequence. For comments, this guards against unusual
                    // attribute values like <div foo="<!--${'bar'}">. Cases like
                    // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                    // below.
                    html += s + (isCommentBinding ? commentMarker : nodeMarker);
                }
                else {
                    // For attributes we use just a marker sentinel, and also append a
                    // $lit$ suffix to the name to opt-out of attribute-specific parsing
                    // that IE and Edge do for style and certain SVG attributes.
                    html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                        attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                        marker;
                }
            }
            html += this.strings[l];
            return html;
        }
        getTemplateElement() {
            const template = emptyTemplateNode.cloneNode();
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is implemented.
            template.innerHTML =
                convertConstantTemplateStringToTrustedHTML(this.getHTML());
            return template;
        }
    }
    /**
     * A TemplateResult for SVG fragments.
     *
     * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
     * SVG namespace, then modifies the template to remove the `<svg>` tag so that
     * clones only container the original fragment.
     */
    class SVGTemplateResult extends TemplateResult {
        getHTML() {
            return `<svg>${super.getHTML()}</svg>`;
        }
        getTemplateElement() {
            const template = super.getTemplateElement();
            const content = template.content;
            const svgElement = content.firstChild;
            content.removeChild(svgElement);
            reparentNodes(content, svgElement.firstChild);
            return template;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const isPrimitive = (value) => {
        return (value === null ||
            !(typeof value === 'object' || typeof value === 'function'));
    };
    const isIterable = (value) => {
        return Array.isArray(value) ||
            // tslint:disable-next-line:no-any
            !!(value && value[Symbol.iterator]);
    };
    /**
     * A global callback used to sanitize any value before inserting it into the
     * DOM.
     */
    let sanitizeDOMValueImpl;
    const sanitizeDOMValue = (value, name, type, node) => {
        if (sanitizeDOMValueImpl !== undefined) {
            return sanitizeDOMValueImpl(value, name, type, node);
        }
        return value;
    };
    /**
     * Used to clone text node instead of each time creating new one which is slower
     */
    const emptyTextNode = document.createTextNode('');
    /**
     * Writes attribute values to the DOM for a group of AttributeParts bound to a
     * single attribute. The value is only set once even if there are multiple parts
     * for an attribute.
     */
    class AttributeCommitter {
        constructor(element, name, strings) {
            this.dirty = true;
            this.element = element;
            this.name = name;
            this.strings = strings;
            this.parts = [];
            for (let i = 0; i < strings.length - 1; i++) {
                this.parts[i] = this._createPart();
            }
        }
        /**
         * Creates a single part. Override this to create a differnt type of part.
         */
        _createPart() {
            return new AttributePart(this);
        }
        _getValue() {
            const strings = this.strings;
            const parts = this.parts;
            const l = strings.length - 1;
            // If we're assigning an attribute via syntax like:
            //    attr="${foo}"  or  attr=${foo}
            // but not
            //    attr="${foo} ${bar}" or attr="${foo} baz"
            // then we don't want to coerce the attribute value into one long
            // string. Instead we want to just return the value itself directly,
            // so that sanitizeDOMValue can get the actual value rather than
            // String(value)
            // The exception is if v is an array, in which case we do want to smash
            // it together into a string without calling String() on the array.
            //
            // This also allows trusted values (when using TrustedTypes) being
            // assigned to DOM sinks without being stringified in the process.
            if (l === 1 && strings[0] === '' && strings[1] === '' &&
                parts[0] !== undefined) {
                const v = parts[0].value;
                if (!isIterable(v)) {
                    return v;
                }
            }
            let text = '';
            for (let i = 0; i < l; i++) {
                text += strings[i];
                const part = parts[i];
                if (part !== undefined) {
                    const v = part.value;
                    if (isPrimitive(v) || !isIterable(v)) {
                        text += typeof v === 'string' ? v : String(v);
                    }
                    else {
                        for (const t of v) {
                            text += typeof t === 'string' ? t : String(t);
                        }
                    }
                }
            }
            text += strings[l];
            return text;
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                let value = this._getValue();
                value = sanitizeDOMValue(value, this.name, 'attribute', this.element);
                if (typeof value === 'symbol') {
                    // Native Symbols throw if they're coerced to string.
                    value = String(value);
                }
                this.element.setAttribute(this.name, value);
            }
        }
    }
    /**
     * A Part that controls all or part of an attribute value.
     */
    class AttributePart {
        constructor(committer) {
            this.value = undefined;
            this.committer = committer;
        }
        setValue(value) {
            if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
                this.value = value;
                // If the value is a not a directive, dirty the committer so that it'll
                // call setAttribute. If the value is a directive, it'll dirty the
                // committer if it calls setValue().
                if (!isDirective(value)) {
                    this.committer.dirty = true;
                }
            }
        }
        commit() {
            while (isDirective(this.value)) {
                const directive = this.value;
                this.value = noChange;
                // @ts-ignore
                if (directive.isClass) {
                    // @ts-ignore
                    directive.runPart(this);
                }
                else {
                    directive(this);
                }
            }
            if (this.value === noChange) {
                return;
            }
            this.committer.commit();
        }
    }
    /**
     * A Part that controls a location within a Node tree. Like a Range, NodePart
     * has start and end locations and can set and update the Nodes between those
     * locations.
     *
     * NodeParts support several value types: primitives, Nodes, TemplateResults,
     * as well as arrays and iterables of those types.
     */
    class NodePart {
        constructor(options) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.options = options;
        }
        /**
         * Appends this part into a container.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendInto(container) {
            this.startNode = container.appendChild(createMarker());
            this.endNode = container.appendChild(createMarker());
        }
        /**
         * Inserts this part after the `ref` node (between `ref` and `ref`'s next
         * sibling). Both `ref` and its next sibling must be static, unchanging nodes
         * such as those that appear in a literal section of a template.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterNode(ref) {
            this.startNode = ref;
            this.endNode = ref.nextSibling;
        }
        /**
         * Appends this part into a parent part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendIntoPart(part) {
            part.__insert(this.startNode = createMarker());
            part.__insert(this.endNode = createMarker());
        }
        /**
         * Inserts this part after the `ref` part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterPart(ref) {
            ref.__insert(this.startNode = createMarker());
            this.endNode = ref.endNode;
            ref.endNode = this.startNode;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                // @ts-ignore
                if (directive.isClass) {
                    // @ts-ignore
                    directive.runPart(this);
                }
                else {
                    directive(this);
                }
            }
            const value = this.__pendingValue;
            if (value === noChange) {
                return;
            }
            if (isPrimitive(value)) {
                if (value !== this.value) {
                    this.__commitText(value);
                }
            }
            else if (value instanceof TemplateResult) {
                this.__commitTemplateResult(value);
            }
            else if (value instanceof Node) {
                this.__commitNode(value);
            }
            else if (isIterable(value)) {
                this.__commitIterable(value);
            }
            else if (value === nothing) {
                this.value = nothing;
                this.clear();
            }
            else {
                // Fallback, will render the string representation
                this.__commitText(value);
            }
        }
        __insert(node) {
            this.endNode.parentNode.insertBefore(node, this.endNode);
        }
        __commitNode(value) {
            if (this.value === value) {
                return;
            }
            this.clear();
            this.__insert(value);
            this.value = value;
        }
        __commitText(value) {
            const node = this.startNode.nextSibling;
            value = value == null ? '' : value;
            if (node === this.endNode.previousSibling &&
                node.nodeType === 3 /* Node.TEXT_NODE */) {
                // If we only have a single text node between the markers, we can just
                // set its value, rather than replacing it.
                const renderedValue = sanitizeDOMValue(value, 'data', 'property', node);
                node.data = typeof renderedValue === 'string' ?
                    renderedValue :
                    String(renderedValue);
            }
            else {
                // When setting text content, for security purposes it matters a lot what
                // the parent is. For example, <style> and <script> need to be handled
                // with care, while <span> does not. So first we need to put a text node
                // into the document, then we can sanitize its contentx.
                const textNode = emptyTextNode.cloneNode();
                this.__commitNode(textNode);
                const renderedValue = sanitizeDOMValue(value, 'textContent', 'property', textNode);
                textNode.data = typeof renderedValue === 'string' ? renderedValue :
                    String(renderedValue);
            }
            this.value = value;
        }
        __commitTemplateResult(value) {
            const template = this.options.templateFactory(value);
            if (this.value instanceof TemplateInstance &&
                this.value.template === template) {
                this.value.update(value.values);
            }
            else {
                // `value` is a template result that was constructed without knowledge of
                // the parent we're about to write it into. sanitizeDOMValue hasn't been
                // made aware of this relationship, and for scripts and style specifically
                // this is known to be unsafe. So in the case where the user is in
                // "secure mode" (i.e. when there's a sanitizeDOMValue set), we just want
                // to forbid this because it's not a use case we want to support.
                // We check for sanitizeDOMValue is to prevent this from
                // being a breaking change to the library.
                const parent = this.endNode.parentNode;
                if (sanitizeDOMValueImpl !== undefined && parent.nodeName === 'STYLE' ||
                    parent.nodeName === 'SCRIPT') {
                    this.__commitText('/* lit-html will not write ' +
                        'TemplateResults to scripts and styles */');
                    return;
                }
                // Make sure we propagate the template processor from the TemplateResult
                // so that we use its syntax extension, etc. The template factory comes
                // from the render function options so that it can control template
                // caching and preprocessing.
                const instance = new TemplateInstance(template, value.processor, this.options);
                const fragment = instance._clone();
                instance.update(value.values);
                this.__commitNode(fragment);
                this.value = instance;
            }
        }
        __commitIterable(value) {
            // For an Iterable, we create a new InstancePart per item, then set its
            // value to the item. This is a little bit of overhead for every item in
            // an Iterable, but it lets us recurse easily and efficiently update Arrays
            // of TemplateResults that will be commonly returned from expressions like:
            // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
            // If _value is an array, then the previous render was of an
            // iterable and _value will contain the NodeParts from the previous
            // render. If _value is not an array, clear this part and make a new
            // array for NodeParts.
            if (!Array.isArray(this.value)) {
                this.value = [];
                this.clear();
            }
            // Lets us keep track of how many items we stamped so we can clear leftover
            // items from a previous render
            const itemParts = this.value;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
                // Try to reuse an existing part
                itemPart = itemParts[partIndex];
                // If no existing part, create a new one
                if (itemPart === undefined) {
                    itemPart = new NodePart(this.options);
                    itemParts.push(itemPart);
                    if (partIndex === 0) {
                        itemPart.appendIntoPart(this);
                    }
                    else {
                        itemPart.insertAfterPart(itemParts[partIndex - 1]);
                    }
                }
                itemPart.setValue(item);
                itemPart.commit();
                partIndex++;
            }
            if (partIndex < itemParts.length) {
                // Truncate the parts array so _value reflects the current state
                itemParts.length = partIndex;
                this.clear(itemPart && itemPart.endNode);
            }
        }
        clear(startNode = this.startNode) {
            removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
        }
    }
    /**
     * Implements a boolean attribute, roughly as defined in the HTML
     * specification.
     *
     * If the value is truthy, then the attribute is present with a value of
     * ''. If the value is falsey, the attribute is removed.
     */
    class BooleanAttributePart {
        constructor(element, name, strings) {
            this.value = undefined;
            this.__pendingValue = undefined;
            if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
                throw new Error('Boolean attributes can only contain a single expression');
            }
            this.element = element;
            this.name = name;
            this.strings = strings;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                // @ts-ignore
                if (directive.isClass) {
                    // @ts-ignore
                    directive.runPart(this);
                }
                else {
                    directive(this);
                }
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const value = !!this.__pendingValue;
            if (this.value !== value) {
                if (value) {
                    this.element.setAttribute(this.name, '');
                }
                else {
                    this.element.removeAttribute(this.name);
                }
                this.value = value;
            }
            this.__pendingValue = noChange;
        }
    }
    /**
     * Sets attribute values for PropertyParts, so that the value is only set once
     * even if there are multiple parts for a property.
     *
     * If an expression controls the whole property value, then the value is simply
     * assigned to the property under control. If there are string literals or
     * multiple expressions, then the strings are expressions are interpolated into
     * a string first.
     */
    class PropertyCommitter extends AttributeCommitter {
        constructor(element, name, strings) {
            super(element, name, strings);
            this.single =
                (strings.length === 2 && strings[0] === '' && strings[1] === '');
        }
        _createPart() {
            return new PropertyPart(this);
        }
        _getValue() {
            if (this.single) {
                return this.parts[0].value;
            }
            return super._getValue();
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                let value = this._getValue();
                value = sanitizeDOMValue(value, this.name, 'property', this.element);
                // tslint:disable-next-line:no-any
                this.element[this.name] = value;
            }
        }
    }
    class PropertyPart extends AttributePart {
    }
    // Detect event listener options support. If the `capture` property is read
    // from the options object, then options are supported. If not, then the third
    // argument to add/removeEventListener is interpreted as the boolean capture
    // value so we should only pass the `capture` property.
    let eventOptionsSupported = false;
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // tslint:disable-next-line:no-any
        window.addEventListener('test', options, options);
        // tslint:disable-next-line:no-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
    }
    class EventPart {
        constructor(element, eventName, eventContext) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.element = element;
            this.eventName = eventName;
            this.eventContext = eventContext;
            this.__boundHandleEvent = (e) => this.handleEvent(e);
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                // @ts-ignore
                if (directive.isClass) {
                    // @ts-ignore
                    directive.runPart(this);
                }
                else {
                    directive(this);
                }
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const newListener = this.__pendingValue;
            const oldListener = this.value;
            const shouldRemoveListener = newListener == null ||
                oldListener != null &&
                    (newListener.capture !== oldListener.capture ||
                        newListener.once !== oldListener.once ||
                        newListener.passive !== oldListener.passive);
            const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
            if (shouldRemoveListener) {
                this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            if (shouldAddListener) {
                this.__options = getOptions(newListener);
                this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            this.value = newListener;
            this.__pendingValue = noChange;
        }
        handleEvent(event) {
            if (typeof this.value === 'function') {
                this.value.call(this.eventContext || this.element, event);
            }
            else {
                this.value.handleEvent(event);
            }
        }
    }
    // We copy options because of the inconsistent behavior of browsers when reading
    // the third argument of add/removeEventListener. IE11 doesn't support options
    // at all. Chrome 41 only reads `capture` if the argument is an object.
    const getOptions = (o) => o &&
        (eventOptionsSupported ?
            { capture: o.capture, passive: o.passive, once: o.once } :
            o.capture);

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * Creates Parts when a template is instantiated.
     */
    class DefaultTemplateProcessor {
        /**
         * Create parts for an attribute-position binding, given the event, attribute
         * name, and string literals.
         *
         * @param element The element containing the binding
         * @param name  The attribute name
         * @param strings The string literals. There are always at least two strings,
         *   event for fully-controlled bindings with a single expression.
         */
        handleAttributeExpressions(element, name, strings, options) {
            const prefix = name[0];
            if (prefix === '.') {
                const committer = new PropertyCommitter(element, name.slice(1), strings);
                return committer.parts;
            }
            if (prefix === '@') {
                return [new EventPart(element, name.slice(1), options.eventContext)];
            }
            if (prefix === '?') {
                return [new BooleanAttributePart(element, name.slice(1), strings)];
            }
            const committer = new AttributeCommitter(element, name, strings);
            return committer.parts;
        }
        /**
         * Create parts for a text-position binding.
         * @param templateFactory
         */
        handleTextExpression(options) {
            return new NodePart(options);
        }
    }
    const defaultTemplateProcessor = new DefaultTemplateProcessor();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * The default TemplateFactory which caches Templates keyed on
     * result.type and result.strings.
     */
    function templateFactory(result) {
        let templateCache = templateCaches.get(result.type);
        if (templateCache === undefined) {
            templateCache = {
                stringsArray: new WeakMap(),
                keyString: new Map()
            };
            templateCaches.set(result.type, templateCache);
        }
        let template = templateCache.stringsArray.get(result.strings);
        if (template !== undefined) {
            return template;
        }
        // If the TemplateStringsArray is new, generate a key from the strings
        // This key is shared between all templates with identical content
        const key = result.strings.join(marker);
        // Check if we already have a Template for this key
        template = templateCache.keyString.get(key);
        if (template === undefined) {
            // If we have not seen this key before, create a new Template
            template = new Template(result, result.getTemplateElement());
            // Cache the Template for this key
            templateCache.keyString.set(key, template);
        }
        // Cache all future queries for this TemplateStringsArray
        templateCache.stringsArray.set(result.strings, template);
        return template;
    }
    const templateCaches = new Map();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const parts = new WeakMap();
    /**
     * Renders a template result or other value to a container.
     *
     * To update a container with new values, reevaluate the template literal and
     * call `render` with the new result.
     *
     * @param result Any value renderable by NodePart - typically a TemplateResult
     *     created by evaluating a template tag like `html` or `svg`.
     * @param container A DOM parent to render to. The entire contents are either
     *     replaced, or efficiently updated if the same result type was previous
     *     rendered there.
     * @param options RenderOptions for the entire render tree rendered to this
     *     container. Render options must *not* change between renders to the same
     *     container, as those changes will not effect previously rendered DOM.
     */
    const render = (result, container, options) => {
        let part = parts.get(container);
        if (part === undefined) {
            removeNodes(container, container.firstChild);
            parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
            part.appendInto(container);
        }
        part.setValue(result);
        part.commit();
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // IMPORTANT: do not change the property name or the assignment expression.
    // This line will be used in regexes to search for lit-html usage.
    // TODO(justinfagnani): inject version number at build time
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
    /**
     * Interprets a template literal as an HTML template that can efficiently
     * render to and update a container.
     */
    const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
    /**
     * Interprets a template literal as an SVG template that can efficiently
     * render to and update a container.
     */
    const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };
    /**
     * A directive that renders the items of an async iterable[1], appending new
     * values after previous values, similar to the built-in support for iterables.
     *
     * Async iterables are objects with a [Symbol.asyncIterator] method, which
     * returns an iterator who's `next()` method returns a Promise. When a new
     * value is available, the Promise resolves and the value is appended to the
     * Part controlled by the directive. If another value other than this
     * directive has been set on the Part, the iterable will no longer be listened
     * to and new values won't be written to the Part.
     *
     * [1]: https://github.com/tc39/proposal-async-iteration
     *
     * @param value An async iterable
     * @param mapper An optional function that maps from (value, index) to another
     *     value. Useful for generating templates for each item in the iterable.
     */
    const asyncAppend = directive((value, mapper) => async (part) => {
        var e_1, _a;
        if (!(part instanceof NodePart)) {
            throw new Error('asyncAppend can only be used in text bindings');
        }
        // If we've already set up this particular iterable, we don't need
        // to do anything.
        if (value === part.value) {
            return;
        }
        part.value = value;
        // We keep track of item Parts across iterations, so that we can
        // share marker nodes between consecutive Parts.
        let itemPart;
        let i = 0;
        try {
            for (var value_1 = __asyncValues(value), value_1_1; value_1_1 = await value_1.next(), !value_1_1.done;) {
                let v = value_1_1.value;
                // Check to make sure that value is the still the current value of
                // the part, and if not bail because a new value owns this part
                if (part.value !== value) {
                    break;
                }
                // When we get the first value, clear the part. This lets the
                // previous value display until we can replace it.
                if (i === 0) {
                    part.clear();
                }
                // As a convenience, because functional-programming-style
                // transforms of iterables and async iterables requires a library,
                // we accept a mapper function. This is especially convenient for
                // rendering a template for each item.
                if (mapper !== undefined) {
                    // This is safe because T must otherwise be treated as unknown by
                    // the rest of the system.
                    v = mapper(v, i);
                }
                // Like with sync iterables, each item induces a Part, so we need
                // to keep track of start and end nodes for the Part.
                // Note: Because these Parts are not updatable like with a sync
                // iterable (if we render a new value, we always clear), it may
                // be possible to optimize away the Parts and just re-use the
                // Part.setValue() logic.
                let itemStartNode = part.startNode;
                // Check to see if we have a previous item and Part
                if (itemPart !== undefined) {
                    // Create a new node to separate the previous and next Parts
                    itemStartNode = createMarker();
                    // itemPart is currently the Part for the previous item. Set
                    // it's endNode to the node we'll use for the next Part's
                    // startNode.
                    itemPart.endNode = itemStartNode;
                    part.endNode.parentNode.insertBefore(itemStartNode, part.endNode);
                }
                itemPart = new NodePart(part.options);
                itemPart.insertAfterNode(itemStartNode);
                itemPart.setValue(v);
                itemPart.commit();
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (value_1_1 && !value_1_1.done && (_a = value_1.return)) await _a.call(value_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    var __asyncValues$1 = (undefined && undefined.__asyncValues) || function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };
    /**
     * A directive that renders the items of an async iterable[1], replacing
     * previous values with new values, so that only one value is ever rendered
     * at a time.
     *
     * Async iterables are objects with a [Symbol.asyncIterator] method, which
     * returns an iterator who's `next()` method returns a Promise. When a new
     * value is available, the Promise resolves and the value is rendered to the
     * Part controlled by the directive. If another value other than this
     * directive has been set on the Part, the iterable will no longer be listened
     * to and new values won't be written to the Part.
     *
     * [1]: https://github.com/tc39/proposal-async-iteration
     *
     * @param value An async iterable
     * @param mapper An optional function that maps from (value, index) to another
     *     value. Useful for generating templates for each item in the iterable.
     */
    const asyncReplace = directive((value, mapper) => async (part) => {
        var e_1, _a;
        if (!(part instanceof NodePart)) {
            throw new Error('asyncReplace can only be used in text bindings');
        }
        // If we've already set up this particular iterable, we don't need
        // to do anything.
        if (value === part.value) {
            return;
        }
        // We nest a new part to keep track of previous item values separately
        // of the iterable as a value itself.
        const itemPart = new NodePart(part.options);
        part.value = value;
        let i = 0;
        try {
            for (var value_1 = __asyncValues$1(value), value_1_1; value_1_1 = await value_1.next(), !value_1_1.done;) {
                let v = value_1_1.value;
                // Check to make sure that value is the still the current value of
                // the part, and if not bail because a new value owns this part
                if (part.value !== value) {
                    break;
                }
                // When we get the first value, clear the part. This let's the
                // previous value display until we can replace it.
                if (i === 0) {
                    part.clear();
                    itemPart.appendIntoPart(part);
                }
                // As a convenience, because functional-programming-style
                // transforms of iterables and async iterables requires a library,
                // we accept a mapper function. This is especially convenient for
                // rendering a template for each item.
                if (mapper !== undefined) {
                    // This is safe because T must otherwise be treated as unknown by
                    // the rest of the system.
                    v = mapper(v, i);
                }
                itemPart.setValue(v);
                itemPart.commit();
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (value_1_1 && !value_1_1.done && (_a = value_1.return)) await _a.call(value_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const templateCaches$1 = new WeakMap();
    /**
     * Enables fast switching between multiple templates by caching the DOM nodes
     * and TemplateInstances produced by the templates.
     *
     * Example:
     *
     * ```
     * let checked = false;
     *
     * html`
     *   ${cache(checked ? html`input is checked` : html`input is not checked`)}
     * `
     * ```
     */
    const cache = directive((value) => (part) => {
        if (!(part instanceof NodePart)) {
            throw new Error('cache can only be used in text bindings');
        }
        let templateCache = templateCaches$1.get(part);
        if (templateCache === undefined) {
            templateCache = new WeakMap();
            templateCaches$1.set(part, templateCache);
        }
        const previousValue = part.value;
        // First, can we update the current TemplateInstance, or do we need to move
        // the current nodes into the cache?
        if (previousValue instanceof TemplateInstance) {
            if (value instanceof TemplateResult &&
                previousValue.template === part.options.templateFactory(value)) {
                // Same Template, just trigger an update of the TemplateInstance
                part.setValue(value);
                return;
            }
            else {
                // Not the same Template, move the nodes from the DOM into the cache.
                let cachedTemplate = templateCache.get(previousValue.template);
                if (cachedTemplate === undefined) {
                    cachedTemplate = {
                        instance: previousValue,
                        nodes: document.createDocumentFragment(),
                    };
                    templateCache.set(previousValue.template, cachedTemplate);
                }
                reparentNodes(cachedTemplate.nodes, part.startNode.nextSibling, part.endNode);
            }
        }
        // Next, can we reuse nodes from the cache?
        if (value instanceof TemplateResult) {
            const template = part.options.templateFactory(value);
            const cachedTemplate = templateCache.get(template);
            if (cachedTemplate !== undefined) {
                // Move nodes out of cache
                part.setValue(cachedTemplate.nodes);
                part.commit();
                // Set the Part value to the TemplateInstance so it'll update it.
                part.value = cachedTemplate.instance;
            }
        }
        part.setValue(value);
    });

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * Stores the ClassInfo object applied to a given AttributePart.
     * Used to unset existing values when a new ClassInfo object is applied.
     */
    const previousClassesCache = new WeakMap();
    /**
     * A directive that applies CSS classes. This must be used in the `class`
     * attribute and must be the only part used in the attribute. It takes each
     * property in the `classInfo` argument and adds the property name to the
     * element's `classList` if the property value is truthy; if the property value
     * is falsey, the property name is removed from the element's `classList`. For
     * example
     * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
     * @param classInfo {ClassInfo}
     */
    const classMap = directive((classInfo) => (part) => {
        if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
            part.committer.name !== 'class' || part.committer.parts.length > 1) {
            throw new Error('The `classMap` directive must be used in the `class` attribute ' +
                'and must be the only part in the attribute.');
        }
        const { committer } = part;
        const { element } = committer;
        let previousClasses = previousClassesCache.get(part);
        if (previousClasses === undefined) {
            // Write static classes once
            element.className = committer.strings.join(' ');
            previousClassesCache.set(part, previousClasses = new Set());
        }
        const { classList } = element;
        // Remove old classes that no longer apply
        // We use forEach() instead of for-of so that re don't require down-level
        // iteration.
        previousClasses.forEach((name) => {
            if (!(name in classInfo)) {
                classList.remove(name);
                previousClasses.delete(name);
            }
        });
        // Add or remove classes based on their classMap value
        for (const name in classInfo) {
            const value = classInfo[name];
            // We explicitly want a loose truthy check of `value` because it seems more
            // convenient that '' and 0 are skipped.
            // tslint:disable-next-line: triple-equals
            if (value != previousClasses.has(name)) {
                if (value) {
                    classList.add(name);
                    previousClasses.add(name);
                }
                else {
                    classList.remove(name);
                    previousClasses.delete(name);
                }
            }
        }
    });

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const previousValues = new WeakMap();
    /**
     * Prevents re-render of a template function until a single value or an array of
     * values changes.
     *
     * Example:
     *
     * ```js
     * html`
     *   <div>
     *     ${guard([user.id, company.id], () => html`...`)}
     *   </div>
     * ```
     *
     * In this case, the template only renders if either `user.id` or `company.id`
     * changes.
     *
     * guard() is useful with immutable data patterns, by preventing expensive work
     * until data updates.
     *
     * Example:
     *
     * ```js
     * html`
     *   <div>
     *     ${guard([immutableItems], () => immutableItems.map(i => html`${i}`))}
     *   </div>
     * ```
     *
     * In this case, items are mapped over only when the array reference changes.
     *
     * @param value the value to check before re-rendering
     * @param f the template function
     */
    const guard = directive((value, f) => (part) => {
        const previousValue = previousValues.get(part);
        if (Array.isArray(value)) {
            // Dirty-check arrays by item
            if (Array.isArray(previousValue) &&
                previousValue.length === value.length &&
                value.every((v, i) => v === previousValue[i])) {
                return;
            }
        }
        else if (previousValue === value &&
            (value !== undefined || previousValues.has(part))) {
            // Dirty-check non-arrays by identity
            return;
        }
        part.setValue(f());
        // Copy the value if it's an array so that if it's mutated we don't forget
        // what the previous values were.
        previousValues.set(part, Array.isArray(value) ? Array.from(value) : value);
    });

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * For AttributeParts, sets the attribute if the value is defined and removes
     * the attribute if the value is undefined.
     *
     * For other part types, this directive is a no-op.
     */
    const ifDefined = directive((value) => (part) => {
        if (value === undefined && part instanceof AttributePart) {
            if (value !== part.value) {
                const name = part.committer.name;
                part.committer.element.removeAttribute(name);
            }
        }
        else {
            part.setValue(value);
        }
    });

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // Helper functions for manipulating parts
    // TODO(kschaaf): Refactor into Part API?
    const createAndInsertPart = (containerPart, beforePart) => {
        const container = containerPart.startNode.parentNode;
        const beforeNode = beforePart === undefined ? containerPart.endNode :
            beforePart.startNode;
        const startNode = container.insertBefore(createMarker(), beforeNode);
        container.insertBefore(createMarker(), beforeNode);
        const newPart = new NodePart(containerPart.options);
        newPart.insertAfterNode(startNode);
        return newPart;
    };
    const updatePart = (part, value) => {
        part.setValue(value);
        part.commit();
        return part;
    };
    const insertPartBefore = (containerPart, part, ref) => {
        const container = containerPart.startNode.parentNode;
        const beforeNode = ref ? ref.startNode : containerPart.endNode;
        const endNode = part.endNode.nextSibling;
        if (endNode !== beforeNode) {
            reparentNodes(container, part.startNode, endNode, beforeNode);
        }
    };
    const removePart = (part) => {
        removeNodes(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
    };
    // Helper for generating a map of array item to its index over a subset
    // of an array (used to lazily generate `newKeyToIndexMap` and
    // `oldKeyToIndexMap`)
    const generateMap = (list, start, end) => {
        const map = new Map();
        for (let i = start; i <= end; i++) {
            map.set(list[i], i);
        }
        return map;
    };
    // Stores previous ordered list of parts and map of key to index
    const partListCache = new WeakMap();
    const keyListCache = new WeakMap();
    /**
     * A directive that repeats a series of values (usually `TemplateResults`)
     * generated from an iterable, and updates those items efficiently when the
     * iterable changes based on user-provided `keys` associated with each item.
     *
     * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
     * meaning previous DOM for a given key is moved into the new position if
     * needed, and DOM will never be reused with values for different keys (new DOM
     * will always be created for new keys). This is generally the most efficient
     * way to use `repeat` since it performs minimum unnecessary work for insertions
     * and removals.
     *
     * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
     * given call to `repeat`. The behavior when two or more items have the same key
     * is undefined.
     *
     * If no `keyFn` is provided, this directive will perform similar to mapping
     * items to values, and DOM will be reused against potentially different items.
     */
    const repeat = directive((items, keyFnOrTemplate, template) => {
        let keyFn;
        if (template === undefined) {
            template = keyFnOrTemplate;
        }
        else if (keyFnOrTemplate !== undefined) {
            keyFn = keyFnOrTemplate;
        }
        return (containerPart) => {
            if (!(containerPart instanceof NodePart)) {
                throw new Error('repeat can only be used in text bindings');
            }
            // Old part & key lists are retrieved from the last update
            // (associated with the part for this instance of the directive)
            const oldParts = partListCache.get(containerPart) || [];
            const oldKeys = keyListCache.get(containerPart) || [];
            // New part list will be built up as we go (either reused from
            // old parts or created for new keys in this update). This is
            // saved in the above cache at the end of the update.
            const newParts = [];
            // New value list is eagerly generated from items along with a
            // parallel array indicating its key.
            const newValues = [];
            const newKeys = [];
            let index = 0;
            for (const item of items) {
                newKeys[index] = keyFn ? keyFn(item, index) : index;
                newValues[index] = template(item, index);
                index++;
            }
            // Maps from key to index for current and previous update; these
            // are generated lazily only when needed as a performance
            // optimization, since they are only required for multiple
            // non-contiguous changes in the list, which are less common.
            let newKeyToIndexMap;
            let oldKeyToIndexMap;
            // Head and tail pointers to old parts and new values
            let oldHead = 0;
            let oldTail = oldParts.length - 1;
            let newHead = 0;
            let newTail = newValues.length - 1;
            // Overview of O(n) reconciliation algorithm (general approach
            // based on ideas found in ivi, vue, snabbdom, etc.):
            //
            // * We start with the list of old parts and new values (and
            //   arrays of their respective keys), head/tail pointers into
            //   each, and we build up the new list of parts by updating
            //   (and when needed, moving) old parts or creating new ones.
            //   The initial scenario might look like this (for brevity of
            //   the diagrams, the numbers in the array reflect keys
            //   associated with the old parts or new values, although keys
            //   and parts/values are actually stored in parallel arrays
            //   indexed using the same head/tail pointers):
            //
            //      oldHead v                 v oldTail
            //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
            //   newParts: [ ,  ,  ,  ,  ,  ,  ]
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
            //                                      item order
            //      newHead ^                 ^ newTail
            //
            // * Iterate old & new lists from both sides, updating,
            //   swapping, or removing parts at the head/tail locations
            //   until neither head nor tail can move.
            //
            // * Example below: keys at head pointers match, so update old
            //   part 0 in-place (no need to move it) and record part 0 in
            //   the `newParts` list. The last thing we do is advance the
            //   `oldHead` and `newHead` pointers (will be reflected in the
            //   next diagram).
            //
            //      oldHead v                 v oldTail
            //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
            //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
            //                                      & newHead
            //      newHead ^                 ^ newTail
            //
            // * Example below: head pointers don't match, but tail
            //   pointers do, so update part 6 in place (no need to move
            //   it), and record part 6 in the `newParts` list. Last,
            //   advance the `oldTail` and `oldHead` pointers.
            //
            //         oldHead v              v oldTail
            //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
            //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldTail
            //                                      & newTail
            //         newHead ^              ^ newTail
            //
            // * If neither head nor tail match; next check if one of the
            //   old head/tail items was removed. We first need to generate
            //   the reverse map of new keys to index (`newKeyToIndexMap`),
            //   which is done once lazily as a performance optimization,
            //   since we only hit this case if multiple non-contiguous
            //   changes were made. Note that for contiguous removal
            //   anywhere in the list, the head and tails would advance
            //   from either end and pass each other before we get to this
            //   case and removals would be handled in the final while loop
            //   without needing to generate the map.
            //
            // * Example below: The key at `oldTail` was removed (no longer
            //   in the `newKeyToIndexMap`), so remove that part from the
            //   DOM and advance just the `oldTail` pointer.
            //
            //         oldHead v           v oldTail
            //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
            //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map: remove
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    5 and advance oldTail
            //         newHead ^           ^ newTail
            //
            // * Once head and tail cannot move, any mismatches are due to
            //   either new or moved items; if a new key is in the previous
            //   "old key to old index" map, move the old part to the new
            //   location, otherwise create and insert a new part. Note
            //   that when moving an old part we null its position in the
            //   oldParts array if it lies between the head and tail so we
            //   know to skip it when the pointers get there.
            //
            // * Example below: neither head nor tail match, and neither
            //   were removed; so find the `newHead` key in the
            //   `oldKeyToIndexMap`, and move that old part's DOM into the
            //   next head position (before `oldParts[oldHead]`). Last,
            //   null the part in the `oldPart` array since it was
            //   somewhere in the remaining oldParts still to be scanned
            //   (between the head and tail pointers) so that we know to
            //   skip that old part on future iterations.
            //
            //         oldHead v        v oldTail
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
            //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck: update & move 2
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    into place and advance
            //                                      newHead
            //         newHead ^           ^ newTail
            //
            // * Note that for moves/insertions like the one above, a part
            //   inserted at the head pointer is inserted before the
            //   current `oldParts[oldHead]`, and a part inserted at the
            //   tail pointer is inserted before `newParts[newTail+1]`. The
            //   seeming asymmetry lies in the fact that new parts are
            //   moved into place outside in, so to the right of the head
            //   pointer are old parts, and to the right of the tail
            //   pointer are new parts.
            //
            // * We always restart back from the top of the algorithm,
            //   allowing matching and simple updates in place to
            //   continue...
            //
            // * Example below: the head pointers once again match, so
            //   simply update part 1 and record it in the `newParts`
            //   array.  Last, advance both head pointers.
            //
            //         oldHead v        v oldTail
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
            //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched: update 1
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
            //                                      & newHead
            //            newHead ^        ^ newTail
            //
            // * As mentioned above, items that were moved as a result of
            //   being stuck (the final else clause in the code below) are
            //   marked with null, so we always advance old pointers over
            //   these so we're comparing the next actual old value on
            //   either end.
            //
            // * Example below: `oldHead` is null (already placed in
            //   newParts), so advance `oldHead`.
            //
            //            oldHead v     v oldTail
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6] <- old head already used:
            //   newParts: [0, 2, 1,  ,  ,  , 6]    advance oldHead
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
            //               newHead ^     ^ newTail
            //
            // * Note it's not critical to mark old parts as null when they
            //   are moved from head to tail or tail to head, since they
            //   will be outside the pointer range and never visited again.
            //
            // * Example below: Here the old tail key matches the new head
            //   key, so the part at the `oldTail` position and move its
            //   DOM to the new head position (before `oldParts[oldHead]`).
            //   Last, advance `oldTail` and `newHead` pointers.
            //
            //               oldHead v  v oldTail
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
            //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]   head: update & move 4,
            //                                     advance oldTail & newHead
            //               newHead ^     ^ newTail
            //
            // * Example below: Old and new head keys match, so update the
            //   old head part in place, and advance the `oldHead` and
            //   `newHead` pointers.
            //
            //               oldHead v oldTail
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
            //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance oldHead &
            //                                      newHead
            //                  newHead ^  ^ newTail
            //
            // * Once the new or old pointers move past each other then all
            //   we have left is additions (if old list exhausted) or
            //   removals (if new list exhausted). Those are handled in the
            //   final while loops at the end.
            //
            // * Example below: `oldHead` exceeded `oldTail`, so we're done
            //   with the main loop.  Create the remaining part and insert
            //   it at the new head position, and the update is complete.
            //
            //                   (oldHead > oldTail)
            //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
            //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
            //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
            //                     newHead ^ newTail
            //
            // * Note that the order of the if/else clauses is not
            //   important to the algorithm, as long as the null checks
            //   come first (to ensure we're always working on valid old
            //   parts) and that the final else clause comes last (since
            //   that's where the expensive moves occur). The order of
            //   remaining clauses is is just a simple guess at which cases
            //   will be most common.
            //
            // * TODO(kschaaf) Note, we could calculate the longest
            //   increasing subsequence (LIS) of old items in new position,
            //   and only move those not in the LIS set. However that costs
            //   O(nlogn) time and adds a bit more code, and only helps
            //   make rare types of mutations require fewer moves. The
            //   above handles removes, adds, reversal, swaps, and single
            //   moves of contiguous items in linear time, in the minimum
            //   number of moves. As the number of multiple moves where LIS
            //   might help approaches a random shuffle, the LIS
            //   optimization becomes less helpful, so it seems not worth
            //   the code at this point. Could reconsider if a compelling
            //   case arises.
            while (oldHead <= oldTail && newHead <= newTail) {
                if (oldParts[oldHead] === null) {
                    // `null` means old part at head has already been used
                    // below; skip
                    oldHead++;
                }
                else if (oldParts[oldTail] === null) {
                    // `null` means old part at tail has already been used
                    // below; skip
                    oldTail--;
                }
                else if (oldKeys[oldHead] === newKeys[newHead]) {
                    // Old head matches new head; update in place
                    newParts[newHead] =
                        updatePart(oldParts[oldHead], newValues[newHead]);
                    oldHead++;
                    newHead++;
                }
                else if (oldKeys[oldTail] === newKeys[newTail]) {
                    // Old tail matches new tail; update in place
                    newParts[newTail] =
                        updatePart(oldParts[oldTail], newValues[newTail]);
                    oldTail--;
                    newTail--;
                }
                else if (oldKeys[oldHead] === newKeys[newTail]) {
                    // Old head matches new tail; update and move to new tail
                    newParts[newTail] =
                        updatePart(oldParts[oldHead], newValues[newTail]);
                    insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
                    oldHead++;
                    newTail--;
                }
                else if (oldKeys[oldTail] === newKeys[newHead]) {
                    // Old tail matches new head; update and move to new head
                    newParts[newHead] =
                        updatePart(oldParts[oldTail], newValues[newHead]);
                    insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
                    oldTail--;
                    newHead++;
                }
                else {
                    if (newKeyToIndexMap === undefined) {
                        // Lazily generate key-to-index maps, used for removals &
                        // moves below
                        newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
                        oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
                    }
                    if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
                        // Old head is no longer in new list; remove
                        removePart(oldParts[oldHead]);
                        oldHead++;
                    }
                    else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
                        // Old tail is no longer in new list; remove
                        removePart(oldParts[oldTail]);
                        oldTail--;
                    }
                    else {
                        // Any mismatches at this point are due to additions or
                        // moves; see if we have an old part we can reuse and move
                        // into place
                        const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
                        const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;
                        if (oldPart === null) {
                            // No old part for this value; create a new one and
                            // insert it
                            const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
                            updatePart(newPart, newValues[newHead]);
                            newParts[newHead] = newPart;
                        }
                        else {
                            // Reuse old part
                            newParts[newHead] =
                                updatePart(oldPart, newValues[newHead]);
                            insertPartBefore(containerPart, oldPart, oldParts[oldHead]);
                            // This marks the old part as having been used, so that
                            // it will be skipped in the first two checks above
                            oldParts[oldIndex] = null;
                        }
                        newHead++;
                    }
                }
            }
            // Add parts for any remaining new values
            while (newHead <= newTail) {
                // For all remaining additions, we insert before last new
                // tail, since old pointers are no longer valid
                const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
                updatePart(newPart, newValues[newHead]);
                newParts[newHead++] = newPart;
            }
            // Remove any remaining unused old parts
            while (oldHead <= oldTail) {
                const oldPart = oldParts[oldHead++];
                if (oldPart !== null) {
                    removePart(oldPart);
                }
            }
            // Save order of new parts for next round
            partListCache.set(containerPart, newParts);
            keyListCache.set(containerPart, newKeys);
        };
    });

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // For each part, remember the value that was last rendered to the part by the
    // unsafeHTML directive, and the DocumentFragment that was last set as a value.
    // The DocumentFragment is used as a unique key to check if the last value
    // rendered to the part was with unsafeHTML. If not, we'll always re-render the
    // value passed to unsafeHTML.
    const previousValues$1 = new WeakMap();
    /**
     * Used to clone existing node instead of each time creating new one which is
     * slower
     */
    const emptyTemplateNode$1 = document.createElement('template');
    /**
     * Renders the result as HTML, rather than text.
     *
     * Note, this is unsafe to use with any user-provided input that hasn't been
     * sanitized or escaped, as it may lead to cross-site-scripting
     * vulnerabilities.
     */
    const unsafeHTML = directive((value) => (part) => {
        if (!(part instanceof NodePart)) {
            throw new Error('unsafeHTML can only be used in text bindings');
        }
        const previousValue = previousValues$1.get(part);
        if (previousValue !== undefined && isPrimitive(value) &&
            value === previousValue.value && part.value === previousValue.fragment) {
            return;
        }
        const template = emptyTemplateNode$1.cloneNode();
        template.innerHTML = value; // innerHTML casts to string internally
        const fragment = document.importNode(template.content, true);
        part.setValue(fragment);
        previousValues$1.set(part, { value, fragment });
    });

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const _state = new WeakMap();
    // Effectively infinity, but a SMI.
    const _infinity = 0x7fffffff;
    /**
     * Renders one of a series of values, including Promises, to a Part.
     *
     * Values are rendered in priority order, with the first argument having the
     * highest priority and the last argument having the lowest priority. If a
     * value is a Promise, low-priority values will be rendered until it resolves.
     *
     * The priority of values can be used to create placeholder content for async
     * data. For example, a Promise with pending content can be the first,
     * highest-priority, argument, and a non_promise loading indicator template can
     * be used as the second, lower-priority, argument. The loading indicator will
     * render immediately, and the primary content will render when the Promise
     * resolves.
     *
     * Example:
     *
     *     const content = fetch('./content.txt').then(r => r.text());
     *     html`${until(content, html`<span>Loading...</span>`)}`
     */
    const until = directive((...args) => (part) => {
        let state = _state.get(part);
        if (state === undefined) {
            state = {
                lastRenderedIndex: _infinity,
                values: [],
            };
            _state.set(part, state);
        }
        const previousValues = state.values;
        let previousLength = previousValues.length;
        state.values = args;
        for (let i = 0; i < args.length; i++) {
            // If we've rendered a higher-priority value already, stop.
            if (i > state.lastRenderedIndex) {
                break;
            }
            const value = args[i];
            // Render non-Promise values immediately
            if (isPrimitive(value) ||
                typeof value.then !== 'function') {
                part.setValue(value);
                state.lastRenderedIndex = i;
                // Since a lower-priority value will never overwrite a higher-priority
                // synchronous value, we can stop processing now.
                break;
            }
            // If this is a Promise we've already handled, skip it.
            if (i < previousLength && value === previousValues[i]) {
                continue;
            }
            // We have a Promise that we haven't seen before, so priorities may have
            // changed. Forget what we rendered before.
            state.lastRenderedIndex = _infinity;
            previousLength = 0;
            Promise.resolve(value).then((resolvedValue) => {
                const index = state.values.indexOf(value);
                // If state.values doesn't contain the value, we've re-rendered without
                // the value, so don't render it. Then, only render if the value is
                // higher-priority than what's already been rendered.
                if (index > -1 && index < state.lastRenderedIndex) {
                    state.lastRenderedIndex = index;
                    part.setValue(resolvedValue);
                    part.commit();
                }
            });
        }
    });

    /* dev imports
    import { render, html, directive, svg, Part } from '../lit-html';
    import { asyncAppend } from '../lit-html/directives/async-append';
    import { asyncReplace } from '../lit-html/directives/async-replace';
    import { cache } from '../lit-html/directives/cache';
    import { classMap } from '../lit-html/directives/class-map';
    import { guard } from '../lit-html/directives/guard';
    import { ifDefined } from '../lit-html/directives/if-defined';
    import { repeat } from '../lit-html/directives/repeat';
    import { unsafeHTML } from '../lit-html/directives/unsafe-html';
    import { until } from '../lit-html/directives/until';
    import { Directive } from '../lit-html/lib/directive';
    */
    /**
     * Schedule - a throttle function that uses requestAnimationFrame to limit the rate at which a function is called.
     *
     * @param {function} fn
     * @returns {function}
     */
    function schedule(fn) {
        let frameId = 0;
        function wrapperFn(argument) {
            if (frameId) {
                return;
            }
            function executeFrame() {
                frameId = 0;
                fn.apply(undefined, [argument]);
            }
            frameId = requestAnimationFrame(executeFrame);
        }
        return wrapperFn;
    }
    /**
     * Is object - helper function to determine if specified variable is an object
     *
     * @param {any} item
     * @returns {boolean}
     */
    function isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    /**
     * Merge deep - helper function which will merge objects recursively - creating brand new one - like clone
     *
     * @param {object} target
     * @params {object} sources
     * @returns {object}
     */
    function mergeDeep(target, ...sources) {
        const source = sources.shift();
        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (typeof target[key] === 'undefined') {
                        target[key] = {};
                    }
                    target[key] = mergeDeep(target[key], source[key]);
                }
                else if (Array.isArray(source[key])) {
                    target[key] = [];
                    for (let item of source[key]) {
                        if (isObject(item)) {
                            target[key].push(mergeDeep({}, item));
                            continue;
                        }
                        target[key].push(item);
                    }
                }
                else {
                    target[key] = source[key];
                }
            }
        }
        if (!sources.length) {
            return target;
        }
        return mergeDeep(target, ...sources);
    }
    /**
     * Clone helper function
     *
     * @param source
     * @returns {object} cloned source
     */
    function clone(source) {
        if (typeof source.actions !== 'undefined') {
            const actns = source.actions.map((action) => {
                const result = Object.assign({}, action);
                const props = Object.assign({}, result.props);
                delete props.state;
                delete props.api;
                delete result.element;
                result.props = props;
                return result;
            });
            source.actions = actns;
        }
        return mergeDeep({}, source);
    }
    /**
     * Vido library
     *
     * @param {any} state - state management for the view (can be anything)
     * @param {any} api - some api's or other globally available services
     * @returns {object} vido instance
     */
    function Vido(state, api) {
        let componentId = 0;
        const components = new Map();
        let actionsByInstance = new Map();
        let app, element;
        let shouldUpdateCount = 0;
        const resolved = Promise.resolve();
        /**
         * Get actions for component instance as directives
         *
         * @param {string} instance
         * @returns {function} directive that will execute actions
         */
        function getActions(instance) {
            return directive(function actionsByInstanceDirective(createFunctions, props = {}) {
                return function actions(part) {
                    const element = part.committer.element;
                    for (const create of createFunctions) {
                        if (typeof create === 'function') {
                            let exists;
                            if (actionsByInstance.has(instance)) {
                                for (const action of actionsByInstance.get(instance)) {
                                    if (action.componentAction.create === create && action.element === element) {
                                        exists = action;
                                        break;
                                    }
                                }
                            }
                            if (!exists) {
                                if (typeof element.vido !== 'undefined')
                                    delete element.vido;
                                const componentAction = { create, update() { }, destroy() { } };
                                const action = { instance, componentAction, element, props };
                                let byInstance = [];
                                if (actionsByInstance.has(instance)) {
                                    byInstance = actionsByInstance.get(instance);
                                }
                                byInstance.push(action);
                                actionsByInstance.set(instance, byInstance);
                            }
                            else {
                                exists.props = props;
                            }
                        }
                    }
                    part.setValue('');
                };
            });
        }
        class PublicComponentMethods {
            constructor(instance, vidoInstance, props = {}) {
                this.instance = instance;
                this.vidoInstance = vidoInstance;
                this.props = props;
                this.destroy = this.destroy.bind(this);
                this.update = this.update.bind(this);
                this.change = this.change.bind(this);
                this.html = this.html.bind(this);
            }
            /**
             * Destroy component
             */
            destroy() {
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`destroying component ${this.instance}`);
                    console.log(clone({ components: components.keys(), actionsByInstance }));
                    console.trace();
                    console.groupEnd();
                }
                return this.vidoInstance.destroyComponent(this.instance, this.vidoInstance);
            }
            /**
             * Update template - trigger rendering process
             */
            update() {
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`updating component ${this.instance}`);
                    console.log(clone({ components: components.keys(), actionsByInstance }));
                    console.trace();
                    console.groupEnd();
                }
                return this.vidoInstance.updateTemplate(this.vidoInstance);
            }
            /**
             * Change component input properties
             * @param {any} newProps
             */
            change(newProps, options) {
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`changing component ${this.instance}`);
                    console.log(clone({ props: this.props, newProps: newProps, components: components.keys(), actionsByInstance }));
                    console.trace();
                    console.groupEnd();
                }
                components.get(this.instance).change(newProps, options);
            }
            /**
             * Get component lit-html template
             * @param {} templateProps
             */
            html(templateProps = {}) {
                return components.get(this.instance).update(templateProps, this.vidoInstance);
            }
        }
        /**
         * Create vido instance for component
         */
        function vido() {
            this.destroyable = [];
            this.onChangeFunctions = [];
            this.debug = false;
            this.state = state;
            this.api = api;
            this.lastProps = {};
            this.reuseComponents = this.reuseComponents.bind(this);
            this.onDestroy = this.onDestroy.bind(this);
            this.onChange = this.onChange.bind(this);
            this.update = this.update.bind(this);
        }
        vido.prototype.html = html;
        vido.prototype.svg = svg;
        vido.prototype.directive = directive;
        vido.prototype.asyncAppend = asyncAppend;
        vido.prototype.asyncReplace = asyncReplace;
        vido.prototype.cache = cache;
        vido.prototype.classMap = classMap;
        vido.prototype.guard = guard;
        vido.prototype.ifDefined = ifDefined;
        vido.prototype.repeat = repeat;
        vido.prototype.unsafeHTML = unsafeHTML;
        /*vido.prototype.unsafeHTML = directive((value) => (part) => {
          const previousValue = previousUnsafeValues.get(part);
          if (
            previousValue !== undefined &&
            isPrimitive(value) &&
            value === previousValue.value &&
            part.value === previousValue.fragment
          ) {
            return;
          }
          const template = templateNode.cloneNode() as HTMLTemplateElement;
          template.innerHTML = value; // innerHTML casts to string internally
          const fragment = document.importNode(template.content, true);
          part.setValue(fragment);
          previousUnsafeValues.set(part, { value, fragment });
        });*/
        vido.prototype.until = until;
        vido.prototype.schedule = schedule;
        vido.prototype.actionsByInstance = (componentActions, props) => { };
        class StyleMap extends Directive {
            constructor(styleInfo) {
                super();
                this.previous = {};
                this.style = styleInfo;
            }
            body(part) {
                // @ts-ignore
                const style = part.committer.element.style;
                let previous = this.previous;
                for (const name in previous) {
                    if (this.style[name] === undefined) {
                        style.removeProperty(name);
                    }
                }
                for (const name in this.style) {
                    const value = this.style[name];
                    const prev = previous[name];
                    if (prev !== undefined && prev === value) {
                        continue;
                    }
                    if (!name.includes('-')) {
                        style[name] = value;
                    }
                    else {
                        style.setProperty(name, value);
                    }
                }
                this.previous = Object.assign({}, this.style);
            }
        }
        vido.prototype.StyleMap = StyleMap;
        vido.prototype.onDestroy = function onDestroy(fn) {
            this.destroyable.push(fn);
        };
        vido.prototype.onChange = function onChange(fn) {
            this.onChangeFunctions.push(fn);
        };
        vido.prototype.update = function update() {
            this.updateTemplate();
        };
        /**
         * Reuse existing components when your data was changed
         *
         * @param {array} currentComponents - array of components
         * @param {array} dataArray  - any data as array for each component
         * @param {function} getProps - you can pass params to component from array item ( example: item=>({id:item.id}) )
         * @param {function} component - what kind of components do you want to create?
         * @param {boolean} leaveTail - leave last elements and do not destroy corresponding components
         * @returns {array} of components (with updated/destroyed/created ones)
         */
        vido.prototype.reuseComponents = function reuseComponents(currentComponents, dataArray, getProps, component, leaveTail = true) {
            const modified = [];
            const currentLen = currentComponents.length;
            const dataLen = dataArray.length;
            let leave = false;
            let leaveStartingAt = 0;
            if (currentLen < dataLen) {
                let diff = dataLen - currentLen;
                while (diff) {
                    const item = dataArray[dataLen - diff];
                    const newComponent = this.createComponent(component, getProps(item));
                    currentComponents.push(newComponent);
                    modified.push(newComponent.instance);
                    diff--;
                }
            }
            else if (currentLen > dataLen) {
                let diff = currentLen - dataLen;
                if (leaveTail) {
                    leave = true;
                    leaveStartingAt = currentLen - diff;
                }
                while (diff) {
                    const index = currentLen - diff;
                    if (!leaveTail) {
                        modified.push(currentComponents[index].instance);
                        currentComponents[index].destroy();
                    }
                    diff--;
                }
                if (!leaveTail) {
                    currentComponents.length = dataLen;
                }
            }
            let index = 0;
            for (const component of currentComponents) {
                const item = dataArray[index];
                if (!modified.includes(component.instance)) {
                    component.change(getProps(item), { leave: leave && index >= leaveStartingAt });
                }
                index++;
            }
            return currentComponents;
        };
        class InternalComponentMethods {
            constructor(instance, vidoInstance, updateFunction) {
                this.instance = instance;
                this.vidoInstance = vidoInstance;
                this.updateFunction = updateFunction;
            }
            destroy() {
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`component destroy method fired ${this.instance}`);
                    console.log(clone({
                        props: this.vidoInstance.props,
                        components: components.keys(),
                        destroyable: this.vidoInstance.destroyable,
                        actionsByInstance
                    }));
                    console.trace();
                    console.groupEnd();
                }
                for (const d of this.vidoInstance.destroyable) {
                    d();
                }
                this.vidoInstance.onChangeFunctions = [];
                this.vidoInstance.destroyable = [];
            }
            update(props = {}) {
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`component update method fired ${this.instance}`);
                    console.log(clone({ components: components.keys(), actionsByInstance }));
                    console.trace();
                    console.groupEnd();
                }
                return this.updateFunction(props);
            }
            change(changedProps, options = { leave: false }) {
                const props = changedProps;
                if (this.vidoInstance.debug) {
                    console.groupCollapsed(`component change method fired ${this.instance}`);
                    console.log(clone({
                        props,
                        components: components.keys(),
                        onChangeFunctions: this.vidoInstance.onChangeFunctions,
                        changedProps,
                        actionsByInstance
                    }));
                    console.trace();
                    console.groupEnd();
                }
                for (const fn of this.vidoInstance.onChangeFunctions) {
                    fn(changedProps, options);
                }
            }
        }
        /**
         * Create component
         *
         * @param {function} component
         * @param {any} props
         * @returns {object} component instance methods
         */
        vido.prototype.createComponent = function createComponent(component, props = {}) {
            const instance = component.name + ':' + componentId++;
            let vidoInstance;
            vidoInstance = new vido();
            vidoInstance.instance = instance;
            vidoInstance.actions = getActions(instance);
            const publicMethods = new PublicComponentMethods(instance, vidoInstance, props);
            const internalMethods = new InternalComponentMethods(instance, vidoInstance, component(vidoInstance, props));
            components.set(instance, internalMethods);
            components.get(instance).change(props);
            if (vidoInstance.debug) {
                console.groupCollapsed(`component created ${instance}`);
                console.log(clone({ props, components: components.keys(), actionsByInstance }));
                console.trace();
                console.groupEnd();
            }
            return publicMethods;
        };
        /**
         * Destroy component
         *
         * @param {string} instance
         * @param {object} vidoInstance
         */
        vido.prototype.destroyComponent = function destroyComponent(instance, vidoInstance) {
            if (vidoInstance.debug) {
                console.groupCollapsed(`destroying component ${instance}...`);
                console.log(clone({ components: components.keys(), actionsByInstance }));
                console.trace();
                console.groupEnd();
            }
            if (actionsByInstance.has(instance)) {
                for (const action of actionsByInstance.get(instance)) {
                    if (typeof action.componentAction.destroy === 'function') {
                        action.componentAction.destroy(action.element, action.props);
                    }
                }
            }
            actionsByInstance.delete(instance);
            components.get(instance).destroy();
            components.delete(instance);
            if (vidoInstance.debug) {
                console.groupCollapsed(`component destroyed ${instance}`);
                console.log(clone({ components: components.keys(), actionsByInstance }));
                console.trace();
                console.groupEnd();
            }
        };
        /**
         * Update template - trigger render proccess
         * @param {object} vidoInstance
         */
        vido.prototype.updateTemplate = function updateTemplate() {
            const currentShouldUpdateCount = ++shouldUpdateCount;
            const self = this;
            function flush() {
                if (currentShouldUpdateCount === shouldUpdateCount) {
                    shouldUpdateCount = 0;
                    self.render();
                }
            }
            resolved.then(flush);
        };
        /**
         * Create app
         *
         * @param config
         * @returns {object} component instance methods
         */
        vido.prototype.createApp = function createApp(config) {
            element = config.element;
            const App = this.createComponent(config.component, config.props);
            app = App.instance;
            this.render();
            return App;
        };
        /**
         * Execute actions
         */
        vido.prototype.executeActions = function executeActions() {
            var _a, _b;
            for (const actions of actionsByInstance.values()) {
                for (const action of actions) {
                    if (action.element.vido === undefined) {
                        const componentAction = action.componentAction;
                        const create = componentAction.create;
                        if (typeof create === 'function') {
                            let result;
                            if (((_a = create.prototype) === null || _a === void 0 ? void 0 : _a.update) === undefined && ((_b = create.prototype) === null || _b === void 0 ? void 0 : _b.destroy) === undefined) {
                                result = create(action.element, action.props);
                            }
                            else {
                                result = new create(action.element, action.props);
                            }
                            if (result !== undefined) {
                                if (typeof result === 'function') {
                                    componentAction.destroy = result;
                                }
                                else {
                                    if (typeof result.update === 'function') {
                                        componentAction.update = result.update.bind(result);
                                    }
                                    if (typeof result.destroy === 'function') {
                                        componentAction.destroy = result.destroy.bind(result);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        action.element.vido = action.props;
                        if (typeof action.componentAction.update === 'function') {
                            action.componentAction.update(action.element, action.props);
                        }
                    }
                }
                for (const action of actions) {
                    action.element.vido = action.props;
                }
            }
        };
        /**
         * Render view
         */
        vido.prototype.render = function renderView() {
            render(components.get(app).update(), element);
            this.executeActions();
        };
        return new vido();
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */
    /* eslint-disable require-jsdoc, valid-jsdoc */
    var MapShim = (function () {
        if (typeof Map !== 'undefined') {
            return Map;
        }
        /**
         * Returns index in provided array that matches the specified key.
         *
         * @param {Array<Array>} arr
         * @param {*} key
         * @returns {number}
         */
        function getIndex(arr, key) {
            var result = -1;
            arr.some(function (entry, index) {
                if (entry[0] === key) {
                    result = index;
                    return true;
                }
                return false;
            });
            return result;
        }
        return /** @class */ (function () {
            function class_1() {
                this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
                /**
                 * @returns {boolean}
                 */
                get: function () {
                    return this.__entries__.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @param {*} key
             * @returns {*}
             */
            class_1.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key);
                var entry = this.__entries__[index];
                return entry && entry[1];
            };
            /**
             * @param {*} key
             * @param {*} value
             * @returns {void}
             */
            class_1.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);
                if (~index) {
                    this.__entries__[index][1] = value;
                }
                else {
                    this.__entries__.push([key, value]);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.delete = function (key) {
                var entries = this.__entries__;
                var index = getIndex(entries, key);
                if (~index) {
                    entries.splice(index, 1);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
            };
            /**
             * @returns {void}
             */
            class_1.prototype.clear = function () {
                this.__entries__.splice(0);
            };
            /**
             * @param {Function} callback
             * @param {*} [ctx=null]
             * @returns {void}
             */
            class_1.prototype.forEach = function (callback, ctx) {
                if (ctx === void 0) { ctx = null; }
                for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    callback.call(ctx, entry[1], entry[0]);
                }
            };
            return class_1;
        }());
    })();

    /**
     * Detects whether window and document objects are available in current environment.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

    // Returns global object of a current environment.
    var global$1 = (function () {
        if (typeof global !== 'undefined' && global.Math === Math) {
            return global;
        }
        if (typeof self !== 'undefined' && self.Math === Math) {
            return self;
        }
        if (typeof window !== 'undefined' && window.Math === Math) {
            return window;
        }
        // eslint-disable-next-line no-new-func
        return Function('return this')();
    })();

    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */
    var requestAnimationFrame$1 = (function () {
        if (typeof requestAnimationFrame === 'function') {
            // It's required to use a bounded function because IE sometimes throws
            // an "Invalid calling object" error if rAF is invoked without the global
            // object on the left hand side.
            return requestAnimationFrame.bind(global$1);
        }
        return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
    })();

    // Defines minimum timeout before adding a trailing call.
    var trailingTimeout = 2;
    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */
    function throttle (callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        /**
         * Invokes the original callback function and schedules new invocation if
         * the "proxy" was called during current request.
         *
         * @returns {void}
         */
        function resolvePending() {
            if (leadingCall) {
                leadingCall = false;
                callback();
            }
            if (trailingCall) {
                proxy();
            }
        }
        /**
         * Callback invoked after the specified delay. It will further postpone
         * invocation of the original function delegating it to the
         * requestAnimationFrame.
         *
         * @returns {void}
         */
        function timeoutCallback() {
            requestAnimationFrame$1(resolvePending);
        }
        /**
         * Schedules invocation of the original function.
         *
         * @returns {void}
         */
        function proxy() {
            var timeStamp = Date.now();
            if (leadingCall) {
                // Reject immediately following calls.
                if (timeStamp - lastCallTime < trailingTimeout) {
                    return;
                }
                // Schedule new call to be in invoked when the pending one is resolved.
                // This is important for "transitions" which never actually start
                // immediately so there is a chance that we might miss one if change
                // happens amids the pending invocation.
                trailingCall = true;
            }
            else {
                leadingCall = true;
                trailingCall = false;
                setTimeout(timeoutCallback, delay);
            }
            lastCallTime = timeStamp;
        }
        return proxy;
    }

    // Minimum delay before invoking the update of observers.
    var REFRESH_DELAY = 20;
    // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.
    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
    // Check if MutationObserver is available.
    var mutationObserverSupported = typeof MutationObserver !== 'undefined';
    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */
    var ResizeObserverController = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserverController.
         *
         * @private
         */
        function ResizeObserverController() {
            /**
             * Indicates whether DOM listeners have been added.
             *
             * @private {boolean}
             */
            this.connected_ = false;
            /**
             * Tells that controller has subscribed for Mutation Events.
             *
             * @private {boolean}
             */
            this.mutationEventsAdded_ = false;
            /**
             * Keeps reference to the instance of MutationObserver.
             *
             * @private {MutationObserver}
             */
            this.mutationsObserver_ = null;
            /**
             * A list of connected observers.
             *
             * @private {Array<ResizeObserverSPI>}
             */
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        }
        /**
         * Adds observer to observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be added.
         * @returns {void}
         */
        ResizeObserverController.prototype.addObserver = function (observer) {
            if (!~this.observers_.indexOf(observer)) {
                this.observers_.push(observer);
            }
            // Add listeners if they haven't been added yet.
            if (!this.connected_) {
                this.connect_();
            }
        };
        /**
         * Removes observer from observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be removed.
         * @returns {void}
         */
        ResizeObserverController.prototype.removeObserver = function (observer) {
            var observers = this.observers_;
            var index = observers.indexOf(observer);
            // Remove observer if it's present in registry.
            if (~index) {
                observers.splice(index, 1);
            }
            // Remove listeners if controller has no connected observers.
            if (!observers.length && this.connected_) {
                this.disconnect_();
            }
        };
        /**
         * Invokes the update of observers. It will continue running updates insofar
         * it detects changes.
         *
         * @returns {void}
         */
        ResizeObserverController.prototype.refresh = function () {
            var changesDetected = this.updateObservers_();
            // Continue running updates if changes have been detected as there might
            // be future ones caused by CSS transitions.
            if (changesDetected) {
                this.refresh();
            }
        };
        /**
         * Updates every observer from observers list and notifies them of queued
         * entries.
         *
         * @private
         * @returns {boolean} Returns "true" if any observer has detected changes in
         *      dimensions of it's elements.
         */
        ResizeObserverController.prototype.updateObservers_ = function () {
            // Collect observers that have active observations.
            var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
            });
            // Deliver notifications in a separate cycle in order to avoid any
            // collisions between observers, e.g. when multiple instances of
            // ResizeObserver are tracking the same element and the callback of one
            // of them changes content dimensions of the observed target. Sometimes
            // this may result in notifications being blocked for the rest of observers.
            activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
            return activeObservers.length > 0;
        };
        /**
         * Initializes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.connect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already added.
            if (!isBrowser || this.connected_) {
                return;
            }
            // Subscription to the "Transitionend" event is used as a workaround for
            // delayed transitions. This way it's possible to capture at least the
            // final state of an element.
            document.addEventListener('transitionend', this.onTransitionEnd_);
            window.addEventListener('resize', this.refresh);
            if (mutationObserverSupported) {
                this.mutationsObserver_ = new MutationObserver(this.refresh);
                this.mutationsObserver_.observe(document, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
            else {
                document.addEventListener('DOMSubtreeModified', this.refresh);
                this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
        };
        /**
         * Removes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.disconnect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already removed.
            if (!isBrowser || !this.connected_) {
                return;
            }
            document.removeEventListener('transitionend', this.onTransitionEnd_);
            window.removeEventListener('resize', this.refresh);
            if (this.mutationsObserver_) {
                this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
                document.removeEventListener('DOMSubtreeModified', this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
        };
        /**
         * "Transitionend" event handler.
         *
         * @private
         * @param {TransitionEvent} event
         * @returns {void}
         */
        ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
            var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
            // Detect whether transition may affect dimensions of an element.
            var isReflowProperty = transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
            });
            if (isReflowProperty) {
                this.refresh();
            }
        };
        /**
         * Returns instance of the ResizeObserverController.
         *
         * @returns {ResizeObserverController}
         */
        ResizeObserverController.getInstance = function () {
            if (!this.instance_) {
                this.instance_ = new ResizeObserverController();
            }
            return this.instance_;
        };
        /**
         * Holds reference to the controller's instance.
         *
         * @private {ResizeObserverController}
         */
        ResizeObserverController.instance_ = null;
        return ResizeObserverController;
    }());

    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */
    var defineConfigurable = (function (target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            Object.defineProperty(target, key, {
                value: props[key],
                enumerable: false,
                writable: false,
                configurable: true
            });
        }
        return target;
    });

    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */
    var getWindowOf = (function (target) {
        // Assume that the element is an instance of Node, which means that it
        // has the "ownerDocument" property from which we can retrieve a
        // corresponding global object.
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        // Return the local global object if it's not possible extract one from
        // provided element.
        return ownerGlobal || global$1;
    });

    // Placeholder of an empty content rectangle.
    var emptyRect = createRectInit(0, 0, 0, 0);
    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */
    function toFloat(value) {
        return parseFloat(value) || 0;
    }
    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */
    function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function (size, position) {
            var value = styles['border-' + position + '-width'];
            return size + toFloat(value);
        }, 0);
    }
    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */
    function getPaddings(styles) {
        var positions = ['top', 'right', 'bottom', 'left'];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            var value = styles['padding-' + position];
            paddings[position] = toFloat(value);
        }
        return paddings;
    }
    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */
    function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
    }
    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */
    function getHTMLElementContentRect(target) {
        // Client width & height properties can't be
        // used exclusively as they provide rounded values.
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        // By this condition we can catch all non-replaced inline, hidden and
        // detached elements. Though elements with width & height properties less
        // than 0.5 will be discarded as well.
        //
        // Without it we would need to implement separate methods for each of
        // those cases and it's not possible to perform a precise and performance
        // effective test for hidden elements. E.g. even jQuery's ':visible' filter
        // gives wrong results for elements with width & height less than 0.5.
        if (!clientWidth && !clientHeight) {
            return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        // Computed styles of width & height are being used because they are the
        // only dimensions available to JS that contain non-rounded values. It could
        // be possible to utilize the getBoundingClientRect if only it's data wasn't
        // affected by CSS transformations let alone paddings, borders and scroll bars.
        var width = toFloat(styles.width), height = toFloat(styles.height);
        // Width & height include paddings and borders when the 'border-box' box
        // model is applied (except for IE).
        if (styles.boxSizing === 'border-box') {
            // Following conditions are required to handle Internet Explorer which
            // doesn't include paddings and borders to computed CSS dimensions.
            //
            // We can say that if CSS dimensions + paddings are equal to the "client"
            // properties then it's either IE, and thus we don't need to subtract
            // anything, or an element merely doesn't have paddings/borders styles.
            if (Math.round(width + horizPad) !== clientWidth) {
                width -= getBordersSize(styles, 'left', 'right') + horizPad;
            }
            if (Math.round(height + vertPad) !== clientHeight) {
                height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
            }
        }
        // Following steps can't be applied to the document's root element as its
        // client[Width/Height] properties represent viewport area of the window.
        // Besides, it's as well not necessary as the <html> itself neither has
        // rendered scroll bars nor it can be clipped.
        if (!isDocumentElement(target)) {
            // In some browsers (only in Firefox, actually) CSS width & height
            // include scroll bars size which can be removed at this step as scroll
            // bars are the only difference between rounded dimensions + paddings
            // and "client" properties, though that is not always true in Chrome.
            var vertScrollbar = Math.round(width + horizPad) - clientWidth;
            var horizScrollbar = Math.round(height + vertPad) - clientHeight;
            // Chrome has a rather weird rounding of "client" properties.
            // E.g. for an element with content width of 314.2px it sometimes gives
            // the client width of 315px and for the width of 314.7px it may give
            // 314px. And it doesn't happen all the time. So just ignore this delta
            // as a non-relevant.
            if (Math.abs(vertScrollbar) !== 1) {
                width -= vertScrollbar;
            }
            if (Math.abs(horizScrollbar) !== 1) {
                height -= horizScrollbar;
            }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
    }
    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    var isSVGGraphicsElement = (function () {
        // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
        // interface.
        if (typeof SVGGraphicsElement !== 'undefined') {
            return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
        }
        // If it's so, then check that element is at least an instance of the
        // SVGElement and that it has the "getBBox" method.
        // eslint-disable-next-line no-extra-parens
        return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
            typeof target.getBBox === 'function'); };
    })();
    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
    }
    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */
    function getContentRect(target) {
        if (!isBrowser) {
            return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
    }
    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */
    function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        // If DOMRectReadOnly is available use it as a prototype for the rectangle.
        var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        // Rectangle's properties are not writable and non-enumerable.
        defineConfigurable(rect, {
            x: x, y: y, width: width, height: height,
            top: y,
            right: x + width,
            bottom: height + y,
            left: x
        });
        return rect;
    }
    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */
    function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }

    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */
    var ResizeObservation = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObservation.
         *
         * @param {Element} target - Element to be observed.
         */
        function ResizeObservation(target) {
            /**
             * Broadcasted width of content rectangle.
             *
             * @type {number}
             */
            this.broadcastWidth = 0;
            /**
             * Broadcasted height of content rectangle.
             *
             * @type {number}
             */
            this.broadcastHeight = 0;
            /**
             * Reference to the last observed content rectangle.
             *
             * @private {DOMRectInit}
             */
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
        }
        /**
         * Updates content rectangle and tells whether it's width or height properties
         * have changed since the last broadcast.
         *
         * @returns {boolean}
         */
        ResizeObservation.prototype.isActive = function () {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return (rect.width !== this.broadcastWidth ||
                rect.height !== this.broadcastHeight);
        };
        /**
         * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
         * from the corresponding properties of the last observed content rectangle.
         *
         * @returns {DOMRectInit} Last observed content rectangle.
         */
        ResizeObservation.prototype.broadcastRect = function () {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
        };
        return ResizeObservation;
    }());

    var ResizeObserverEntry = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObserverEntry.
         *
         * @param {Element} target - Element that is being observed.
         * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
         */
        function ResizeObserverEntry(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            // According to the specification following properties are not writable
            // and are also not enumerable in the native implementation.
            //
            // Property accessors are not being used as they'd require to define a
            // private WeakMap storage which may cause memory leaks in browsers that
            // don't support this type of collections.
            defineConfigurable(this, { target: target, contentRect: contentRect });
        }
        return ResizeObserverEntry;
    }());

    var ResizeObserverSPI = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback function that is invoked
         *      when one of the observed elements changes it's content dimensions.
         * @param {ResizeObserverController} controller - Controller instance which
         *      is responsible for the updates of observer.
         * @param {ResizeObserver} callbackCtx - Reference to the public
         *      ResizeObserver instance which will be passed to callback function.
         */
        function ResizeObserverSPI(callback, controller, callbackCtx) {
            /**
             * Collection of resize observations that have detected changes in dimensions
             * of elements.
             *
             * @private {Array<ResizeObservation>}
             */
            this.activeObservations_ = [];
            /**
             * Registry of the ResizeObservation instances.
             *
             * @private {Map<Element, ResizeObservation>}
             */
            this.observations_ = new MapShim();
            if (typeof callback !== 'function') {
                throw new TypeError('The callback provided as parameter 1 is not a function.');
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
        }
        /**
         * Starts observing provided element.
         *
         * @param {Element} target - Element to be observed.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.observe = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is already being observed.
            if (observations.has(target)) {
                return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            // Force the update of observations.
            this.controller_.refresh();
        };
        /**
         * Stops observing provided element.
         *
         * @param {Element} target - Element to stop observing.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.unobserve = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is not being observed.
            if (!observations.has(target)) {
                return;
            }
            observations.delete(target);
            if (!observations.size) {
                this.controller_.removeObserver(this);
            }
        };
        /**
         * Stops observing all elements.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
        };
        /**
         * Collects observation instances the associated element of which has changed
         * it's content rectangle.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.gatherActive = function () {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function (observation) {
                if (observation.isActive()) {
                    _this.activeObservations_.push(observation);
                }
            });
        };
        /**
         * Invokes initial callback function with a list of ResizeObserverEntry
         * instances collected from active resize observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.broadcastActive = function () {
            // Do nothing if observer doesn't have active observations.
            if (!this.hasActive()) {
                return;
            }
            var ctx = this.callbackCtx_;
            // Create ResizeObserverEntry instance for every active observation.
            var entries = this.activeObservations_.map(function (observation) {
                return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
        };
        /**
         * Clears the collection of active observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
        };
        /**
         * Tells whether observer has active observations.
         *
         * @returns {boolean}
         */
        ResizeObserverSPI.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
        };
        return ResizeObserverSPI;
    }());

    // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.
    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */
    var ResizeObserver = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback that is invoked when
         *      dimensions of the observed elements change.
         */
        function ResizeObserver(callback) {
            if (!(this instanceof ResizeObserver)) {
                throw new TypeError('Cannot call a class as a function.');
            }
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
        }
        return ResizeObserver;
    }());
    // Expose public methods of ResizeObserver.
    [
        'observe',
        'unobserve',
        'disconnect'
    ].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
            var _a;
            return (_a = observers.get(this))[method].apply(_a, arguments);
        };
    });

    var index = (function () {
        // Export existing implementation if available.
        if (typeof global$1.ResizeObserver !== 'undefined') {
            return global$1.ResizeObserver;
        }
        return ResizeObserver;
    })();

    /**
     * Main component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function Main(vido, props = {}) {
        const { api, state, onDestroy, actions, update, createComponent, html, StyleMap } = vido;
        const componentName = api.name;
        let ListComponent;
        onDestroy(state.subscribe('config.components.List', value => (ListComponent = value)));
        let ChartComponent;
        onDestroy(state.subscribe('config.components.Chart', value => (ChartComponent = value)));
        const List = createComponent(ListComponent);
        onDestroy(List.destroy);
        const Chart = createComponent(ChartComponent);
        onDestroy(Chart.destroy);
        onDestroy(state.subscribe('config.plugins', plugins => {
            if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
                for (const plugin of plugins) {
                    const destroyPlugin = plugin(vido);
                    if (typeof destroyPlugin === 'function') {
                        onDestroy(destroyPlugin);
                    }
                }
            }
        }));
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.Main', value => (wrapper = value)));
        const componentActions = api.getActions('');
        let className, classNameVerticalScroll, styleMap = new StyleMap({}), verticalScrollStyleMap = new StyleMap({}), verticalScrollAreaStyleMap = new StyleMap({});
        let verticalScrollBarElement;
        let rowsHeight = 0;
        let resizerActive = false;
        /**
         * Update class names
         * @param {object} classNames
         */
        const updateClassNames = classNames => {
            const config = state.get('config');
            className = api.getClass(componentName, { config });
            if (resizerActive) {
                className += ` ${componentName}__list-column-header-resizer--active`;
            }
            classNameVerticalScroll = api.getClass('vertical-scroll', { config });
            update();
        };
        onDestroy(state.subscribe('config.classNames', updateClassNames));
        /**
         * Height change
         */
        const heightChange = () => {
            const config = state.get('config');
            const scrollBarHeight = state.get('_internal.scrollBarHeight');
            const height = config.height - config.headerHeight - scrollBarHeight;
            state.update('_internal.height', height);
            styleMap.style['--height'] = config.height + 'px';
            verticalScrollStyleMap.style.height = height + 'px';
            verticalScrollStyleMap.style.width = scrollBarHeight + 'px';
            verticalScrollStyleMap.style['margin-top'] = config.headerHeight + 'px';
            update();
        };
        onDestroy(state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], heightChange));
        /**
         * Resizer active change
         * @param {boolean} active
         */
        const resizerActiveChange = active => {
            resizerActive = active;
            className = api.getClass(api.name);
            if (resizerActive) {
                className += ` ${api.name}__list-column-header-resizer--active`;
            }
            update();
        };
        onDestroy(state.subscribe('_internal.list.columns.resizer.active', resizerActiveChange));
        /**
         * Generate tree
         * @param {object} bulk
         * @param {object} eventInfo
         */
        function generateTree(bulk, eventInfo) {
            if (state.get('_internal.flatTreeMap').length && eventInfo.type === 'subscribe') {
                return;
            }
            const configRows = state.get('config.list.rows');
            const rows = [];
            for (const rowId in configRows) {
                rows.push(configRows[rowId]);
            }
            api.fillEmptyRowValues(rows);
            const configItems = state.get('config.chart.items');
            const items = [];
            for (const itemId in configItems) {
                items.push(configItems[itemId]);
            }
            const treeMap = api.makeTreeMap(rows, items);
            state.update('_internal.treeMap', treeMap);
            state.update('_internal.flatTreeMapById', api.getFlatTreeMapById(treeMap));
            state.update('_internal.flatTreeMap', api.flattenTreeMap(treeMap));
            update();
        }
        onDestroy(state.subscribeAll(['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'], generateTree, { bulk: true }));
        /**
         * Prepare expanded
         */
        function prepareExpanded() {
            const configRows = state.get('config.list.rows');
            const rowsWithParentsExpanded = api.getRowsFromIds(api.getRowsWithParentsExpanded(state.get('_internal.flatTreeMap'), state.get('_internal.flatTreeMapById'), configRows), configRows);
            rowsHeight = api.getRowsHeight(rowsWithParentsExpanded);
            state.update('_internal.list.rowsHeight', rowsHeight);
            state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
            update();
        }
        onDestroy(state.subscribeAll(['config.list.rows.*.expanded', '_internal.treeMap;'], prepareExpanded, { bulk: true }));
        /**
         * Generate visible rows
         */
        function generateVisibleRows() {
            const { visibleRows, compensation } = api.getVisibleRowsAndCompensation(state.get('_internal.list.rowsWithParentsExpanded'));
            const current = state.get('_internal.list.visibleRows');
            let shouldUpdate = true;
            state.update('config.scroll.compensation', -compensation);
            if (visibleRows.length) {
                shouldUpdate = visibleRows.some((row, index) => {
                    if (typeof current[index] === 'undefined') {
                        return true;
                    }
                    return row.id !== current[index].id;
                });
            }
            if (shouldUpdate) {
                state.update('_internal.list.visibleRows', visibleRows);
                const visibleItems = [];
                for (const row of visibleRows) {
                    for (const item of row._internal.items) {
                        visibleItems.push(item);
                    }
                }
                state.update('_internal.chart.visibleItems', visibleItems);
            }
            update();
        }
        onDestroy(state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], generateVisibleRows));
        let elementScrollTop = 0;
        /**
         * On visible rows change
         */
        function onVisibleRowsChange() {
            const top = state.get('config.scroll.top');
            verticalScrollAreaStyleMap.style.width = '1px';
            verticalScrollAreaStyleMap.style.height = rowsHeight + 'px';
            if (elementScrollTop !== top && verticalScrollBarElement) {
                elementScrollTop = top;
                verticalScrollBarElement.scrollTop = top;
            }
            update();
        }
        onDestroy(state.subscribe('_internal.list.visibleRows;', onVisibleRowsChange));
        /**
         * Generate and add period dates
         * @param {string} period
         * @param {object} internalTime
         */
        const generateAndAddPeriodDates = (period, internalTime) => {
            const dates = [];
            let leftGlobal = internalTime.leftGlobal;
            const rightGlobal = internalTime.rightGlobal;
            const timePerPixel = internalTime.timePerPixel;
            let sub = leftGlobal - api.time.date(leftGlobal).startOf(period);
            let subPx = sub / timePerPixel;
            let leftPx = 0;
            let maxWidth = 0;
            while (leftGlobal < rightGlobal) {
                const date = {
                    sub,
                    subPx,
                    leftGlobal,
                    rightGlobal: api.time
                        .date(leftGlobal)
                        .endOf(period)
                        .valueOf(),
                    width: 0,
                    leftPx: 0,
                    rightPx: 0
                };
                date.width = (date.rightGlobal - date.leftGlobal + sub) / timePerPixel;
                maxWidth = date.width > maxWidth ? date.width : maxWidth;
                date.leftPx = leftPx;
                leftPx += date.width;
                date.rightPx = leftPx;
                dates.push(date);
                leftGlobal = date.rightGlobal + 1;
                sub = 0;
                subPx = 0;
            }
            internalTime.maxWidth[period] = maxWidth;
            internalTime.dates[period] = dates;
        };
        /**
         * Recalculate times action
         */
        const recalculateTimes = () => {
            const chartWidth = state.get('_internal.chart.dimensions.width');
            let time = api.mergeDeep({}, state.get('config.chart.time'));
            time = api.time.recalculateFromTo(time);
            const zoomPercent = time.zoom * 0.01;
            let scrollLeft = state.get('config.scroll.left');
            time.timePerPixel = zoomPercent + Math.pow(2, time.zoom);
            time.totalViewDurationMs = api.time.date(time.to).diff(time.from, 'milliseconds');
            time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
            if (scrollLeft > time.totalViewDurationPx) {
                scrollLeft = time.totalViewDurationPx - chartWidth;
            }
            time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
            time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
            time.leftInner = time.leftGlobal - time.from;
            time.rightInner = time.rightGlobal - time.from;
            time.leftPx = time.leftInner / time.timePerPixel;
            time.rightPx = time.rightInner / time.timePerPixel;
            const pixelGlobal = Math.round(time.rightGlobal / time.timePerPixel);
            const pixelTo = Math.round(time.to / time.timePerPixel);
            if (pixelGlobal > pixelTo) {
                const diff = time.rightGlobal - time.to;
                const diffPercent = diff / (time.rightGlobal - time.from);
                time.timePerPixel = time.timePerPixel - time.timePerPixel * diffPercent;
                time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
                time.rightGlobal = time.to;
                time.rightInner = time.rightGlobal - time.from;
                time.totalViewDurationMs = time.to - time.from;
                time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
                time.rightInner = time.rightGlobal - time.from;
                time.rightPx = time.rightInner / time.timePerPixel;
                time.leftPx = time.leftInner / time.timePerPixel;
            }
            generateAndAddPeriodDates('day', time);
            generateAndAddPeriodDates('month', time);
            state.update(`_internal.chart.time`, time);
            update();
        };
        onDestroy(state.subscribeAll([
            'config.chart.time',
            '_internal.dimensions.width',
            'config.scroll.left',
            '_internal.scrollBarHeight',
            '_internal.list.width',
            '_internal.chart.dimensions'
        ], recalculateTimes, { bulk: true }));
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        function renderIcon(html) {
            return new Promise(resolve => {
                const img = document.createElement('img');
                img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(html));
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
            });
        }
        function renderIcons() {
            return __awaiter(this, void 0, void 0, function* () {
                const icons = state.get('config.list.expander.icons');
                const rendered = {};
                for (const iconName in icons) {
                    const html = icons[iconName];
                    rendered[iconName] = yield renderIcon(html);
                }
                state.update('_internal.list.expander.icons', rendered);
            });
        }
        renderIcons();
        state.update('_internal.scrollBarHeight', api.getScrollBarHeight());
        let scrollTop = 0;
        /**
         * Handle scroll Event
         * @param {MouseEvent} event
         */
        const handleEvent = (event) => {
            //event.stopPropagation();
            if (event.type === 'scroll') {
                // @ts-ignore
                const top = event.target.scrollTop;
                /**
                 * Handle on scroll event
                 * @param {object} scroll
                 * @returns {object} scroll
                 */
                const handleOnScroll = scroll => {
                    scroll.top = top;
                    scrollTop = scroll.top;
                    const scrollInner = state.get('_internal.elements.vertical-scroll-inner');
                    if (scrollInner) {
                        const scrollHeight = scrollInner.clientHeight;
                        scroll.percent.top = scroll.top / scrollHeight;
                    }
                    return scroll;
                };
                if (scrollTop !== top)
                    state.update('config.scroll', handleOnScroll, {
                        only: ['top', 'percent.top']
                    });
            }
            else {
                const wheel = api.normalizeMouseWheelEvent(event);
                const xMultiplier = state.get('config.scroll.xMultiplier');
                const yMultiplier = state.get('config.scroll.yMultiplier');
                if (event.shiftKey && wheel.y) {
                    state.update('config.scroll.left', left => {
                        return api.limitScroll('left', (left += wheel.y * xMultiplier));
                    });
                }
                else if (wheel.x) {
                    state.update('config.scroll.left', left => {
                        return api.limitScroll('left', (left += wheel.x * xMultiplier));
                    });
                }
                else {
                    state.update('config.scroll.top', top => {
                        return (scrollTop = api.limitScroll('top', (top += wheel.y * yMultiplier)));
                    });
                }
            }
        };
        const onScroll = {
            handleEvent: handleEvent,
            passive: true,
            capture: false
        };
        /**
         * Stop scroll / wheel to sink into parent elements
         * @param {Event} event
         */
        const onScrollStop = (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
        };
        const dimensions = { width: 0, height: 0 };
        let ro;
        /**
         * Resize action
         * @param {Element} element
         */
        const resizeAction = (element) => {
            if (!ro) {
                ro = new index((entries, observer) => {
                    const width = element.clientWidth;
                    const height = element.clientHeight;
                    if (dimensions.width !== width || dimensions.height !== height) {
                        dimensions.width = width;
                        dimensions.height = height;
                        state.update('_internal.dimensions', dimensions);
                    }
                });
                ro.observe(element);
                state.update('_internal.elements.main', element);
            }
        };
        if (!componentActions.includes(resizeAction)) {
            componentActions.push(resizeAction);
        }
        onDestroy(() => {
            ro.disconnect();
        });
        /**
         * Bind scroll element
         * @param {Element} element
         */
        const bindScrollElement = (element) => {
            if (!verticalScrollBarElement) {
                verticalScrollBarElement = element;
                state.update('_internal.elements.vertical-scroll', element);
            }
        };
        /**
         * Bind scroll inner element
         * @param {Element} element
         */
        const bindScrollInnerElement = (element) => {
            state.update('_internal.elements.vertical-scroll-inner', element);
        };
        const actionProps = Object.assign(Object.assign({}, props), { api, state });
        return templateProps => wrapper(html `
        <div
          data-info-url="https://github.com/neuronetio/gantt-schedule-timeline-calendar"
          class=${className}
          style=${styleMap}
          @scroll=${onScrollStop}
          @wheel=${onScrollStop}
          data-actions=${actions(componentActions, actionProps)}
        >
          ${List.html()}${Chart.html()}
          <div
            class=${classNameVerticalScroll}
            style=${verticalScrollStyleMap}
            @scroll=${onScroll}
            @wheel=${onScroll}
            data-action=${actions([bindScrollElement])}
          >
            <div style=${verticalScrollAreaStyleMap} data-actions=${actions([bindScrollInnerElement])} />
          </div>
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * List component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function List(vido, props = {}) {
        const { api, state, onDestroy, actions, update, reuseComponents, html, schedule, StyleMap } = vido;
        const componentName = 'list';
        const componentActions = api.getActions(componentName);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.List', value => (wrapper = value)));
        let ListColumnComponent;
        onDestroy(state.subscribe('config.components.ListColumn', value => (ListColumnComponent = value)));
        let className;
        let list, percent;
        function onListChange() {
            list = state.get('config.list');
            percent = list.columns.percent;
            update();
        }
        onDestroy(state.subscribe('config.list', onListChange));
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName, { list });
            update();
        }));
        let listColumns = [];
        function onListColumnsDataChange(data) {
            reuseComponents(listColumns, Object.values(data), column => ({ columnId: column.id }), ListColumnComponent);
            update();
        }
        onDestroy(state.subscribe('config.list.columns.data;', onListColumnsDataChange));
        onDestroy(() => {
            listColumns.forEach(c => c.destroy());
        });
        const styleMap = new StyleMap({
            height: '',
            '--expander-padding-width': '',
            '--expander-size': ''
        });
        onDestroy(state.subscribeAll(['config.height', 'config.list.expander'], bulk => {
            const expander = state.get('config.list.expander');
            styleMap.style['height'] = state.get('config.height') + 'px';
            styleMap.style['--expander-padding-width'] = expander.padding + 'px';
            styleMap.style['--expander-size'] = expander.size + 'px';
            update();
        }));
        function onScrollHandler(event) {
            event.stopPropagation();
            event.preventDefault();
            if (event.type === 'scroll') {
                state.update('config.scroll.top', event.target.scrollTop);
            }
            else {
                const wheel = api.normalizeMouseWheelEvent(event);
                state.update('config.scroll.top', top => {
                    return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
                });
            }
        }
        const onScroll = {
            handleEvent: schedule(onScrollHandler),
            passive: false
        };
        let width;
        function getWidth(element) {
            if (!width) {
                width = element.clientWidth;
                if (percent === 0) {
                    width = 0;
                }
                state.update('_internal.list.width', width);
                state.update('_internal.elements.list', element);
            }
        }
        let mc, moving = false, lastY = 0, lastX = 0;
        function onPanStart(ev) {
            moving = true;
            lastY = ev.deltaY;
            lastX = ev.deltaX;
        }
        function onPanMove(ev) {
            if (!moving)
                return;
            const movementY = ev.deltaY - lastY;
            state.update('config.scroll.top', top => {
                top -= movementY;
                top = api.limitScroll('top', top);
                return top;
            });
            lastY = ev.deltaY;
            lastX = ev.deltaX;
        }
        function onPanEnd(ev) {
            moving = false;
            lastY = 0;
            lastX = 0;
        }
        componentActions.push(element => {
            state.update('_internal.elements.list', element);
            mc = new api.Hammer(element, { pointers: 0, threshold: 0, direction: api.Hammer.DIRECTION_VERTICAL });
            mc.on('panstart', onPanStart);
            mc.on('panmove', onPanMove);
            mc.on('panend', onPanEnd);
            getWidth(element);
            return {
                update: getWidth,
                destroy(element) {
                    mc.remove(element, 'panstart panmove panend');
                }
            };
        });
        const actionProps = Object.assign(Object.assign({}, props), { api, state });
        return templateProps => wrapper(list.columns.percent > 0
            ? html `
            <div
              class=${className}
              data-actions=${actions(componentActions, actionProps)}
              style=${styleMap}
              @scroll=${onScroll}
              @wheel=${onScroll}
            >
              ${listColumns.map(c => c.html())}
            </div>
          `
            : null, { vido, props: {}, templateProps });
    }

    /**
     * ListColumn component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListColumn(vido, props) {
        const { api, state, onDestroy, actions, update, createComponent, reuseComponents, html, StyleMap } = vido;
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListColumn', value => (wrapper = value)));
        let ListColumnRowComponent;
        onDestroy(state.subscribe('config.components.ListColumnRow', value => (ListColumnRowComponent = value)));
        let ListColumnHeaderComponent;
        onDestroy(state.subscribe('config.components.ListColumnHeader', value => (ListColumnHeaderComponent = value)));
        let column, columnPath = `config.list.columns.data.${props.columnId}`;
        onDestroy(state.subscribe(columnPath, function columnChanged(val) {
            column = val;
            update();
        }));
        const componentName = 'list-column';
        const rowsComponentName = componentName + '-rows';
        const componentActions = api.getActions(componentName);
        const rowsActions = api.getActions(rowsComponentName);
        let className, classNameContainer, calculatedWidth;
        const widthStyleMap = new StyleMap({ width: '', '--width': '' });
        const containerStyleMap = new StyleMap({ width: '', height: '' });
        const scrollCompensationStyleMap = new StyleMap({ width: '', height: '' });
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName, { column });
            classNameContainer = api.getClass(rowsComponentName, { column });
            update();
        }));
        let width;
        function calculateStyle() {
            const list = state.get('config.list');
            const compensation = state.get('config.scroll.compensation');
            calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
            width = calculatedWidth;
            const height = state.get('_internal.height');
            widthStyleMap.style.width = width + 'px';
            widthStyleMap.style['--width'] = width + 'px';
            containerStyleMap.style.width = width + 'px';
            containerStyleMap.style.height = height + 'px';
            scrollCompensationStyleMap.style.width = width + 'px';
            scrollCompensationStyleMap.style.height = height + Math.abs(compensation) + 'px';
            scrollCompensationStyleMap.style.transform = `translate(0px, ${compensation}px)`;
        }
        onDestroy(state.subscribeAll([
            'config.list.columns.percent',
            'config.list.columns.resizer.width',
            `config.list.columns.data.${column.id}.width`,
            '_internal.chart.dimensions.width',
            '_internal.height',
            'config.scroll.compensation',
            '_internal.list.width'
        ], calculateStyle, { bulk: true }));
        let visibleRows = [];
        const visibleRowsChange = val => {
            reuseComponents(visibleRows, val, row => row && { columnId: props.columnId, rowId: row.id, width }, ListColumnRowComponent);
            update();
        };
        onDestroy(state.subscribe('_internal.list.visibleRows;', visibleRowsChange));
        onDestroy(function rowsDestroy() {
            visibleRows.forEach(row => row.destroy());
        });
        const ListColumnHeader = createComponent(ListColumnHeaderComponent, { columnId: props.columnId });
        onDestroy(ListColumnHeader.destroy);
        function getRowHtml(row) {
            return row.html();
        }
        const componentActionsProps = { column, state: state, api: api };
        const rowActionsProps = { api, state };
        return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, componentActionsProps)} style=${widthStyleMap}>
          ${ListColumnHeader.html()}
          <div
            class=${classNameContainer}
            style=${containerStyleMap}
            data-actions=${actions(rowsActions, rowActionsProps)}
          >
            <div class=${classNameContainer + '--scroll-compensation'} style=${scrollCompensationStyleMap}>
              ${visibleRows.map(getRowHtml)}
            </div>
          </div>
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * ListColumnHeader component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListColumnHeader(vido, props) {
        const { api, state, onDestroy, actions, update, createComponent, html, cache, StyleMap } = vido;
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListColumnHeader', value => (wrapper = value)));
        const componentName = 'list-column-header';
        const componentActions = api.getActions(componentName);
        let ListColumnHeaderResizerComponent;
        onDestroy(state.subscribe('config.components.ListColumnHeaderResizer', value => (ListColumnHeaderResizerComponent = value)));
        const ListColumnHeaderResizer = createComponent(ListColumnHeaderResizerComponent, { columnId: props.columnId });
        onDestroy(ListColumnHeaderResizer.destroy);
        let ListExpanderComponent;
        onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));
        const ListExpander = createComponent(ListExpanderComponent, {});
        onDestroy(ListExpander.destroy);
        let column;
        onDestroy(state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
            column = val;
            update();
        }));
        let className, contentClass, styleMap = new StyleMap({
            height: '',
            '--height': '',
            '--paddings-count': ''
        });
        onDestroy(state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
            const value = state.get('config');
            className = api.getClass(componentName, { column });
            contentClass = api.getClass(componentName + '-content', { column });
            styleMap.style['height'] = value.headerHeight + 'px';
            styleMap.style['--height'] = value.headerHeight + 'px';
            styleMap.style['--paddings-count'] = '1';
            update();
        }));
        function withExpander() {
            return html `
      <div class=${contentClass}>
        ${ListExpander.html()}${ListColumnHeaderResizer.html(column)}
      </div>
    `;
        }
        function withoutExpander() {
            return html `
      <div class=${contentClass}>
        ${ListColumnHeaderResizer.html(column)}
      </div>
    `;
        }
        const actionProps = { column, api, state };
        return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions(componentActions, actionProps)}>
          ${cache(typeof column.expander === 'boolean' && column.expander ? withExpander() : withoutExpander())}
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * ListColumnHeaderResizer component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListColumnHeaderResizer(vido, props) {
        const { api, state, onDestroy, update, html, actions, cache, StyleMap } = vido;
        const componentName = 'list-column-header-resizer';
        const componentActions = api.getActions(componentName);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListColumnHeaderResizer', value => (wrapper = value)));
        let column;
        onDestroy(state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
            column = val;
            update();
        }));
        let className, containerClass, dotsClass, dotClass, lineClass, calculatedWidth, dotsStyleMap = new StyleMap({ width: '' });
        let inRealTime = false;
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName, { column });
            containerClass = api.getClass(componentName + '-container', { column });
            dotsClass = api.getClass(componentName + '-dots', { column });
            dotClass = api.getClass(componentName + '-dots-dot', { column });
            lineClass = api.getClass(componentName + '-line', { column });
            update();
        }));
        onDestroy(state.subscribeAll([
            `config.list.columns.data.${column.id}.width`,
            'config.list.columns.percent',
            'config.list.columns.resizer.width',
            'config.list.columns.resizer.inRealTime'
        ], (value, path) => {
            const list = state.get('config.list');
            calculatedWidth = column.width * list.columns.percent * 0.01;
            dotsStyleMap.style['--width'] = list.columns.resizer.width + 'px';
            inRealTime = list.columns.resizer.inRealTime;
            state.update('_internal.list.width', calculatedWidth);
            update();
        }));
        let dots = [1, 2, 3, 4, 5, 6, 7, 8];
        onDestroy(state.subscribe('config.list.columns.resizer.dots', value => {
            dots = [];
            for (let i = 0; i < value; i++) {
                dots.push(i);
            }
            update();
        }));
        let isMoving = false;
        let left = calculatedWidth;
        const lineStyleMap = new StyleMap({
            '--display': 'none',
            '--left': left + 'px'
        });
        const columnWidthPath = `config.list.columns.data.${column.id}.width`;
        function onMouseDown(event) {
            isMoving = true;
            state.update('_internal.list.columns.resizer.active', true);
            if (isMoving) {
                lineStyleMap.style['display'] = 'block';
                lineStyleMap.style['--left'] = left + 'px';
            }
            else {
                lineStyleMap.style['display'] = 'none';
                lineStyleMap.style['--left'] = '0px';
            }
        }
        function onMouseMove(event) {
            if (isMoving) {
                let minWidth = state.get('config.list.columns.minWidth');
                if (typeof column.minWidth === 'number') {
                    minWidth = column.minWidth;
                }
                left += event.movementX;
                if (left < minWidth) {
                    left = minWidth;
                }
                if (inRealTime) {
                    state.update(columnWidthPath, left);
                }
            }
        }
        function onMouseUp(event) {
            if (isMoving) {
                state.update('_internal.list.columns.resizer.active', false);
                state.update(columnWidthPath, left);
                isMoving = false;
            }
        }
        document.body.addEventListener('mousemove', onMouseMove);
        onDestroy(() => document.body.removeEventListener('mousemove', onMouseMove));
        document.body.addEventListener('mouseup', onMouseUp);
        onDestroy(() => document.body.removeEventListener('mouseup', onMouseUp));
        const actionProps = { column, api, state };
        return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)}>
          <div class=${containerClass}>
            ${cache(column.header.html
        ? html `
                    ${column.header.html}
                  `
        : column.header.content)}
          </div>
          <div class=${dotsClass} style=${dotsStyleMap} @mousedown=${onMouseDown}>
            ${dots.map(dot => html `
                  <div class=${dotClass} />
                `)}
          </div>
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * ListColumnRow component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListColumnRow(vido, props) {
        const { api, state, onDestroy, actions, update, html, createComponent, onChange, StyleMap, unsafeHTML } = vido;
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));
        let ListExpanderComponent;
        onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));
        let rowPath = `_internal.flatTreeMapById.${props.rowId}`, row = state.get(rowPath);
        let colPath = `config.list.columns.data.${props.columnId}`, column = state.get(colPath);
        let styleMap = new StyleMap(column.expander
            ? {
                opacity: '1',
                pointerEvents: 'auto',
                height: '',
                width: '',
                top: '',
                '--height': '',
                '--expander-padding-width': '',
                '--expander-size': ''
            }
            : {
                opacity: '1',
                pointerEvents: 'auto',
                height: '',
                width: '',
                top: '',
                '--height': ''
            });
        let rowSub, colSub;
        const ListExpander = createComponent(ListExpanderComponent, { row });
        const onPropsChange = (changedProps, options) => {
            if (options.leave) {
                styleMap.style.opacity = '0';
                styleMap.style.pointerEvents = 'none';
                update();
                return;
            }
            props = changedProps;
            const rowId = props.rowId;
            const columnId = props.columnId;
            if (rowSub) {
                rowSub();
            }
            if (colSub) {
                colSub();
            }
            rowPath = `_internal.flatTreeMapById.${rowId}`;
            colPath = `config.list.columns.data.${columnId}`;
            rowSub = state.subscribeAll([rowPath, 'config.list.expander'], bulk => {
                row = state.get(rowPath);
                const expander = state.get('config.list.expander');
                // @ts-ignore
                styleMap.style = {}; // we must reset style because of user specified styling
                styleMap.style['opacity'] = '1';
                styleMap.style['pointerEvents'] = 'auto';
                styleMap.style['height'] = row.height + 'px';
                styleMap.style['--height'] = row.height + 'px';
                if (column.expander) {
                    styleMap.style['--expander-padding-width'] = expander.padding * (row._internal.parents.length + 1) + 'px';
                }
                for (let parentId of row._internal.parents) {
                    const parent = state.get(`_internal.flatTreeMapById.${parentId}`);
                    if (typeof parent.style === 'object' && parent.style.constructor.name === 'Object') {
                        if (typeof parent.style.children === 'object') {
                            const childrenStyle = parent.style.children;
                            for (const name in childrenStyle) {
                                styleMap.style[name] = childrenStyle[name];
                            }
                        }
                    }
                }
                if (typeof row.style === 'object' &&
                    row.style.constructor.name === 'Object' &&
                    typeof row.style.current === 'object') {
                    const rowCurrentStyle = row.style.current;
                    for (const name in rowCurrentStyle) {
                        styleMap.style[name] = rowCurrentStyle[name];
                    }
                }
                update();
            });
            if (ListExpander) {
                ListExpander.change({ row });
            }
            colSub = state.subscribe(colPath, val => {
                column = val;
                update();
            });
        };
        onChange(onPropsChange);
        onDestroy(() => {
            if (ListExpander)
                ListExpander.destroy();
            colSub();
            rowSub();
        });
        const componentName = 'list-column-row';
        const componentActions = api.getActions(componentName);
        let className;
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName);
            update();
        }));
        function getHtml() {
            if (typeof column.data === 'function')
                return unsafeHTML(column.data(row));
            return unsafeHTML(row[column.data]);
        }
        function getText() {
            if (typeof column.data === 'function')
                return column.data(row);
            return row[column.data];
        }
        const actionProps = { column, row, api, state };
        return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions(componentActions, actionProps)}>
          ${column.expander ? ListExpander.html() : null}
          <div class=${className + '-content'}>
            ${column.isHTML ? getHtml() : getText()}
          </div>
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * ListExpander component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListExpander(vido, props) {
        const { api, state, onDestroy, actions, update, html, createComponent, onChange } = vido;
        const componentName = 'list-expander';
        const componentActions = api.getActions(componentName);
        let className;
        let ListToggleComponent;
        onDestroy(state.subscribe('config.components.ListToggle', value => (ListToggleComponent = value)));
        const ListToggle = createComponent(ListToggleComponent, props.row ? { row: props.row } : {});
        onDestroy(ListToggle.destroy);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListExpander', value => (wrapper = value)));
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName);
            update();
        }));
        if (props.row) {
            function onPropsChange(changedProps) {
                props = changedProps;
                ListToggle.change(props);
            }
            onChange(onPropsChange);
            onDestroy(function listExpanderDestroy() {
            });
        }
        const actionProps = { row: props.row, api, state };
        return templateProps => wrapper(html `
        <div class=${className} data-action=${actions(componentActions, actionProps)}>
          ${ListToggle.html()}
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * ListToggle component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ListToggle(vido, props) {
        const { api, state, onDestroy, actions, update, html, onChange, cache } = vido;
        const componentName = 'list-expander-toggle';
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ListToggle', value => (wrapper = value)));
        const componentActions = api.getActions(componentName);
        let className, classNameChild, classNameOpen, classNameClosed;
        let expanded = false;
        let iconChild, iconOpen, iconClosed;
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName);
            classNameChild = className + '-child';
            classNameOpen = className + '-open';
            classNameClosed = className + '-closed';
            update();
        }));
        onDestroy(state.subscribe('_internal.list.expander.icons', icons => {
            if (icons) {
                iconChild = icons.child;
                iconOpen = icons.open;
                iconClosed = icons.closed;
            }
            update();
        }));
        if (props.row) {
            function expandedChange(isExpanded) {
                expanded = isExpanded;
                update();
            }
            let expandedSub;
            function onPropsChange(changedProps) {
                props = changedProps;
                if (expandedSub)
                    expandedSub();
                expandedSub = state.subscribe(`config.list.rows.${props.row.id}.expanded`, expandedChange);
            }
            onChange(onPropsChange);
            onDestroy(function listToggleDestroy() {
                if (expandedSub)
                    expandedSub();
            });
        }
        else {
            function expandedChange(bulk) {
                for (const rowExpanded of bulk) {
                    if (rowExpanded.value) {
                        expanded = true;
                        break;
                    }
                }
                update();
            }
            onDestroy(state.subscribe('config.list.rows.*.expanded', expandedChange, { bulk: true }));
        }
        function toggle() {
            expanded = !expanded;
            if (props.row) {
                state.update(`config.list.rows.${props.row.id}.expanded`, expanded);
            }
            else {
                state.update(`config.list.rows`, rows => {
                    for (const rowId in rows) {
                        rows[rowId].expanded = expanded;
                    }
                    return rows;
                }, { only: ['*.expanded'] });
            }
        }
        const actionProps = { row: props.row, api, state };
        const getIcon = () => {
            var _a, _b, _c;
            if (iconChild) {
                if (((_c = (_b = (_a = props.row) === null || _a === void 0 ? void 0 : _a._internal) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                    return html `
          <img class=${classNameChild} src=${iconChild} />
        `;
                }
                return expanded
                    ? html `
            <img class=${classNameOpen} src=${iconOpen} />
          `
                    : html `
            <img class=${classNameClosed} src=${iconClosed} />
          `;
            }
            return '';
        };
        return templateProps => wrapper(html `
        <div class=${className} data-action=${actions(componentActions, actionProps)} @click=${toggle}>
          ${cache(getIcon())}
        </div>
      `, { vido, props, templateProps });
    }

    /**
     * Chart component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function Chart(vido, props = {}) {
        const { api, state, onDestroy, actions, update, html, StyleMap, createComponent } = vido;
        const componentName = 'chart';
        const ChartCalendarComponent = state.get('config.components.ChartCalendar');
        const ChartTimelineComponent = state.get('config.components.ChartTimeline');
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.Chart', value => (wrapper = value)));
        const Calendar = createComponent(ChartCalendarComponent);
        onDestroy(Calendar.destroy);
        const Timeline = createComponent(ChartTimelineComponent);
        onDestroy(Timeline.destroy);
        let className, classNameScroll, classNameScrollInner, scrollElement, scrollStyleMap = new StyleMap({}), scrollInnerStyleMap = new StyleMap({}), componentActions = api.getActions(componentName);
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName);
            classNameScroll = api.getClass('horizontal-scroll');
            classNameScrollInner = api.getClass('horizontal-scroll-inner');
            update();
        }));
        onDestroy(state.subscribe('config.scroll.left', left => {
            if (scrollElement && scrollElement.scrollLeft !== left) {
                scrollElement.scrollLeft = left;
            }
            update();
        }));
        onDestroy(state.subscribeAll(['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'], function horizontalScroll(value, eventInfo) {
            scrollStyleMap.style.width = state.get('_internal.chart.dimensions.width') + 'px';
            scrollInnerStyleMap.style.width = state.get('_internal.chart.time.totalViewDurationPx') + 'px';
            scrollInnerStyleMap.style.height = '1px';
            update();
        }));
        const handleEvent = event => {
            let scrollLeft, scrollTop;
            if (event.type === 'scroll') {
                state.update('config.scroll.left', event.target.scrollLeft);
                scrollLeft = event.target.scrollLeft;
            }
            else {
                const wheel = api.normalizeMouseWheelEvent(event);
                const xMultiplier = state.get('config.scroll.xMultiplier');
                const yMultiplier = state.get('config.scroll.yMultiplier');
                if (event.shiftKey && wheel.y) {
                    state.update('config.scroll.left', left => {
                        return (scrollLeft = api.limitScroll('left', (left += wheel.y * xMultiplier)));
                    });
                }
                else if (wheel.x) {
                    state.update('config.scroll.left', left => {
                        return (scrollLeft = api.limitScroll('left', (left += wheel.x * xMultiplier)));
                    });
                }
                else {
                    state.update('config.scroll.top', top => {
                        return (scrollTop = api.limitScroll('top', (top += wheel.y * yMultiplier)));
                    });
                }
            }
            const chart = state.get('_internal.elements.chart');
            const scrollInner = state.get('_internal.elements.horizontal-scroll-inner');
            if (chart) {
                const scrollLeft = state.get('config.scroll.left');
                let percent = 0;
                if (scrollLeft) {
                    percent = Math.round((scrollLeft / (scrollInner.clientWidth - chart.clientWidth)) * 100);
                    if (percent > 100)
                        percent = 100;
                }
                state.update('config.scroll.percent.left', percent);
            }
        };
        const onScroll = {
            handleEvent: handleEvent,
            passive: true,
            capture: false
        };
        const onWheel = {
            handleEvent: handleEvent,
            passive: true,
            capture: false
        };
        const bindElement = element => {
            if (!scrollElement) {
                scrollElement = element;
                state.update('_internal.elements.horizontal-scroll', element);
            }
        };
        const bindInnerScroll = element => {
            state.update('_internal.elements.horizontal-scroll-inner', element);
        };
        let chartWidth = 0;
        let ro;
        componentActions.push(element => {
            if (!ro) {
                ro = new index((entries, observer) => {
                    const width = element.clientWidth;
                    const height = element.clientHeight;
                    const innerWidth = width - state.get('_internal.scrollBarHeight');
                    if (chartWidth !== width) {
                        chartWidth = width;
                        state.update('_internal.chart.dimensions', { width, innerWidth, height });
                    }
                });
                ro.observe(element);
                state.update('_internal.elements.chart', element);
            }
        });
        onDestroy(() => {
            ro.disconnect();
        });
        return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, { api, state })} @wheel=${onWheel}>
          ${Calendar.html()}${Timeline.html()}
          <div
            class=${classNameScroll}
            style=${scrollStyleMap}
            data-actions=${actions([bindElement])}
            @scroll=${onScroll}
          >
            <div
              class=${classNameScrollInner}
              style=${scrollInnerStyleMap}
              data-actions=${actions([bindInnerScroll])}
            />
          </div>
        </div>
      `, { vido, props: {}, templateProps });
    }

    /**
     * ChartCalendar component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ChartCalendar(vido, props) {
        const { api, state, onDestroy, actions, update, reuseComponents, html, StyleMap } = vido;
        const componentName = 'chart-calendar';
        const componentActions = api.getActions(componentName);
        const actionProps = Object.assign(Object.assign({}, props), { api, state });
        const ChartCalendarDateComponent = state.get('config.components.ChartCalendarDate');
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartCalendar', value => (wrapper = value)));
        let className;
        onDestroy(state.subscribe('config.classNames', value => {
            className = api.getClass(componentName);
            update();
        }));
        let headerHeight, styleMap = new StyleMap({ height: '', '--headerHeight': '' });
        onDestroy(state.subscribe('config.headerHeight', value => {
            headerHeight = value;
            styleMap.style['height'] = headerHeight + 'px';
            styleMap.style['--calendar-height'] = headerHeight + 'px';
            update();
        }));
        let period;
        onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));
        let dayComponents = [], monthComponents = [];
        onDestroy(state.subscribe(`_internal.chart.time.dates`, dates => {
            const currentDate = api.time.date().format('YYYY-MM-DD');
            if (typeof dates.day === 'object' && Array.isArray(dates.day) && dates.day.length) {
                reuseComponents(dayComponents, dates.day, date => date && { period: 'day', date, currentDate }, ChartCalendarDateComponent);
            }
            if (typeof dates.month === 'object' && Array.isArray(dates.month) && dates.month.length) {
                reuseComponents(monthComponents, dates.month, date => date && { period: 'month', date, currentDate }, ChartCalendarDateComponent);
            }
            update();
        }));
        onDestroy(() => {
            dayComponents.forEach(c => c.destroy());
        });
        componentActions.push(element => {
            state.update('_internal.elements.calendar', element);
        });
        return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          <div class=${className + '-dates ' + className + '-dates--months'}>${monthComponents.map(m => m.html())}</div>
          <div class=${className + '-dates ' + className + '-dates--days'}>${dayComponents.map(d => d.html())}</div>
          </div>
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * ChartCalendarDate component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ChartCalendarDate(vido, props) {
        const { api, state, onDestroy, actions, update, onChange, html, StyleMap } = vido;
        const componentName = 'chart-calendar-date';
        const componentActions = api.getActions(componentName);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartCalendarDate', value => (wrapper = value)));
        let className = api.getClass(componentName, props);
        let current = '';
        if (api.time.date(props.date.leftGlobal).format('YYYY-MM-DD') === props.currentDate) {
            current = ' current';
        }
        else {
            current = '';
        }
        let time, htmlFormatted, styleMap = new StyleMap({ width: '', 'margin-left': '', visibility: 'visible' }), scrollStyleMap = new StyleMap({
            overflow: 'hidden',
            'text-align': 'left',
            'margin-left': props.date.subPx + 8 + 'px'
        });
        const updateDate = () => {
            if (!props)
                return;
            time = state.get('_internal.chart.time');
            styleMap.style.width = props.date.width + 'px';
            styleMap.style['margin-left'] = -props.date.subPx + 'px';
            styleMap.style.visibility = 'visible';
            scrollStyleMap.style = { overflow: 'hidden', 'text-align': 'left', 'margin-left': props.date.subPx + 8 + 'px' };
            const dateMod = api.time.date(props.date.leftGlobal);
            if (dateMod.format('YYYY-MM-DD') === props.currentDate) {
                current = ' current';
            }
            else if (dateMod.subtract(1, 'days').format('YYYY-MM-DD') === props.currentDate) {
                current = ' next';
            }
            else if (dateMod.add(1, 'days').format('YYYY-MM-DD') === props.currentDate) {
                current = ' previous';
            }
            else {
                current = '';
            }
            const maxWidth = time.maxWidth[props.period];
            switch (props.period) {
                case 'month':
                    htmlFormatted = html `
          <div class=${className + '-content ' + className + '-content--month' + current} style=${scrollStyleMap}>
            ${dateMod.format('MMMM YYYY')}
          </div>
        `;
                    if (maxWidth <= 100) {
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--month' + current}>
              ${dateMod.format("MMM'YY")}
            </div>
          `;
                    }
                    break;
                case 'day':
                    htmlFormatted = html `
          <div class=${className + '-content ' + className + '-content--day _0' + current}>
            <div class=${className + '-content ' + className + '-content--day-small' + current}>
              ${dateMod.format('DD')} ${dateMod.format('ddd')}
            </div>
          </div>
        `;
                    if (maxWidth >= 40 && maxWidth < 50) {
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _40' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('dd')}
            </div>
          `;
                    }
                    else if (maxWidth >= 50 && maxWidth < 90) {
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _50' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('ddd')}
            </div>
          `;
                    }
                    else if (maxWidth >= 90 && maxWidth < 180) {
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _90' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('dddd')}
            </div>
          `;
                    }
                    else if (maxWidth >= 180 && maxWidth < 400) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 12; i++) {
                            const left = start.add(i * 2, 'hours');
                            const width = (start
                                .add(i * 2 + 1, 'hours')
                                .endOf('hour')
                                .valueOf() -
                                left.valueOf()) /
                                time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH')
                            });
                        }
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _180' + current}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class="${className + '-content ' + className + '-content--hours-hour' + current}"
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    else if (maxWidth >= 400 && maxWidth < 1000) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 24; i++) {
                            const left = start.add(i, 'hours');
                            const width = (start
                                .add(i, 'hours')
                                .endOf('hour')
                                .valueOf() -
                                left.valueOf()) /
                                time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH')
                            });
                        }
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _400' + current}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    // scroll day from now on
                    else if (maxWidth >= 1000 && maxWidth < 2000) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 24; i++) {
                            const left = start.add(i, 'hours');
                            const width = (start
                                .add(i, 'hours')
                                .endOf('hour')
                                .valueOf() -
                                left.valueOf()) /
                                time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH:mm')
                            });
                        }
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _1000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    else if (maxWidth >= 2000 && maxWidth < 5000) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 24 * 2; i++) {
                            const left = start.add(i * 30, 'minutes');
                            const width = (start.add((i + 1) * 30, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH:mm')
                            });
                        }
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _2000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    else if (maxWidth >= 5000 && maxWidth < 20000) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 24 * 4; i++) {
                            const left = start.add(i * 15, 'minutes');
                            const width = (start.add((i + 1) * 15, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH:mm')
                            });
                        }
                        htmlFormatted = html `
            <div class=${className + '-content ' + className + '-content--day _5000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    else if (maxWidth >= 20000) {
                        const hours = [];
                        const start = dateMod.startOf('day');
                        for (let i = 0; i < 24 * 12; i++) {
                            const left = start.add(i * 5, 'minutes');
                            const width = (start.add((i + 1) * 5, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
                            hours.push({
                                width,
                                formatted: left.format('HH:mm')
                            });
                        }
                        htmlFormatted = html `
            <div
              class=${className + '-content ' + className + '-content--day _20000' + current}
              style=${scrollStyleMap}
            >
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(hour => html `
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `)}
            </div>
          `;
                    }
                    break;
            }
            update();
        };
        let timeSub;
        const actionProps = { date: props.date, period: props.period, api, state };
        onChange((changedProps, options) => {
            if (options.leave) {
                styleMap.style.visibility = 'hidden';
                return update();
            }
            props = changedProps;
            actionProps.date = props.date;
            actionProps.period = props.period;
            if (timeSub) {
                timeSub();
            }
            timeSub = state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'], updateDate, {
                bulk: true
            });
        });
        onDestroy(() => {
            timeSub();
        });
        return templateProps => wrapper(html `
        <div
          class=${className + ' ' + className + '--' + props.period + current}
          style=${styleMap}
          data-actions=${actions(componentActions, actionProps)}
        >
          ${htmlFormatted}
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * ChartTimeline component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ChartTimeline(vido, props) {
        const { api, state, onDestroy, actions, update, html, createComponent, StyleMap } = vido;
        const componentName = 'chart-timeline';
        const componentActions = api.getActions(componentName);
        const actionProps = Object.assign(Object.assign({}, props), { api, state });
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimeline', value => (wrapper = value)));
        const GridComponent = state.get('config.components.ChartTimelineGrid');
        const ItemsComponent = state.get('config.components.ChartTimelineItems');
        const Grid = createComponent(GridComponent);
        onDestroy(Grid.destroy);
        const Items = createComponent(ItemsComponent);
        onDestroy(Items.destroy);
        let className, classNameInner;
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName);
            classNameInner = api.getClass(componentName + '-inner');
            update();
        }));
        let styleMap = new StyleMap({}), innerStyleMap = new StyleMap({});
        function calculateStyle() {
            const compensation = state.get('config.scroll.compensation');
            const width = state.get('_internal.chart.dimensions.width');
            const height = state.get('_internal.list.rowsHeight');
            styleMap.style.height = state.get('_internal.height') + 'px';
            if (width)
                styleMap.style.width = width + 'px';
            innerStyleMap.style.height = height + 'px';
            if (width)
                innerStyleMap.style.width = width + 'px';
            innerStyleMap.style.transform = `translate(0px, ${compensation}px)`;
            update();
        }
        onDestroy(state.subscribeAll([
            '_internal.height',
            '_internal.chart.dimensions.width',
            '_internal.list.rowsHeight',
            'config.scroll.compensation'
        ], calculateStyle));
        componentActions.push(element => {
            state.update('_internal.elements.chart-timeline', element);
        });
        return templateProps => wrapper(html `
        <div
          class=${className}
          style=${styleMap}
          data-actions=${actions(componentActions, actionProps)}
          @wheel=${api.onScroll}
        >
          <div class=${classNameInner} style=${innerStyleMap}>
            ${Grid.html()}${Items.html()}
          </div>
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * ChartTimelineGrid component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ChartTimelineGrid(vido, props) {
        const { api, state, onDestroy, actions, update, html, reuseComponents, StyleMap } = vido;
        const componentName = 'chart-timeline-grid';
        const componentActions = api.getActions(componentName);
        const actionProps = { api, state };
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineGrid', value => (wrapper = value)));
        const GridRowComponent = state.get('config.components.ChartTimelineGridRow');
        let className;
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName);
            update();
        }));
        let period;
        onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));
        let onBlockCreate;
        onDestroy(state.subscribe('config.chart.grid.block.onCreate', onCreate => (onBlockCreate = onCreate)));
        let rowsComponents = [];
        const rowsWithBlocks = [];
        const formatCache = new Map();
        const styleMap = new StyleMap({});
        /**
         * Generate blocks
         */
        const generateBlocks = () => {
            const width = state.get('_internal.chart.dimensions.width');
            const height = state.get('_internal.height');
            const periodDates = state.get(`_internal.chart.time.dates.${period}`);
            const visibleRows = state.get('_internal.list.visibleRows');
            if (!periodDates || periodDates.length === 0) {
                return;
            }
            const xCompensation = periodDates[0].subPx;
            const yCompensation = state.get('config.scroll.compensation');
            styleMap.style.height = height + Math.abs(yCompensation) + 'px';
            styleMap.style.width = width + 'px';
            styleMap.style.transform = `translate(-${xCompensation}px, 0px)`;
            let top = 0;
            rowsWithBlocks.length = 0;
            for (const row of visibleRows) {
                const blocks = [];
                for (const time of periodDates) {
                    let format;
                    if (formatCache.has(time.leftGlobal)) {
                        format = formatCache.get(time.leftGlobal);
                    }
                    else {
                        format = api.time.date(time.leftGlobal).format('YYYY-MM-DD');
                        formatCache.set(time.leftGlobal, format);
                    }
                    let id = row.id + ':' + format;
                    let block = { id, time, row, top };
                    for (const onCreate of onBlockCreate) {
                        block = onCreate(block);
                    }
                    blocks.push(block);
                }
                rowsWithBlocks.push({ row, blocks, top, width });
                top += row.height;
            }
            state.update('_internal.chart.grid.rowsWithBlocks', rowsWithBlocks);
        };
        onDestroy(state.subscribeAll([
            '_internal.list.visibleRows;',
            `_internal.chart.time.dates.${period};`,
            '_internal.height',
            '_internal.chart.dimensions.width'
        ], generateBlocks, {
            bulk: true
        }));
        /**
         * Generate rows components
         * @param {array} rowsWithBlocks
         */
        const generateRowsComponents = rowsWithBlocks => {
            if (rowsWithBlocks) {
                reuseComponents(rowsComponents, rowsWithBlocks, row => row, GridRowComponent);
                update();
            }
        };
        onDestroy(state.subscribe('_internal.chart.grid.rowsWithBlocks', generateRowsComponents));
        /**
         * Bind element
         * @param {Element} element
         */
        function bindElement(element) {
            state.update('_internal.elements.chart-timeline-grid', element);
        }
        if (!componentActions.includes(bindElement)) {
            componentActions.push();
        }
        onDestroy(() => {
            rowsComponents.forEach(row => row.destroy());
        });
        return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * ChartTimelineGridRow component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    /**
     * Bind element action
     * @param {Element} element
     * @param {any} data
     * @returns {object} with update and destroy
     */
    function bindElementAction(element, data) {
        data.state.update('_internal.elements.chart-timeline-grid-rows', function updateGridRows(rows) {
            if (typeof rows === 'undefined') {
                rows = [];
            }
            rows.push(element);
            return rows;
        }, { only: null });
        return {
            update() { },
            destroy(element) {
                data.state.update('_internal.elements.chart-timeline-grid-rows', rows => {
                    return rows.filter(el => el !== element);
                });
            }
        };
    }
    function ChartTimelineGridRow(vido, props) {
        const { api, state, onDestroy, actions, update, html, reuseComponents, onChange, StyleMap } = vido;
        const componentName = 'chart-timeline-grid-row';
        const actionProps = Object.assign(Object.assign({}, props), { api,
            state });
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineGridRow', value => {
            wrapper = value;
            update();
        }));
        const GridBlockComponent = state.get('config.components.ChartTimelineGridRowBlock');
        const componentActions = api.getActions(componentName);
        let className = api.getClass(componentName);
        let styleMap = new StyleMap({
            width: props.width + 'px',
            height: props.row.height + 'px',
            opacity: '1',
            pointerEvents: 'all',
            overflow: 'hidden'
        });
        let rowsBlocksComponents = [];
        const onPropsChange = (changedProps, options) => {
            var _a, _b, _c, _d, _e, _f, _g;
            if (options.leave) {
                styleMap.style.opacity = '0';
                styleMap.style.pointerEvents = 'none';
                update();
                return;
            }
            props = changedProps;
            reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
            //const compensation = state.get('config.scroll.compensation');
            // @ts-ignore
            styleMap.style = {};
            styleMap.style.opacity = '1';
            styleMap.style.pointerEvents = 'all';
            styleMap.style.height = props.row.height + 'px';
            styleMap.style.width = props.width + 'px';
            //styleMap.style.top = props.top + compensation + 'px';
            const rows = state.get('config.list.rows');
            for (const parentId of props.row._internal.parents) {
                const parent = rows[parentId];
                const childrenStyle = (_c = (_b = (_a = parent.style) === null || _a === void 0 ? void 0 : _a.grid) === null || _b === void 0 ? void 0 : _b.row) === null || _c === void 0 ? void 0 : _c.children;
                if (childrenStyle)
                    styleMap.style = Object.assign(Object.assign({}, styleMap.style), childrenStyle);
            }
            const currentStyle = (_g = (_f = (_e = (_d = props.row) === null || _d === void 0 ? void 0 : _d.style) === null || _e === void 0 ? void 0 : _e.grid) === null || _f === void 0 ? void 0 : _f.row) === null || _g === void 0 ? void 0 : _g.current;
            if (currentStyle)
                styleMap.style = Object.assign(Object.assign({}, styleMap.style), currentStyle);
            for (const prop in props) {
                actionProps[prop] = props[prop];
            }
            update();
        };
        onChange(onPropsChange);
        onDestroy(() => {
            rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
        });
        if (componentActions.indexOf(bindElementAction) === -1) {
            componentActions.push(bindElementAction);
        }
        return templateProps => {
            return wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          ${rowsBlocksComponents.map(r => r.html())}
        </div>
      `, { vido, props, templateProps });
        };
    }

    /**
     * ChartTimelineGridRowBlock component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    /**
     * Bind element action
     * @param {Element} element
     * @param {any} data
     * @returns {object} with update and destroy
     */
    const bindElementAction$1 = (element, data) => {
        data.state.update('_internal.elements.chart-timeline-grid-row-blocks', blocks => {
            if (typeof blocks === 'undefined') {
                blocks = [];
            }
            blocks.push(element);
            return blocks;
        }, { only: null });
        return element => {
            data.state.update('_internal.elements.chart-timeline-grid-row-blocks', blocks => {
                return blocks.filter(el => el !== element);
            }, { only: [''] });
        };
    };
    const ChartTimelineGridRowBlock = (vido, props) => {
        const { api, state, onDestroy, actions, update, html, onChange, StyleMap } = vido;
        const componentName = 'chart-timeline-grid-row-block';
        let actionProps = Object.assign(Object.assign({}, props), { api,
            state });
        const componentActions = api.getActions(componentName);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineGridRowBlock', value => {
            wrapper = value;
            update();
        }));
        const currentTime = api.time
            .date()
            .startOf('day')
            .valueOf();
        let className, classNameContent;
        function updateClassName(time) {
            className = api.getClass(componentName);
            classNameContent = className + '-content';
            if (time.leftGlobal === currentTime) {
                className += ' current';
            }
        }
        updateClassName(props.time);
        let styleMap = new StyleMap({ width: '', height: '' });
        /**
         * On props change
         * @param {any} changedProps
         */
        function onPropsChange(changedProps, options) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (options.leave) {
                return update();
            }
            props = changedProps;
            actionProps = Object.assign(Object.assign({}, props), { api, state });
            updateClassName(props.time);
            styleMap.style = {};
            styleMap.style.width = props.time.width + 'px';
            styleMap.style.height = props.row.height + 'px';
            const rows = state.get('config.list.rows');
            for (const parentId of props.row._internal.parents) {
                const parent = rows[parentId];
                const childrenStyle = (_c = (_b = (_a = parent.style) === null || _a === void 0 ? void 0 : _a.grid) === null || _b === void 0 ? void 0 : _b.block) === null || _c === void 0 ? void 0 : _c.children;
                if (childrenStyle)
                    styleMap.style = Object.assign(Object.assign({}, styleMap.style), childrenStyle);
            }
            const currentStyle = (_g = (_f = (_e = (_d = props.row) === null || _d === void 0 ? void 0 : _d.style) === null || _e === void 0 ? void 0 : _e.grid) === null || _f === void 0 ? void 0 : _f.block) === null || _g === void 0 ? void 0 : _g.current;
            if (currentStyle)
                styleMap.style = Object.assign(Object.assign({}, styleMap.style), currentStyle);
            update();
        }
        onChange(onPropsChange);
        if (componentActions.indexOf(bindElementAction$1) === -1) {
            componentActions.push(bindElementAction$1);
        }
        return templateProps => {
            return wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          <div class=${classNameContent} />
        </div>
      `, { props, vido, templateProps });
        };
    };

    /**
     * ChartTimelineItems component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function ChartTimelineItems(vido, props = {}) {
        const { api, state, onDestroy, actions, update, html, reuseComponents, StyleMap } = vido;
        const componentName = 'chart-timeline-items';
        const componentActions = api.getActions(componentName);
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineItems', value => (wrapper = value)));
        const ItemsRowComponent = state.get('config.components.ChartTimelineItemsRow');
        let className;
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName);
            update();
        }));
        let styleMap = new StyleMap({});
        const calculateStyle = () => {
            const width = state.get('_internal.chart.dimensions.width');
            const height = state.get('_internal.height');
            const compensation = state.get('config.scroll.compensation');
            styleMap.style.width = width + 'px';
            styleMap.style.height = height + Math.abs(compensation) + 'px';
        };
        onDestroy(state.subscribeAll(['_internal.height', '_internal.chart.dimensions.width', 'config.scroll.compensation'], calculateStyle));
        let rowsComponents = [];
        const createRowComponents = () => {
            const visibleRows = state.get('_internal.list.visibleRows');
            rowsComponents = reuseComponents(rowsComponents, visibleRows, row => ({ row }), ItemsRowComponent);
            update();
        };
        onDestroy(state.subscribeAll(['_internal.list.visibleRows', 'config.chart.items', 'config.list.rows'], createRowComponents, {
            bulk: true
        }));
        onDestroy(function destroyRows() {
            rowsComponents.forEach(row => row.destroy());
        });
        const actionProps = { api, state };
        return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions(componentActions, actionProps)}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `, { props, vido, templateProps });
    }

    /**
     * ChartTimelineItemsRow component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    /**
     * Bind element action
     * @param {Element} element
     * @param {any} data
     * @returns {object} with update and destroy
     */
    const bindElementAction$2 = (element, data) => {
        data.state.update('_internal.elements.chart-timeline-items-rows', rows => {
            if (typeof rows === 'undefined') {
                rows = [];
            }
            rows.push(element);
            return rows;
        }, { only: null });
        return {
            update() { },
            destroy(element) {
                data.state.update('_internal.elements.chart-timeline-items-rows', rows => {
                    return rows.filter(el => el !== element);
                });
            }
        };
    };
    const ChartTimelineItemsRow = (vido, props) => {
        const { api, state, onDestroy, actions, update, html, onChange, reuseComponents, StyleMap } = vido;
        const actionProps = Object.assign(Object.assign({}, props), { api, state });
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));
        const ItemComponent = state.get('config.components.ChartTimelineItemsRowItem');
        let itemsPath = `_internal.flatTreeMapById.${props.row.id}._internal.items`;
        let rowSub, itemsSub;
        let styleMap = new StyleMap({ opacity: '1', pointerEvents: 'auto', width: '', height: '' });
        let itemComponents = [];
        const updateDom = () => {
            const chart = state.get('_internal.chart');
            //const compensation = state.get('config.scroll.compensation');
            styleMap.style.opacity = '1';
            styleMap.style.pointerEvents = 'auto';
            styleMap.style.width = chart.dimensions.width + 'px';
            if (!props) {
                styleMap.style.opacity = '0';
                styleMap.style.pointerEvents = 'none';
                return;
            }
            styleMap.style.height = props.row.height + 'px';
            //styleMap.style.top = props.row.top + compensation + 'px';
            styleMap.style['--row-height'] = props.row.height + 'px';
        };
        const updateRow = row => {
            itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;
            if (typeof rowSub === 'function') {
                rowSub();
            }
            if (typeof itemsSub === 'function') {
                itemsSub();
            }
            rowSub = state.subscribe('_internal.chart', (bulk, eventInfo) => {
                updateDom();
                update();
            });
            itemsSub = state.subscribe(itemsPath, value => {
                itemComponents = reuseComponents(itemComponents, value, item => ({ row, item }), ItemComponent);
                updateDom();
                update();
            });
        };
        /**
         * On props change
         * @param {any} changedProps
         */
        const onPropsChange = (changedProps, options) => {
            if (options.leave) {
                updateDom();
                return update();
            }
            props = changedProps;
            for (const prop in props) {
                actionProps[prop] = props[prop];
            }
            updateRow(props.row);
        };
        onChange(onPropsChange);
        onDestroy(() => {
            itemsSub();
            rowSub();
            itemComponents.forEach(item => item.destroy());
        });
        const componentName = 'chart-timeline-items-row';
        const componentActions = api.getActions(componentName);
        let className;
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName, props);
            update();
        }));
        if (!componentActions.includes(bindElementAction$2)) {
            componentActions.push(bindElementAction$2);
        }
        return templateProps => {
            return wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          ${itemComponents.map(i => i.html())}
        </div>
      `, { props, vido, templateProps });
        };
    };

    /**
     * ChartTimelineItemsRowItem component
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    /**
     * Bind element action
     * @param {Element} element
     * @param {any} data
     * @returns {object} with update and destroy
     */
    const bindElementAction$3 = (element, data) => {
        data.state.update('_internal.elements.chart-timeline-items-row-items', function updateRowItems(items) {
            if (typeof items === 'undefined') {
                items = [];
            }
            items.push(element);
            return items;
        }, { only: null });
        return {
            update() { },
            destroy(element) {
                data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
                    return items.filter(el => el !== element);
                });
            }
        };
    };
    function ChartTimelineItemsRowItem(vido, props) {
        const { api, state, onDestroy, actions, update, html, onChange, unsafeHTML, StyleMap } = vido;
        let wrapper;
        onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
        let styleMap = new StyleMap({ width: '', height: '', left: '', opacity: '1', pointerEvents: 'auto' }), contentStyleMap = new StyleMap({ width: '', height: '' }), itemLeftPx = 0, itemWidthPx = 0, leave = false;
        const actionProps = {
            item: props.item,
            row: props.row,
            left: itemLeftPx,
            width: itemWidthPx,
            api,
            state
        };
        function updateItem() {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (leave)
                return;
            let time = state.get('_internal.chart.time');
            itemLeftPx = (props.item.time.start - time.leftGlobal) / time.timePerPixel;
            itemLeftPx = Math.round(itemLeftPx * 10) * 0.1;
            itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
            itemWidthPx -= state.get('config.chart.spacing') || 0;
            if (itemWidthPx) {
                itemWidthPx = Math.round(itemWidthPx * 10) * 0.1;
            }
            const oldWidth = styleMap.style.width;
            const oldHeight = styleMap.style.height;
            //const oldTransform = styleMap.style.transform;
            const oldLeft = styleMap.style.left;
            styleMap.style = {};
            const inViewPort = api.isItemInViewport(props.item, time.leftGlobal, time.rightGlobal);
            styleMap.style.opacity = inViewPort ? '1' : '0';
            styleMap.style.pointerEvents = inViewPort ? 'auto' : 'none';
            if (inViewPort) {
                // update style only when visible to prevent browser's recalculate style
                styleMap.style.width = itemWidthPx + 'px';
                styleMap.style.height = props.row.height + 'px';
                //styleMap.style.transform = `translate(${itemLeftPx}px, 0px)`;
                styleMap.style.left = itemLeftPx + 'px';
            }
            else {
                styleMap.style.width = oldWidth;
                styleMap.style.height = oldHeight;
                styleMap.style.left = oldLeft;
                //styleMap.style.transform = oldTransform;
            }
            // @ts-ignore
            contentStyleMap.style = { width: itemWidthPx + 'px', 'max-height': props.row.height + 'px' };
            const rows = state.get('config.list.rows');
            for (const parentId of props.row._internal.parents) {
                const parent = rows[parentId];
                const childrenStyle = (_c = (_b = (_a = parent.style) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.children;
                if (childrenStyle)
                    contentStyleMap.style = Object.assign(Object.assign({}, contentStyleMap.style), childrenStyle);
            }
            const currentRowItemsStyle = (_g = (_f = (_e = (_d = props.row) === null || _d === void 0 ? void 0 : _d.style) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.item) === null || _g === void 0 ? void 0 : _g.current;
            if (currentRowItemsStyle)
                contentStyleMap.style = Object.assign(Object.assign({}, contentStyleMap), currentRowItemsStyle);
            const currentStyle = (_h = props.item) === null || _h === void 0 ? void 0 : _h.style;
            if (currentStyle)
                contentStyleMap.style = Object.assign(Object.assign({}, contentStyleMap.style), currentStyle);
            update();
        }
        function onPropsChange(changedProps, options) {
            if (options.leave) {
                leave = true;
                styleMap.style.opacity = '0';
                styleMap.style.pointerEvents = 'none';
                return update();
            }
            else {
                leave = false;
            }
            props = changedProps;
            actionProps.item = props.item;
            actionProps.row = props.row;
            actionProps.left = itemLeftPx;
            actionProps.width = itemWidthPx;
            updateItem();
        }
        onChange(onPropsChange);
        const componentName = 'chart-timeline-items-row-item';
        const componentActions = api.getActions(componentName);
        let className, contentClassName, labelClassName;
        onDestroy(state.subscribe('config.classNames', () => {
            className = api.getClass(componentName, props);
            contentClassName = api.getClass(componentName + '-content', props);
            labelClassName = api.getClass(componentName + '-content-label', props);
            update();
        }));
        onDestroy(state.subscribe('_internal.chart.time', bulk => {
            updateItem();
        }));
        if (componentActions.indexOf(bindElementAction$3) === -1) {
            componentActions.push(bindElementAction$3);
        }
        return templateProps => {
            return wrapper(html `
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          <div class=${contentClassName} style=${contentStyleMap}>
            <div class=${labelClassName}>
              ${props.item.isHtml ? unsafeHTML(props.item.label) : props.item.label}
            </div>
          </div>
        </div>
      `, { vido, props, templateProps });
        };
    }

    /**
     * Gantt-Schedule-Timeline-Calendar
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0
     */
    const actionNames = [
        '',
        'list',
        'list-column',
        'list-column-header',
        'list-expander',
        'list-expander-toggle',
        'list-column-header-resizer',
        'list-column-row',
        'chart',
        'chart-calendar',
        'chart-calendar-date',
        'chart-timeline',
        'chart-timeline-grid',
        'chart-timeline-grid-row',
        'chart-timeline-grid-row-block',
        'chart-timeline-items',
        'chart-timeline-items-row',
        'chart-timeline-items-row-item'
    ];
    function generateEmptyActions() {
        const actions = {};
        actionNames.forEach(name => (actions[name] = []));
        return actions;
    }
    // default configuration
    function defaultConfig() {
        const actions = generateEmptyActions();
        return {
            plugins: [],
            plugin: {},
            height: 740,
            headerHeight: 86,
            components: {
                Main,
                List,
                ListColumn,
                ListColumnHeader,
                ListColumnHeaderResizer,
                ListColumnRow,
                ListExpander,
                ListToggle,
                Chart,
                ChartCalendar,
                ChartCalendarDate,
                ChartTimeline,
                ChartTimelineGrid,
                ChartTimelineGridRow,
                ChartTimelineGridRowBlock,
                ChartTimelineItems,
                ChartTimelineItemsRow,
                ChartTimelineItemsRowItem
            },
            wrappers: {
                Main(input) {
                    return input;
                },
                List(input) {
                    return input;
                },
                ListColumn(input) {
                    return input;
                },
                ListColumnHeader(input) {
                    return input;
                },
                ListColumnHeaderResizer(input) {
                    return input;
                },
                ListColumnRow(input) {
                    return input;
                },
                ListExpander(input) {
                    return input;
                },
                ListToggle(input) {
                    return input;
                },
                Chart(input) {
                    return input;
                },
                ChartCalendar(input) {
                    return input;
                },
                ChartCalendarDate(input) {
                    return input;
                },
                ChartTimeline(input) {
                    return input;
                },
                ChartTimelineGrid(input) {
                    return input;
                },
                ChartTimelineGridRow(input) {
                    return input;
                },
                ChartTimelineGridRowBlock(input) {
                    return input;
                },
                ChartTimelineItems(input) {
                    return input;
                },
                ChartTimelineItemsRow(input) {
                    return input;
                },
                ChartTimelineItemsRowItem(input) {
                    return input;
                }
            },
            list: {
                rows: {},
                rowHeight: 40,
                columns: {
                    percent: 100,
                    resizer: {
                        width: 10,
                        inRealTime: true,
                        dots: 6
                    },
                    minWidth: 50,
                    data: {}
                },
                expander: {
                    padding: 18,
                    size: 20,
                    icon: {
                        width: 16,
                        height: 16
                    },
                    icons: {
                        child: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><ellipse ry="4" rx="4" id="svg_1" cy="12" cx="12" fill="#000000B0"/></svg>',
                        open: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                        closed: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'
                    }
                }
            },
            scroll: {
                top: 0,
                left: 0,
                xMultiplier: 1.5,
                yMultiplier: 1,
                percent: {
                    top: 0,
                    left: 0
                }
            },
            chart: {
                time: {
                    from: 0,
                    to: 0,
                    zoom: 21,
                    period: 'day',
                    dates: {},
                    maxWidth: {}
                },
                calendar: {
                    vertical: {
                        smallFormat: 'YYYY-MM-DD'
                    }
                },
                grid: {
                    block: {
                        onCreate: []
                    }
                },
                items: {},
                spacing: 1
            },
            classNames: {},
            actions,
            locale: {
                name: 'en',
                weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
                weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
                weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
                months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
                monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
                weekStart: 1,
                relativeTime: {
                    future: 'in %s',
                    past: '%s ago',
                    s: 'a few seconds',
                    m: 'a minute',
                    mm: '%d minutes',
                    h: 'an hour',
                    hh: '%d hours',
                    d: 'a day',
                    dd: '%d days',
                    M: 'a month',
                    MM: '%d months',
                    y: 'a year',
                    yy: '%d years'
                },
                formats: {
                    LT: 'HH:mm',
                    LTS: 'HH:mm:ss',
                    L: 'DD/MM/YYYY',
                    LL: 'D MMMM YYYY',
                    LLL: 'D MMMM YYYY HH:mm',
                    LLLL: 'dddd, D MMMM YYYY HH:mm'
                },
                ordinal: n => {
                    const s = ['th', 'st', 'nd', 'rd'];
                    const v = n % 100;
                    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
                }
            }
        };
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var hammer = createCommonjsModule(function (module) {
    /*! Hammer.JS - v2.0.7 - 2016-04-22
     * http://hammerjs.github.io/
     *
     * Copyright (c) 2016 Jorik Tangelder;
     * Licensed under the MIT license */
    (function(window, document, exportName, undefined$1) {

    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var TEST_ELEMENT = document.createElement('div');

    var TYPE_FUNCTION = 'function';

    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;

    /**
     * set a timeout with a given scope
     * @param {Function} fn
     * @param {Number} timeout
     * @param {Object} context
     * @returns {number}
     */
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }

    /**
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {*|Array} arg
     * @param {String} fn
     * @param {Object} [context]
     * @returns {Boolean}
     */
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }

    /**
     * walk objects and arrays
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
     */
    function each(obj, iterator, context) {
        var i;

        if (!obj) {
            return;
        }

        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length !== undefined$1) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        } else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }

    /**
     * wrap a method with a deprecation warning and stack trace
     * @param {Function} method
     * @param {String} name
     * @param {String} message
     * @returns {Function} A new function wrapping the supplied method.
     */
    function deprecate(method, name, message) {
        var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
        return function() {
            var e = new Error('get-stack-trace');
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

            var log = window.console && (window.console.warn || window.console.log);
            if (log) {
                log.call(window.console, deprecationMessage, stack);
            }
            return method.apply(this, arguments);
        };
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} target
     * @param {...Object} objects_to_assign
     * @returns {Object} target
     */
    var assign;
    if (typeof Object.assign !== 'function') {
        assign = function assign(target) {
            if (target === undefined$1 || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined$1 && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    } else {
        assign = Object.assign;
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} dest
     * @param {Object} src
     * @param {Boolean} [merge=false]
     * @returns {Object} dest
     */
    var extend = deprecate(function extend(dest, src, merge) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
            if (!merge || (merge && dest[keys[i]] === undefined$1)) {
                dest[keys[i]] = src[keys[i]];
            }
            i++;
        }
        return dest;
    }, 'extend', 'Use `assign`.');

    /**
     * merge the values from src in the dest.
     * means that properties that exist in dest will not be overwritten by src
     * @param {Object} dest
     * @param {Object} src
     * @returns {Object} dest
     */
    var merge = deprecate(function merge(dest, src) {
        return extend(dest, src, true);
    }, 'merge', 'Use `assign`.');

    /**
     * simple class inheritance
     * @param {Function} child
     * @param {Function} base
     * @param {Object} [properties]
     */
    function inherit(child, base, properties) {
        var baseP = base.prototype,
            childP;

        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;

        if (properties) {
            assign(childP, properties);
        }
    }

    /**
     * simple function bind
     * @param {Function} fn
     * @param {Object} context
     * @returns {Function}
     */
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }

    /**
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {Boolean|Function} val
     * @param {Array} [args]
     * @returns {Boolean}
     */
    function boolOrFn(val, args) {
        if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
        }
        return val;
    }

    /**
     * use the val2 when val1 is undefined
     * @param {*} val1
     * @param {*} val2
     * @returns {*}
     */
    function ifUndefined(val1, val2) {
        return (val1 === undefined$1) ? val2 : val1;
    }

    /**
     * addEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function addEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
            target.addEventListener(type, handler, false);
        });
    }

    /**
     * removeEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function removeEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
            target.removeEventListener(type, handler, false);
        });
    }

    /**
     * find if a node is in the given parent
     * @method hasParent
     * @param {HTMLElement} node
     * @param {HTMLElement} parent
     * @return {Boolean} found
     */
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * small indexOf wrapper
     * @param {String} str
     * @param {String} find
     * @returns {Boolean} found
     */
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }

    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }

    /**
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {Array} src
     * @param {String} find
     * @param {String} [findByKey]
     * @return {Boolean|Number} false when not found, or the index
     */
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        } else {
            var i = 0;
            while (i < src.length) {
                if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                    return i;
                }
                i++;
            }
            return -1;
        }
    }

    /**
     * convert array-like objects to real arrays
     * @param {Object} obj
     * @returns {Array}
     */
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }

    /**
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {Array} src [{id:1},{id:2},{id:1}]
     * @param {String} [key]
     * @param {Boolean} [sort=False]
     * @returns {Array} [{id:1},{id:2}]
     */
    function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;

        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key];
                });
            }
        }

        return results;
    }

    /**
     * get the prefixed property
     * @param {Object} obj
     * @param {String} property
     * @returns {String|Undefined} prefixed
     */
    function prefixed(obj, property) {
        var prefix, prop;
        var camelProp = property[0].toUpperCase() + property.slice(1);

        var i = 0;
        while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = (prefix) ? prefix + camelProp : property;

            if (prop in obj) {
                return prop;
            }
            i++;
        }
        return undefined$1;
    }

    /**
     * get a unique id
     * @returns {number} uniqueId
     */
    var _uniqueId = 1;
    function uniqueId() {
        return _uniqueId++;
    }

    /**
     * get the window object of an element
     * @param {HTMLElement} element
     * @returns {DocumentView|Window}
     */
    function getWindowForElement(element) {
        var doc = element.ownerDocument || element;
        return (doc.defaultView || doc.parentWindow || window);
    }

    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    var INPUT_TYPE_TOUCH = 'touch';
    var INPUT_TYPE_PEN = 'pen';
    var INPUT_TYPE_MOUSE = 'mouse';
    var INPUT_TYPE_KINECT = 'kinect';

    var COMPUTE_INTERVAL = 25;

    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;

    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;

    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

    /**
     * create new input type manager
     * @param {Manager} manager
     * @param {Function} callback
     * @returns {Input}
     * @constructor
     */
    function Input(manager, callback) {
        var self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;

        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function(ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
                self.handler(ev);
            }
        };

        this.init();

    }

    Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function() { },

        /**
         * bind the events
         */
        init: function() {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },

        /**
         * unbind the events
         */
        destroy: function() {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
    };

    /**
     * create new input type manager
     * called by the Manager constructor
     * @param {Hammer} manager
     * @returns {Input}
     */
    function createInputInstance(manager) {
        var Type;
        var inputClass = manager.options.inputClass;

        if (inputClass) {
            Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
        } else {
            Type = TouchMouseInput;
        }
        return new (Type)(manager, inputHandler);
    }

    /**
     * handle input events
     * @param {Manager} manager
     * @param {String} eventType
     * @param {Object} input
     */
    function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
        var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;

        if (isFirst) {
            manager.session = {};
        }

        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;

        // compute scale, rotation etc
        computeInputData(manager, input);

        // emit secret event
        manager.emit('hammer.input', input);

        manager.recognize(input);
        manager.session.prevInput = input;
    }

    /**
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {Object} manager
     * @param {Object} input
     */
    function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

        var center = input.center = getCenter(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);

        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

        input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
            session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

        computeIntervalInputData(session, input);

        // find the correct target
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    }

    function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};

        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
    }

    /**
     * velocity is calculated every x ms
     * @param {Object} session
     * @param {Object} input
     */
    function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input,
            deltaTime = input.timeStamp - last.timeStamp,
            velocity, velocityX, velocityY, direction;

        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;

            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);

            session.lastInterval = input;
        } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    }

    /**
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {Object} input
     * @returns {Object} clonedInputData
     */
    function simpleCloneInputData(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: round(input.pointers[i].clientX),
                clientY: round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    }

    /**
     * get the center of all the pointers
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */
    function getCenter(pointers) {
        var pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: round(pointers[0].clientX),
                y: round(pointers[0].clientY)
            };
        }

        var x = 0, y = 0, i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
        };
    }

    /**
     * calculate the velocity between two points. unit is in px per ms.
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    function getVelocity(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    }

    /**
     * get the direction between two points
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */
    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }

        if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    /**
     * calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * calculate the angle between two coordinates
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    /**
     * calculate the rotation degrees between two pointersets
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }

    /**
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }

    var MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
    };

    var MOUSE_ELEMENT_EVENTS = 'mousedown';
    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

    /**
     * Mouse events input
     * @constructor
     * @extends Input
     */
    function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;

        this.pressed = false; // mousedown state

        Input.apply(this, arguments);
    }

    inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type];

            // on start we want to have the left mouse button down
            if (eventType & INPUT_START && ev.button === 0) {
                this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
                eventType = INPUT_END;
            }

            // mouse must be down
            if (!this.pressed) {
                return;
            }

            if (eventType & INPUT_END) {
                this.pressed = false;
            }

            this.callback(this.manager, eventType, {
                pointers: [ev],
                changedPointers: [ev],
                pointerType: INPUT_TYPE_MOUSE,
                srcEvent: ev
            });
        }
    });

    var POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
    };

    // in IE10 the pointer types is defined as an enum
    var IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };

    var POINTER_ELEMENT_EVENTS = 'pointerdown';
    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

    // IE10 has prefixed support, and case-sensitive
    if (window.MSPointerEvent && !window.PointerEvent) {
        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }

    /**
     * Pointer events input
     * @constructor
     * @extends Input
     */
    function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;

        Input.apply(this, arguments);

        this.store = (this.manager.session.pointerEvents = []);
    }

    inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;

            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

            var isTouch = (pointerType == INPUT_TYPE_TOUCH);

            // get index of the event in the store
            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

            // start and mouse must be down
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                if (storeIndex < 0) {
                    store.push(ev);
                    storeIndex = store.length - 1;
                }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                removePointer = true;
            }

            // it not found, so the pointer hasn't been down (so it's probably a hover)
            if (storeIndex < 0) {
                return;
            }

            // update the event in the store
            store[storeIndex] = ev;

            this.callback(this.manager, eventType, {
                pointers: store,
                changedPointers: [ev],
                pointerType: pointerType,
                srcEvent: ev
            });

            if (removePointer) {
                // remove from the store
                store.splice(storeIndex, 1);
            }
        }
    });

    var SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Touch events input
     * @constructor
     * @extends Input
     */
    function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;

        Input.apply(this, arguments);
    }

    inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

            // should we handle the touch events?
            if (type === INPUT_START) {
                this.started = true;
            }

            if (!this.started) {
                return;
            }

            var touches = normalizeSingleTouches.call(this, ev, type);

            // when done, reset the started state
            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
                this.started = false;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function normalizeSingleTouches(ev, type) {
        var all = toArray(ev.touches);
        var changed = toArray(ev.changedTouches);

        if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
        }

        return [all, changed];
    }

    var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */
    function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};

        Input.apply(this, arguments);
    }

    inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);
            if (!touches) {
                return;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function getTouches(ev, type) {
        var allTouches = toArray(ev.touches);
        var targetIds = this.targetIds;

        // when there is only one touch, the process can be simplified
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }

        var i,
            targetTouches,
            changedTouches = toArray(ev.changedTouches),
            changedTargetTouches = [],
            target = this.target;

        // get target touches from touches
        targetTouches = allTouches.filter(function(touch) {
            return hasParent(touch.target, target);
        });

        // collect touches
        if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }

        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }

            // cleanup removed touches
            if (type & (INPUT_END | INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }

        if (!changedTargetTouches.length) {
            return;
        }

        return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
            changedTargetTouches
        ];
    }

    /**
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @constructor
     * @extends Input
     */

    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;

    function TouchMouseInput() {
        Input.apply(this, arguments);

        var handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);

        this.primaryTouch = null;
        this.lastTouches = [];
    }

    inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
                isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
                return;
            }

            // when we're in a touch event, record touches to  de-dupe synthetic mouse event
            if (isTouch) {
                recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
                return;
            }

            this.callback(manager, inputEvent, inputData);
        },

        /**
         * remove the event listeners
         */
        destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
        }
    });

    function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
        }
    }

    function setLastTouch(eventData) {
        var touch = eventData.changedPointers[0];

        if (touch.identifier === this.primaryTouch) {
            var lastTouch = {x: touch.clientX, y: touch.clientY};
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;
            var removeLastTouch = function() {
                var i = lts.indexOf(lastTouch);
                if (i > -1) {
                    lts.splice(i, 1);
                }
            };
            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
    }

    function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                return true;
            }
        }
        return false;
    }

    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;

    // magical touchAction value
    var TOUCH_ACTION_COMPUTE = 'compute';
    var TOUCH_ACTION_AUTO = 'auto';
    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    var TOUCH_ACTION_NONE = 'none';
    var TOUCH_ACTION_PAN_X = 'pan-x';
    var TOUCH_ACTION_PAN_Y = 'pan-y';
    var TOUCH_ACTION_MAP = getTouchActionProps();

    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */
    function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
    }

    TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function(value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }

            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        },

        /**
         * just re-set the touchAction value
         */
        update: function() {
            this.set(this.manager.options.touchAction);
        },

        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function() {
            var actions = [];
            each(this.manager.recognizers, function(recognizer) {
                if (boolOrFn(recognizer.options.enable, [recognizer])) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        },

        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function(input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection;

            // if the touch action did prevented once this session
            if (this.manager.session.prevented) {
                srcEvent.preventDefault();
                return;
            }

            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
                //do not prevent defaults if this is a tap gesture

                var isTapPointer = input.pointers.length === 1;
                var isTapMovement = input.distance < 2;
                var isTapTouchTime = input.deltaTime < 250;

                if (isTapPointer && isTapMovement && isTapTouchTime) {
                    return;
                }
            }

            if (hasPanX && hasPanY) {
                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                return;
            }

            if (hasNone ||
                (hasPanY && direction & DIRECTION_HORIZONTAL) ||
                (hasPanX && direction & DIRECTION_VERTICAL)) {
                return this.preventSrc(srcEvent);
            }
        },

        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
        }
    };

    /**
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {String} actions
     * @returns {*}
     */
    function cleanTouchActions(actions) {
        // none
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
        }

        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

        // if both pan-x and pan-y are set (different recognizers
        // for different directions, e.g. horizontal pan but vertical swipe?)
        // we need none (as otherwise with pan-x pan-y combined none of these
        // recognizers will work, since the browser would handle all panning
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
        }

        // pan-x OR pan-y
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }

        // manipulation
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
        }

        return TOUCH_ACTION_AUTO;
    }

    function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
            return false;
        }
        var touchMap = {};
        var cssSupports = window.CSS && window.CSS.supports;
        ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
        });
        return touchMap;
    }

    /**
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;

    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     * @param {Object} options
     */
    function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});

        this.id = uniqueId();

        this.manager = null;

        // default is enable true
        this.options.enable = ifUndefined(this.options.enable, true);

        this.state = STATE_POSSIBLE;

        this.simultaneous = {};
        this.requireFail = [];
    }

    Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},

        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function(options) {
            assign(this.options, options);

            // also update the touchAction, in case something changed about the directions/enabled state
            this.manager && this.manager.touchAction.update();
            return this;
        },

        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                return this;
            }

            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        },

        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        },

        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                return this;
            }

            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        },

        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        },

        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function() {
            return this.requireFail.length > 0;
        },

        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        },

        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function(input) {
            var self = this;
            var state = this.state;

            function emit(event) {
                self.manager.emit(event, input);
            }

            // 'panstart' and 'panmove'
            if (state < STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
                emit(input.additionalEvent);
            }

            // panend and pancancel
            if (state >= STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
        },

        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function(input) {
            if (this.canEmit()) {
                return this.emit(input);
            }
            // it's failing anyway
            this.state = STATE_FAILED;
        },

        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function() {
            var i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        },

        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function(inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var inputDataClone = assign({}, inputData);

            // is is enabled and allow recognizing?
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                this.reset();
                this.state = STATE_FAILED;
                return;
            }

            // reset when we've reached the end
            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
                this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone);

            // the recognizer has recognized a gesture
            // so trigger an event
            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
                this.tryEmit(inputDataClone);
            }
        },

        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function(inputData) { }, // jshint ignore:line

        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function() { },

        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function() { }
    };

    /**
     * get a usable string, used as event postfix
     * @param {Const} state
     * @returns {String} state
     */
    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return 'cancel';
        } else if (state & STATE_ENDED) {
            return 'end';
        } else if (state & STATE_CHANGED) {
            return 'move';
        } else if (state & STATE_BEGAN) {
            return 'start';
        }
        return '';
    }

    /**
     * direction cons to string
     * @param {Const} direction
     * @returns {String}
     */
    function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
            return 'down';
        } else if (direction == DIRECTION_UP) {
            return 'up';
        } else if (direction == DIRECTION_LEFT) {
            return 'left';
        } else if (direction == DIRECTION_RIGHT) {
            return 'right';
        }
        return '';
    }

    /**
     * get a recognizer by name if it is bound to a manager
     * @param {Recognizer|String} otherRecognizer
     * @param {Recognizer} recognizer
     * @returns {Recognizer}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer);
        }
        return otherRecognizer;
    }

    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */
    function AttrRecognizer() {
        Recognizer.apply(this, arguments);
    }

    inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
        },

        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function(input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
        },

        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function(input) {
            var state = this.state;
            var eventType = input.eventType;

            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input);

            // on cancel input and we've recognized before, return STATE_CANCELLED
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
                if (eventType & INPUT_END) {
                    return state | STATE_ENDED;
                } else if (!(state & STATE_BEGAN)) {
                    return STATE_BEGAN;
                }
                return state | STATE_CHANGED;
            }
            return STATE_FAILED;
        }
    });

    /**
     * Pan
     * Recognized when the pointer is down and moved in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);

        this.pX = null;
        this.pY = null;
    }

    inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
        },

        getTouchAction: function() {
            var direction = this.options.direction;
            var actions = [];
            if (direction & DIRECTION_HORIZONTAL) {
                actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & DIRECTION_VERTICAL) {
                actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
        },

        directionTest: function(input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY;

            // lock to axis?
            if (!(direction & options.direction)) {
                if (options.direction & DIRECTION_HORIZONTAL) {
                    direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.deltaX);
                } else {
                    direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.deltaY);
                }
            }
            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
        },

        attrTest: function(input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) &&
                (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
        },

        emit: function(input) {

            this.pX = input.deltaX;
            this.pY = input.deltaY;

            var direction = directionStr(input.direction);

            if (direction) {
                input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @constructor
     * @extends AttrRecognizer
     */
    function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function(input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },

        emit: function(input) {
            if (input.scale !== 1) {
                var inOut = input.scale < 1 ? 'in' : 'out';
                input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @constructor
     * @extends Recognizer
     */
    function PressRecognizer() {
        Recognizer.apply(this, arguments);

        this._timer = null;
        this._input = null;
    }

    inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
            event: 'press',
            pointers: 1,
            time: 251, // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_AUTO];
        },

        process: function(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;

            this._input = input;

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
                this.reset();
            } else if (input.eventType & INPUT_START) {
                this.reset();
                this._timer = setTimeoutContext(function() {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                }, options.time, this);
            } else if (input.eventType & INPUT_END) {
                return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
        },

        reset: function() {
            clearTimeout(this._timer);
        },

        emit: function(input) {
            if (this.state !== STATE_RECOGNIZED) {
                return;
            }

            if (input && (input.eventType & INPUT_END)) {
                this.manager.emit(this.options.event + 'up', input);
            } else {
                this._input.timeStamp = now();
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Rotate
     * Recognized when two or more pointer are moving in a circular motion.
     * @constructor
     * @extends AttrRecognizer
     */
    function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function(input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
    });

    /**
     * Swipe
     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
        },

        getTouchAction: function() {
            return PanRecognizer.prototype.getTouchAction.call(this);
        },

        attrTest: function(input) {
            var direction = this.options.direction;
            var velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
                velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
                velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
                velocity = input.overallVelocityY;
            }

            return this._super.attrTest.call(this, input) &&
                direction & input.offsetDirection &&
                input.distance > this.options.threshold &&
                input.maxPointers == this.options.pointers &&
                abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },

        emit: function(input) {
            var direction = directionStr(input.offsetDirection);
            if (direction) {
                this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
        }
    });

    /**
     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
     * a single tap.
     *
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @constructor
     * @extends Recognizer
     */
    function TapRecognizer() {
        Recognizer.apply(this, arguments);

        // previous time and center,
        // used for tap counting
        this.pTime = false;
        this.pCenter = false;

        this._timer = null;
        this._input = null;
        this.count = 0;
    }

    inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300, // max time between the multi-tap taps
            time: 250, // max time of the pointer to be down (like finger on the screen)
            threshold: 9, // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_MANIPULATION];
        },

        process: function(input) {
            var options = this.options;

            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;

            this.reset();

            if ((input.eventType & INPUT_START) && (this.count === 0)) {
                return this.failTimeout();
            }

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (validMovement && validTouchTime && validPointers) {
                if (input.eventType != INPUT_END) {
                    return this.failTimeout();
                }

                var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

                this.pTime = input.timeStamp;
                this.pCenter = input.center;

                if (!validMultiTap || !validInterval) {
                    this.count = 1;
                } else {
                    this.count += 1;
                }

                this._input = input;

                // if tap count matches we have recognized it,
                // else it has began recognizing...
                var tapCount = this.count % options.taps;
                if (tapCount === 0) {
                    // no failing requirements, immediately trigger the tap event
                    // or wait as long as the multitap interval to trigger
                    if (!this.hasRequireFailures()) {
                        return STATE_RECOGNIZED;
                    } else {
                        this._timer = setTimeoutContext(function() {
                            this.state = STATE_RECOGNIZED;
                            this.tryEmit();
                        }, options.interval, this);
                        return STATE_BEGAN;
                    }
                }
            }
            return STATE_FAILED;
        },

        failTimeout: function() {
            this._timer = setTimeoutContext(function() {
                this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
        },

        reset: function() {
            clearTimeout(this._timer);
        },

        emit: function() {
            if (this.state == STATE_RECOGNIZED) {
                this._input.tapCount = this.count;
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Simple way to create a manager with a default set of recognizers.
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Hammer(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
        return new Manager(element, options);
    }

    /**
     * @const {string}
     */
    Hammer.VERSION = '2.0.7';

    /**
     * default settings
     * @namespace
     */
    Hammer.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,

        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,

        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,

        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,

        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,

        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
            [RotateRecognizer, {enable: false}],
            [PinchRecognizer, {enable: false}, ['rotate']],
            [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
            [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
            [TapRecognizer],
            [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
            [PressRecognizer]
        ],

        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
        }
    };

    var STOP = 1;
    var FORCED_STOP = 2;

    /**
     * Manager
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Manager(element, options) {
        this.options = assign({}, Hammer.defaults, options || {});

        this.options.inputTarget = this.options.inputTarget || element;

        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};

        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);

        toggleCssProps(this, true);

        each(this.options.recognizers, function(item) {
            var recognizer = this.add(new (item[0])(item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
        }, this);
    }

    Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function(options) {
            assign(this.options, options);

            // Options that need a little more setup
            if (options.touchAction) {
                this.touchAction.update();
            }
            if (options.inputTarget) {
                // Clean up existing event listeners and reinitialize
                this.input.destroy();
                this.input.target = options.inputTarget;
                this.input.init();
            }
            return this;
        },

        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        },

        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function(inputData) {
            var session = this.session;
            if (session.stopped) {
                return;
            }

            // run the touch-action polyfill
            this.touchAction.preventDefaults(inputData);

            var recognizer;
            var recognizers = this.recognizers;

            // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`
            var curRecognizer = session.curRecognizer;

            // reset when the last recognizer is recognized
            // or when we're in a new session
            if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = null;
            }

            var i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];

                // find out if we are allowed try to recognize the input for this one.
                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                //      that is being recognized.
                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                //      this can be setup with the `recognizeWith()` method on the recognizer.
                if (session.stopped !== FORCED_STOP && ( // 1
                        !curRecognizer || recognizer == curRecognizer || // 2
                        recognizer.canRecognizeWith(curRecognizer))) { // 3
                    recognizer.recognize(inputData);
                } else {
                    recognizer.reset();
                }

                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                // current active recognizer. but only if we don't already have an active recognizer
                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        },

        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function(recognizer) {
            if (recognizer instanceof Recognizer) {
                return recognizer;
            }

            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
                if (recognizers[i].options.event == recognizer) {
                    return recognizers[i];
                }
            }
            return null;
        },

        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function(recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
                return this;
            }

            // remove existing
            var existing = this.get(recognizer.options.event);
            if (existing) {
                this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;

            this.touchAction.update();
            return recognizer;
        },

        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function(recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
                return this;
            }

            recognizer = this.get(recognizer);

            // let's make sure this recognizer exists
            if (recognizer) {
                var recognizers = this.recognizers;
                var index = inArray(recognizers, recognizer);

                if (index !== -1) {
                    recognizers.splice(index, 1);
                    this.touchAction.update();
                }
            }

            return this;
        },

        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function(events, handler) {
            if (events === undefined$1) {
                return;
            }
            if (handler === undefined$1) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function(event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        },

        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function(events, handler) {
            if (events === undefined$1) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function(event) {
                if (!handler) {
                    delete handlers[event];
                } else {
                    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
                }
            });
            return this;
        },

        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function(event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
                triggerDomEvent(event, data);
            }

            // no handlers, so skip it all
            var handlers = this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
                return;
            }

            data.type = event;
            data.preventDefault = function() {
                data.srcEvent.preventDefault();
            };

            var i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        },

        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function() {
            this.element && toggleCssProps(this, false);

            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
        }
    };

    /**
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {Manager} manager
     * @param {Boolean} add
     */
    function toggleCssProps(manager, add) {
        var element = manager.element;
        if (!element.style) {
            return;
        }
        var prop;
        each(manager.options.cssProps, function(value, name) {
            prop = prefixed(element.style, name);
            if (add) {
                manager.oldCssProps[prop] = element.style[prop];
                element.style[prop] = value;
            } else {
                element.style[prop] = manager.oldCssProps[prop] || '';
            }
        });
        if (!add) {
            manager.oldCssProps = {};
        }
    }

    /**
     * trigger dom event
     * @param {String} event
     * @param {Object} data
     */
    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
    }

    assign(Hammer, {
        INPUT_START: INPUT_START,
        INPUT_MOVE: INPUT_MOVE,
        INPUT_END: INPUT_END,
        INPUT_CANCEL: INPUT_CANCEL,

        STATE_POSSIBLE: STATE_POSSIBLE,
        STATE_BEGAN: STATE_BEGAN,
        STATE_CHANGED: STATE_CHANGED,
        STATE_ENDED: STATE_ENDED,
        STATE_RECOGNIZED: STATE_RECOGNIZED,
        STATE_CANCELLED: STATE_CANCELLED,
        STATE_FAILED: STATE_FAILED,

        DIRECTION_NONE: DIRECTION_NONE,
        DIRECTION_LEFT: DIRECTION_LEFT,
        DIRECTION_RIGHT: DIRECTION_RIGHT,
        DIRECTION_UP: DIRECTION_UP,
        DIRECTION_DOWN: DIRECTION_DOWN,
        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
        DIRECTION_ALL: DIRECTION_ALL,

        Manager: Manager,
        Input: Input,
        TouchAction: TouchAction,

        TouchInput: TouchInput,
        MouseInput: MouseInput,
        PointerEventInput: PointerEventInput,
        TouchMouseInput: TouchMouseInput,
        SingleTouchInput: SingleTouchInput,

        Recognizer: Recognizer,
        AttrRecognizer: AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,

        on: addEventListeners,
        off: removeEventListeners,
        each: each,
        merge: merge,
        extend: extend,
        assign: assign,
        inherit: inherit,
        bindFn: bindFn,
        prefixed: prefixed
    });

    // this prevents errors when Hammer is loaded in the presence of an AMD
    //  style loader but by script tag, not by the loader.
    var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
    freeGlobal.Hammer = Hammer;

    if (typeof undefined$1 === 'function' && undefined$1.amd) {
        undefined$1(function() {
            return Hammer;
        });
    } else if ( module.exports) {
        module.exports = Hammer;
    } else {
        window[exportName] = Hammer;
    }

    })(window, document, 'Hammer');
    });

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i;}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u,$offset:n.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
    });

    /**
     * Gantt-Schedule-Timeline-Calendar
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0
     */

    function timeApi(state, getApi) {
      const locale = state.get('config.locale');
      dayjs_min.locale(locale, null, true);
      return {
        date(time) {
          return time ? dayjs_min(time).locale(locale.name) : dayjs_min().locale(locale.name);
        },
        recalculateFromTo(time) {
          time = { ...time };
          if (time.from !== 0) {
            time.from = this.date(time.from)
              .startOf('day')
              .valueOf();
          }
          if (time.to !== 0) {
            time.to = this.date(time.to)
              .endOf('day')
              .valueOf();
          }

          let from = Number.MAX_SAFE_INTEGER,
            to = 0;
          const items = state.get('config.chart.items');
          if (Object.keys(items).length === 0) {
            return time;
          }
          if (time.from === 0 || time.to === 0) {
            for (let itemId in items) {
              const item = items[itemId];
              if (from > item.time.start) {
                from = item.time.start;
              }
              if (to < item.time.end) {
                to = item.time.end;
              }
            }
            if (time.from === 0) {
              time.from = this.date(from)
                .startOf('day')
                .valueOf();
            }
            if (time.to === 0) {
              time.to = this.date(to)
                .endOf('day')
                .valueOf();
            }
          }
          return time;
        }
      };
    }

    // forked from https://github.com/joonhocho/superwild
    function Matcher(pattern, wchar = '*') {
        this.wchar = wchar;
        this.pattern = pattern;
        this.segments = [];
        this.starCount = 0;
        this.minLength = 0;
        this.maxLength = 0;
        this.segStartIndex = 0;
        for (let i = 0, len = pattern.length; i < len; i += 1) {
            const char = pattern[i];
            if (char === wchar) {
                this.starCount += 1;
                if (i > this.segStartIndex) {
                    this.segments.push(pattern.substring(this.segStartIndex, i));
                }
                this.segments.push(char);
                this.segStartIndex = i + 1;
            }
        }
        if (this.segStartIndex < pattern.length) {
            this.segments.push(pattern.substring(this.segStartIndex));
        }
        if (this.starCount) {
            this.minLength = pattern.length - this.starCount;
            this.maxLength = Infinity;
        }
        else {
            this.maxLength = this.minLength = pattern.length;
        }
    }
    Matcher.prototype.match = function match(match) {
        if (this.pattern === this.wchar) {
            return true;
        }
        if (this.segments.length === 0) {
            return this.pattern === match;
        }
        const { length } = match;
        if (length < this.minLength || length > this.maxLength) {
            return false;
        }
        let segLeftIndex = 0;
        let segRightIndex = this.segments.length - 1;
        let rightPos = match.length - 1;
        let rightIsStar = false;
        while (true) {
            const segment = this.segments[segRightIndex];
            segRightIndex -= 1;
            if (segment === this.wchar) {
                rightIsStar = true;
            }
            else {
                const lastIndex = rightPos + 1 - segment.length;
                const index = match.lastIndexOf(segment, lastIndex);
                if (index === -1 || index > lastIndex) {
                    return false;
                }
                if (rightIsStar) {
                    rightPos = index - 1;
                    rightIsStar = false;
                }
                else {
                    if (index !== lastIndex) {
                        return false;
                    }
                    rightPos -= segment.length;
                }
            }
            if (segLeftIndex > segRightIndex) {
                break;
            }
        }
        return true;
    };

    function WildcardObject(obj, delimeter, wildcard) {
        this.obj = obj;
        this.delimeter = delimeter;
        this.wildcard = wildcard;
    }
    WildcardObject.prototype.simpleMatch = function simpleMatch(first, second) {
        if (first === second)
            return true;
        if (first === this.wildcard)
            return true;
        const index = first.indexOf(this.wildcard);
        if (index > -1) {
            const end = first.substr(index + 1);
            if (index === 0 || second.substring(0, index) === first.substring(0, index)) {
                const len = end.length;
                if (len > 0) {
                    return second.substr(-len) === end;
                }
                return true;
            }
        }
        return false;
    };
    WildcardObject.prototype.match = function match(first, second) {
        return (first === second ||
            first === this.wildcard ||
            second === this.wildcard ||
            this.simpleMatch(first, second) ||
            new Matcher(first).match(second));
    };
    WildcardObject.prototype.handleArray = function handleArray(wildcard, currentArr, partIndex, path, result = {}) {
        let nextPartIndex = wildcard.indexOf(this.delimeter, partIndex);
        let end = false;
        if (nextPartIndex === -1) {
            end = true;
            nextPartIndex = wildcard.length;
        }
        const currentWildcardPath = wildcard.substring(partIndex, nextPartIndex);
        let index = 0;
        for (const item of currentArr) {
            const key = index.toString();
            const currentPath = path === '' ? key : path + this.delimeter + index;
            if (currentWildcardPath === this.wildcard ||
                currentWildcardPath === key ||
                this.simpleMatch(currentWildcardPath, key)) {
                end ? (result[currentPath] = item) : this.goFurther(wildcard, item, nextPartIndex + 1, currentPath, result);
            }
            index++;
        }
        return result;
    };
    WildcardObject.prototype.handleObject = function handleObject(wildcard, currentObj, partIndex, path, result = {}) {
        let nextPartIndex = wildcard.indexOf(this.delimeter, partIndex);
        let end = false;
        if (nextPartIndex === -1) {
            end = true;
            nextPartIndex = wildcard.length;
        }
        const currentWildcardPath = wildcard.substring(partIndex, nextPartIndex);
        for (let key in currentObj) {
            key = key.toString();
            const currentPath = path === '' ? key : path + this.delimeter + key;
            if (currentWildcardPath === this.wildcard ||
                currentWildcardPath === key ||
                this.simpleMatch(currentWildcardPath, key)) {
                end
                    ? (result[currentPath] = currentObj[key])
                    : this.goFurther(wildcard, currentObj[key], nextPartIndex + 1, currentPath, result);
            }
        }
        return result;
    };
    WildcardObject.prototype.goFurther = function goFurther(wildcard, currentObj, partIndex, currentPath, result = {}) {
        if (Array.isArray(currentObj)) {
            return this.handleArray(wildcard, currentObj, partIndex, currentPath, result);
        }
        return this.handleObject(wildcard, currentObj, partIndex, currentPath, result);
    };
    WildcardObject.prototype.get = function get(wildcard) {
        return this.goFurther(wildcard, this.obj, 0, '');
    };

    class ObjectPath {
        static get(path, obj, copiedPath = null) {
            if (copiedPath === null) {
                copiedPath = path.slice();
            }
            if (copiedPath.length === 0 || typeof obj === 'undefined') {
                return obj;
            }
            const currentPath = copiedPath.shift();
            if (!obj.hasOwnProperty(currentPath)) {
                return undefined;
            }
            if (copiedPath.length === 0) {
                return obj[currentPath];
            }
            return ObjectPath.get(path, obj[currentPath], copiedPath);
        }
        static set(path, newValue, obj, copiedPath = null) {
            if (copiedPath === null) {
                copiedPath = path.slice();
            }
            if (copiedPath.length === 0) {
                for (const key in obj) {
                    delete obj[key];
                }
                for (const key in newValue) {
                    obj[key] = newValue[key];
                }
                return;
            }
            const currentPath = copiedPath.shift();
            if (copiedPath.length === 0) {
                obj[currentPath] = newValue;
                return;
            }
            if (!obj.hasOwnProperty(currentPath)) {
                obj[currentPath] = {};
            }
            ObjectPath.set(path, newValue, obj[currentPath], copiedPath);
        }
    }

    function log(message, info) {
        console.debug(message, info);
    }
    const defaultOptions = {
        delimeter: `.`,
        notRecursive: `;`,
        param: `:`,
        wildcard: `*`,
        log
    };
    const defaultListenerOptions = {
        bulk: false,
        debug: false,
        source: "",
        data: undefined
    };
    const defaultUpdateOptions = {
        only: [],
        source: "",
        debug: false,
        data: undefined
    };
    function DeepState(data = {}, options = defaultOptions) {
        this.listeners = new Map();
        this.data = data;
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
        this.id = 0;
        this.pathGet = ObjectPath.get;
        this.pathSet = ObjectPath.set;
        this.scan = new WildcardObject(this.data, this.options.delimeter, this.options.wildcard);
    }
    DeepState.prototype.getListeners = function getListeners() {
        return this.listeners;
    };
    DeepState.prototype.destroy = function destroy() {
        this.data = undefined;
        this.listeners = new Map();
    };
    DeepState.prototype.match = function match(first, second) {
        if (first === second)
            return true;
        if (first === this.options.wildcard || second === this.options.wildcard)
            return true;
        return this.scan.match(first, second);
    };
    DeepState.prototype.getIndicesOf = function getIndicesOf(searchStr, str) {
        const searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        let startIndex = 0, index, indices = [];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    };
    DeepState.prototype.getIndicesCount = function getIndicesCount(searchStr, str) {
        const searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return 0;
        }
        let startIndex = 0, index, indices = 0;
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices++;
            startIndex = index + searchStrLen;
        }
        return indices;
    };
    DeepState.prototype.cutPath = function cutPath(longer, shorter) {
        longer = this.cleanNotRecursivePath(longer);
        shorter = this.cleanNotRecursivePath(shorter);
        const shorterPartsLen = this.getIndicesCount(this.options.delimeter, shorter);
        const longerParts = this.getIndicesOf(this.options.delimeter, longer);
        return longer.substr(0, longerParts[shorterPartsLen]);
    };
    DeepState.prototype.trimPath = function trimPath(path) {
        path = this.cleanNotRecursivePath(path);
        if (path.charAt(0) === this.options.delimeter) {
            return path.substr(1);
        }
        return path;
    };
    DeepState.prototype.split = function split(path) {
        return path === "" ? [] : path.split(this.options.delimeter);
    };
    DeepState.prototype.isWildcard = function isWildcard(path) {
        return path.includes(this.options.wildcard);
    };
    DeepState.prototype.isNotRecursive = function isNotRecursive(path) {
        return path.endsWith(this.options.notRecursive);
    };
    DeepState.prototype.cleanNotRecursivePath = function cleanNotRecursivePath(path) {
        return this.isNotRecursive(path) ? path.substring(0, path.length - 1) : path;
    };
    DeepState.prototype.hasParams = function hasParams(path) {
        return path.includes(this.options.param);
    };
    DeepState.prototype.getParamsInfo = function getParamsInfo(path) {
        let paramsInfo = { replaced: "", original: path, params: {} };
        let partIndex = 0;
        let fullReplaced = [];
        for (const part of this.split(path)) {
            paramsInfo.params[partIndex] = {
                original: part,
                replaced: "",
                name: ""
            };
            const reg = new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`, "g");
            let param = reg.exec(part);
            if (param) {
                paramsInfo.params[partIndex].name = param[1];
            }
            else {
                delete paramsInfo.params[partIndex];
                fullReplaced.push(part);
                partIndex++;
                continue;
            }
            reg.lastIndex = 0;
            paramsInfo.params[partIndex].replaced = part.replace(reg, this.options.wildcard);
            fullReplaced.push(paramsInfo.params[partIndex].replaced);
            partIndex++;
        }
        paramsInfo.replaced = fullReplaced.join(this.options.delimeter);
        return paramsInfo;
    };
    DeepState.prototype.getParams = function getParams(paramsInfo, path) {
        if (!paramsInfo) {
            return undefined;
        }
        const split = this.split(path);
        const result = {};
        for (const partIndex in paramsInfo.params) {
            const param = paramsInfo.params[partIndex];
            result[param.name] = split[partIndex];
        }
        return result;
    };
    DeepState.prototype.subscribeAll = function subscribeAll(userPaths, fn, options = defaultListenerOptions) {
        let unsubscribers = [];
        for (const userPath of userPaths) {
            unsubscribers.push(this.subscribe(userPath, fn, options));
        }
        return () => {
            for (const unsubscribe of unsubscribers) {
                unsubscribe();
            }
            unsubscribers = [];
        };
    };
    DeepState.prototype.getCleanListenersCollection = function getCleanListenersCollection(values = {}) {
        return Object.assign({ listeners: new Map(), isRecursive: false, isWildcard: false, hasParams: false, match: undefined, paramsInfo: undefined, path: undefined, count: 0 }, values);
    };
    DeepState.prototype.getCleanListener = function getCleanListener(fn, options = defaultListenerOptions) {
        return {
            fn,
            options: Object.assign(Object.assign({}, defaultListenerOptions), options)
        };
    };
    DeepState.prototype.getListenerCollectionMatch = function getListenerCollectionMatch(listenerPath, isRecursive, isWildcard) {
        listenerPath = this.cleanNotRecursivePath(listenerPath);
        const self = this;
        return function listenerCollectionMatch(path) {
            if (isRecursive)
                path = self.cutPath(path, listenerPath);
            if (isWildcard && self.match(listenerPath, path))
                return true;
            return listenerPath === path;
        };
    };
    DeepState.prototype.getListenersCollection = function getListenersCollection(listenerPath, listener) {
        if (this.listeners.has(listenerPath)) {
            let listenersCollection = this.listeners.get(listenerPath);
            this.id++;
            listenersCollection.listeners.set(this.id, listener);
            return listenersCollection;
        }
        let collCfg = {
            isRecursive: true,
            isWildcard: false,
            hasParams: false,
            paramsInfo: undefined,
            originalPath: listenerPath,
            path: listenerPath
        };
        if (this.hasParams(collCfg.path)) {
            collCfg.paramsInfo = this.getParamsInfo(collCfg.path);
            collCfg.path = collCfg.paramsInfo.replaced;
            collCfg.hasParams = true;
        }
        collCfg.isWildcard = this.isWildcard(collCfg.path);
        if (this.isNotRecursive(collCfg.path)) {
            collCfg.isRecursive = false;
        }
        let listenersCollection = this.getCleanListenersCollection(Object.assign(Object.assign({}, collCfg), { match: this.getListenerCollectionMatch(collCfg.path, collCfg.isRecursive, collCfg.isWildcard) }));
        this.id++;
        listenersCollection.listeners.set(this.id, listener);
        this.listeners.set(collCfg.path, listenersCollection);
        return listenersCollection;
    };
    DeepState.prototype.subscribe = function subscribe(listenerPath, fn, options = defaultListenerOptions, type = "subscribe") {
        let listener = this.getCleanListener(fn, options);
        const listenersCollection = this.getListenersCollection(listenerPath, listener);
        listenersCollection.count++;
        listenerPath = listenersCollection.path;
        if (!listenersCollection.isWildcard) {
            fn(this.pathGet(this.split(this.cleanNotRecursivePath(listenerPath)), this.data), {
                type,
                listener,
                listenersCollection,
                path: {
                    listener: listenerPath,
                    update: undefined,
                    resolved: this.cleanNotRecursivePath(listenerPath)
                },
                params: this.getParams(listenersCollection.paramsInfo, listenerPath),
                options
            });
        }
        else {
            const paths = this.scan.get(this.cleanNotRecursivePath(listenerPath));
            if (options.bulk) {
                const bulkValue = [];
                for (const path in paths) {
                    bulkValue.push({
                        path,
                        params: this.getParams(listenersCollection.paramsInfo, path),
                        value: paths[path]
                    });
                }
                fn(bulkValue, {
                    type,
                    listener,
                    listenersCollection,
                    path: {
                        listener: listenerPath,
                        update: undefined,
                        resolved: undefined
                    },
                    options,
                    params: undefined
                });
            }
            else {
                for (const path in paths) {
                    fn(paths[path], {
                        type,
                        listener,
                        listenersCollection,
                        path: {
                            listener: listenerPath,
                            update: undefined,
                            resolved: this.cleanNotRecursivePath(path)
                        },
                        params: this.getParams(listenersCollection.paramsInfo, path),
                        options
                    });
                }
            }
        }
        this.debugSubscribe(listener, listenersCollection, listenerPath);
        return this.unsubscribe(listenerPath, this.id);
    };
    DeepState.prototype.unsubscribe = function unsubscribe(path, id) {
        const listeners = this.listeners;
        const listenersCollection = listeners.get(path);
        return function unsub() {
            listenersCollection.listeners.delete(id);
            listenersCollection.count--;
            if (listenersCollection.count === 0) {
                listeners.delete(path);
            }
        };
    };
    DeepState.prototype.same = function same(newValue, oldValue) {
        return ((["number", "string", "undefined", "boolean"].includes(typeof newValue) ||
            newValue === null) &&
            oldValue === newValue);
    };
    DeepState.prototype.notifyListeners = function notifyListeners(listeners, exclude = [], returnNotified) {
        const alreadyNotified = [];
        for (const path in listeners) {
            let { single, bulk } = listeners[path];
            for (const singleListener of single) {
                if (exclude.includes(singleListener))
                    continue;
                const time = this.debugTime(singleListener);
                singleListener.listener.fn(singleListener.value(), singleListener.eventInfo);
                if (returnNotified)
                    alreadyNotified.push(singleListener);
                this.debugListener(time, singleListener);
            }
            for (const bulkListener of bulk) {
                if (exclude.includes(bulkListener))
                    continue;
                const time = this.debugTime(bulkListener);
                const bulkValue = [];
                for (const bulk of bulkListener.value) {
                    bulkValue.push(Object.assign(Object.assign({}, bulk), { value: bulk.value() }));
                }
                bulkListener.listener.fn(bulkValue, bulkListener.eventInfo);
                if (returnNotified)
                    alreadyNotified.push(bulkListener);
                this.debugListener(time, bulkListener);
            }
        }
        return alreadyNotified;
    };
    DeepState.prototype.getSubscribedListeners = function getSubscribedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
        options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
        const listeners = {};
        for (let [listenerPath, listenersCollection] of this.listeners) {
            listeners[listenerPath] = { single: [], bulk: [], bulkData: [] };
            if (listenersCollection.match(updatePath)) {
                const params = listenersCollection.paramsInfo
                    ? this.getParams(listenersCollection.paramsInfo, updatePath)
                    : undefined;
                const value = listenersCollection.isRecursive || listenersCollection.isWildcard
                    ? () => this.get(this.cutPath(updatePath, listenerPath))
                    : () => newValue;
                const bulkValue = [{ value, path: updatePath, params }];
                for (const listener of listenersCollection.listeners.values()) {
                    if (listener.options.bulk) {
                        listeners[listenerPath].bulk.push({
                            listener,
                            listenersCollection,
                            eventInfo: {
                                type,
                                listener,
                                path: {
                                    listener: listenerPath,
                                    update: originalPath ? originalPath : updatePath,
                                    resolved: undefined
                                },
                                params,
                                options
                            },
                            value: bulkValue
                        });
                    }
                    else {
                        listeners[listenerPath].single.push({
                            listener,
                            listenersCollection,
                            eventInfo: {
                                type,
                                listener,
                                path: {
                                    listener: listenerPath,
                                    update: originalPath ? originalPath : updatePath,
                                    resolved: this.cleanNotRecursivePath(updatePath)
                                },
                                params,
                                options
                            },
                            value
                        });
                    }
                }
            }
        }
        return listeners;
    };
    DeepState.prototype.notifySubscribedListeners = function notifySubscribedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
        return this.notifyListeners(this.getSubscribedListeners(updatePath, newValue, options, type, originalPath));
    };
    DeepState.prototype.getNestedListeners = function getNestedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
        const listeners = {};
        for (let [listenerPath, listenersCollection] of this.listeners) {
            listeners[listenerPath] = { single: [], bulk: [] };
            const currentCuttedPath = this.cutPath(listenerPath, updatePath);
            if (this.match(currentCuttedPath, updatePath)) {
                const restPath = this.trimPath(listenerPath.substr(currentCuttedPath.length));
                const values = new WildcardObject(newValue, this.options.delimeter, this.options.wildcard).get(restPath);
                const params = listenersCollection.paramsInfo
                    ? this.getParams(listenersCollection.paramsInfo, updatePath)
                    : undefined;
                const bulk = [];
                const bulkListeners = {};
                for (const currentRestPath in values) {
                    const value = () => values[currentRestPath];
                    const fullPath = [updatePath, currentRestPath].join(this.options.delimeter);
                    for (const [listenerId, listener] of listenersCollection.listeners) {
                        const eventInfo = {
                            type,
                            listener,
                            listenersCollection,
                            path: {
                                listener: listenerPath,
                                update: originalPath ? originalPath : updatePath,
                                resolved: this.cleanNotRecursivePath(fullPath)
                            },
                            params,
                            options
                        };
                        if (listener.options.bulk) {
                            bulk.push({ value, path: fullPath, params });
                            bulkListeners[listenerId] = listener;
                        }
                        else {
                            listeners[listenerPath].single.push({
                                listener,
                                listenersCollection,
                                eventInfo,
                                value
                            });
                        }
                    }
                }
                for (const listenerId in bulkListeners) {
                    const listener = bulkListeners[listenerId];
                    const eventInfo = {
                        type,
                        listener,
                        listenersCollection,
                        path: {
                            listener: listenerPath,
                            update: updatePath,
                            resolved: undefined
                        },
                        options,
                        params
                    };
                    listeners[listenerPath].bulk.push({
                        listener,
                        listenersCollection,
                        eventInfo,
                        value: bulk
                    });
                }
            }
        }
        return listeners;
    };
    DeepState.prototype.notifyNestedListeners = function notifyNestedListeners(updatePath, newValue, options, type = "update", alreadyNotified, originalPath = null) {
        return this.notifyListeners(this.getNestedListeners(updatePath, newValue, options, type, originalPath), alreadyNotified, false);
    };
    DeepState.prototype.getNotifyOnlyListeners = function getNotifyOnlyListeners(updatePath, newValue, options, type = "update", originalPath = null) {
        const listeners = {};
        if (typeof options.only !== "object" ||
            !Array.isArray(options.only) ||
            typeof options.only[0] === "undefined" ||
            !this.canBeNested(newValue)) {
            return listeners;
        }
        for (const notifyPath of options.only) {
            const wildcardScan = new WildcardObject(newValue, this.options.delimeter, this.options.wildcard).get(notifyPath);
            listeners[notifyPath] = { bulk: [], single: [] };
            for (const wildcardPath in wildcardScan) {
                const fullPath = updatePath + this.options.delimeter + wildcardPath;
                for (const [listenerPath, listenersCollection] of this.listeners) {
                    const params = listenersCollection.paramsInfo
                        ? this.getParams(listenersCollection.paramsInfo, fullPath)
                        : undefined;
                    if (this.match(listenerPath, fullPath)) {
                        const value = () => wildcardScan[wildcardPath];
                        const bulkValue = [{ value, path: fullPath, params }];
                        for (const listener of listenersCollection.listeners.values()) {
                            const eventInfo = {
                                type,
                                listener,
                                listenersCollection,
                                path: {
                                    listener: listenerPath,
                                    update: originalPath ? originalPath : updatePath,
                                    resolved: this.cleanNotRecursivePath(fullPath)
                                },
                                params,
                                options
                            };
                            if (listener.options.bulk) {
                                if (!listeners[notifyPath].bulk.some(bulkListener => bulkListener.listener === listener)) {
                                    listeners[notifyPath].bulk.push({
                                        listener,
                                        listenersCollection,
                                        eventInfo,
                                        value: bulkValue
                                    });
                                }
                            }
                            else {
                                listeners[notifyPath].single.push({
                                    listener,
                                    listenersCollection,
                                    eventInfo,
                                    value
                                });
                            }
                        }
                    }
                }
            }
        }
        return listeners;
    };
    DeepState.prototype.notifyOnly = function notifyOnly(updatePath, newValue, options, type = "update", originalPath) {
        return (typeof this.notifyListeners(this.getNotifyOnlyListeners(updatePath, newValue, options, type, originalPath))[0] !== "undefined");
    };
    DeepState.prototype.canBeNested = function canBeNested(newValue) {
        return typeof newValue === "object" && newValue !== null;
    };
    DeepState.prototype.getUpdateValues = function getUpdateValues(oldValue, split, fn) {
        if (typeof oldValue === "object" && oldValue !== null) {
            Array.isArray(oldValue)
                ? (oldValue = oldValue.slice())
                : (oldValue = Object.assign({}, oldValue));
        }
        let newValue = fn;
        if (typeof fn === "function") {
            newValue = fn(this.pathGet(split, this.data));
        }
        return { newValue, oldValue };
    };
    DeepState.prototype.wildcardUpdate = function wildcardUpdate(updatePath, fn, options = defaultUpdateOptions) {
        options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
        const scanned = this.scan.get(updatePath);
        const bulk = {};
        for (const path in scanned) {
            const split = this.split(path);
            const { oldValue, newValue } = this.getUpdateValues(scanned[path], split, fn);
            if (!this.same(newValue, oldValue))
                bulk[path] = newValue;
        }
        const groupedListenersPack = [];
        for (const path in bulk) {
            const newValue = bulk[path];
            if (options.only.length) {
                groupedListenersPack.push(this.getNotifyOnlyListeners(path, newValue, options, "update", updatePath));
            }
            else {
                groupedListenersPack.push(this.getSubscribedListeners(path, newValue, options, "update", updatePath));
                this.canBeNested(newValue) &&
                    groupedListenersPack.push(this.getNestedListeners(path, newValue, options, "update", updatePath));
            }
            options.debug && this.options.log("Wildcard update", { path, newValue });
            this.pathSet(this.split(path), newValue, this.data);
        }
        let alreadyNotified = [];
        for (const groupedListeners of groupedListenersPack) {
            alreadyNotified = [
                ...alreadyNotified,
                ...this.notifyListeners(groupedListeners, alreadyNotified)
            ];
        }
    };
    DeepState.prototype.update = function update(updatePath, fn, options = defaultUpdateOptions) {
        if (this.isWildcard(updatePath)) {
            return this.wildcardUpdate(updatePath, fn, options);
        }
        const split = this.split(updatePath);
        const { oldValue, newValue } = this.getUpdateValues(this.pathGet(split, this.data), split, fn);
        if (options.debug) {
            this.options.log(`Updating ${updatePath} ${options.source ? `from ${options.source}` : ""}`, oldValue, newValue);
        }
        if (this.same(newValue, oldValue)) {
            return newValue;
        }
        this.pathSet(split, newValue, this.data);
        options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
        if (options.only === null) {
            return newValue;
        }
        if (options.only.length) {
            this.notifyOnly(updatePath, newValue, options);
            return newValue;
        }
        const alreadyNotified = this.notifySubscribedListeners(updatePath, newValue, options);
        if (this.canBeNested(newValue)) {
            this.notifyNestedListeners(updatePath, newValue, options, "update", alreadyNotified);
        }
        return newValue;
    };
    DeepState.prototype.get = function get(userPath = undefined) {
        if (typeof userPath === "undefined" || userPath === "") {
            return this.data;
        }
        return this.pathGet(this.split(userPath), this.data);
    };
    DeepState.prototype.debugSubscribe = function debugSubscribe(listener, listenersCollection, listenerPath) {
        if (listener.options.debug) {
            this.options.log("listener subscribed", listenerPath, listener, listenersCollection);
        }
    };
    DeepState.prototype.debugListener = function debugListener(time, groupedListener) {
        if (groupedListener.eventInfo.options.debug ||
            groupedListener.listener.options.debug) {
            this.options.log("Listener fired", {
                time: Date.now() - time,
                info: groupedListener
            });
        }
    };
    DeepState.prototype.debugTime = function debugTime(groupedListener) {
        return groupedListener.listener.options.debug ||
            groupedListener.eventInfo.options.debug
            ? Date.now()
            : 0;
    };

    /**
     * Api functions
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0
     */
    const lib = 'gantt-schedule-timeline-calendar';

    /**
     * Helper function to determine if specified variable is an object
     *
     * @param {any} item
     *
     * @returns {boolean}
     */
    function isObject$1(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Helper function which will merge objects recursively - creating brand new one - like clone
     *
     * @param {object} target
     * @params {object} sources
     *
     * @returns {object}
     */
    function mergeDeep$1(target, ...sources) {
      const source = sources.shift();
      if (isObject$1(target) && isObject$1(source)) {
        for (const key in source) {
          if (isObject$1(source[key])) {
            if (typeof target[key] === 'undefined') {
              target[key] = {};
            }
            target[key] = mergeDeep$1(target[key], source[key]);
          } else if (Array.isArray(source[key])) {
            target[key] = [];
            for (let item of source[key]) {
              if (isObject$1(item)) {
                target[key].push(mergeDeep$1({}, item));
                continue;
              }
              target[key].push(item);
            }
          } else {
            target[key] = source[key];
          }
        }
      }
      if (!sources.length) {
        return target;
      }
      return mergeDeep$1(target, ...sources);
    }

    function mergeActions(userConfig, defaultConfig) {
      const defaultConfigActions = mergeDeep$1({}, defaultConfig.actions);
      const userActions = mergeDeep$1({}, userConfig.actions);
      let allActionNames = [...Object.keys(defaultConfigActions), ...Object.keys(userActions)];
      allActionNames = allActionNames.filter(i => allActionNames.includes(i));
      const actions = {};
      for (const actionName of allActionNames) {
        actions[actionName] = [];
        if (typeof defaultConfigActions[actionName] !== 'undefined' && Array.isArray(defaultConfigActions[actionName])) {
          actions[actionName] = [...defaultConfigActions[actionName]];
        }
        if (typeof userActions[actionName] !== 'undefined' && Array.isArray(userActions[actionName])) {
          actions[actionName] = [...actions[actionName], ...userActions[actionName]];
        }
      }
      delete userConfig.actions;
      delete defaultConfig.actions;
      return actions;
    }

    function stateFromConfig(userConfig) {
      const defaultConfig$1 = defaultConfig();
      const actions = mergeActions(userConfig, defaultConfig$1);
      const state = { config: mergeDeep$1({}, defaultConfig$1, userConfig) };
      state.config.actions = actions;
      // @ts-ignore
      return new DeepState(state, { delimeter: '.' });
    }

    const publicApi = {
      name: lib,
      stateFromConfig,
      mergeDeep: mergeDeep$1,
      Hammer: hammer,
      date(time) {
        return time ? dayjs_min(time) : dayjs_min();
      },
      dayjs: dayjs_min
    };

    function getInternalApi(state) {
      let $state = state.get();
      let unsubscribers = [];
      const api = {
        name: lib,
        debug: false,

        log(...args) {
          if (this.debug) {
            console.log.call(console, ...args);
          }
        },

        Hammer: hammer,

        mergeDeep: mergeDeep$1,

        getClass(name) {
          let simple = `${lib}__${name}`;
          if (name === this.name) {
            simple = this.name;
          }
          return simple;
        },

        allActions: [],

        getActions(name) {
          if (!this.allActions.includes(name)) this.allActions.push(name);
          let actions = state.get('config.actions.' + name);
          if (typeof actions === 'undefined') {
            actions = [];
          }
          return actions;
        },

        isItemInViewport(item, left, right) {
          return (item.time.start >= left && item.time.start < right) || (item.time.end >= left && item.time.end < right);
        },

        fillEmptyRowValues(rows) {
          let top = 0;
          for (const rowId in rows) {
            const row = rows[rowId];
            row._internal = {
              parents: [],
              children: [],
              items: []
            };
            if (typeof row.height !== 'number') {
              row.height = $state.config.list.rowHeight;
            }
            if (typeof row.expanded !== 'boolean') {
              row.expanded = false;
            }
            row.top = top;
            top += row.height;
          }
          return rows;
        },

        generateParents(rows, parentName = 'parentId') {
          const parents = {};
          for (const row of rows) {
            const parentId = typeof row[parentName] !== 'undefined' ? row[parentName] : '';
            if (typeof parents[parentId] === 'undefined') {
              parents[parentId] = {};
            }
            parents[parentId][row.id] = row;
          }
          return parents;
        },

        fastTree(rowParents, node, parents = []) {
          const children = rowParents[node.id];
          node._internal.parents = parents;
          if (typeof children === 'undefined') {
            node._internal.children = [];
            return node;
          }
          if (node.id !== '') {
            parents = [...parents, node.id];
          }
          node._internal.children = Object.values(children);
          for (const childrenId in children) {
            const child = children[childrenId];
            this.fastTree(rowParents, child, parents);
          }
          return node;
        },

        makeTreeMap(rows, items) {
          const itemParents = this.generateParents(items, 'rowId');
          for (const row of rows) {
            row._internal.items = typeof itemParents[row.id] !== 'undefined' ? Object.values(itemParents[row.id]) : [];
          }
          const rowParents = this.generateParents(rows);
          const tree = { id: '', _internal: { children: [], parents: [], items: [] } };
          return this.fastTree(rowParents, tree);
        },

        getFlatTreeMapById(treeMap, flatTreeMapById = {}) {
          for (const child of treeMap._internal.children) {
            flatTreeMapById[child.id] = child;
            this.getFlatTreeMapById(child, flatTreeMapById);
          }
          return flatTreeMapById;
        },

        flattenTreeMap(treeMap, rows = []) {
          for (const child of treeMap._internal.children) {
            rows.push(child.id);
            this.flattenTreeMap(child, rows);
          }
          return rows;
        },

        getRowsFromMap(flatTreeMap, rows) {
          return flatTreeMap.map(node => rows[node.id]);
        },

        getRowsFromIds(ids, rows) {
          const result = [];
          for (const id of ids) {
            result.push(rows[id]);
          }
          return result;
        },

        getRowsWithParentsExpanded(flatTreeMap, flatTreeMapById, rows) {
          const rowsWithParentsExpanded = [];
          next: for (const rowId of flatTreeMap) {
            for (const parentId of flatTreeMapById[rowId]._internal.parents) {
              const parent = rows[parentId];
              if (!parent.expanded) {
                continue next;
              }
            }
            rowsWithParentsExpanded.push(rowId);
          }
          return rowsWithParentsExpanded;
        },

        getRowsHeight(rows) {
          let height = 0;
          for (let row of rows) {
            height += row.height;
          }
          return height;
        },

        /**
         * Get visible rows - get rows that are inside current viewport (height)
         *
         * @param {array} rowsWithParentsExpanded rows that have parent expanded- they are visible
         */
        getVisibleRowsAndCompensation(rowsWithParentsExpanded) {
          const visibleRows = [];
          let currentRowsOffset = 0;
          let rowOffset = 0;
          const scrollTop = state.get('config.scroll.top');
          const height = state.get('_internal.height');
          let chartViewBottom = 0;
          let compensation = 0;
          for (const row of rowsWithParentsExpanded) {
            chartViewBottom = scrollTop + height;
            if (currentRowsOffset + row.height >= scrollTop && currentRowsOffset <= chartViewBottom) {
              row.top = rowOffset;
              compensation = row.top + scrollTop - currentRowsOffset;
              rowOffset += row.height;
              visibleRows.push(row);
            }
            currentRowsOffset += row.height;
            if (currentRowsOffset >= chartViewBottom) {
              break;
            }
          }
          return { visibleRows, compensation };
        },

        /**
         * Normalize mouse wheel event to get proper scroll metrics
         *
         * @param {Event} event mouse wheel event
         */
        normalizeMouseWheelEvent(event) {
          // @ts-ignore
          let x = event.deltaX || 0;
          // @ts-ignore
          let y = event.deltaY || 0;
          // @ts-ignore
          let z = event.deltaZ || 0;
          // @ts-ignore
          const mode = event.deltaMode;
          // @ts-ignore
          const lineHeight = parseInt(getComputedStyle(event.target).getPropertyValue('line-height'));
          let scale = 1;
          switch (mode) {
            case 1:
              scale = lineHeight;
              break;
            case 2:
              // @ts-ignore
              scale = window.height;
              break;
          }
          x *= scale;
          y *= scale;
          z *= scale;
          return { x, y, z, event };
        },

        limitScroll(which, scroll) {
          if (which === 'top') {
            const height = state.get('_internal.list.rowsHeight') - state.get('_internal.height');
            if (scroll < 0) {
              scroll = 0;
            } else if (scroll > height) {
              scroll = height;
            }
            return scroll;
          } else {
            const width =
              state.get('_internal.chart.time.totalViewDurationPx') - state.get('_internal.chart.dimensions.width');
            if (scroll < 0) {
              scroll = 0;
            } else if (scroll > width) {
              scroll = width;
            }
            return scroll;
          }
        },

        time: timeApi(state),

        /**
         * Get scrollbar height - compute it from element
         *
         * @returns {number}
         */
        getScrollBarHeight() {
          const outer = document.createElement('div');
          outer.style.visibility = 'hidden';
          outer.style.height = '100px';
          outer.style.msOverflowStyle = 'scrollbar';
          document.body.appendChild(outer);
          var noScroll = outer.offsetHeight;
          outer.style.overflow = 'scroll';
          var inner = document.createElement('div');
          inner.style.height = '100%';
          outer.appendChild(inner);
          var withScroll = inner.offsetHeight;
          outer.parentNode.removeChild(outer);
          return noScroll - withScroll + 1; // +1 for scroll area inside scroll container
        },

        /**
         * Get grid blocks that are under specified rectangle
         *
         * @param {number} x beginging at chart-timeline bounding rect
         * @param {number} y beginging at chart-timeline bounding rect
         * @param {number} width
         * @param {number} height
         * @returns {array} array of {element, data}
         */
        getGridBlocksUnderRect(x, y, width, height) {
          const main = state.get('_internal.elements.main');
          if (!main) return [];
        },

        /**
         * Destroy things to release memory
         */
        destroy() {
          $state = undefined;
          for (const unsubscribe of unsubscribers) {
            unsubscribe();
          }
          unsubscribers = [];
          if (api.debug) {
            // @ts-ignore
            delete window.state;
          }
        }
      };

      if (api.debug) {
        // @ts-ignore
        window.state = state;
        // @ts-ignore
        window.api = api;
      }

      return api;
    }

    /**
     * Gantt-Schedule-Timeline-Calendar
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   GPL-3.0
     */
    function GSTC(options) {
        const state = options.state;
        const api = getInternalApi(state);
        const _internal = {
            components: {
                Main
            },
            scrollBarHeight: 17,
            height: 0,
            treeMap: {},
            flatTreeMap: [],
            flatTreeMapById: {},
            list: {
                expandedHeight: 0,
                visibleRows: [],
                rows: {},
                width: 0
            },
            dimensions: {
                width: 0,
                height: 0
            },
            chart: {
                dimensions: {
                    width: 0,
                    innerWidth: 0
                },
                visibleItems: [],
                time: {
                    dates: {},
                    timePerPixel: 0,
                    firstTaskTime: 0,
                    lastTaskTime: 0,
                    totalViewDurationMs: 0,
                    totalViewDurationPx: 0,
                    leftGlobal: 0,
                    rightGlobal: 0,
                    leftPx: 0,
                    rightPx: 0,
                    leftInner: 0,
                    rightInner: 0,
                    maxWidth: {}
                }
            },
            elements: {}
        };
        if (typeof options.debug === 'boolean' && options.debug) {
            // @ts-ignore
            window.state = state;
        }
        state.update('', oldValue => {
            return {
                config: oldValue.config,
                _internal
            };
        });
        // @ts-ignore
        const vido = Vido(state, api);
        const app = vido.createApp({ component: Main, props: vido, element: options.element });
        return { state, app };
    }
    GSTC.api = publicApi;

    return GSTC;

})));
//# sourceMappingURL=index.umd.js.map
