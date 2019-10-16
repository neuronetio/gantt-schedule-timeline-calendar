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
const directives = new WeakMap();
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
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
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
 * An updateable Template that tracks the location of dynamic parts.
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
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
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
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
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
        // But Safari dooes not implement CustomElementRegistry#upgrade, so we
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
const commentMarker = ` ${marker} `;
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
            // attribute, text, or comment poisition.
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
            // Check to see if we have an attribute-like sequence preceeding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceeding sequence. For comments, this guards against unusual
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
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
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
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
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
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
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
            this.element.setAttribute(this.name, this._getValue());
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
            directive(this);
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
            directive(this);
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
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
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
            directive(this);
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
            // tslint:disable-next-line:no-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
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
            directive(this);
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
const classMapCache = new WeakMap();
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
    // handle static classes
    if (!classMapCache.has(part)) {
        element.className = committer.strings.join(' ');
    }
    const { classList } = element;
    // remove old classes that no longer apply
    const oldInfo = classMapCache.get(part);
    for (const name in oldInfo) {
        if (!(name in classInfo)) {
            classList.remove(name);
        }
    }
    // add new classes
    for (const name in classInfo) {
        const value = classInfo[name];
        if (!oldInfo || value !== oldInfo[name]) {
            // We explicitly want a loose truthy check here because
            // it seems more convenient that '' and 0 are skipped.
            const method = value ? 'add' : 'remove';
            classList[method](name);
        }
    }
    classMapCache.set(part, classInfo);
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
 * amd removals.
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
 * Stores the StyleInfo object applied to a given AttributePart.
 * Used to unset existing values when a new StyleInfo object is applied.
 */
const styleMapCache = new WeakMap();
/**
 * A directive that applies CSS properties to an element.
 *
 * `styleMap` can only be used in the `style` attribute and must be the only
 * expression in the attribute. It takes the property names in the `styleInfo`
 * object and adds the property values as CSS propertes. Property names with
 * dashes (`-`) are assumed to be valid CSS property names and set on the
 * element's style object using `setProperty()`. Names without dashes are
 * assumed to be camelCased JavaScript property names and set on the element's
 * style object using property assignment, allowing the style object to
 * translate JavaScript-style names to CSS property names.
 *
 * For example `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size':
 * '0'})` sets the `background-color`, `border-top` and `--size` properties.
 *
 * @param styleInfo {StyleInfo}
 */
const styleMap = directive((styleInfo) => (part) => {
    if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
        part.committer.name !== 'style' || part.committer.parts.length > 1) {
        throw new Error('The `styleMap` directive must be used in the style attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { style } = committer.element;
    // Handle static styles the first time we see a Part
    if (!styleMapCache.has(part)) {
        style.cssText = committer.strings.join(' ');
    }
    // Remove old properties that no longer exist in styleInfo
    const oldInfo = styleMapCache.get(part);
    for (const name in oldInfo) {
        if (!(name in styleInfo)) {
            if (name.indexOf('-') === -1) {
                // tslint:disable-next-line:no-any
                style[name] = null;
            }
            else {
                style.removeProperty(name);
            }
        }
    }
    // Add or update properties
    for (const name in styleInfo) {
        if (name.indexOf('-') === -1) {
            // tslint:disable-next-line:no-any
            style[name] = styleInfo[name];
        }
        else {
            style.setProperty(name, styleInfo[name]);
        }
    }
    styleMapCache.set(part, styleInfo);
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
    const template = document.createElement('template');
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
            // synchronous value, we can stop processsing now.
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

function Vido(state, api) {
    let componentId = 0;
    const components = {};
    let actions = [];
    let app, element;
    let shouldUpdateCount = 0;
    const resolved = Promise.resolve();
    function getActions(instance) {
        return directive(function actionsDirective(createFunctions, props) {
            return function partial(part) {
                const element = part.committer.element;
                for (const create of createFunctions) {
                    if (typeof create === 'function') {
                        const exists = actions.find(action => action.instance === instance && action.componentAction.create === create && action.element === element);
                        if (!exists) {
                            if (typeof element.__vido__ !== 'undefined')
                                delete element.__vido__;
                            const componentAction = { create, update() { }, destroy() { } };
                            actions.push({ instance, componentAction, element, props });
                        }
                        else {
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
        actions(componentActions, props) { },
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
            const vidoInstance = Object.assign(Object.assign({}, vido), { update, onDestroy, instance, actions: getActions(instance) });
            let firstMethods, methods;
            if (props) {
                firstMethods = component(props, vidoInstance);
            }
            else {
                firstMethods = component(vidoInstance);
            }
            if (typeof firstMethods === 'function') {
                const destroy = () => {
                    destroyable.forEach(d => d());
                };
                methods = { update: firstMethods, destroy };
            }
            else {
                const originalDestroy = methods.destroy;
                const destroy = () => {
                    destroyable.forEach(d => d());
                    originalDestroy();
                };
                methods = Object.assign(Object.assign({}, firstMethods), { destroy });
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
                        if (typeof result !== 'undefined') {
                            if (typeof result.update === 'function') {
                                action.componentAction.update = result.update;
                            }
                            if (typeof result.destroy === 'function') {
                                action.componentAction.destroy = result.destroy;
                            }
                        }
                    }
                }
                else {
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
//# sourceMappingURL=vido.esm.js.map

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
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function Main(vido) {
    const { api, state, onDestroy, actions, update, createComponent, html } = vido;
    const componentName = api.name;
    const ListComponent = state.get('config.components.List');
    const ChartComponent = state.get('config.components.Chart');
    const List = createComponent(ListComponent);
    onDestroy(List.destroy);
    const Chart = createComponent(ChartComponent);
    onDestroy(Chart.destroy);
    onDestroy(state.subscribe('config.plugins', plugins => {
        if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
            for (const plugin of plugins) {
                plugin(state, api);
            }
        }
    }));
    const componentActions = api.getActions('');
    let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
    let verticalScrollBarElement;
    let rowsHeight = 0;
    let resizerActive = false;
    onDestroy(state.subscribe('config.classNames', classNames => {
        const config = state.get('config');
        className = api.getClass(componentName, { config });
        if (resizerActive) {
            className += ` ${componentName}__list-column-header-resizer--active`;
        }
        classNameVerticalScroll = api.getClass('vertical-scroll', { config });
        update();
    }));
    onDestroy(state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], () => {
        const config = state.get('config');
        const scrollBarHeight = state.get('_internal.scrollBarHeight');
        const height = config.height - config.headerHeight - scrollBarHeight;
        state.update('_internal.height', height);
        style = `--height: ${config.height}px`;
        styleVerticalScroll = `height: ${height}px; width: ${scrollBarHeight}px; margin-top: ${config.headerHeight}px;`;
        update();
    }));
    onDestroy(state.subscribe('_internal.list.columns.resizer.active', active => {
        resizerActive = active;
        className = api.getClass(api.name);
        if (resizerActive) {
            className += ` ${api.name}__list-column-header-resizer--active`;
        }
        update();
    }));
    onDestroy(state.subscribeAll(['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'], (bulk, eventInfo) => {
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
    }, { bulk: true }));
    onDestroy(state.subscribeAll(['config.list.rows.*.expanded', '_internal.treeMap;'], bulk => {
        const configRows = state.get('config.list.rows');
        const rowsWithParentsExpanded = api.getRowsFromIds(api.getRowsWithParentsExpanded(state.get('_internal.flatTreeMap'), state.get('_internal.flatTreeMapById'), configRows), configRows);
        rowsHeight = api.getRowsHeight(rowsWithParentsExpanded);
        state.update('_internal.list.rowsHeight', rowsHeight);
        state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
        update();
    }, { bulk: true }));
    onDestroy(state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
        const visibleRows = api.getVisibleRows(state.get('_internal.list.rowsWithParentsExpanded'));
        state.update('_internal.list.visibleRows', visibleRows);
        update();
    }));
    onDestroy(state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
        const top = state.get('config.scroll.top');
        styleVerticalScrollArea = `height: ${rowsHeight}px; width: 1px`;
        if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
            verticalScrollBarElement.scrollTop = top;
        }
        update();
    }));
    function generateAndAddDates(internalTime, chartWidth) {
        const dates = [];
        let leftGlobal = internalTime.leftGlobal;
        const rightGlobal = internalTime.rightGlobal;
        const timePerPixel = internalTime.timePerPixel;
        const period = internalTime.period;
        let sub = leftGlobal - api.time.date(leftGlobal).startOf(period);
        let subPx = sub / timePerPixel;
        let leftPx = 0;
        let maxWidth = 0;
        let id = 0;
        while (leftGlobal < rightGlobal) {
            const date = {
                id: id++,
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
            if (date.width > chartWidth) {
                date.width = chartWidth;
            }
            maxWidth = date.width > maxWidth ? date.width : maxWidth;
            date.leftPx = leftPx;
            leftPx += date.width;
            date.rightPx = leftPx;
            dates.push(date);
            leftGlobal = date.rightGlobal + 1;
            sub = 0;
            subPx = 0;
        }
        internalTime.maxWidth = maxWidth;
        internalTime.dates = dates;
    }
    onDestroy(state.subscribeAll([
        'config.chart.time',
        '_internal.dimensions.width',
        'config.scroll.left',
        '_internal.scrollBarHeight',
        '_internal.list.width'
    ], function recalculateTimesAction() {
        const chartWidth = state.get('_internal.dimensions.width') - state.get('_internal.list.width');
        const chartInnerWidth = chartWidth - state.get('_internal.scrollBarHeight');
        const chartHeight = state.get('_internal.dimensions.height') - state.get('config.headerHeight');
        state.update('_internal.chart.dimensions', {
            width: chartWidth,
            innerWidth: chartInnerWidth,
            height: chartHeight
        });
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
        generateAndAddDates(time, chartWidth);
        state.update(`_internal.chart.time`, time);
        update();
    }));
    state.update('_internal.scrollBarHeight', api.getScrollBarHeight());
    const onScroll = {
        handleEvent(event) {
            event.stopPropagation();
            event.preventDefault();
            state.update('config.scroll', scroll => {
                scroll.top = event.target.scrollTop;
                const scrollInner = state.get('_internal.elements.verticalScrollInner');
                if (scrollInner) {
                    const scrollHeight = scrollInner.clientHeight;
                    scroll.percent.top = scroll.top / scrollHeight;
                }
                return scroll;
            }, { only: ['top', 'percent.top'] });
        },
        passive: false
    };
    const dimensions = { width: 0, height: 0 };
    componentActions.push(element => {
        const ro = new index((entries, observer) => {
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
    });
    function bindScrollElement(element) {
        verticalScrollBarElement = element;
        state.update('_internal.elements.verticalScroll', element);
    }
    function bindScrollInnerElement(element) {
        state.update('_internal.elements.verticalScrollInner', element);
    }
    return props => html `
      <div class=${className} style=${style} @scroll=${onScroll} data-actions=${actions(componentActions)}>
        ${List.html()}${Chart.html()}
        <div
          class=${classNameVerticalScroll}
          style=${styleVerticalScroll}
          @scroll=${onScroll}
          data-action=${actions([bindScrollElement])}
        >
          <div style=${styleVerticalScrollArea} data-actions=${actions([bindScrollInnerElement])} />
        </div>
      </div>
    `;
}
//# sourceMappingURL=Main.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListToggle(props, vido) {
    const { api, state, onDestroy, actions, update, html, unsafeHTML } = vido;
    const componentName = 'list-expander-toggle';
    const componentActions = api.getActions(componentName);
    let className, style;
    let classNameOpen, classNameClosed;
    let expanded = false;
    let iconOpen, iconClosed;
    onDestroy(state.subscribe('config.classNames', value => {
        if (props.row) {
            className = api.getClass(componentName, { row: props.row });
            classNameOpen = api.getClass(componentName + '-open', { row: props.row });
            classNameClosed = api.getClass(componentName + '-closed', { row: props.row });
        }
        else {
            className = api.getClass(componentName);
            classNameOpen = api.getClass(componentName + '-open');
            classNameClosed = api.getClass(componentName + '-closed');
        }
        update();
    }));
    onDestroy(state.subscribeAll(['config.list.expander.size', 'config.list.expander.icons'], () => {
        const expander = state.get('config.list.expander');
        style = `--size: ${expander.size}px`;
        iconOpen = expander.icons.open;
        iconClosed = expander.icons.closed;
        update();
    }));
    if (props.row) {
        onDestroy(state.subscribe(`config.list.rows.${props.row.id}.expanded`, isExpanded => {
            expanded = isExpanded;
            update();
        }));
    }
    else {
        onDestroy(state.subscribe('config.list.rows.*.expanded', bulk => {
            for (const rowExpanded of bulk) {
                if (rowExpanded.value) {
                    expanded = true;
                    break;
                }
            }
            update();
        }, { bulk: true }));
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
    return () => html `
    <div
      class=${className}
      data-actions=${actions(componentActions, { row: props.row, api, state })}
      style=${style}
      @click=${toggle}
    >
      ${expanded
        ? html `
            <div class=${classNameOpen}>
              ${unsafeHTML(iconOpen)}
            </div>
          `
        : html `
            <div class=${classNameClosed}>
              ${unsafeHTML(iconClosed)}
            </div>
          `}
    </div>
  `;
}
//# sourceMappingURL=ListToggle.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListExpander(props, vido) {
    const { api, state, onDestroy, actions, update, html, createComponent } = vido;
    const componentName = 'list-expander';
    const componentActions = api.getActions(componentName);
    let className, padding, width, paddingClass, children = [];
    onDestroy(state.subscribe('config.classNames', value => {
        if (props.row) {
            className = api.getClass(componentName, { row: props.row });
            paddingClass = api.getClass(componentName + '-padding', { row: props.row });
        }
        else {
            className = api.getClass(componentName);
            paddingClass = api.getClass(componentName + '-padding');
        }
        update();
    }));
    onDestroy(state.subscribeAll(['config.list.expander.padding'], value => {
        padding = value;
        update();
    }));
    if (props.row) {
        onDestroy(state.subscribe(`_internal.list.rows.${props.row.id}.parentId`, parentId => {
            width = 'width:' + props.row._internal.parents.length * padding + 'px';
            children = props.row._internal.children;
            update();
        }));
    }
    else {
        width = 'width:0px';
        children = [];
    }
    // @ts-ignore
    const listToggle = createComponent(ListToggle, props.row ? { row: props.row } : {});
    onDestroy(listToggle.destroy);
    return () => html `
    <div class=${className} data-action=${actions(componentActions, { row: props.row, api, state })}>
      <div class=${paddingClass} style=${width}></div>
      ${children.length || !props.row ? listToggle.html() : ''}
    </div>
  `;
}
//# sourceMappingURL=ListExpander.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListColumnRow({ rowId, columnId }, vido) {
    const { api, state, onDestroy, actions, update, html, createComponent } = vido;
    let row, rowPath = `config.list.rows.${rowId}`;
    let style;
    onDestroy(state.subscribe(rowPath, value => {
        row = value;
        style = `--height: ${row.height}px`;
        update();
    }));
    let column, columnPath = `config.list.columns.data.${columnId}`;
    onDestroy(state.subscribe(columnPath, val => {
        column = val;
        update();
    }));
    const componentName = 'list-column-row';
    const componentActions = api.getActions(componentName);
    let className;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName, { row, column });
        update();
    }));
    function getHtml() {
        if (typeof column.data === 'function')
            return html `
        ${column.data(row)}
      `;
        return html `
      ${row[column.data]}
    `;
    }
    function getText() {
        if (typeof column.data === 'function')
            return column.data(row);
        return row[column.data];
    }
    const listExpander = createComponent(ListExpander, { row });
    onDestroy(listExpander.destroy);
    return props => html `
    <div
      class=${className}
      style=${style}
      data-actions=${actions(componentActions, {
        column,
        row,
        api,
        state
    })}
    >
      ${typeof column.expander === 'boolean' && column.expander ? listExpander.html() : ''}
      ${typeof column.html === 'string' ? getHtml() : getText()}
    </div>
  `;
}
//# sourceMappingURL=ListColumnRow.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListColumnHeaderResizer({ columnId }, vido) {
    const { api, state, onDestroy, update, html, actions } = vido;
    const componentName = 'list-column-header-resizer';
    const componentActions = api.getActions(componentName);
    let column;
    onDestroy(state.subscribe(`config.list.columns.data.${columnId}`, val => {
        column = val;
        update();
    }));
    let className, containerClass, dotsClass, dotClass, lineClass, calculatedWidth, dotsWidth;
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
        dotsWidth = `width: ${list.columns.resizer.width}px`;
        inRealTime = list.columns.resizer.inRealTime;
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
    const columnWidthPath = `config.list.columns.data.${column.id}.width`;
    function onMouseDown(event) {
        isMoving = true;
        state.update('_internal.list.columns.resizer.active', true);
    }
    function onMouseMove(event) {
        if (isMoving) {
            left += event.movementX;
            if (left < 0) {
                left = 0;
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
    return props => html `
    <div class=${className} data-actions=${actions(componentActions, { column, api, state })}>
      <div class=${containerClass}>
        ${column.header.html
        ? html `
              ${column.header.html}
            `
        : column.header.content}
      </div>
      <div class=${dotsClass} style=${'--' + dotsWidth} @mousedown=${onMouseDown}>
        ${dots.map(dot => html `
              <div class=${dotClass} />
            `)}
      </div>
    </div>
  `;
}
//# sourceMappingURL=ListColumnHeaderResizer.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListColumnHeader({ columnId }, vido) {
    const { api, state, onDestroy, actions, update, createComponent, html } = vido;
    const componentName = 'list-column-header';
    const componentActions = api.getActions(componentName);
    let column;
    onDestroy(state.subscribe(`config.list.columns.data.${columnId}`, val => {
        column = val;
        update();
    }));
    let className, contentClass, style;
    onDestroy(state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
        const value = state.get('config');
        className = api.getClass(componentName, { column });
        contentClass = api.getClass(componentName + '-content', { column });
        style = `--height: ${value.headerHeight}px;`;
        update();
    }));
    const ListColumnHeaderResizer$1 = createComponent(ListColumnHeaderResizer, { columnId });
    onDestroy(ListColumnHeaderResizer$1.destroy);
    // @ts-ignore
    const listExpander = createComponent(ListExpander, {});
    onDestroy(listExpander.destroy);
    function withExpander() {
        return html `
      <div class=${contentClass}>
        ${listExpander.html()}${ListColumnHeaderResizer$1.html(column)}
      </div>
    `;
    }
    function withoutExpander() {
        return html `
      <div class=${contentClass}>
        ${ListColumnHeaderResizer$1.html(column)}
      </div>
    `;
    }
    return function () {
        return html `
      <div class=${className} style=${style} data-actions=${actions(componentActions, { column, api, state })}>
        ${typeof column.expander === 'boolean' && column.expander ? withExpander() : withoutExpander()}
      </div>
    `;
    };
}
//# sourceMappingURL=ListColumnHeader.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function ListColumnComponent({ columnId }, vido) {
    const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;
    let column, columnPath = `config.list.columns.data.${columnId}`;
    onDestroy(state.subscribe(columnPath, val => {
        column = val;
        update();
    }));
    const componentName = 'list-column';
    const rowsComponentName = componentName + '-rows';
    const componentActions = api.getActions(componentName);
    const rowsActions = api.getActions(rowsComponentName);
    let className, classNameContainer, calculatedWidth, width, styleContainer;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName, { column });
        classNameContainer = api.getClass(rowsComponentName, { column });
        update();
    }));
    let visibleRows = [];
    onDestroy(state.subscribe('_internal.list.visibleRows;', val => {
        visibleRows.forEach(row => row.component.destroy());
        visibleRows = val.map(row => ({
            id: row.id,
            component: createComponent(ListColumnRow, { columnId, rowId: row.id })
        }));
        update();
    }));
    onDestroy(() => {
        visibleRows.forEach(row => row.component.destroy());
    });
    onDestroy(state.subscribeAll([
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        'config.height',
        'config.headerHeight'
    ], bulk => {
        const list = state.get('config.list');
        calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
        width = `width: ${calculatedWidth + list.columns.resizer.width}px`;
        styleContainer = `height: ${state.get('config.height')}px`;
    }, { bulk: true }));
    const ListColumnHeader$1 = createComponent(ListColumnHeader, { columnId });
    onDestroy(ListColumnHeader$1.destroy);
    return props => html `
    <div
      class=${className}
      data-actions=${actions(componentActions, { column, state: state, api: api })}
      style=${width}
    >
      ${ListColumnHeader$1.html()}
      <div class=${classNameContainer} style=${styleContainer} data-actions=${actions(rowsActions, { api, state })}>
        ${visibleRows.map(row => row.component.html())}
      </div>
    </div>
  `;
}
//# sourceMappingURL=ListColumn.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function List(vido) {
    const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;
    const componentName = 'list';
    const componentActions = api.getActions(componentName);
    let className;
    let list, percent;
    onDestroy(state.subscribe('config.list', () => {
        list = state.get('config.list');
        percent = list.columns.percent;
        update();
    }));
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, { list });
        update();
    }));
    let columns, listColumns = [];
    onDestroy(state.subscribe('config.list.columns.data;', data => {
        // only 'config.list.columns.data;' because listcolumn component will watch nested values
        listColumns.forEach(ls => ls.component.destroy());
        columns = Object.keys(data);
        listColumns = columns.map(columnId => {
            const component = createComponent(ListColumnComponent, {
                columnId
            });
            return { id: columnId, component };
        });
        update();
    }));
    onDestroy(() => {
        listColumns.forEach(c => c.component.destroy());
    });
    let style;
    onDestroy(state.subscribe('config.height', height => {
        style = `height: ${height}px`;
        update();
    }));
    function onScroll(event) {
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
    componentActions.push(element => {
        state.update('_internal.elements.list', element);
        getWidth(element);
        return {
            update: getWidth
        };
    });
    return props => list.columns.percent > 0
        ? html `
          <div
            class=${className}
            data-actions=${actions(componentActions)}
            style=${style}
            @scroll=${onScroll}
            @wheel=${onScroll}
          >
            ${listColumns.map(c => c.component.html())}
          </div>
        `
        : null;
}
//# sourceMappingURL=List.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function Chart(vido) {
    const { api, state, onDestroy, actions, update, html, createComponent } = vido;
    const componentName = 'chart';
    const ChartCalendarComponent = state.get('config.components.ChartCalendar');
    const ChartTimelineComponent = state.get('config.components.ChartTimeline');
    const Calendar = createComponent(ChartCalendarComponent);
    onDestroy(Calendar.destroy);
    const Timeline = createComponent(ChartTimelineComponent);
    onDestroy(Timeline.destroy);
    let className, classNameScroll, classNameScrollInner, scrollElement, styleScroll = '', styleScrollInner = '', componentActions = api.getActions(componentName);
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
        styleScroll = `width: ${state.get('_internal.chart.dimensions.width')}px`;
        styleScrollInner = `width: ${state.get('_internal.chart.time.totalViewDurationPx')}px; height:1px`;
        update();
    }));
    const onScroll = {
        handleEvent(event) {
            event.stopPropagation();
            event.preventDefault();
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
            const scrollInner = state.get('_internal.elements.horizontalScrollInner');
            if (chart) {
                const scrollLeft = state.get('config.scroll.left');
                let percent = 0;
                if (scrollLeft) {
                    percent = Math.round((scrollLeft / (scrollInner.clientWidth - chart.clientWidth)) * 100);
                    if (percent > 100)
                        percent = 100;
                    console.log(`scrollLeft: ${scrollLeft} percent: ${percent} chart clientWidth: ${chart.clientWidth}`);
                }
                state.update('config.scroll.percent.left', percent);
            }
        },
        passive: false
    };
    function bindElement(element) {
        scrollElement = element;
        state.update('_internal.elements.horizontalScroll', element);
    }
    function bindInnerScroll(element) {
        state.update('_internal.elements.horizontalScrollInner', element);
    }
    componentActions.push(element => {
        state.update('_internal.elements.chart', element);
    });
    return props => html `
    <div class=${className} data-actions=${actions(componentActions, { api, state })} @wheel=${onScroll}>
      ${Calendar.html()}${Timeline.html()}
      <div class=${classNameScroll} style=${styleScroll} data-actions=${actions([bindElement])} @scroll=${onScroll}>
        <div class=${classNameScrollInner} style=${styleScrollInner} data-actions=${actions([bindInnerScroll])} />
      </div>
    </div>
  `;
}
//# sourceMappingURL=Chart.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function Calendar(vido) {
    const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;
    const componentName = 'chart-calendar';
    const componentActions = api.getActions(componentName);
    const ChartCalendarDateComponent = state.get('config.components.ChartCalendarDate');
    let className;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName);
        update();
    }));
    let headerHeight, style = '';
    onDestroy(state.subscribe('config.headerHeight', value => {
        headerHeight = value;
        style = `height: ${headerHeight}px;`;
        update();
    }));
    let dates, datesComponents = [];
    onDestroy(state.subscribe('_internal.chart.time.dates', value => {
        dates = value;
        datesComponents.forEach(date => date.component.destroy());
        datesComponents = [];
        for (const date of dates) {
            datesComponents.push({ id: date.id, component: createComponent(ChartCalendarDateComponent, { date }) });
        }
        update();
    }));
    onDestroy(() => {
        datesComponents.forEach(date => date.component.destroy());
    });
    componentActions.push(element => {
        state.update('_internal.elements.calendar', element);
    });
    return props => html `
    <div class=${className} data-actions=${actions(componentActions)} style=${style}>
      ${repeat(datesComponents, d => d.id, d => d.component.html())}
    </div>
  `;
}
//# sourceMappingURL=ChartCalendar.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function CalendarDate({ date }, vido) {
    const { api, state, onDestroy, actions, update, html } = vido;
    const componentName = 'chart-calendar-date';
    const componentActions = api.getActions(componentName);
    let className, formattedClassName, formattedYearClassName, formattedMonthClassName, formattedDayClassName, formattedDayWordClassName;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, { date });
        if (api.time.date(date.leftGlobal).format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')) {
            className += ' current';
        }
        if (api.time
            .date(date.leftGlobal)
            .subtract(1, 'day')
            .format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')) {
            className += ' next';
        }
        if (api.time
            .date(date.leftGlobal)
            .add(1, 'day')
            .format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')) {
            className += ' previous';
        }
        formattedClassName = api.getClass(`${componentName}-formatted`, { date });
        formattedYearClassName = api.getClass(`${componentName}-formatted-year`, { date });
        formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, { date });
        formattedDayClassName = api.getClass(`${componentName}-formatted-day`, { date });
        formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, { date });
        update();
    }));
    let time, small, smallFormatted, year, month, day, dayWord, style, daySize;
    onDestroy(state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'], function updateDate() {
        time = state.get('_internal.chart.time');
        daySize = time.zoom <= 22 ? 18 : 13;
        const dateMod = api.time.date(date.leftGlobal);
        const maxWidth = time.maxWidth;
        small = maxWidth <= 40;
        const smallFormat = state.get('config.chart.calendar.vertical.smallFormat');
        smallFormatted = dateMod.format(smallFormat);
        year = dateMod.format('YYYY');
        month = dateMod.format('MMMM');
        day = dateMod.format('DD');
        dayWord = dateMod.format('dddd');
        if (maxWidth <= 70) {
            year = dateMod.format('YY');
            month = dateMod.format('MMM');
            day = dateMod.format('DD');
            dayWord = dateMod.format('ddd');
        }
        else if (maxWidth <= 150) {
            dayWord = dateMod.format('ddd');
        }
        style = `width: ${date.width}px; margin-left:-${date.subPx}px; --day-size: ${daySize}px`;
        update();
    }, { bulk: true }));
    return props => html `
    <div class=${className} style=${style} data-actions=${actions(componentActions, { date, api, state })}>
      ${small
        ? html `
            <div class=${formattedClassName} style="transform: rotate(90deg);">${smallFormatted}</div>
          `
        : html `
            <div class=${formattedClassName}>
              <div class=${formattedYearClassName}>${year}</div>
              <div class=${formattedMonthClassName}>${month}</div>
              <div class=${formattedDayClassName}>${day}</div>
              <div class=${formattedDayWordClassName}>${dayWord}</div>
            </div>
          `}
    </div>
  `;
}

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function Gantt(vido) {
    const { api, state, onDestroy, actions, update, html, createComponent } = vido;
    const componentName = 'chart-gantt';
    const componentActions = api.getActions(componentName);
    const GridComponent = state.get('config.components.ChartTimelineGrid');
    const ItemsComponent = state.get('config.components.ChartTimelineItems');
    const Grid = createComponent(GridComponent);
    onDestroy(Grid.destroy);
    const Items = createComponent(ItemsComponent);
    onDestroy(Items.destroy);
    let className, classNameInner;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName);
        classNameInner = api.getClass(componentName + '-inner');
        update();
    }));
    let style = '', styleInner = '';
    onDestroy(state.subscribeAll(['_internal.height', '_internal.list.rowsHeight'], () => {
        style = `height: ${state.get('_internal.height')}px`;
        styleInner = `height: ${state.get('_internal.list.rowsHeight')}px;`;
        update();
    }));
    componentActions.push(element => {
        state.update('_internal.elements.gantt', element);
    });
    return props => html `
    <div class=${className} style=${style} data-actions=${actions(componentActions)} @wheel=${api.onScroll}>
      <div class=${classNameInner} style=${styleInner}>
        ${Grid.html()}${Items.html()}
      </div>
    </div>
  `;
}
//# sourceMappingURL=ChartTimeline.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GanttGrid(vido) {
    const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
    const componentName = 'chart-gantt-grid';
    const componentActions = api.getActions(componentName);
    const GridRowComponent = state.get('config.components.ChartTimelineGridRow');
    let className;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        update();
    }));
    let height, style;
    onDestroy(state.subscribe('_internal.height', h => {
        height = h;
        style = `height: ${height}px`;
        update();
    }));
    let rows, rowsComponents = [];
    onDestroy(state.subscribeAll(['_internal.chart.time.dates', '_internal.list.visibleRows', 'config.chart.grid.block'], function generateBlocks() {
        const rowsData = state.get('_internal.list.visibleRows');
        const dates = state.get('_internal.chart.time.dates');
        rowsComponents.forEach(row => row.component.destroy());
        rowsComponents = [];
        let top = 0;
        rows = [];
        for (const rowId in rowsData) {
            const rowData = rowsData[rowId];
            const blocks = [];
            let index = 0;
            for (const date of dates) {
                blocks.push({ id: index++, date, row: rowData, top });
            }
            const row = { id: rowData.id, blocks, rowData, top };
            rows.push(row);
            rowsComponents.push({ id: rowData.id, component: createComponent(GridRowComponent, { row }) });
            top += rowData.height;
            update();
        }
    }, { bulk: true }));
    componentActions.push(element => {
        state.update('_internal.elements.grid');
    });
    onDestroy(() => {
        rowsComponents.forEach(row => row.component.destroy());
    });
    return props => html `
    <div class=${className} data-actions=${actions(componentActions, { api, state })} style=${style}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
}
//# sourceMappingURL=ChartTimelineGrid.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GanttGridBlock({ row, time, top }, vido) {
    const { api, state, onDestroy, actions, update, html } = vido;
    const componentName = 'chart-gantt-grid-block';
    const componentActions = api.getActions(componentName, { row, time, top });
    let className = api.getClass(componentName, { row });
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        if (time.leftGlobal ===
            api.time
                .date()
                .startOf('day')
                .valueOf()) {
            className += ' current';
        }
        update();
    }));
    let style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px`;
    return props => html `
      <div
        class=${className}
        data-actions=${actions(componentActions, { row, time, top, api, state })}
        style=${style}
      />
    `;
}
//# sourceMappingURL=ChartTimelineGridBlock.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GanttGridRow({ row }, vido) {
    const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
    const componentName = 'chart-gantt-grid-row';
    const GridBlockComponent = state.get('config.components.ChartTimelineGridBlock');
    const componentActions = api.getActions(componentName);
    let className;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName, { row });
        update();
    }));
    let rowsBlocksComponents = [];
    for (const block of row.blocks) {
        rowsBlocksComponents.push({
            id: block.id,
            component: createComponent(GridBlockComponent, { row, time: block.date, top: block.top })
        });
    }
    onDestroy(() => {
        rowsBlocksComponents.forEach(row => row.component.destroy());
    });
    let style = `height: ${row.rowData.height}px;`;
    return props => html `
    <div class=${className} data-actions=${actions(componentActions, { row, api, state })} style=${style}>
      ${rowsBlocksComponents.map(r => r.component.html())}
    </div>
  `;
}
//# sourceMappingURL=ChartTimelineGridRow.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GnattItems(vido) {
    const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
    const componentName = 'chart-gantt-items';
    const componentActions = api.getActions(componentName);
    const ItemsRowComponent = state.get('config.components.ChartTimelineItemsRow');
    let className;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        update();
    }));
    let rows = [], rowsComponents = [];
    onDestroy(state.subscribe('_internal.list.visibleRows;', visibleRows => {
        rows = visibleRows;
        rowsComponents.forEach(row => row.component.destroy());
        rowsComponents = [];
        for (const row of rows) {
            rowsComponents.push({ id: row.id, component: createComponent(ItemsRowComponent, { rowId: row.id }) });
        }
        update();
    }));
    onDestroy(() => {
        rowsComponents.forEach(row => row.component.destroy());
    });
    return props => html `
    <div class=${className} data-actions=${actions(componentActions, { api, state })}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
}
//# sourceMappingURL=ChartTimelineItems.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GanttItemsRow({ rowId }, vido) {
    const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
    const ItemComponent = state.get('config.components.ChartTimelineItemsRowItem');
    let rowPath = `_internal.flatTreeMapById.${rowId}`;
    let row, style, styleInner;
    onDestroy(state.subscribeAll([rowPath, '_internal.chart'], bulk => {
        row = state.get(rowPath);
        const chart = state.get('_internal.chart');
        style = `width:${chart.dimensions.width}px;height:${row.height}px;--row-height:${row.height}px;`;
        styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
        update();
    }));
    let items, itemComponents = [];
    onDestroy(state.subscribe(`_internal.flatTreeMapById.${rowId}._internal.items;`, value => {
        items = value;
        itemComponents.forEach(item => item.component.destroy());
        itemComponents = [];
        for (const item of items) {
            itemComponents.push({ id: item.id, component: createComponent(ItemComponent, { rowId, itemId: item.id }) });
        }
        update();
    }));
    onDestroy(() => {
        itemComponents.forEach(item => item.component.destroy());
    });
    const componentName = 'chart-gantt-items-row';
    const componentNameInner = componentName + '-inner';
    const componentActions = api.getActions(componentName);
    let className, classNameInner;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, { row });
        classNameInner = api.getClass(componentNameInner, { row });
        update();
    }));
    return props => html `
    <div class=${className} data-actions=${actions(componentActions)} style=${style}>
      <div class=${classNameInner} style=${styleInner}>
        ${repeat(itemComponents, i => i.id, i => i.component.html())}
      </div>
    </div>
  `;
}
//# sourceMappingURL=ChartTimelineItemsRow.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GanttItemsRowItem({ rowId, itemId }, vido) {
    const { api, state, onDestroy, actions, update, html } = vido;
    let row, rowPath = `config.list.rows.${rowId}`;
    onDestroy(state.subscribe(rowPath, value => {
        row = value;
        update();
    }));
    let item, itemPath = `config.chart.items.${itemId}`;
    onDestroy(state.subscribe(itemPath, value => {
        item = value;
        update();
    }));
    const componentName = 'chart-gantt-items-row-item';
    const componentActions = api.getActions(componentName);
    let className, contentClassName, labelClassName;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, { row, item });
        contentClassName = api.getClass(componentName + '-content', { row, item });
        labelClassName = api.getClass(componentName + '-content-label', { row, item });
        update();
    }));
    let style, itemLeftPx = 0, itemWidthPx = 0;
    onDestroy(state.subscribeAll(['_internal.chart.time', 'config.scroll', itemPath], bulk => {
        item = state.get(itemPath);
        let time = state.get('_internal.chart.time');
        itemLeftPx = (item.time.start - time.leftGlobal) / time.timePerPixel;
        itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
        itemWidthPx -= state.get('config.chart.spacing');
        const inViewPort = api.isItemInViewport(item, time.leftGlobal, time.rightGlobal);
        style = `left:${itemLeftPx}px;width:${itemWidthPx}px;`;
        update();
    }, { bulk: true }));
    return props => html `
    <div
      class=${className}
      data-actions=${actions(componentActions, { item, row, left: itemLeftPx, width: itemWidthPx, api, state })}
      style=${style}
    >
      <div class=${contentClassName}>
        <div class=${labelClassName}">${item.label}</div>
      </div>
    </div>
  `;
}
//# sourceMappingURL=ChartTimelineItemsRowItem.js.map

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
    'chart-gantt',
    'chart-gantt-grid',
    'chart-gantt-grid-row',
    'chart-gantt-items',
    'chart-gantt-items-row',
    'chart-gantt-items-row-item',
    'chart-calendar-date',
    'chart-gantt-grid-column',
    'chart-gantt-grid-block'
];
function generateEmptyActions() {
    const actions = {};
    actionNames.forEach(name => (actions[name] = []));
    return actions;
}
// default configuration
const defaultConfig = {
    height: 740,
    headerHeight: 86,
    components: {
        Main,
        List,
        ListColumn: ListColumnComponent,
        ListColumnHeader,
        ListColumnHeaderResizer,
        ListColumnRow,
        ListExpander,
        ListToggle,
        Chart,
        ChartCalendar: Calendar,
        ChartCalendarDate: CalendarDate,
        ChartTimeline: Gantt,
        ChartTimelineGrid: GanttGrid,
        ChartTimelineGridBlock: GanttGridBlock,
        ChartTimelineGridRow: GanttGridRow,
        ChartTimelineItems: GnattItems,
        ChartTimelineItemsRow: GanttItemsRow,
        ChartTimelineItemsRowItem: GanttItemsRowItem
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
            data: {}
        },
        expander: {
            padding: 20,
            size: 20,
            icons: {
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
            dates: []
        },
        calendar: {
            vertical: {
                smallFormat: 'YYYY-MM-DD'
            }
        },
        grid: {},
        items: {}
    },
    classNames: {},
    actions: generateEmptyActions(),
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
//# sourceMappingURL=default-config.js.map

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,h:r,m:e,s:n,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i;}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,a){var h=this,f=!!D.u(a)||a,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case o:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,a){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[o]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(a-this.$W):a;if(f===u||f===o){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,a){var h,f=this;t=Number(t);var c=D.p(a),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:D.s(a+1,2,"0"),MMM:c(i.monthsShort,a,h,3),MMMM:h[a]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,o,2),ddd:c(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[o]=y/12,c[u]=y,c[a]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
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
class Matcher {
    constructor(pattern, wchar = '*') {
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
    match(match) {
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
    }
}
//# sourceMappingURL=stringMatcher.js.map

class WildcardObject {
    constructor(obj, delimeter, wildcard) {
        this.obj = obj;
        this.delimeter = delimeter;
        this.wildcard = wildcard;
    }
    simpleMatch(first, second) {
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
    }
    match(first, second) {
        return (first === second ||
            first === this.wildcard ||
            second === this.wildcard ||
            this.simpleMatch(first, second) ||
            new Matcher(first).match(second));
    }
    handleArray(wildcard, currentArr, partIndex, path, result = {}) {
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
    }
    handleObject(wildcard, currentObj, partIndex, path, result = {}) {
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
    }
    goFurther(wildcard, currentObj, partIndex, currentPath, result = {}) {
        if (Array.isArray(currentObj)) {
            return this.handleArray(wildcard, currentObj, partIndex, currentPath, result);
        }
        return this.handleObject(wildcard, currentObj, partIndex, currentPath, result);
    }
    get(wildcard) {
        return this.goFurther(wildcard, this.obj, 0, '');
    }
}
//# sourceMappingURL=wildcard-object-scan.js.map

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
//# sourceMappingURL=ObjectPath.js.map

function log(message, info) {
    console.debug(message, info);
}
const defaultOptions = { delimeter: `.`, notRecursive: `;`, param: `:`, wildcard: `*`, log };
const defaultListenerOptions = { bulk: false, debug: false, source: '', data: undefined };
const defaultUpdateOptions = { only: [], source: '', debug: false, data: undefined };
class DeepState {
    constructor(data = {}, options = defaultOptions) {
        this.listeners = {};
        this.data = data;
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
        this.id = 0;
        this.pathGet = ObjectPath.get;
        this.pathSet = ObjectPath.set;
        this.scan = new WildcardObject(this.data, this.options.delimeter, this.options.wildcard);
    }
    getListeners() {
        return this.listeners;
    }
    destroy() {
        this.data = undefined;
        this.listeners = {};
    }
    match(first, second) {
        if (first === second)
            return true;
        if (first === this.options.wildcard || second === this.options.wildcard)
            return true;
        return this.scan.match(first, second);
    }
    cutPath(longer, shorter) {
        return this.split(this.cleanNotRecursivePath(longer))
            .slice(0, this.split(this.cleanNotRecursivePath(shorter)).length)
            .join(this.options.delimeter);
    }
    trimPath(path) {
        return this.cleanNotRecursivePath(path).replace(new RegExp(`^\\${this.options.delimeter}{1}`), ``);
    }
    split(path) {
        return path === '' ? [] : path.split(this.options.delimeter);
    }
    isWildcard(path) {
        return path.includes(this.options.wildcard);
    }
    isNotRecursive(path) {
        return path.endsWith(this.options.notRecursive);
    }
    cleanNotRecursivePath(path) {
        return this.isNotRecursive(path) ? path.slice(0, -this.options.notRecursive.length) : path;
    }
    hasParams(path) {
        return path.includes(this.options.param);
    }
    getParamsInfo(path) {
        let paramsInfo = { replaced: '', original: path, params: {} };
        let partIndex = 0;
        let fullReplaced = [];
        for (const part of this.split(path)) {
            paramsInfo.params[partIndex] = {
                original: part,
                replaced: '',
                name: ''
            };
            const reg = new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`, 'g');
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
    }
    getParams(paramsInfo, path) {
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
    }
    subscribeAll(userPaths, fn, options = defaultListenerOptions) {
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
    }
    getCleanListenersCollection(values = {}) {
        return Object.assign({
            listeners: {},
            isRecursive: false,
            isWildcard: false,
            hasParams: false,
            match: undefined,
            paramsInfo: undefined,
            path: undefined,
            count: 0
        }, values);
    }
    getCleanListener(fn, options = defaultListenerOptions) {
        return {
            fn,
            options: Object.assign(Object.assign({}, defaultListenerOptions), options)
        };
    }
    getListenerCollectionMatch(listenerPath, isRecursive, isWildcard) {
        listenerPath = this.cleanNotRecursivePath(listenerPath);
        return (path) => {
            if (isRecursive)
                path = this.cutPath(path, listenerPath);
            if (isWildcard && this.match(listenerPath, path))
                return true;
            return listenerPath === path;
        };
    }
    getListenersCollection(listenerPath, listener) {
        if (typeof this.listeners[listenerPath] !== 'undefined') {
            let listenersCollection = this.listeners[listenerPath];
            this.id++;
            listenersCollection.listeners[this.id] = listener;
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
        let listenersCollection = (this.listeners[collCfg.path] = this.getCleanListenersCollection(Object.assign(Object.assign({}, collCfg), { match: this.getListenerCollectionMatch(collCfg.path, collCfg.isRecursive, collCfg.isWildcard) })));
        this.id++;
        listenersCollection.listeners[this.id] = listener;
        return listenersCollection;
    }
    subscribe(listenerPath, fn, options = defaultListenerOptions, type = 'subscribe') {
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
    }
    unsubscribe(path, id) {
        const listeners = this.listeners;
        const listenersCollection = listeners[path];
        return function unsub() {
            delete listenersCollection.listeners[id];
            listenersCollection.count--;
            if (listenersCollection.count === 0) {
                delete listeners[path];
            }
        };
    }
    same(newValue, oldValue) {
        return ((['number', 'string', 'undefined', 'boolean'].includes(typeof newValue) || newValue === null) &&
            oldValue === newValue);
    }
    notifyListeners(listeners, exclude = [], returnNotified = true) {
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
                const bulkValue = bulkListener.value.map((bulk) => (Object.assign(Object.assign({}, bulk), { value: bulk.value() })));
                bulkListener.listener.fn(bulkValue, bulkListener.eventInfo);
                if (returnNotified)
                    alreadyNotified.push(bulkListener);
                this.debugListener(time, bulkListener);
            }
        }
        return alreadyNotified;
    }
    getSubscribedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
        options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
        const listeners = {};
        for (let listenerPath in this.listeners) {
            const listenersCollection = this.listeners[listenerPath];
            listeners[listenerPath] = { single: [], bulk: [], bulkData: [] };
            if (listenersCollection.match(updatePath)) {
                const params = listenersCollection.paramsInfo
                    ? this.getParams(listenersCollection.paramsInfo, updatePath)
                    : undefined;
                const value = listenersCollection.isRecursive || listenersCollection.isWildcard
                    ? () => this.get(this.cutPath(updatePath, listenerPath))
                    : () => newValue;
                const bulkValue = [{ value, path: updatePath, params }];
                for (const listenerId in listenersCollection.listeners) {
                    const listener = listenersCollection.listeners[listenerId];
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
    }
    notifySubscribedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
        return this.notifyListeners(this.getSubscribedListeners(updatePath, newValue, options, type, originalPath));
    }
    getNestedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
        const listeners = {};
        for (let listenerPath in this.listeners) {
            listeners[listenerPath] = { single: [], bulk: [] };
            const listenersCollection = this.listeners[listenerPath];
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
                    for (const listenerId in listenersCollection.listeners) {
                        const listener = listenersCollection.listeners[listenerId];
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
                            listeners[listenerPath].single.push({ listener, listenersCollection, eventInfo, value });
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
                    listeners[listenerPath].bulk.push({ listener, listenersCollection, eventInfo, value: bulk });
                }
            }
        }
        return listeners;
    }
    notifyNestedListeners(updatePath, newValue, options, type = 'update', alreadyNotified, originalPath = null) {
        return this.notifyListeners(this.getNestedListeners(updatePath, newValue, options, type, originalPath), alreadyNotified, false);
    }
    getNotifyOnlyListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
        const listeners = {};
        if (typeof options.only !== 'object' ||
            !Array.isArray(options.only) ||
            typeof options.only[0] === 'undefined' ||
            !this.canBeNested(newValue)) {
            return listeners;
        }
        for (const notifyPath of options.only) {
            const wildcardScan = new WildcardObject(newValue, this.options.delimeter, this.options.wildcard).get(notifyPath);
            listeners[notifyPath] = { bulk: [], single: [] };
            for (const wildcardPath in wildcardScan) {
                const fullPath = updatePath + this.options.delimeter + wildcardPath;
                for (const listenerPath in this.listeners) {
                    const listenersCollection = this.listeners[listenerPath];
                    const params = listenersCollection.paramsInfo
                        ? this.getParams(listenersCollection.paramsInfo, fullPath)
                        : undefined;
                    if (this.match(listenerPath, fullPath)) {
                        const value = () => wildcardScan[wildcardPath];
                        const bulkValue = [{ value, path: fullPath, params }];
                        for (const listenerId in listenersCollection.listeners) {
                            const listener = listenersCollection.listeners[listenerId];
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
                                if (!listeners[notifyPath].bulk.some((bulkListener) => bulkListener.listener === listener)) {
                                    listeners[notifyPath].bulk.push({ listener, listenersCollection, eventInfo, value: bulkValue });
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
    }
    notifyOnly(updatePath, newValue, options, type = 'update', originalPath = null) {
        return (typeof this.notifyListeners(this.getNotifyOnlyListeners(updatePath, newValue, options, type, originalPath))[0] !==
            'undefined');
    }
    canBeNested(newValue) {
        return typeof newValue === 'object' && newValue !== null;
    }
    getUpdateValues(oldValue, split, fn) {
        if (typeof oldValue === 'object' && oldValue !== null) {
            Array.isArray(oldValue) ? (oldValue = oldValue.slice()) : (oldValue = Object.assign({}, oldValue));
        }
        let newValue = fn;
        if (typeof fn === 'function') {
            newValue = fn(this.pathGet(split, this.data));
        }
        return { newValue, oldValue };
    }
    wildcardUpdate(updatePath, fn, options = defaultUpdateOptions) {
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
                groupedListenersPack.push(this.getNotifyOnlyListeners(path, newValue, options, 'update', updatePath));
            }
            else {
                groupedListenersPack.push(this.getSubscribedListeners(path, newValue, options, 'update', updatePath));
                this.canBeNested(newValue) &&
                    groupedListenersPack.push(this.getNestedListeners(path, newValue, options, 'update', updatePath));
            }
            options.debug && this.options.log('Wildcard update', { path, newValue });
            this.pathSet(this.split(path), newValue, this.data);
        }
        let alreadyNotified = [];
        for (const groupedListeners of groupedListenersPack) {
            alreadyNotified = [...alreadyNotified, ...this.notifyListeners(groupedListeners, alreadyNotified)];
        }
    }
    update(updatePath, fn, options = defaultUpdateOptions) {
        if (this.isWildcard(updatePath)) {
            return this.wildcardUpdate(updatePath, fn, options);
        }
        const split = this.split(updatePath);
        const { oldValue, newValue } = this.getUpdateValues(this.pathGet(split, this.data), split, fn);
        if (options.debug) {
            this.options.log(`Updating ${updatePath} ${options.source ? `from ${options.source}` : ''}`, oldValue, newValue);
        }
        if (this.same(newValue, oldValue)) {
            return newValue;
        }
        this.pathSet(split, newValue, this.data);
        options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
        if (this.notifyOnly(updatePath, newValue, options)) {
            return newValue;
        }
        const alreadyNotified = this.notifySubscribedListeners(updatePath, newValue, options);
        if (this.canBeNested(newValue)) {
            this.notifyNestedListeners(updatePath, newValue, options, 'update', alreadyNotified);
        }
        return newValue;
    }
    get(userPath = undefined) {
        if (typeof userPath === 'undefined' || userPath === '') {
            return this.data;
        }
        return this.pathGet(this.split(userPath), this.data);
    }
    debugSubscribe(listener, listenersCollection, listenerPath) {
        if (listener.options.debug) {
            this.options.log('listener subscribed', listenerPath, listener, listenersCollection);
        }
    }
    debugListener(time, groupedListener) {
        if (groupedListener.eventInfo.options.debug || groupedListener.listener.options.debug) {
            this.options.log('Listener fired', {
                time: Date.now() - time,
                info: groupedListener
            });
        }
    }
    debugTime(groupedListener) {
        return groupedListener.listener.options.debug || groupedListener.eventInfo.options.debug ? Date.now() : 0;
    }
}
//# sourceMappingURL=index.js.map

/**
 * Gantt-Schedule-Timeline-Calendar
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
function isObject(item) {
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
function mergeDeep(target, ...sources) {
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (typeof target[key] === 'undefined') {
          target[key] = {};
        }
        target[key] = mergeDeep(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        target[key] = [];
        for (let item of source[key]) {
          if (isObject(item)) {
            target[key].push(mergeDeep({}, item));
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
  return mergeDeep(target, ...sources);
}

function mergeActions(userConfig) {
  const defaultConfigActions = mergeDeep({}, defaultConfig.actions);
  const userActions = mergeDeep({}, userConfig.actions);
  const allActionNames = [Object.keys(defaultConfigActions), Object.keys(userActions)].flatMap((item, index, all) => {
    if (index === 1) {
      return item.filter(i => !all[0].includes(i));
    }
    return item;
  });
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
  const actions = mergeActions(userConfig);
  const state = { config: mergeDeep({}, defaultConfig, userConfig) };
  state.config.actions = actions;
  return new DeepState(state, { delimeter: '.' });
}

const publicApi = {
  name: lib,
  stateFromConfig,
  mergeDeep,
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

    mergeDeep,

    getComponentData(componentName, attrs) {
      const componentData = {};
      componentData.componentName = componentName;
      componentData.className = this.getClass(componentName, attrs);
      componentData.action = this.getAction(componentName);
      return componentData;
    },

    getClass(name, attrs) {
      let simple = `${lib}__${name}`;
      if (name === this.name) {
        simple = this.name;
      }
      let className = `${simple} `;
      let postfix = '-';
      if (typeof attrs !== 'undefined') {
        for (const key in attrs) {
          if (attrs[key].constructor.name === 'Object' && typeof attrs[key].id !== 'undefined') {
            postfix += `-${key}_${attrs[key].id}`;
            return className + className.trim() + postfix;
          }
          if (typeof attrs[key] === 'string' || typeof attrs[key] === 'number') {
            postfix += `-${key}_${attrs[key]}`;
          }
        }
      }
      if (postfix != '-') {
        className += simple + postfix + ' ';
      }
      if (typeof $state.config.classNames[name] !== 'undefined') {
        state.get(`config.classNames.${name}`).forEach(customClass => (className += customClass + ' '));
      }
      if (typeof $state.config.classNames[name + postfix] !== 'undefined') {
        state.get(`config.classNames.${name + postfix}`).forEach(customClass => (className += customClass + ' '));
      }
      return className.trim();
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
    getVisibleRows(rowsWithParentsExpanded) {
      const rows = [];
      let currentOffset = 0;
      let rowOffset = 0;
      for (const row of rowsWithParentsExpanded) {
        if (
          currentOffset + row.height > $state.config.scroll.top &&
          currentOffset < $state.config.scroll.top + $state._internal.height
        ) {
          row.top = rowOffset;
          rowOffset += row.height;
          rows.push(row);
        }
        if (currentOffset > $state.config.scroll.top + $state._internal.height) {
          break;
        }
        currentOffset += row.height;
      }
      return rows;
    },

    /**
     * Normalize mouse wheel event to get proper scroll metrics
     *
     * @param {Event} event mouse wheel event
     */
    normalizeMouseWheelEvent(event) {
      let x = event.deltaX || 0;
      let y = event.deltaY || 0;
      let z = event.deltaZ || 0;
      const mode = event.deltaMode;
      const lineHeight = parseInt(getComputedStyle(event.target).getPropertyValue('line-height'));
      let scale = 1;
      switch (mode) {
        case 1:
          scale = lineHeight;
          break;
        case 2:
          scale = window.height;
          break;
      }
      x *= scale;
      y *= scale;
      z *= scale;
      return { x, y, z };
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
     * Destroy things to release memory
     */
    destroy() {
      $state = undefined;
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
      unsubscribers = [];
      if (api.debug) {
        delete window.state;
      }
    }
  };

  if (api.debug) {
    window.state = state;
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
            dates: [],
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
            rightInner: 0
        }
    },
    elements: {}
};
const GSTC = options => {
    const state = options.state;
    const api = getInternalApi(state);
    // @ts-ignore
    window.state = state;
    state.update('', oldValue => {
        return {
            config: oldValue.config,
            _internal
        };
    });
    // @ts-ignore
    const vido = Vido(state, api);
    const app = vido.createApp(Main, options.element);
    return { state };
};
GSTC.api = publicApi;
//# sourceMappingURL=index.js.map

export default GSTC;
//# sourceMappingURL=index.esm.js.map
