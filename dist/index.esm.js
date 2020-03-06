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
    // tslint:disable-next-line:no-any
    d.isDirective = true;
    return d;
});
class Directive {
    constructor() {
        this.isDirective = true;
        this.isClass = true;
    }
    body(_part) {
        // body of the directive
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
const isCEPolyfill = typeof window !== 'undefined' ?
    window.customElements != null &&
        window.customElements
            .polyfillWrapFlushCallback !== undefined :
    false;
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
                        this.parts.push({
                            type: 'attribute',
                            index,
                            name,
                            strings: statics,
                            sanitizer: undefined
                        });
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
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

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
                const textPart = this.processor.handleTextExpression(this.options, part);
                textPart.insertAfterNode(node.previousSibling);
                this.__parts.push(textPart);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options, part));
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // tslint:disable-next-line: no-any
        !!(value && value[Symbol.iterator]);
};
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/**
 * A global callback used to get a sanitizer for a given field.
 */
let sanitizerFactory = noopSanitizer;
/** Sets the global sanitizer factory. */
const setSanitizerFactory = (newSanitizer) => {
    if (sanitizerFactory !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactory = newSanitizer;
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
    constructor(element, name, strings, 
    // Next breaking change, consider making this param required.
    templatePart, kind = 'attribute') {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        let sanitizer = templatePart && templatePart.sanitizer;
        if (sanitizer === undefined) {
            sanitizer = sanitizerFactory(element, name, kind);
            if (templatePart !== undefined) {
                templatePart.sanitizer = sanitizer;
            }
        }
        this.sanitizer = sanitizer;
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
            value = this.sanitizer(value);
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
            // tslint:disable-next-line: no-any
            if (directive.isClass) {
                // tslint:disable-next-line: no-any
                directive.body(this);
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
    constructor(options, templatePart) {
        this.value = undefined;
        this.__pendingValue = undefined;
        /**
         * The sanitizer to use when writing text contents into this NodePart.
         *
         * We have to initialize this here rather than at the template literal level
         * because the security of text content depends on the context into which
         * it's written. e.g. the same text has different security requirements
         * when a child of a <script> vs a <style> vs a <div>.
         */
        this.textSanitizer = undefined;
        this.options = options;
        this.templatePart = templatePart;
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
            // tslint:disable-next-line: no-any
            if (directive.isClass) {
                // tslint:disable-next-line: no-any
                directive.body(this);
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
            if (this.textSanitizer === undefined) {
                this.textSanitizer = sanitizerFactory(node, 'data', 'property');
            }
            const renderedValue = this.textSanitizer(value);
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
            if (this.textSanitizer === undefined) {
                this.textSanitizer = sanitizerFactory(textNode, 'data', 'property');
            }
            const renderedValue = this.textSanitizer(value);
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
            // We only apply this policy when sanitizerFactory has been set to
            // prevent this from being a breaking change to the library.
            const parent = this.endNode.parentNode;
            if (sanitizerFactory !== noopSanitizer && parent.nodeName === 'STYLE' ||
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
                itemPart = new NodePart(this.options, this.templatePart);
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
            // tslint:disable-next-line: no-any
            if (directive.isClass) {
                // tslint:disable-next-line: no-any
                directive.body(this);
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
    constructor(element, name, strings, 
    // Next breaking change, consider making this param required.
    templatePart) {
        super(element, name, strings, templatePart, 'property');
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
            value = this.sanitizer(value);
            // tslint:disable-next-line: no-any
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
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // noop
    }
})();
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
            // tslint:disable-next-line: no-any
            if (directive.isClass) {
                // tslint:disable-next-line: no-any
                directive.body(this);
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
    handleAttributeExpressions(element, name, strings, options, templatePart) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings, templatePart);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings, templatePart);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options, nodeTemplatePart) {
        return new NodePart(options, nodeTemplatePart);
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
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options), undefined));
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
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
    // If we run in the browser set version
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.5');
}
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

var lithtml = /*#__PURE__*/Object.freeze({
    __proto__: null,
    html: html,
    svg: svg,
    DefaultTemplateProcessor: DefaultTemplateProcessor,
    defaultTemplateProcessor: defaultTemplateProcessor,
    directive: directive,
    Directive: Directive,
    isDirective: isDirective,
    removeNodes: removeNodes,
    reparentNodes: reparentNodes,
    noChange: noChange,
    nothing: nothing,
    AttributeCommitter: AttributeCommitter,
    AttributePart: AttributePart,
    BooleanAttributePart: BooleanAttributePart,
    EventPart: EventPart,
    isIterable: isIterable,
    isPrimitive: isPrimitive,
    NodePart: NodePart,
    PropertyCommitter: PropertyCommitter,
    PropertyPart: PropertyPart,
    get sanitizerFactory () { return sanitizerFactory; },
    setSanitizerFactory: setSanitizerFactory,
    parts: parts,
    render: render,
    templateCaches: templateCaches,
    templateFactory: templateFactory,
    TemplateInstance: TemplateInstance,
    SVGTemplateResult: SVGTemplateResult,
    TemplateResult: TemplateResult,
    createMarker: createMarker,
    isTemplatePartActive: isTemplatePartActive,
    Template: Template
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
var __asyncValues =  function (o) {
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
            itemPart = new NodePart(part.options, part.templatePart);
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
var __asyncValues$1 =  function (o) {
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
    const itemPart = new NodePart(part.options, part.templatePart);
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
    const beforeNode = beforePart == null ? containerPart.endNode : beforePart.startNode;
    const startNode = container.insertBefore(createMarker(), beforeNode);
    container.insertBefore(createMarker(), beforeNode);
    const newPart = new NodePart(containerPart.options, undefined);
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

const detached = new WeakMap();
class Detach extends Directive {
    constructor(ifFn) {
        super();
        this.ifFn = ifFn;
    }
    body(part) {
        const detach = this.ifFn();
        const element = part.committer.element;
        if (detach) {
            if (!detached.has(part)) {
                const nextSibling = element.nextSibling;
                detached.set(part, { element, nextSibling });
            }
            element.remove();
        }
        else {
            const data = detached.get(part);
            if (typeof data !== 'undefined' && data !== null) {
                data.nextSibling.parentNode.insertBefore(data.element, data.nextSibling);
                detached.delete(part);
            }
        }
    }
}

const toRemove = [], toUpdate = [];
class StyleMap extends Directive {
    constructor(styleInfo, detach = false) {
        super();
        this.previous = {};
        this.style = styleInfo;
        this.detach = detach;
    }
    setStyle(styleInfo) {
        this.style = styleInfo;
    }
    setDetach(detach) {
        this.detach = detach;
    }
    body(part) {
        toRemove.length = 0;
        toUpdate.length = 0;
        // @ts-ignore
        const element = part.committer.element;
        const style = element.style;
        let previous = this.previous;
        for (const name in previous) {
            if (this.style[name] === undefined) {
                toRemove.push(name);
            }
        }
        for (const name in this.style) {
            const value = this.style[name];
            const prev = previous[name];
            if (prev !== undefined && prev === value) {
                continue;
            }
            toUpdate.push(name);
        }
        if (toRemove.length || toUpdate.length) {
            let parent, nextSibling;
            if (this.detach) {
                parent = element.parentNode;
                if (parent) {
                    nextSibling = element.nextSibling;
                    element.remove();
                }
            }
            for (const name of toRemove) {
                style.removeProperty(name);
            }
            for (const name of toUpdate) {
                const value = this.style[name];
                if (!name.includes('-')) {
                    style[name] = value;
                }
                else {
                    style.setProperty(name, value);
                }
            }
            if (this.detach && parent) {
                parent.insertBefore(element, nextSibling);
            }
            this.previous = Object.assign({}, this.style);
        }
    }
}

class Action {
    constructor() {
        this.isAction = true;
    }
}
Action.prototype.isAction = true;

const defaultOptions = {
    element: document.createTextNode(''),
    axis: 'xy',
    threshold: 10,
    onDown(data) { },
    onMove(data) { },
    onUp(data) { },
    onWheel(data) { }
};
const pointerEventsExists = typeof PointerEvent !== 'undefined';
let id = 0;
class PointerAction extends Action {
    constructor(element, data) {
        super();
        this.moving = '';
        this.initialX = 0;
        this.initialY = 0;
        this.lastY = 0;
        this.lastX = 0;
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.element = element;
        this.id = ++id;
        this.options = Object.assign(Object.assign({}, defaultOptions), data.pointerOptions);
        if (pointerEventsExists) {
            element.addEventListener('pointerdown', this.onPointerDown);
            document.addEventListener('pointermove', this.onPointerMove);
            document.addEventListener('pointerup', this.onPointerUp);
        }
        else {
            element.addEventListener('touchstart', this.onPointerDown);
            document.addEventListener('touchmove', this.onPointerMove, { passive: false });
            document.addEventListener('touchend', this.onPointerUp);
            document.addEventListener('touchcancel', this.onPointerUp);
            element.addEventListener('mousedown', this.onPointerDown);
            document.addEventListener('mousemove', this.onPointerMove, { passive: false });
            document.addEventListener('mouseup', this.onPointerUp);
        }
    }
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
    }
    onWheel(event) {
        const normalized = this.normalizeMouseWheelEvent(event);
        this.options.onWheel(normalized);
    }
    normalizePointerEvent(event) {
        let result = { x: 0, y: 0, pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0, event };
        switch (event.type) {
            case 'wheel':
                const wheel = this.normalizeMouseWheelEvent(event);
                result.x = wheel.x;
                result.y = wheel.y;
                result.pageX = result.x;
                result.pageY = result.y;
                result.screenX = result.x;
                result.screenY = result.y;
                result.clientX = result.x;
                result.clientY = result.y;
                break;
            case 'touchstart':
            case 'touchmove':
            case 'touchend':
            case 'touchcancel':
                result.x = event.changedTouches[0].screenX;
                result.y = event.changedTouches[0].screenY;
                result.pageX = event.changedTouches[0].pageX;
                result.pageY = event.changedTouches[0].pageY;
                result.screenX = event.changedTouches[0].screenX;
                result.screenY = event.changedTouches[0].screenY;
                result.clientX = event.changedTouches[0].clientX;
                result.clientY = event.changedTouches[0].clientY;
                break;
            default:
                result.x = event.x;
                result.y = event.y;
                result.pageX = event.pageX;
                result.pageY = event.pageY;
                result.screenX = event.screenX;
                result.screenY = event.screenY;
                result.clientX = event.clientX;
                result.clientY = event.clientY;
                break;
        }
        return result;
    }
    onPointerDown(event) {
        if (event.type === 'mousedown' && event.button !== 0)
            return;
        this.moving = 'xy';
        const normalized = this.normalizePointerEvent(event);
        this.lastX = normalized.x;
        this.lastY = normalized.y;
        this.initialX = normalized.x;
        this.initialY = normalized.y;
        this.options.onDown(normalized);
    }
    handleX(normalized) {
        let movementX = normalized.x - this.lastX;
        this.lastY = normalized.y;
        this.lastX = normalized.x;
        return movementX;
    }
    handleY(normalized) {
        let movementY = normalized.y - this.lastY;
        this.lastY = normalized.y;
        this.lastX = normalized.x;
        return movementY;
    }
    onPointerMove(event) {
        if (this.moving === '' || (event.type === 'mousemove' && event.button !== 0))
            return;
        const normalized = this.normalizePointerEvent(event);
        if (this.options.axis === 'x|y') {
            let movementX = 0, movementY = 0;
            if (this.moving === 'x' ||
                (this.moving === 'xy' && Math.abs(normalized.x - this.initialX) > this.options.threshold)) {
                this.moving = 'x';
                movementX = this.handleX(normalized);
            }
            if (this.moving === 'y' ||
                (this.moving === 'xy' && Math.abs(normalized.y - this.initialY) > this.options.threshold)) {
                this.moving = 'y';
                movementY = this.handleY(normalized);
            }
            this.options.onMove({
                movementX,
                movementY,
                x: normalized.x,
                y: normalized.y,
                initialX: this.initialX,
                initialY: this.initialY,
                lastX: this.lastX,
                lastY: this.lastY,
                event
            });
        }
        else if (this.options.axis === 'xy') {
            let movementX = 0, movementY = 0;
            if (Math.abs(normalized.x - this.initialX) > this.options.threshold) {
                movementX = this.handleX(normalized);
            }
            if (Math.abs(normalized.y - this.initialY) > this.options.threshold) {
                movementY = this.handleY(normalized);
            }
            this.options.onMove({
                movementX,
                movementY,
                x: normalized.x,
                y: normalized.y,
                initialX: this.initialX,
                initialY: this.initialY,
                lastX: this.lastX,
                lastY: this.lastY,
                event
            });
        }
        else if (this.options.axis === 'x') {
            if (this.moving === 'x' ||
                (this.moving === 'xy' && Math.abs(normalized.x - this.initialX) > this.options.threshold)) {
                this.moving = 'x';
                this.options.onMove({
                    movementX: this.handleX(normalized),
                    movementY: 0,
                    initialX: this.initialX,
                    initialY: this.initialY,
                    lastX: this.lastX,
                    lastY: this.lastY,
                    event
                });
            }
        }
        else if (this.options.axis === 'y') {
            let movementY = 0;
            if (this.moving === 'y' ||
                (this.moving === 'xy' && Math.abs(normalized.y - this.initialY) > this.options.threshold)) {
                this.moving = 'y';
                movementY = this.handleY(normalized);
            }
            this.options.onMove({
                movementX: 0,
                movementY,
                x: normalized.x,
                y: normalized.y,
                initialX: this.initialX,
                initialY: this.initialY,
                lastX: this.lastX,
                lastY: this.lastY,
                event
            });
        }
    }
    onPointerUp(event) {
        this.moving = '';
        const normalized = this.normalizePointerEvent(event);
        this.options.onUp({
            movementX: 0,
            movementY: 0,
            x: normalized.x,
            y: normalized.y,
            initialX: this.initialX,
            initialY: this.initialY,
            lastX: this.lastX,
            lastY: this.lastY,
            event
        });
        this.lastY = 0;
        this.lastX = 0;
    }
    destroy(element) {
        if (pointerEventsExists) {
            element.removeEventListener('pointerdown', this.onPointerDown);
            document.removeEventListener('pointermove', this.onPointerMove);
            document.removeEventListener('pointerup', this.onPointerUp);
        }
        else {
            element.removeEventListener('mousedown', this.onPointerDown);
            document.removeEventListener('mousemove', this.onPointerMove);
            document.removeEventListener('mouseup', this.onPointerUp);
            element.removeEventListener('touchstart', this.onPointerDown);
            document.removeEventListener('touchmove', this.onPointerMove);
            document.removeEventListener('touchend', this.onPointerUp);
            document.removeEventListener('touchcancel', this.onPointerUp);
        }
    }
}

function getPublicComponentMethods(components, actionsByInstance, clone) {
    return class PublicComponentMethods {
        constructor(instance, vidoInstance, props = {}) {
            this.instance = instance;
            this.name = vidoInstance.name;
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
            const component = components.get(this.instance);
            if (component) {
                return component.update(templateProps, this.vidoInstance);
            }
            return undefined;
        }
        _getComponents() {
            return components;
        }
        _getActions() {
            return actionsByInstance;
        }
    };
}

function getActionsCollector(actionsByInstance) {
    return class ActionsCollector extends Directive {
        constructor(instance) {
            super();
            this.instance = instance;
        }
        set(actions, props) {
            this.actions = actions;
            this.props = props;
            // props must be mutable! (do not do this -> {...props})
            // because we will modify action props with onChange and can reuse existin instance
            return this;
        }
        body(part) {
            const element = part.committer.element;
            for (const create of this.actions) {
                if (typeof create !== 'undefined') {
                    let exists;
                    if (actionsByInstance.has(this.instance)) {
                        for (const action of actionsByInstance.get(this.instance)) {
                            if (action.componentAction.create === create && action.element === element) {
                                exists = action;
                                break;
                            }
                        }
                    }
                    if (!exists) {
                        // @ts-ignore
                        if (typeof element.vido !== 'undefined')
                            delete element.vido;
                        const componentAction = {
                            create,
                            update() { },
                            destroy() { }
                        };
                        const action = { instance: this.instance, componentAction, element, props: this.props };
                        let byInstance = [];
                        if (actionsByInstance.has(this.instance)) {
                            byInstance = actionsByInstance.get(this.instance);
                        }
                        byInstance.push(action);
                        actionsByInstance.set(this.instance, byInstance);
                    }
                    else {
                        exists.props = this.props;
                    }
                }
            }
        }
    };
}

function getInternalComponentMethods(components, actionsByInstance, clone) {
    return class InternalComponentMethods {
        constructor(instance, vidoInstance, renderFunction, content) {
            this.instance = instance;
            this.vidoInstance = vidoInstance;
            this.renderFunction = renderFunction;
            this.content = content;
        }
        destroy() {
            var _a;
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
            if (typeof ((_a = this.content) === null || _a === void 0 ? void 0 : _a.destroy) === 'function') {
                this.content.destroy();
            }
            for (const d of this.vidoInstance.destroyable) {
                d();
            }
            this.vidoInstance.onChangeFunctions = [];
            this.vidoInstance.destroyable = [];
            this.vidoInstance.update();
        }
        update(props = {}) {
            if (this.vidoInstance.debug) {
                console.groupCollapsed(`component update method fired ${this.instance}`);
                console.log(clone({ components: components.keys(), actionsByInstance }));
                console.trace();
                console.groupEnd();
            }
            return this.renderFunction(props);
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
    };
}

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
    const additionalMethods = {};
    const ActionsCollector = getActionsCollector(actionsByInstance);
    class InstanceActionsCollector {
        constructor(instance) {
            this.instance = instance;
        }
        create(actions, props) {
            const actionsInstance = new ActionsCollector(this.instance);
            actionsInstance.set(actions, props);
            return actionsInstance;
        }
    }
    const PublicComponentMethods = getPublicComponentMethods(components, actionsByInstance, clone);
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
        for (const name in additionalMethods) {
            this[name] = additionalMethods[name];
        }
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
    vido.prototype.until = until;
    vido.prototype.schedule = schedule;
    vido.prototype.actionsByInstance = (componentActions, props) => { };
    vido.prototype.StyleMap = StyleMap;
    vido.prototype.Detach = Detach;
    vido.prototype.PointerAction = PointerAction;
    vido.prototype.addMethod = function addMethod(name, body) {
        additionalMethods[name] = body;
    };
    vido.prototype.Action = Action;
    vido.prototype.onDestroy = function onDestroy(fn) {
        this.destroyable.push(fn);
    };
    vido.prototype.onChange = function onChange(fn) {
        this.onChangeFunctions.push(fn);
    };
    vido.prototype.update = function update(callback) {
        return this.updateTemplate(callback);
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
        if (leaveTail && (dataArray === undefined || dataArray.length === 0)) {
            leave = true;
        }
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
    };
    const InternalComponentMethods = getInternalComponentMethods(components, actionsByInstance, clone);
    /**
     * Create component
     *
     * @param {function} component
     * @param {any} props
     * @returns {object} component instance methods
     */
    function createComponent(component, props = {}, content = null) {
        const instance = component.name + ':' + componentId++;
        let vidoInstance;
        vidoInstance = new vido();
        vidoInstance.instance = instance;
        vidoInstance.name = component.name;
        vidoInstance.Actions = new InstanceActionsCollector(instance);
        const publicMethods = new PublicComponentMethods(instance, vidoInstance, props);
        const internalMethods = new InternalComponentMethods(instance, vidoInstance, component(vidoInstance, props, content), content);
        components.set(instance, internalMethods);
        components.get(instance).change(props);
        if (vidoInstance.debug) {
            console.groupCollapsed(`component created ${instance}`);
            console.log(clone({ props, components: components.keys(), actionsByInstance }));
            console.trace();
            console.groupEnd();
        }
        return publicMethods;
    }
    vido.prototype.createComponent = createComponent;
    class Slot extends Directive {
        constructor(components, props = {}, content = null) {
            super();
            this.components = [];
            if (Array.isArray(components)) {
                for (const component of components) {
                    this.components.push(createComponent(component, props, content));
                }
            }
        }
        body(part) {
            part.setValue(this.components.map((component) => component.html()));
        }
        change(changedProps, options) {
            for (const component of this.components) {
                component.change(changedProps, options);
            }
        }
        getComponents() {
            return this.components;
        }
        setComponents(components) {
            this.components = components;
        }
        destroy() {
            for (const component of this.components) {
                component.destroy();
            }
        }
    }
    vido.prototype.Slot = Slot;
    class Slots {
        constructor() {
            this.slots = {};
        }
        addSlot(name, slot) {
            if (this.slots[name] === undefined) {
                this.slots[name] = [];
            }
            this.slots[name].push(slot);
        }
        change(changedProps, options) {
            for (const name in this.slots) {
                for (const slot of this.slots[name]) {
                    slot.change(changedProps, options);
                }
            }
        }
        destroy() {
            for (const name in this.slots) {
                for (const slot of this.slots[name]) {
                    slot.destroy();
                }
            }
        }
        get(name) {
            return this.slots[name];
        }
        set(name, value) {
            this.slots[name] = value;
        }
    }
    vido.prototype.Slots = Slots;
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
        const component = components.get(instance);
        component.update();
        component.destroy();
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
    vido.prototype.updateTemplate = function updateTemplate(callback) {
        return new Promise((resolve) => {
            const currentShouldUpdateCount = ++shouldUpdateCount;
            const self = this;
            function flush() {
                if (currentShouldUpdateCount === shouldUpdateCount) {
                    shouldUpdateCount = 0;
                    self.render();
                    if (typeof callback === 'function')
                        callback();
                    resolve();
                }
            }
            resolved.then(flush);
        });
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
        var _a, _b, _c;
        for (const actions of actionsByInstance.values()) {
            for (const action of actions) {
                if (action.element.vido === undefined) {
                    const componentAction = action.componentAction;
                    const create = componentAction.create;
                    if (typeof create !== 'undefined') {
                        let result;
                        if (((_a = create.prototype) === null || _a === void 0 ? void 0 : _a.isAction) !== true &&
                            create.isAction === undefined &&
                            ((_b = create.prototype) === null || _b === void 0 ? void 0 : _b.update) === undefined &&
                            ((_c = create.prototype) === null || _c === void 0 ? void 0 : _c.destroy) === undefined) {
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
        const appComponent = components.get(app);
        if (appComponent) {
            render(appComponent.update(), element);
            this.executeActions();
        }
        else if (element) {
            element.remove();
        }
    };
    vido.prototype._components = components;
    vido.prototype._actions = actionsByInstance;
    return new vido();
}
Vido.prototype.lithtml = lithtml;
Vido.prototype.Action = Action;
Vido.prototype.Directive = Directive;
Vido.prototype.schedule = schedule;
Vido.prototype.Detach = Detach;
Vido.prototype.StyleMap = StyleMap;
Vido.prototype.PointerAction = PointerAction;
Vido.prototype.asyncAppend = asyncAppend;
Vido.prototype.asyncReplace = asyncReplace;
Vido.prototype.cache = cache;
Vido.prototype.classMap = classMap;
Vido.prototype.guard = guard;
Vido.prototype.ifDefined = ifDefined;
Vido.prototype.repeat = repeat;
Vido.prototype.unsafeHTML = unsafeHTML;
Vido.prototype.unti = until;

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
var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

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
        if (!isBrowser$1 || this.connected_) {
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
        if (!isBrowser$1 || !this.connected_) {
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
    if (!isBrowser$1) {
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function Main(vido, props = {}) {
    const { api, state, onDestroy, Actions, update, createComponent, html, StyleMap, schedule } = vido;
    const componentName = api.name;
    // Initialize plugins
    onDestroy(state.subscribe('config.plugins', plugins => {
        if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
            for (const initializePlugin of plugins) {
                const destroyPlugin = initializePlugin(vido);
                if (typeof destroyPlugin === 'function') {
                    onDestroy(destroyPlugin);
                }
                else if (destroyPlugin && destroyPlugin.hasOwnProperty('destroy')) {
                    destroyPlugin.destroy();
                }
            }
        }
    }));
    const componentSubs = [];
    let ListComponent;
    componentSubs.push(state.subscribe('config.components.List', value => (ListComponent = value)));
    let ChartComponent;
    componentSubs.push(state.subscribe('config.components.Chart', value => (ChartComponent = value)));
    const List = createComponent(ListComponent);
    onDestroy(List.destroy);
    const Chart = createComponent(ChartComponent);
    onDestroy(Chart.destroy);
    onDestroy(() => {
        componentSubs.forEach(unsub => unsub());
    });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.Main', value => (wrapper = value)));
    const componentActions = api.getActions('main');
    let className, classNameVerticalScroll;
    const styleMap = new StyleMap({}), verticalScrollStyleMap = new StyleMap({}), verticalScrollAreaStyleMap = new StyleMap({});
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
    function heightChange() {
        const config = state.get('config');
        const scrollBarHeight = state.get('_internal.scrollBarHeight');
        const height = config.height - config.headerHeight - scrollBarHeight;
        state.update('_internal.height', height);
        styleMap.style['--height'] = config.height + 'px';
        verticalScrollStyleMap.style.height = height + 'px';
        verticalScrollStyleMap.style.width = scrollBarHeight + 'px';
        verticalScrollStyleMap.style['margin-top'] = config.headerHeight + 'px';
        update();
    }
    onDestroy(state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], heightChange));
    /**
     * Resizer active change
     * @param {boolean} active
     */
    function resizerActiveChange(active) {
        resizerActive = active;
        className = api.getClass(api.name);
        if (resizerActive) {
            className += ` ${api.name}__list-column-header-resizer--active`;
        }
        update();
    }
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
        api.prepareItems(items);
        const treeMap = api.makeTreeMap(rows, items);
        state.update('_internal.treeMap', treeMap);
        const flatTreeMapById = api.getFlatTreeMapById(treeMap);
        state.update('_internal.flatTreeMapById', flatTreeMapById);
        const flatTreeMap = api.flattenTreeMap(treeMap);
        state.update('_internal.flatTreeMap', flatTreeMap);
        update();
    }
    onDestroy(state.subscribeAll(['config.list.rows;', 'config.chart.items;'], generateTree));
    onDestroy(state.subscribeAll(['config.list.rows.*.parentId', 'config.chart.items.*.rowId'], generateTree, { bulk: true }));
    function prepareExpanded() {
        const configRows = state.get('config.list.rows');
        const rowsWithParentsExpanded = api.getRowsFromIds(api.getRowsWithParentsExpanded(state.get('_internal.flatTreeMap'), state.get('_internal.flatTreeMapById'), configRows), configRows);
        rowsHeight = api.getRowsHeight(rowsWithParentsExpanded);
        state.update('_internal.list.rowsHeight', rowsHeight);
        state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
        update();
    }
    onDestroy(state.subscribeAll(['config.list.rows.*.expanded', '_internal.treeMap;', 'config.list.rows.*.height'], prepareExpanded, { bulk: true }));
    /**
     * Generate visible rows
     */
    function generateVisibleRowsAndItems() {
        const { visibleRows, compensation } = api.getVisibleRowsAndCompensation(state.get('_internal.list.rowsWithParentsExpanded'));
        const smoothScroll = state.get('config.scroll.smooth');
        const currentVisibleRows = state.get('_internal.list.visibleRows');
        let shouldUpdate = true;
        state.update('config.scroll.compensation.y', smoothScroll ? -compensation : 0);
        if (visibleRows.length !== currentVisibleRows.length) {
            shouldUpdate = true;
        }
        else if (visibleRows.length) {
            shouldUpdate = visibleRows.some((row, index) => {
                if (typeof currentVisibleRows[index] === 'undefined') {
                    return true;
                }
                return row.id !== currentVisibleRows[index].id;
            });
        }
        if (shouldUpdate) {
            state.update('_internal.list.visibleRows', visibleRows);
        }
        const visibleItems = [];
        for (const row of visibleRows) {
            for (const item of row._internal.items) {
                visibleItems.push(item);
            }
        }
        state.update('_internal.chart.visibleItems', visibleItems);
        update();
    }
    onDestroy(state.subscribeAll(['_internal.list.rowsWithParentsExpanded;', 'config.scroll.top', 'config.chart.items'], generateVisibleRowsAndItems, { bulk: true }));
    let elementScrollTop = 0;
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
    const generatePeriodDates = (period, internalTime) => {
        const dates = [];
        let leftGlobal = internalTime.leftGlobal;
        const timePerPixel = internalTime.timePerPixel;
        let startOfLeft = api.time
            .date(leftGlobal)
            .startOf(period)
            .valueOf();
        if (startOfLeft < leftGlobal)
            startOfLeft = leftGlobal;
        let sub = leftGlobal - startOfLeft;
        let subPx = sub / timePerPixel;
        let leftPx = 0;
        const diff = Math.ceil(api.time
            .date(internalTime.rightGlobal)
            .endOf(period)
            .diff(api.time.date(leftGlobal).startOf(period), period, true));
        for (let i = 0; i < diff; i++) {
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
                rightPx: 0,
                period
            };
            date.width = (date.rightGlobal - date.leftGlobal + sub) / timePerPixel;
            date.leftPx = leftPx;
            leftPx += date.width;
            date.rightPx = leftPx;
            dates.push(date);
            leftGlobal = date.rightGlobal + 1;
            sub = 0;
            subPx = 0;
        }
        return dates;
    };
    function triggerLoadedEvent() {
        if (state.get('_internal.loadedEventTriggered'))
            return;
        Promise.resolve().then(() => {
            const element = state.get('_internal.elements.main');
            const parent = element.parentNode;
            const event = new Event('gstc-loaded');
            element.dispatchEvent(event);
            parent.dispatchEvent(event);
        });
        state.update('_internal.loadedEventTriggered', true);
    }
    function limitGlobalAndSetCenter(time) {
        if (time.leftGlobal < time.finalFrom)
            time.leftGlobal = time.finalFrom;
        if (time.rightGlobal > time.finalTo)
            time.rightGlobal = time.finalTo;
        time.centerGlobal = time.leftGlobal + Math.round((time.rightGlobal - time.leftGlobal) / 2);
        return time;
    }
    function guessPeriod(time, calendar) {
        if (!time.zoom)
            return time;
        for (const level of calendar.levels) {
            const formatting = level.formats.find(format => +time.zoom <= +format.zoomTo);
            if (formatting && level.main) {
                time.period = formatting.period;
            }
        }
        return time;
    }
    function updateLevels(time, calendar) {
        time.levels = [];
        let index = 0;
        for (const level of calendar.levels) {
            const formatting = level.formats.find(format => +time.zoom <= +format.zoomTo);
            if (level.main) {
                time.format = formatting;
                time.level = index;
            }
            if (formatting) {
                time.levels.push(generatePeriodDates(formatting.period, time));
            }
            index++;
        }
    }
    let working = false;
    function recalculateTimes(reason) {
        if (working)
            return;
        working = true;
        const configTime = state.get('config.chart.time');
        const chartWidth = state.get('_internal.chart.dimensions.width');
        const calendar = state.get('config.chart.calendar');
        const oldTime = Object.assign({}, state.get('_internal.chart.time'));
        let time = api.mergeDeep({}, configTime);
        if ((!time.from || !time.to) && !Object.keys(state.get('config.chart.items')).length) {
            return;
        }
        let mainLevel = calendar.levels.find(level => level.main);
        if (!mainLevel) {
            throw new Error('Main calendar level not found (config.chart.calendar.levels).');
        }
        if (!time.compressMode) {
            if (time.period !== oldTime.period) {
                let periodFormat = mainLevel.formats.find(format => format.period === time.period && format.default);
                if (periodFormat) {
                    time.zoom = periodFormat.zoomTo;
                }
            }
            guessPeriod(time, calendar);
        }
        // If _internal.chart.time (leftGlobal, centerGlobal, rightGlobal, from , to) was changed
        // then we need to apply those values - no recalculation is needed (values form plugins etc)
        const justApply = ['leftGlobal', 'centerGlobal', 'rightGlobal', 'from', 'to'].includes(reason.name);
        if (justApply) {
            time = Object.assign(Object.assign({}, time), { leftGlobal: configTime.leftGlobal, centerGlobal: configTime.centerGlobal, rightGlobal: configTime.rightGlobal, from: configTime.from, to: configTime.to });
        }
        let scrollLeft = 0;
        // source of everything = time.timePerPixel
        if (time.compressMode && chartWidth) {
            time.finalFrom = time.from;
            time.finalTo = time.to;
            time.totalViewDurationMs = api.time.date(time.finalTo).diff(time.finalFrom, 'milliseconds');
            time.timePerPixel = time.totalViewDurationMs / chartWidth;
            time.zoom = Math.log(time.timePerPixel) / Math.log(2);
            guessPeriod(time, calendar);
            time.totalViewDurationPx = Math.round(time.totalViewDurationMs / time.timePerPixel);
            time.leftGlobal = time.from;
            time.rightGlobal = time.to;
        }
        else {
            time.timePerPixel = Math.pow(2, time.zoom);
            time = api.time.recalculateFromTo(time);
            time.totalViewDurationMs = api.time.date(time.finalTo).diff(time.finalFrom, 'milliseconds');
            time.totalViewDurationPx = Math.round(time.totalViewDurationMs / time.timePerPixel);
            scrollLeft = state.get('config.scroll.left');
        }
        if (!justApply && !time.compressMode) {
            // If time.zoom (or time.period) has been changed
            // then we need to recalculate basing on time.centerGlobal
            // and update scroll left
            // if not then we need to calculate from scroll left
            // because change was triggered by scroll
            if (time.zoom !== oldTime.zoom && oldTime.centerGlobal) {
                const chartWidthInMs = chartWidth * time.timePerPixel;
                const halfChartInMs = Math.round(chartWidthInMs / 2);
                time.leftGlobal = oldTime.centerGlobal - halfChartInMs;
                time.rightGlobal = time.leftGlobal + chartWidthInMs;
                scrollLeft = Math.round((time.leftGlobal - time.finalFrom) / time.timePerPixel);
                scrollLeft = api.limitScroll('left', scrollLeft);
            }
            else {
                time.leftGlobal = scrollLeft * time.timePerPixel + time.finalFrom;
                time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
            }
        }
        limitGlobalAndSetCenter(time);
        time.leftInner = time.leftGlobal - time.finalFrom;
        time.rightInner = time.rightGlobal - time.finalFrom;
        time.leftPx = time.leftInner / time.timePerPixel;
        time.rightPx = time.rightInner / time.timePerPixel;
        if (calendar.stretch && scrollLeft === 0 && chartWidth > time.totalViewDurationPx) {
            stretch(time, chartWidth);
        }
        updateLevels(time, calendar);
        let xCompensation = 0;
        if (time.levels[time.level] && time.levels[time.level].length !== 0) {
            xCompensation = time.levels[time.level][0].subPx;
        }
        state.update(`_internal.chart.time`, time);
        state.update('config.scroll.compensation.x', xCompensation);
        state.update('config.chart.time', configTime => {
            configTime.zoom = time.zoom;
            configTime.period = time.format.period;
            configTime.leftGlobal = time.leftGlobal;
            configTime.centerGlobal = time.centerGlobal;
            configTime.rightGlobal = time.rightGlobal;
            configTime.from = time.from;
            configTime.to = time.to;
            configTime.finalFrom = time.finalFrom;
            configTime.finalTo = time.finalTo;
            return configTime;
        });
        state.update('config.scroll.left', scrollLeft);
        update().then(() => {
            if (!state.get('_internal.loaded.time')) {
                state.update('_internal.loaded.time', true);
            }
        });
        working = false;
    }
    const recalculationTriggerCache = {
        initialized: false,
        zoom: 0,
        period: '',
        scrollLeft: 0,
        chartWidth: 0,
        leftGlobal: 0,
        centerGlobal: 0,
        rightGlobal: 0,
        from: 0,
        to: 0
    };
    function recalculationIsNeeded() {
        const configTime = state.get('config.chart.time');
        const scrollLeft = state.get('config.scroll.left');
        const chartWidth = state.get('_internal.chart.dimensions.width');
        const cache = Object.assign({}, recalculationTriggerCache);
        recalculationTriggerCache.zoom = configTime.zoom;
        recalculationTriggerCache.period = configTime.period;
        recalculationTriggerCache.leftGlobal = configTime.leftGlobal;
        recalculationTriggerCache.centerGlobal = configTime.centerGlobal;
        recalculationTriggerCache.rightGlobal = configTime.rightGlobal;
        recalculationTriggerCache.from = configTime.from;
        recalculationTriggerCache.to = configTime.to;
        recalculationTriggerCache.scrollLeft = scrollLeft;
        recalculationTriggerCache.chartWidth = chartWidth;
        if (!recalculationTriggerCache.initialized) {
            recalculationTriggerCache.initialized = true;
            return 'all';
        }
        if (configTime.zoom !== cache.zoom)
            return { name: 'zoom', oldValue: cache.zoom, newValue: configTime.zoom };
        if (configTime.period !== cache.period)
            return { name: 'period', oldValue: cache.period, newValue: configTime.period };
        if (configTime.leftGlobal !== cache.leftGlobal)
            return { name: 'leftGlobal', oldValue: cache.leftGlobal, newValue: configTime.leftGlobal };
        if (configTime.centerGlobal !== cache.centerGlobal)
            return { name: 'centerGlobal', oldValue: cache.centerGlobal, newValue: configTime.centerGlobal };
        if (configTime.rightGlobal !== cache.rightGlobal)
            return { name: 'rightGlobal', oldValue: cache.rightGlobal, newValue: configTime.rightGlobal };
        if (configTime.from !== cache.from)
            return { name: 'from', oldValue: cache.from, newValue: configTime.from };
        if (configTime.to !== cache.to)
            return { name: 'to', oldValue: cache.to, newValue: configTime.to };
        if (scrollLeft !== cache.scrollLeft)
            return { name: 'scroll', oldValue: cache.scrollLeft, newValue: scrollLeft };
        if (chartWidth !== cache.chartWidth)
            return { name: 'chartWidth', oldValue: cache.chartWidth, newValue: chartWidth };
        return false;
    }
    onDestroy(state.subscribeAll(['config.chart.time', 'config.chart.calendar.levels', 'config.scroll.left', '_internal.chart.dimensions.width'], () => {
        let reason = recalculationIsNeeded();
        if (reason)
            recalculateTimes(reason);
    }, { bulk: true }));
    // When time.from and time.to is not specified and items are reloaded;
    // check if item is outside current time scope and extend it if needed
    onDestroy(state.subscribe('config.chart.items;', items => {
        const configTime = state.get('config.chart.time');
        if (configTime.from !== 0 && configTime.to !== 0)
            return;
        const internalTime = state.get('_internal.chart.time');
        for (const itemId in items) {
            const item = items[itemId];
            if (item.time.start < internalTime.from || item.time.end > internalTime.to) {
                recalculateTimes('items');
            }
        }
    }));
    if (state.get('config.usageStatistics') === true &&
        location.port === '' &&
        location.host !== '' &&
        !location.host.startsWith('localhost') &&
        !location.host.startsWith('127.') &&
        !location.host.startsWith('192.') &&
        !location.host.endsWith('.test') &&
        !location.host.endsWith('.local')) {
        try {
            const oReq = new XMLHttpRequest();
            oReq.open('POST', 'https://gstc-us.neuronet.io/');
            oReq.send(JSON.stringify({ location: { href: location.href, host: location.host } }));
        }
        catch (e) { }
    }
    let scrollTop = 0;
    let propagate = true;
    onDestroy(state.subscribe('config.scroll.propagate', prpgt => (propagate = prpgt)));
    /**
     * Handle scroll Event
     * @param {MouseEvent} event
     */
    function handleEvent(event) {
        if (!propagate) {
            event.stopPropagation();
            event.preventDefault();
        }
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
    }
    const onScroll = {
        handleEvent,
        passive: false,
        capture: false
    };
    const dimensions = { width: 0, height: 0 };
    let ro;
    /**
     * Resize action
     * @param {Element} element
     */
    class ResizeAction {
        constructor(element) {
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
        }
        update() { }
        destroy(element) {
            ro.unobserve(element);
        }
    }
    if (!componentActions.includes(ResizeAction)) {
        componentActions.push(ResizeAction);
    }
    onDestroy(() => {
        ro.disconnect();
    });
    /**
     * Bind scroll element
     * @param {HTMLElement} element
     */
    function bindScrollElement(element) {
        if (!verticalScrollBarElement) {
            verticalScrollBarElement = element;
            state.update('_internal.elements.vertical-scroll', element);
        }
    }
    onDestroy(state.subscribeAll(['_internal.loaded', '_internal.chart.time.totalViewDurationPx'], () => {
        if (state.get('_internal.loadedEventTriggered'))
            return;
        const loaded = state.get('_internal.loaded');
        if (loaded.main && loaded.chart && loaded.time && loaded['horizontal-scroll-inner']) {
            const scroll = state.get('_internal.elements.horizontal-scroll-inner');
            const width = state.get('_internal.chart.time.totalViewDurationPx');
            if (scroll && scroll.clientWidth === Math.round(width)) {
                setTimeout(triggerLoadedEvent, 0);
            }
        }
    }));
    function LoadedEventAction() {
        state.update('_internal.loaded.main', true);
    }
    if (!componentActions.includes(LoadedEventAction))
        componentActions.push(LoadedEventAction);
    /**
     * Bind scroll inner element
     * @param {Element} element
     */
    function bindScrollInnerElement(element) {
        if (!state.get('_internal.elements.vertical-scroll-inner'))
            state.update('_internal.elements.vertical-scroll-inner', element);
        if (!state.get('_internal.loaded.vertical-scroll-inner'))
            state.update('_internal.loaded.vertical-scroll-inner', true);
    }
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    const mainActions = Actions.create(componentActions, actionProps);
    const verticalScrollActions = Actions.create([bindScrollElement]);
    const verticalScrollAreaActions = Actions.create([bindScrollInnerElement]);
    return templateProps => wrapper(html `
        <div
          data-info-url="https://github.com/neuronetio/gantt-schedule-timeline-calendar"
          class=${className}
          style=${styleMap}
          @scroll=${onScroll}
          @wheel=${onScroll}
          data-actions=${mainActions}
        >
          ${List.html()}${Chart.html()}
          <div
            class=${classNameVerticalScroll}
            style=${verticalScrollStyleMap}
            @scroll=${onScroll}
            @wheel=${onScroll}
            data-actions=${verticalScrollActions}
          >
            <div style=${verticalScrollAreaStyleMap} data-actions=${verticalScrollAreaActions} />
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function List(vido, props = {}) {
    const { api, state, onDestroy, Actions, update, reuseComponents, html, schedule, StyleMap, cache } = vido;
    const componentName = 'list';
    const componentActions = api.getActions(componentName);
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.List', value => (wrapper = value)));
    let ListColumnComponent;
    const listColumnUnsub = state.subscribe('config.components.ListColumn', value => (ListColumnComponent = value));
    function renderExpanderIcons() {
        const icons = state.get('config.list.expander.icons');
        const rendered = {};
        for (const iconName in icons) {
            const html = icons[iconName];
            rendered[iconName] = api.getSVGIconSrc(html);
        }
        state.update('_internal.list.expander.icons', rendered);
    }
    renderExpanderIcons();
    function renderToggleIcons() {
        const toggleIconsSrc = {
            open: '',
            close: ''
        };
        const icons = state.get('config.list.toggle.icons');
        for (const iconName in icons) {
            const html = icons[iconName];
            toggleIconsSrc[iconName] = api.getSVGIconSrc(html);
        }
        state.update('_internal.list.toggle.icons', toggleIconsSrc);
    }
    renderToggleIcons();
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
        const destroy = reuseComponents(listColumns, Object.values(data), column => ({ columnId: column.id }), ListColumnComponent);
        update();
        return destroy;
    }
    onDestroy(state.subscribe('config.list.columns.data;', onListColumnsDataChange));
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
    onDestroy(() => {
        listColumns.forEach(listColumn => listColumn.destroy());
        listColumnUnsub();
    });
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
        }
    }
    class ListAction {
        constructor(element, data) {
            data.state.update('_internal.elements.list', element);
            getWidth(element);
        }
        update(element) {
            return getWidth(element);
        }
    }
    componentActions.push(ListAction);
    const actions = Actions.create(componentActions, Object.assign(Object.assign({}, props), { api, state }));
    return templateProps => wrapper(cache(list.columns.percent > 0
        ? html `
              <div class=${className} data-actions=${actions} style=${styleMap} @scroll=${onScroll} @wheel=${onScroll}>
                ${listColumns.map(c => c.html())}
              </div>
            `
        : ''), { vido, props: {}, templateProps });
}

/**
 * ListColumn component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 */
class BindElementAction {
    constructor(element, data) {
        let shouldUpdate = false;
        let elements = data.state.get('_internal.elements.list-columns');
        if (typeof elements === 'undefined') {
            elements = [];
            shouldUpdate = true;
        }
        if (!elements.includes(element)) {
            elements.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.list-columns', elements);
    }
    destroy(element, data) {
        data.state.update('_internal.elements.list-columns', elements => {
            return elements.filter(el => el !== element);
        });
    }
}
function ListColumn(vido, props) {
    const { api, state, onDestroy, onChange, Actions, update, createComponent, reuseComponents, html, StyleMap } = vido;
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumn', value => (wrapper = value)));
    const componentsSub = [];
    let ListColumnRowComponent;
    componentsSub.push(state.subscribe('config.components.ListColumnRow', value => (ListColumnRowComponent = value)));
    let ListColumnHeaderComponent;
    componentsSub.push(state.subscribe('config.components.ListColumnHeader', value => (ListColumnHeaderComponent = value)));
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    const componentName = 'list-column';
    const rowsComponentName = componentName + '-rows';
    const componentActions = api.getActions(componentName);
    const rowsActions = api.getActions(rowsComponentName);
    let className, classNameContainer, calculatedWidth;
    const widthStyleMap = new StyleMap({ width: '', '--width': '' });
    const containerStyleMap = new StyleMap({ width: '', height: '' });
    const scrollCompensationStyleMap = new StyleMap({ width: '', height: '' });
    let column, columnPath = `config.list.columns.data.${props.columnId}`;
    let columnSub = state.subscribe(columnPath, function columnChanged(val) {
        column = val;
        update();
    });
    let width;
    function calculateStyle() {
        const list = state.get('config.list');
        const compensationY = state.get('config.scroll.compensation.y');
        calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
        width = calculatedWidth;
        const height = state.get('_internal.height');
        widthStyleMap.style.width = width + 'px';
        widthStyleMap.style['--width'] = width + 'px';
        containerStyleMap.style.height = height + 'px';
        scrollCompensationStyleMap.style.height = height + Math.abs(compensationY) + 'px';
        scrollCompensationStyleMap.style.transform = `translate(0px, ${compensationY}px)`;
    }
    let styleSub = state.subscribeAll([
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        '_internal.chart.dimensions.width',
        '_internal.height',
        'config.scroll.compensation.y',
        '_internal.list.width'
    ], calculateStyle, { bulk: true });
    const ListColumnHeader = createComponent(ListColumnHeaderComponent, { columnId: props.columnId });
    onDestroy(ListColumnHeader.destroy);
    onChange(changedProps => {
        props = changedProps;
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        if (columnSub)
            columnSub();
        ListColumnHeader.change({ columnId: props.columnId });
        columnPath = `config.list.columns.data.${props.columnId}`;
        columnSub = state.subscribe(columnPath, function columnChanged(val) {
            column = val;
            update();
        });
        if (styleSub)
            styleSub();
        styleSub = state.subscribeAll([
            'config.list.columns.percent',
            'config.list.columns.resizer.width',
            `config.list.columns.data.${column.id}.width`,
            '_internal.chart.dimensions.width',
            '_internal.height',
            'config.scroll.compensation.y',
            '_internal.list.width'
        ], calculateStyle, { bulk: true });
        ListColumnHeader.change(props);
    });
    onDestroy(() => {
        columnSub();
        styleSub();
    });
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName);
        classNameContainer = api.getClass(rowsComponentName);
        update();
    }));
    const visibleRows = [];
    const visibleRowsChange = val => {
        const destroy = reuseComponents(visibleRows, val || [], row => row && { columnId: props.columnId, rowId: row.id, width }, ListColumnRowComponent);
        update();
        return destroy;
    };
    onDestroy(state.subscribe('_internal.list.visibleRows;', visibleRowsChange));
    onDestroy(() => {
        visibleRows.forEach(row => row.destroy());
        componentsSub.forEach(unsub => unsub());
    });
    function getRowHtml(row) {
        return row.html();
    }
    componentActions.push(BindElementAction);
    const headerActions = Actions.create(componentActions, { column, state: state, api: api });
    const rowActions = Actions.create(rowsActions, { api, state });
    return templateProps => wrapper(html `
        <div class=${className} data-actions=${headerActions} style=${widthStyleMap}>
          ${ListColumnHeader.html()}
          <div class=${classNameContainer} style=${containerStyleMap} data-actions=${rowActions}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ListColumnHeader(vido, props) {
    const { api, state, onDestroy, onChange, Actions, update, createComponent, html, cache, StyleMap } = vido;
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumnHeader', value => (wrapper = value)));
    const componentName = 'list-column-header';
    const componentActions = api.getActions(componentName);
    const componentsSubs = [];
    let ListColumnHeaderResizerComponent;
    componentsSubs.push(state.subscribe('config.components.ListColumnHeaderResizer', value => (ListColumnHeaderResizerComponent = value)));
    const ListColumnHeaderResizer = createComponent(ListColumnHeaderResizerComponent, { columnId: props.columnId });
    let ListColumnRowExpanderComponent;
    componentsSubs.push(state.subscribe('config.components.ListColumnRowExpander', value => (ListColumnRowExpanderComponent = value)));
    const ListColumnRowExpander = createComponent(ListColumnRowExpanderComponent, {});
    onDestroy(() => {
        ListColumnHeaderResizer.destroy();
        ListColumnRowExpander.destroy();
        componentsSubs.forEach(unsub => unsub());
    });
    let column;
    let columnSub = state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
        column = val;
        update();
    });
    onDestroy(columnSub);
    onChange(changedProps => {
        props = changedProps;
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        if (columnSub)
            columnSub();
        columnSub = state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
            column = val;
            update();
        });
    });
    let className, contentClass;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        contentClass = api.getClass(componentName + '-content');
    }));
    const styleMap = new StyleMap({
        height: '',
        '--height': '',
        '--paddings-count': ''
    });
    onDestroy(state.subscribe('config.headerHeight', () => {
        const value = state.get('config');
        styleMap.style['height'] = value.headerHeight + 'px';
        styleMap.style['--height'] = value.headerHeight + 'px';
        styleMap.style['--paddings-count'] = '1';
        update();
    }));
    function withExpander() {
        return html `
      <div class=${contentClass}>
        ${ListColumnRowExpander.html()}${ListColumnHeaderResizer.html(column)}
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
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions}>
          ${cache(column.expander ? withExpander() : withoutExpander())}
        </div>
      `, { vido, props, templateProps });
}

/**
 * ListColumnHeaderResizer component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ListColumnHeaderResizer(vido, props) {
    const { api, state, onDestroy, update, html, schedule, Actions, PointerAction, cache, StyleMap } = vido;
    const componentName = 'list-column-header-resizer';
    const componentActions = api.getActions(componentName);
    const componentDotsActions = api.getActions(componentName + '-dots');
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumnHeaderResizer', value => (wrapper = value)));
    let column;
    onDestroy(state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
        column = val;
        update();
    }));
    let className, containerClass, dotsClass, dotClass, calculatedWidth;
    const dotsStyleMap = new StyleMap({ width: '' });
    let inRealTime = false;
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName, { column });
        containerClass = api.getClass(componentName + '-container', { column });
        dotsClass = api.getClass(componentName + '-dots', { column });
        dotClass = api.getClass(componentName + '-dots-dot', { column });
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
    /*
    let isMoving = false;
    const lineStyleMap = new StyleMap({
      '--display': 'none',
      '--left': left + 'px'
    });*/
    let left = calculatedWidth;
    const columnWidthPath = `config.list.columns.data.${column.id}.width`;
    const actionProps = {
        column,
        api,
        state,
        pointerOptions: {
            axis: 'x',
            onMove: function onMove({ movementX }) {
                let minWidth = state.get('config.list.columns.minWidth');
                if (typeof column.minWidth === 'number') {
                    minWidth = column.minWidth;
                }
                left += movementX;
                if (left < minWidth) {
                    left = minWidth;
                }
                if (inRealTime) {
                    state.update(columnWidthPath, left);
                }
            }
        }
    };
    componentActions.push(PointerAction);
    const actions = Actions.create(componentActions, actionProps);
    const dotsActions = Actions.create(componentDotsActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions}>
          <div class=${containerClass}>
            ${cache(column.header.html
        ? html `
                    ${column.header.html}
                  `
        : column.header.content)}
          </div>
          <div class=${dotsClass} style=${dotsStyleMap} data-actions=${dotsActions}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 */
class BindElementAction$1 {
    constructor(element, data) {
        let elements = data.state.get('_internal.elements.list-column-rows');
        let shouldUpdate = false;
        if (typeof elements === 'undefined') {
            shouldUpdate = true;
            elements = [];
        }
        if (!elements.includes(element)) {
            elements.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.list-column-rows', elements);
    }
    destroy(element, data) {
        data.state.update('_internal.elements.list-column-rows', elements => {
            return elements.filter(el => el !== element);
        });
    }
}
function ListColumnRow(vido, props) {
    const { api, state, onDestroy, Detach, Actions, update, html, createComponent, onChange, StyleMap, unsafeHTML, PointerAction } = vido;
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let shouldDetach = false;
    const detach = new Detach(() => shouldDetach);
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));
    let ListColumnRowExpanderComponent;
    onDestroy(state.subscribe('config.components.ListColumnRowExpander', value => (ListColumnRowExpanderComponent = value)));
    let rowPath = `_internal.flatTreeMapById.${props.rowId}`, row = state.get(rowPath);
    let colPath = `config.list.columns.data.${props.columnId}`, column = state.get(colPath);
    const styleMap = new StyleMap(column.expander
        ? {
            height: '',
            top: '',
            '--height': '',
            '--expander-padding-width': '',
            '--expander-size': ''
        }
        : {
            height: '',
            top: '',
            '--height': ''
        }, true);
    let rowSub, colSub;
    const ListColumnRowExpander = createComponent(ListColumnRowExpanderComponent, { row });
    const onPropsChange = (changedProps, options) => {
        if (options.leave || changedProps.rowId === undefined || changedProps.columnId === undefined) {
            shouldDetach = true;
            if (rowSub)
                rowSub();
            if (colSub)
                colSub();
            update();
            return;
        }
        shouldDetach = false;
        props = changedProps;
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        const rowId = props.rowId;
        const columnId = props.columnId;
        if (rowSub)
            rowSub();
        if (colSub)
            colSub();
        rowPath = `_internal.flatTreeMapById.${rowId}`;
        colPath = `config.list.columns.data.${columnId}`;
        rowSub = state.subscribeAll([rowPath, colPath, 'config.list.expander'], bulk => {
            column = state.get(colPath);
            row = state.get(rowPath);
            if (column === undefined || row === undefined) {
                shouldDetach = true;
                update();
                return;
            }
            if (column === undefined || row === undefined)
                return;
            const expander = state.get('config.list.expander');
            // @ts-ignore
            styleMap.setStyle({}); // we must reset style because of user specified styling
            styleMap.style['height'] = row.height + 'px';
            styleMap.style['--height'] = row.height + 'px';
            if (column.expander) {
                styleMap.style['--expander-padding-width'] = expander.padding * (row._internal.parents.length + 1) + 'px';
            }
            for (const parentId of row._internal.parents) {
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
        }, { bulk: true });
        if (ListColumnRowExpander) {
            ListColumnRowExpander.change({ row });
        }
        colSub = state.subscribe(colPath, val => {
            column = val;
            update();
        });
    };
    onChange(onPropsChange);
    onDestroy(() => {
        if (ListColumnRowExpander)
            ListColumnRowExpander.destroy();
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
        if (row === undefined)
            return null;
        if (typeof column.data === 'function')
            return unsafeHTML(column.data(row));
        return unsafeHTML(row[column.data]);
    }
    function getText() {
        if (row === undefined)
            return null;
        if (typeof column.data === 'function')
            return column.data(row);
        return row[column.data];
    }
    if (!componentActions.includes(BindElementAction$1))
        componentActions.push(BindElementAction$1);
    actionProps.pointerOptions = {
        axis: 'x|y',
        onMove({ event, movementX, movementY }) {
            event.stopPropagation();
            event.preventDefault();
            if (movementX) {
                state.update('config.list.columns.percent', percent => {
                    percent += movementX * state.get('config.scroll.xMultiplier');
                    if (percent < 0)
                        percent = 0;
                    if (percent > 100)
                        percent = 100;
                    return percent;
                });
            }
            else if (movementY) {
                state.update('config.scroll.top', top => {
                    top -= movementY * state.get('config.scroll.yMultiplier');
                    top = api.limitScroll('top', top);
                    return top;
                });
            }
        }
    };
    componentActions.push(PointerAction);
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div detach=${detach} class=${className} style=${styleMap} data-actions=${actions}>
          ${column.expander ? ListColumnRowExpander.html() : null}
          <div class=${className + '-content'}>
            ${column.isHTML ? getHtml() : getText()}
          </div>
        </div>
      `, { vido, props, templateProps });
}

/**
 * ListColumnRowExpander component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ListColumnRowExpander(vido, props) {
    const { api, state, onDestroy, Actions, update, html, createComponent, onChange } = vido;
    const componentName = 'list-column-row-expander';
    const componentActions = api.getActions(componentName);
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let className;
    let ListColumnRowExpanderToggleComponent;
    const toggleUnsub = state.subscribe('config.components.ListColumnRowExpanderToggle', value => (ListColumnRowExpanderToggleComponent = value));
    const ListColumnRowExpanderToggle = createComponent(ListColumnRowExpanderToggleComponent, props.row ? { row: props.row } : {});
    onDestroy(() => {
        ListColumnRowExpanderToggle.destroy();
        toggleUnsub();
    });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumnRowExpander', value => (wrapper = value)));
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName);
        update();
    }));
    if (props.row) {
        function onPropsChange(changedProps) {
            props = changedProps;
            for (const prop in props) {
                actionProps[prop] = props[prop];
            }
            ListColumnRowExpanderToggle.change(props);
        }
        onChange(onPropsChange);
    }
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} data-action=${actions}>
          ${ListColumnRowExpanderToggle.html()}
        </div>
      `, { vido, props, templateProps });
}

/**
 * ListColumnRowExpanderToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ListColumnRowExpanderToggle(vido, props) {
    const { api, state, onDestroy, Actions, update, html, onChange, cache } = vido;
    const componentName = 'list-column-row-expander-toggle';
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListColumnRowExpanderToggle', value => (wrapper = value)));
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
            var _a, _b;
            props = changedProps;
            for (const prop in props) {
                actionProps[prop] = props[prop];
            }
            if (expandedSub)
                expandedSub();
            if ((_b = (_a = props) === null || _a === void 0 ? void 0 : _a.row) === null || _b === void 0 ? void 0 : _b.id)
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
    const getIcon = () => {
        var _a, _b, _c;
        if (iconChild) {
            if (((_c = (_b = (_a = props.row) === null || _a === void 0 ? void 0 : _a._internal) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                return html `
          <img width="16" height="16" class=${classNameChild} src=${iconChild} />
        `;
            }
            return expanded
                ? html `
            <img width="16" height="16" class=${classNameOpen} src=${iconOpen} />
          `
                : html `
            <img width="16" height="16" class=${classNameClosed} src=${iconClosed} />
          `;
        }
        return '';
    };
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} data-action=${actions} @click=${toggle}>
          ${cache(getIcon())}
        </div>
      `, { vido, props, templateProps });
}

/**
 * ListToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ListToggle(vido, props = {}) {
    const { html, onDestroy, api, state, update } = vido;
    const componentName = 'list-toggle';
    let className;
    onDestroy(state.subscribe('config.classNames', classNames => {
        className = api.getClass(componentName);
    }));
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ListToggle', ListToggleWrapper => (wrapper = ListToggleWrapper)));
    let toggleIconsSrc = {
        open: '',
        close: ''
    };
    onDestroy(state.subscribe('_internal.list.toggle.icons', value => {
        if (value) {
            toggleIconsSrc = value;
            update();
        }
    }));
    let open = true;
    onDestroy(state.subscribe('config.list.columns.percent', percent => (percent === 0 ? (open = false) : (open = true))));
    function toggle(ev) {
        state.update('config.list.columns.percent', percent => {
            return percent === 0 ? 100 : 0;
        });
    }
    return templateProps => wrapper(html `
        <div class=${className} @click=${toggle}><img src=${open ? toggleIconsSrc.close : toggleIconsSrc.open} /></div>
      `, { props, vido, templateProps });
}

/**
 * Chart component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function Chart(vido, props = {}) {
    const { api, state, onDestroy, Actions, update, html, StyleMap, createComponent } = vido;
    const componentName = 'chart';
    const ChartCalendarComponent = state.get('config.components.ChartCalendar');
    const ChartTimelineComponent = state.get('config.components.ChartTimeline');
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.Chart', value => (wrapper = value)));
    const Calendar = createComponent(ChartCalendarComponent);
    onDestroy(Calendar.destroy);
    const Timeline = createComponent(ChartTimelineComponent);
    onDestroy(Timeline.destroy);
    let className, classNameScroll, classNameScrollInner, scrollElement;
    const scrollStyleMap = new StyleMap({}), scrollInnerStyleMap = new StyleMap({}), componentActions = api.getActions(componentName);
    onDestroy(state.subscribe('config.classNames', value => {
        className = api.getClass(componentName);
        classNameScroll = api.getClass('horizontal-scroll');
        classNameScrollInner = api.getClass('horizontal-scroll-inner');
        update();
    }));
    onDestroy(state.subscribeAll(['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'], function horizontalScroll(value, eventInfo) {
        scrollStyleMap.style.width = state.get('_internal.chart.dimensions.width') + 'px';
        scrollInnerStyleMap.style.width = state.get('_internal.chart.time.totalViewDurationPx') + 'px';
        scrollInnerStyleMap.style.height = '1px';
        update();
    }));
    onDestroy(state.subscribe('config.scroll.left', left => {
        if (scrollElement) {
            scrollElement.scrollLeft = left;
        }
        update();
    }));
    function onScrollHandler(event) {
        if (event.type === 'scroll') {
            // @ts-ignore
            const left = event.target.scrollLeft;
            state.update('config.scroll.left', left);
        }
    }
    const onScroll = {
        handleEvent: onScrollHandler,
        passive: true,
        capture: false
    };
    function onWheelHandler(event) {
        if (event.type === 'wheel') {
            const wheel = api.normalizeMouseWheelEvent(event);
            const xMultiplier = state.get('config.scroll.xMultiplier');
            const yMultiplier = state.get('config.scroll.yMultiplier');
            if (event.shiftKey && wheel.y) {
                const currentScrollLeft = state.get('config.scroll.left');
                const newScrollLeft = api.limitScroll('left', currentScrollLeft + wheel.y * xMultiplier);
                state.update('config.scroll.left', newScrollLeft); // will trigger scrollbar to move which will trigger scroll event
            }
            else if (event.ctrlKey && wheel.y) {
                event.preventDefault();
                state.update('config.chart.time.zoom', currentZoom => {
                    if (wheel.y < 0) {
                        return currentZoom - 1;
                    }
                    return currentZoom + 1;
                });
            }
            else if (wheel.x) {
                const currentScrollLeft = state.get('config.scroll.left');
                state.update('config.scroll.left', currentScrollLeft + wheel.x * xMultiplier);
            }
            else {
                state.update('config.scroll.top', top => {
                    return api.limitScroll('top', (top += wheel.y * yMultiplier));
                });
            }
        }
    }
    const onWheel = {
        handleEvent: onWheelHandler,
        passive: false,
        capture: false
    };
    function bindElement(element) {
        if (!scrollElement) {
            scrollElement = element;
            state.update('_internal.elements.horizontal-scroll', element);
        }
    }
    function bindInnerScroll(element) {
        const old = state.get('_internal.elements.horizontal-scroll-inner');
        if (old !== element)
            state.update('_internal.elements.horizontal-scroll-inner', element);
        if (!state.get('_internal.loaded.horizontal-scroll-inner'))
            state.update('_internal.loaded.horizontal-scroll-inner', true);
    }
    let chartWidth = 0;
    let ro;
    componentActions.push(function bindElement(element) {
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
            state.update('_internal.loaded.chart', true);
        }
    });
    onDestroy(() => {
        ro.disconnect();
    });
    const actions = Actions.create(componentActions, { api, state });
    const scrollActions = Actions.create([bindElement]);
    const scrollAreaActions = Actions.create([bindInnerScroll]);
    return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions} @wheel=${onWheel} @scroll=${onScroll}>
          ${Calendar.html()}${Timeline.html()}
          <div class=${classNameScroll} style=${scrollStyleMap} data-actions=${scrollActions} @scroll=${onScroll}>
            <div class=${classNameScrollInner} style=${scrollInnerStyleMap} data-actions=${scrollAreaActions} />
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ChartCalendar(vido, props) {
    const { api, state, onDestroy, Actions, update, reuseComponents, html, StyleMap } = vido;
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
    let headerHeight;
    const styleMap = new StyleMap({ height: '', '--headerHeight': '', 'margin-left': '' });
    onDestroy(state.subscribe('config.headerHeight', value => {
        headerHeight = value;
        styleMap.style['height'] = headerHeight + 'px';
        styleMap.style['--calendar-height'] = headerHeight + 'px';
        update();
    }));
    onDestroy(state.subscribe('config.scroll.compensation.x', compensation => {
        styleMap.style['margin-left'] = -compensation + 'px';
        update();
    }));
    const components = [[], []];
    onDestroy(state.subscribe(`_internal.chart.time.levels`, levels => {
        let level = 0;
        for (const dates of levels) {
            if (!dates.length)
                continue;
            let currentDateFormat = 'YYYY-MM-DD HH'; // hour
            switch (dates[0].period) {
                case 'day':
                    currentDateFormat = 'YYYY-MM-DD';
                    break;
                case 'week':
                    currentDateFormat = 'YYYY-MM-ww';
                    break;
                case 'month':
                    currentDateFormat = 'YYYY-MM';
                    break;
                case 'year':
                    currentDateFormat = 'YYYY';
                    break;
            }
            const currentDate = api.time.date().format(currentDateFormat);
            reuseComponents(components[level], dates, date => date && { level, date, currentDate, currentDateFormat }, ChartCalendarDateComponent);
            level++;
        }
        update();
    }));
    onDestroy(() => {
        components.forEach(level => level.forEach(component => component.destroy()));
    });
    componentActions.push(element => {
        state.update('_internal.elements.chart-calendar', element);
    });
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions} style=${styleMap}>
          ${components.map((components, level) => html `
              <div class=${className + '-dates ' + className + `-dates--level-${level}`}>
                ${components.map(m => m.html())}
              </div>
            `)}
        </div>
      `, { props, vido, templateProps });
}

class Action$1 {
    constructor() {
        this.isAction = true;
    }
}
Action$1.prototype.isAction = true;

/**
 * ChartCalendarDay component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Save element
 * @param {HTMLElement} element
 * @param {object} data
 */
class BindElementAction$2 extends Action$1 {
    constructor(element, data) {
        super();
        data.state.update('_internal.elements.chart-calendar-dates', elements => {
            if (typeof elements === 'undefined') {
                elements = [];
            }
            if (!elements.includes(element)) {
                elements.push(element);
            }
            return elements;
        });
    }
}
function ChartCalendarDay(vido, props) {
    const { api, state, onDestroy, Actions, update, onChange, html, StyleMap, Detach } = vido;
    const componentName = 'chart-calendar-date';
    const componentActions = api.getActions(componentName);
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartCalendarDate', value => (wrapper = value)));
    let className;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, props);
    }));
    let current = '';
    let time, htmlFormatted;
    const styleMap = new StyleMap({ width: '', visibility: 'visible' }), scrollStyleMap = new StyleMap({
        overflow: 'hidden',
        'text-align': 'left'
    });
    let formatClassName = '';
    function updateDate() {
        if (!props)
            return;
        const cache = state.get('_internal.cache.calendar');
        const level = state.get(`config.chart.calendar.levels.${props.level}`);
        styleMap.style.width = props.date.width + 'px';
        styleMap.style.visibility = 'visible';
        scrollStyleMap.style = { overflow: 'hidden', 'text-align': 'left', 'margin-left': props.date.subPx + 8 + 'px' };
        time = state.get('_internal.chart.time');
        const cacheKey = `${new Date(props.date.leftGlobal).toISOString()}-${props.date.period}-${props.level}-${time.zoom}`;
        if (!cache[cacheKey]) {
            cache[cacheKey] = {};
        }
        let timeStart, timeEnd;
        {
            timeStart = api.time.date(props.date.leftGlobal);
            timeEnd = api.time.date(props.date.rightGlobal);
            cache[cacheKey].timeStart = timeStart;
            cache[cacheKey].timeEnd = timeEnd;
        }
        const formats = level.formats;
        const formatting = formats.find(formatting => +time.zoom <= +formatting.zoomTo);
        let format;
        {
            format = formatting ? formatting.format({ timeStart, timeEnd, className, vido, props }) : null;
            cache[cacheKey].format = format;
        }
        {
            if (timeStart.format(props.currentDateFormat) === props.currentDate) {
                current = ' gstc-current';
            }
            else if (timeStart.subtract(1, props.date.period).format(props.currentDateFormat) === props.currentDate) {
                current = ' gstc-next';
            }
            else if (timeStart.add(1, props.date.period).format(props.currentDateFormat) === props.currentDate) {
                current = ' gstc-previous';
            }
            else {
                current = '';
            }
            cache[cacheKey].current = current;
        }
        let finalClassName = className + '-content ' + className + `-content--${props.date.period}` + current;
        if (formatting.className) {
            finalClassName += ' ' + formatting.className;
            formatClassName = ' ' + formatting.className;
        }
        else {
            formatClassName = '';
        }
        // updating cache state is not necessary because it is object and nobody listen to cache
        htmlFormatted = html `
      <div class=${finalClassName}>
        ${format}
      </div>
    `;
        update();
    }
    let shouldDetach = false;
    const detach = new Detach(() => shouldDetach);
    let timeSub;
    const actionProps = { date: props.date, period: props.period, api, state };
    onChange((changedProps, options) => {
        if (options.leave) {
            shouldDetach = true;
            return update();
        }
        shouldDetach = false;
        props = changedProps;
        actionProps.date = props.date;
        actionProps.period = props.period;
        if (timeSub) {
            timeSub();
        }
        timeSub = state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.levels'], updateDate, {
            bulk: true
        });
    });
    onDestroy(() => {
        timeSub();
    });
    if (!componentActions.includes(BindElementAction$2))
        componentActions.push(BindElementAction$2);
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div
          detach=${detach}
          class=${className +
        ' ' +
        className +
        `--${props.date.period}` +
        ' ' +
        className +
        `--level-${props.level}` +
        current +
        formatClassName}
          style=${styleMap}
          data-actions=${actions}
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ChartTimeline(vido, props) {
    const { api, state, onDestroy, Action, Actions, update, html, createComponent, StyleMap } = vido;
    const componentName = 'chart-timeline';
    const componentActions = api.getActions(componentName);
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartTimeline', value => (wrapper = value)));
    const GridComponent = state.get('config.components.ChartTimelineGrid');
    const ItemsComponent = state.get('config.components.ChartTimelineItems');
    const ListToggleComponent = state.get('config.components.ListToggle');
    const Grid = createComponent(GridComponent);
    onDestroy(Grid.destroy);
    const Items = createComponent(ItemsComponent);
    onDestroy(Items.destroy);
    const ListToggle = createComponent(ListToggleComponent);
    onDestroy(ListToggle.destroy);
    let className, classNameInner;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        classNameInner = api.getClass(componentName + '-inner');
        update();
    }));
    let showToggle;
    onDestroy(state.subscribe('config.list.toggle.display', val => (showToggle = val)));
    const styleMap = new StyleMap({}), innerStyleMap = new StyleMap({});
    function calculateStyle() {
        const xCompensation = api.getCompensationX();
        const yCompensation = api.getCompensationY();
        const width = state.get('_internal.chart.dimensions.width');
        const height = state.get('_internal.list.rowsHeight');
        styleMap.style.height = state.get('_internal.height') + 'px';
        styleMap.style['--height'] = styleMap.style.height;
        styleMap.style['--negative-compensation-x'] = xCompensation + 'px';
        styleMap.style['--compensation-x'] = Math.round(Math.abs(xCompensation)) + 'px';
        styleMap.style['--negative-compensation-y'] = yCompensation + 'px';
        styleMap.style['--compensation-y'] = Math.abs(yCompensation) + 'px';
        if (width) {
            styleMap.style.width = width + 'px';
            styleMap.style['--width'] = width + 'px';
        }
        else {
            styleMap.style.width = '0px';
            styleMap.style['--width'] = '0px';
        }
        innerStyleMap.style.height = height + 'px';
        if (width) {
            innerStyleMap.style.width = width + xCompensation + 'px';
        }
        else {
            innerStyleMap.style.width = '0px';
        }
        //innerStyleMap.style.transform = `translate(-${xCompensation}px, ${yCompensation}px)`;
        innerStyleMap.style['margin-left'] = -xCompensation + 'px';
        update();
    }
    onDestroy(state.subscribeAll([
        '_internal.height',
        '_internal.chart.dimensions.width',
        '_internal.list.rowsHeight',
        'config.scroll.compensation',
        '_internal.chart.time.dates.day'
    ], calculateStyle));
    componentActions.push(class BindElementAction extends Action {
        constructor(element) {
            super();
            const old = state.get('_internal.elements.chart-timeline');
            if (old !== element)
                state.update('_internal.elements.chart-timeline', element);
        }
    });
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions} @wheel=${api.onScroll}>
          <div class=${classNameInner} style=${innerStyleMap}>
            ${Grid.html()}${Items.html()}${showToggle ? ListToggle.html() : ''}
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 */
class BindElementAction$3 {
    constructor(element, data) {
        const old = data.state.get('_internal.elements.chart-timeline-grid');
        if (old !== element)
            data.state.update('_internal.elements.chart-timeline-grid', element);
    }
    destroy(element, data) {
        data.state.update('_internal.elements', elements => {
            delete elements['chart-timeline-grid'];
            return elements;
        });
    }
}
function ChartTimelineGrid(vido, props) {
    const { api, state, onDestroy, Actions, update, html, reuseComponents, StyleMap } = vido;
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
    let onBlockCreate;
    onDestroy(state.subscribe('config.chart.grid.block.onCreate', onCreate => (onBlockCreate = onCreate)));
    const rowsComponents = [];
    const rowsWithBlocks = [];
    const formatCache = new Map();
    const styleMap = new StyleMap({});
    /**
     * Generate blocks
     */
    function generateBlocks() {
        const width = state.get('_internal.chart.dimensions.width');
        const height = state.get('_internal.height');
        const time = state.get('_internal.chart.time');
        const periodDates = state.get(`_internal.chart.time.levels.${time.level}`);
        if (!periodDates || periodDates.length === 0) {
            state.update('_internal.chart.grid.rowsWithBlocks', []);
            return;
        }
        const visibleRows = state.get('_internal.list.visibleRows');
        const xCompensation = api.getCompensationX();
        const yCompensation = api.getCompensationY();
        styleMap.style.height = height + Math.abs(yCompensation) + 'px';
        styleMap.style.width = width + xCompensation + 'px';
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
                    format = api.time.date(time.leftGlobal).format('YYYY-MM-DD HH:mm');
                    formatCache.set(time.leftGlobal, format);
                }
                const id = row.id + ':' + format;
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
    }
    onDestroy(state.subscribeAll([
        '_internal.list.visibleRows;',
        `_internal.chart.time.levels`,
        '_internal.height',
        '_internal.chart.dimensions.width'
    ], generateBlocks, {
        bulk: true
    }));
    /**
     * Generate rows components
     * @param {array} rowsWithBlocks
     */
    function generateRowsComponents(rowsWithBlocks) {
        reuseComponents(rowsComponents, rowsWithBlocks || [], row => row, GridRowComponent);
        update();
    }
    onDestroy(state.subscribe('_internal.chart.grid.rowsWithBlocks', generateRowsComponents));
    onDestroy(() => {
        rowsComponents.forEach(row => row.destroy());
    });
    componentActions.push(BindElementAction$3);
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => wrapper(html `
        <div class=${className} data-actions=${actions} style=${styleMap}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 */
class BindElementAction$4 {
    constructor(element, data) {
        let shouldUpdate = false;
        let rows = data.state.get('_internal.elements.chart-timeline-grid-rows');
        if (typeof rows === 'undefined') {
            rows = [];
            shouldUpdate = true;
        }
        if (!rows.includes(element)) {
            rows.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.chart-timeline-grid-rows', rows, { only: null });
    }
    destroy(element, data) {
        data.state.update('_internal.elements.chart-timeline-grid-rows', rows => {
            return rows.filter(el => el !== element);
        });
    }
}
function ChartTimelineGridRow(vido, props) {
    const { api, state, onDestroy, Detach, Actions, update, html, reuseComponents, onChange, StyleMap } = vido;
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
    let className;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
    }));
    const styleMap = new StyleMap({
        width: props.width + 'px',
        height: props.row.height + 'px',
        overflow: 'hidden'
    }, true);
    let shouldDetach = false;
    const detach = new Detach(() => shouldDetach);
    const rowsBlocksComponents = [];
    onChange(function onPropsChange(changedProps, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (options.leave || changedProps.row === undefined) {
            shouldDetach = true;
            reuseComponents(rowsBlocksComponents, [], block => block, GridBlockComponent);
            update();
            return;
        }
        shouldDetach = false;
        props = changedProps;
        reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
        styleMap.setStyle({});
        styleMap.style.height = props.row.height + 'px';
        styleMap.style.width = props.width + 'px';
        const rows = state.get('config.list.rows');
        for (const parentId of props.row._internal.parents) {
            const parent = rows[parentId];
            const childrenStyle = (_d = (_c = (_b = (_a = parent) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.grid) === null || _c === void 0 ? void 0 : _c.row) === null || _d === void 0 ? void 0 : _d.children;
            if (childrenStyle)
                for (const name in childrenStyle) {
                    styleMap.style[name] = childrenStyle[name];
                }
        }
        const currentStyle = (_j = (_h = (_g = (_f = (_e = props) === null || _e === void 0 ? void 0 : _e.row) === null || _f === void 0 ? void 0 : _f.style) === null || _g === void 0 ? void 0 : _g.grid) === null || _h === void 0 ? void 0 : _h.row) === null || _j === void 0 ? void 0 : _j.current;
        if (currentStyle)
            for (const name in currentStyle) {
                styleMap.style[name] = currentStyle[name];
            }
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        update();
    });
    onDestroy(function destroy() {
        rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
    });
    if (componentActions.indexOf(BindElementAction$4) === -1) {
        componentActions.push(BindElementAction$4);
    }
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => {
        return wrapper(html `
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 * @returns {object} with update and destroy
 */
class BindElementAction$5 {
    constructor(element, data) {
        let shouldUpdate = false;
        let blocks = data.state.get('_internal.elements.chart-timeline-grid-row-blocks');
        if (typeof blocks === 'undefined') {
            blocks = [];
            shouldUpdate = true;
        }
        if (!blocks.includes(element)) {
            blocks.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.chart-timeline-grid-row-blocks', blocks, { only: null });
    }
    destroy(element, data) {
        data.state.update('_internal.elements.chart-timeline-grid-row-blocks', blocks => {
            return blocks.filter(el => el !== element);
        }, { only: [''] });
    }
}
const ChartTimelineGridRowBlock = (vido, props) => {
    const { api, state, onDestroy, Detach, Actions, update, html, onChange, StyleMap } = vido;
    const componentName = 'chart-timeline-grid-row-block';
    const actionProps = Object.assign(Object.assign({}, props), { api,
        state });
    let shouldDetach = false;
    const detach = new Detach(() => shouldDetach);
    const componentActions = api.getActions(componentName);
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartTimelineGridRowBlock', value => {
        wrapper = value;
        update();
    }));
    let className;
    function updateClassName(time) {
        const currentTime = api.time
            .date()
            .startOf(time.period)
            .valueOf();
        className = api.getClass(componentName);
        if (time.leftGlobal === currentTime) {
            className += ' current';
        }
    }
    updateClassName(props.time);
    const styleMap = new StyleMap({ width: '', height: '' });
    /**
     * On props change
     * @param {any} changedProps
     */
    function onPropsChange(changedProps, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (options.leave || changedProps.row === undefined) {
            shouldDetach = true;
            return update();
        }
        shouldDetach = false;
        props = changedProps;
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        updateClassName(props.time);
        styleMap.setStyle({});
        styleMap.style.width = (((_b = (_a = props) === null || _a === void 0 ? void 0 : _a.time) === null || _b === void 0 ? void 0 : _b.width) || 0) + 'px';
        styleMap.style.height = (((_d = (_c = props) === null || _c === void 0 ? void 0 : _c.row) === null || _d === void 0 ? void 0 : _d.height) || 0) + 'px';
        const rows = state.get('config.list.rows');
        for (const parentId of props.row._internal.parents) {
            const parent = rows[parentId];
            const childrenStyle = (_h = (_g = (_f = (_e = parent) === null || _e === void 0 ? void 0 : _e.style) === null || _f === void 0 ? void 0 : _f.grid) === null || _g === void 0 ? void 0 : _g.block) === null || _h === void 0 ? void 0 : _h.children;
            if (childrenStyle)
                styleMap.setStyle(Object.assign(Object.assign({}, styleMap.style), childrenStyle));
        }
        const currentStyle = (_o = (_m = (_l = (_k = (_j = props) === null || _j === void 0 ? void 0 : _j.row) === null || _k === void 0 ? void 0 : _k.style) === null || _l === void 0 ? void 0 : _l.grid) === null || _m === void 0 ? void 0 : _m.block) === null || _o === void 0 ? void 0 : _o.current;
        if (currentStyle)
            styleMap.setStyle(Object.assign(Object.assign({}, styleMap.style), currentStyle));
        update();
    }
    onChange(onPropsChange);
    componentActions.push(BindElementAction$5);
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => {
        return wrapper(html `
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}></div>
      `, { props, vido, templateProps });
    };
};

/**
 * ChartTimelineItems component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ChartTimelineItems(vido, props = {}) {
    const { api, state, onDestroy, Actions, update, html, reuseComponents, StyleMap } = vido;
    const componentName = 'chart-timeline-items';
    const componentActions = api.getActions(componentName);
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartTimelineItems', value => (wrapper = value)));
    let ItemsRowComponent;
    onDestroy(state.subscribe('config.components.ChartTimelineItemsRow', value => (ItemsRowComponent = value)));
    let className;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName);
        update();
    }));
    const styleMap = new StyleMap({}, true);
    function calculateStyle() {
        const width = state.get('_internal.chart.dimensions.width');
        const height = state.get('_internal.height');
        const yCompensation = api.getCompensationY();
        const xCompensation = api.getCompensationX();
        styleMap.style.width = width + xCompensation + 'px';
        styleMap.style.height = height + Math.abs(yCompensation) + 'px';
    }
    onDestroy(state.subscribeAll([
        '_internal.height',
        '_internal.chart.dimensions.width',
        'config.scroll.compensation',
        '_internal.chart.time.dates.day'
    ], calculateStyle));
    const rowsComponents = [];
    function createRowComponents() {
        const visibleRows = state.get('_internal.list.visibleRows');
        reuseComponents(rowsComponents, visibleRows || [], row => ({ row }), ItemsRowComponent);
        update();
    }
    onDestroy(state.subscribeAll(['_internal.list.visibleRows;', 'config.chart.items'], createRowComponents));
    onDestroy(() => {
        rowsComponents.forEach(row => row.destroy());
    });
    const actions = Actions.create(componentActions, { api, state });
    return templateProps => wrapper(html `
        <div class=${className} style=${styleMap} data-actions=${actions}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 */
class BindElementAction$6 {
    constructor(element, data) {
        let shouldUpdate = false;
        let rows = data.state.get('_internal.elements.chart-timeline-items-rows');
        if (typeof rows === 'undefined') {
            rows = [];
            shouldUpdate = true;
        }
        if (!rows.includes(element)) {
            rows.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.chart-timeline-items-rows', rows, { only: null });
    }
    destroy(element, data) {
        data.state.update('_internal.elements.chart-timeline-items-rows', rows => {
            return rows.filter(el => el !== element);
        });
    }
}
const ChartTimelineItemsRow = (vido, props) => {
    const { api, state, onDestroy, Detach, Actions, update, html, onChange, reuseComponents, StyleMap } = vido;
    const actionProps = Object.assign(Object.assign({}, props), { api, state });
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));
    let ItemComponent;
    onDestroy(state.subscribe('config.components.ChartTimelineItemsRowItem', value => (ItemComponent = value)));
    let itemsPath = `_internal.flatTreeMapById.${props.row.id}._internal.items`;
    let rowSub, itemsSub;
    const itemComponents = [], styleMap = new StyleMap({ width: '', height: '' }, true);
    let shouldDetach = false;
    const detach = new Detach(() => shouldDetach);
    const updateDom = () => {
        const chart = state.get('_internal.chart');
        shouldDetach = false;
        const xCompensation = api.getCompensationX();
        styleMap.style.width = chart.dimensions.width + xCompensation + 'px';
        if (!props) {
            shouldDetach = true;
            return;
        }
        styleMap.style.height = props.row.height + 'px';
        styleMap.style['--row-height'] = props.row.height + 'px';
    };
    function updateRow(row) {
        itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;
        if (typeof rowSub === 'function') {
            rowSub();
        }
        if (typeof itemsSub === 'function') {
            itemsSub();
        }
        rowSub = state.subscribe('_internal.chart', value => {
            if (value === undefined) {
                shouldDetach = true;
                return update();
            }
            updateDom();
            update();
        });
        itemsSub = state.subscribe(itemsPath, value => {
            if (value === undefined) {
                shouldDetach = true;
                reuseComponents(itemComponents, [], item => ({ row, item }), ItemComponent);
                return update();
            }
            reuseComponents(itemComponents, value, item => ({ row, item }), ItemComponent);
            updateDom();
            update();
        });
    }
    /**
     * On props change
     * @param {any} changedProps
     */
    onChange((changedProps, options) => {
        if (options.leave || changedProps.row === undefined) {
            shouldDetach = true;
            return update();
        }
        props = changedProps;
        for (const prop in props) {
            actionProps[prop] = props[prop];
        }
        updateRow(props.row);
    });
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
    componentActions.push(BindElementAction$6);
    const actions = Actions.create(componentActions, actionProps);
    return templateProps => {
        return wrapper(html `
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
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
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
/**
 * Bind element action
 */
class BindElementAction$7 {
    constructor(element, data) {
        let shouldUpdate = false;
        let items = data.state.get('_internal.elements.chart-timeline-items-row-items');
        if (typeof items === 'undefined') {
            items = [];
            shouldUpdate = true;
        }
        if (!items.includes(element)) {
            items.push(element);
            shouldUpdate = true;
        }
        if (shouldUpdate)
            data.state.update('_internal.elements.chart-timeline-items-row-items', items, { only: null });
    }
    destroy(element, data) {
        data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
            return items.filter(el => el !== element);
        });
    }
}
function ChartTimelineItemsRowItem(vido, props) {
    const { api, state, onDestroy, Detach, Actions, update, html, onChange, unsafeHTML, StyleMap } = vido;
    let wrapper;
    onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
    let itemLeftPx = 0, itemWidthPx = 0, leave = false, cutLeft = false, cutRight = false;
    const styleMap = new StyleMap({ width: '', height: '', left: '' }), leftCutStyleMap = new StyleMap({ 'margin-left': '0px' }), rightCutStyleMap = new StyleMap({ 'margin-right': '0px' }), actionProps = {
        item: props.item,
        row: props.row,
        left: itemLeftPx,
        width: itemWidthPx,
        api,
        state
    };
    let shouldDetach = false;
    function updateItem() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (leave)
            return;
        const time = state.get('_internal.chart.time');
        itemLeftPx = api.time.globalTimeToViewPixelOffset(props.item.time.start);
        itemLeftPx = Math.round(itemLeftPx * 10) * 0.1;
        itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
        itemWidthPx -= state.get('config.chart.spacing') || 0;
        if (itemWidthPx) {
            itemWidthPx = Math.round(itemWidthPx * 10) * 0.1;
        }
        if (props.item.time.start < time.leftGlobal) {
            leftCutStyleMap.style['margin-left'] = (time.leftGlobal - props.item.time.start) / time.timePerPixel + 'px';
            cutLeft = true;
        }
        else {
            leftCutStyleMap.style['margin-left'] = '0px';
            cutLeft = false;
        }
        if (props.item.time.end > time.rightGlobal) {
            rightCutStyleMap.style['margin-right'] = (props.item.time.end - time.rightGlobal) / time.timePerPixel + 'px';
            cutRight = true;
        }
        else {
            cutRight = false;
            rightCutStyleMap.style['margin-right'] = '0px';
        }
        const oldWidth = styleMap.style.width;
        const oldLeft = styleMap.style.left;
        const xCompensation = api.getCompensationX();
        styleMap.setStyle({});
        const inViewPort = api.isItemInViewport(props.item, time.leftGlobal, time.rightGlobal);
        shouldDetach = !inViewPort;
        if (inViewPort) {
            // update style only when visible to prevent browser's recalculate style
            styleMap.style.width = itemWidthPx + 'px';
            styleMap.style.left = itemLeftPx + xCompensation + 'px';
        }
        else {
            styleMap.style.width = oldWidth;
            styleMap.style.left = oldLeft;
        }
        const rows = state.get('config.list.rows');
        for (const parentId of props.row._internal.parents) {
            const parent = rows[parentId];
            const childrenStyle = (_d = (_c = (_b = (_a = parent) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.children;
            if (childrenStyle)
                styleMap.setStyle(Object.assign(Object.assign({}, styleMap.style), childrenStyle));
        }
        const currentRowItemsStyle = (_j = (_h = (_g = (_f = (_e = props) === null || _e === void 0 ? void 0 : _e.row) === null || _f === void 0 ? void 0 : _f.style) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h.item) === null || _j === void 0 ? void 0 : _j.current;
        if (currentRowItemsStyle)
            styleMap.setStyle(Object.assign(Object.assign({}, styleMap.style), currentRowItemsStyle));
        const currentStyle = (_l = (_k = props) === null || _k === void 0 ? void 0 : _k.item) === null || _l === void 0 ? void 0 : _l.style;
        if (currentStyle)
            styleMap.setStyle(Object.assign(Object.assign({}, styleMap.style), currentStyle));
        actionProps.left = itemLeftPx + xCompensation;
        actionProps.width = itemWidthPx;
        update();
    }
    const componentName = 'chart-timeline-items-row-item';
    const cutterName = api.getClass(componentName) + '-cut';
    const cutterLeft = html `
    <div class=${cutterName} style=${leftCutStyleMap}>
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 18 16" width="16">
        <path fill-opacity="0.5" fill="#ffffff" d="m5,3l-5,5l5,5l0,-10z" />
      </svg>
    </div>
  `;
    const cutterRight = html `
    <div class=${cutterName} style=${rightCutStyleMap}>
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 4 16" width="16">
        <path transform="rotate(-180 2.5,8) " fill-opacity="0.5" fill="#ffffff" d="m5,3l-5,5l5,5l0,-10z" />
      </svg>
    </div>
  `;
    function onPropsChange(changedProps, options) {
        if (options.leave || changedProps.row === undefined || changedProps.item === undefined) {
            leave = true;
            shouldDetach = true;
            return update();
        }
        else {
            shouldDetach = false;
            leave = false;
        }
        props = changedProps;
        actionProps.item = props.item;
        actionProps.row = props.row;
        updateItem();
    }
    onChange(onPropsChange);
    const componentActions = api.getActions(componentName);
    let className, labelClassName;
    onDestroy(state.subscribe('config.classNames', () => {
        className = api.getClass(componentName, props);
        labelClassName = api.getClass(componentName + '-label', props);
        update();
    }));
    onDestroy(state.subscribeAll(['_internal.chart.time', 'config.scroll.compensation.x'], updateItem));
    componentActions.push(BindElementAction$7);
    const actions = Actions.create(componentActions, actionProps);
    const detach = new Detach(() => shouldDetach);
    return templateProps => {
        return wrapper(html `
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
          ${cutLeft ? cutterLeft : ''}
          <div class=${labelClassName}>
            ${props.item.isHtml ? unsafeHTML(props.item.label) : props.item.label}
          </div>
          ${cutRight ? cutterRight : ''}
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
 * @license   AGPL-3.0
 */
const actionNames = [
    'main',
    'list',
    'list-column',
    'list-column-header',
    'list-column-header-resizer',
    'list-column-header-resizer-dots',
    'list-column-row',
    'list-column-row-expander',
    'list-column-row-expander-toggle',
    'list-toggle',
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
function generateEmptySlots() {
    const slots = {};
    actionNames.forEach(name => {
        slots[name] = { before: [], after: [] };
    });
    return slots;
}
// default configuration
function defaultConfig() {
    const actions = generateEmptyActions();
    const slots = generateEmptySlots();
    return {
        plugins: [],
        plugin: {},
        height: 822,
        headerHeight: 72,
        components: {
            Main,
            List,
            ListColumn,
            ListColumnHeader,
            ListColumnHeaderResizer,
            ListColumnRow,
            ListColumnRowExpander,
            ListColumnRowExpanderToggle,
            ListToggle,
            Chart,
            ChartCalendar,
            ChartCalendarDate: ChartCalendarDay,
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
            ListColumnRowExpander(input) {
                return input;
            },
            ListColumnRowExpanderToggle(input) {
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
            },
            toggle: {
                display: true,
                icons: {
                    open: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path stroke="null" d="m16.406954,16.012672l4.00393,-4.012673l-4.00393,-4.012673l1.232651,-1.232651l5.245324,5.245324l-5.245324,5.245324l-1.232651,-1.232651z"/><path stroke="null" d="m-0.343497,12.97734zm1.620144,0l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,3.909362l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,-9.773404l0,1.95468l11.341011,0l0,-1.95468l-11.341011,0z"/></svg>`,
                    close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(-180 4.392796516418457,12) " stroke="null" d="m1.153809,16.012672l4.00393,-4.012673l-4.00393,-4.012673l1.232651,-1.232651l5.245324,5.245324l-5.245324,5.245324l-1.232651,-1.232651z"/><path stroke="null" d="m9.773297,12.97734zm1.620144,0l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,3.909362l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,-9.773404l0,1.95468l11.341011,0l0,-1.95468l-11.341011,0z"/></svg>`
                }
            }
        },
        scroll: {
            propagate: true,
            smooth: false,
            top: 0,
            left: 0,
            xMultiplier: 3,
            yMultiplier: 3,
            percent: {
                top: 0,
                left: 0
            },
            compensation: {
                x: 0,
                y: 0
            }
        },
        chart: {
            time: {
                period: 'day',
                from: 0,
                to: 0,
                finalFrom: 0,
                finalTo: 0,
                zoom: 21,
                leftGlobal: 0,
                centerGlobal: 0,
                rightGlobal: 0,
                levels: [],
                compressMode: false
            },
            calendar: {
                expand: true,
                levels: [
                    {
                        formats: [
                            {
                                zoomTo: 17,
                                period: 'day',
                                className: 'gstc-date-medium gstc-date-left',
                                format({ timeStart }) {
                                    return timeStart.format('DD MMMM YYYY (dddd)');
                                }
                            },
                            {
                                zoomTo: 23,
                                period: 'month',
                                format({ timeStart }) {
                                    return timeStart.format('MMMM YYYY');
                                }
                            },
                            {
                                zoomTo: 24,
                                period: 'month',
                                format({ timeStart, className, vido }) {
                                    return timeStart.format("MMMM 'YY");
                                }
                            },
                            {
                                zoomTo: 25,
                                period: 'month',
                                format({ timeStart }) {
                                    return timeStart.format('MMM YYYY');
                                }
                            },
                            {
                                zoomTo: 27,
                                period: 'year',
                                format({ timeStart }) {
                                    return timeStart.format('YYYY');
                                }
                            },
                            {
                                zoomTo: 100,
                                period: 'year',
                                default: true,
                                format() {
                                    return null;
                                }
                            }
                        ]
                    },
                    {
                        main: true,
                        formats: [
                            {
                                zoomTo: 16,
                                period: 'hour',
                                format({ timeStart }) {
                                    return timeStart.format('HH:mm');
                                }
                            },
                            {
                                zoomTo: 17,
                                period: 'hour',
                                default: true,
                                format({ timeStart }) {
                                    return timeStart.format('HH');
                                }
                            },
                            {
                                zoomTo: 19,
                                period: 'day',
                                className: 'gstc-date-medium',
                                format({ timeStart, className, vido }) {
                                    return vido.html `<span class="${className}-content gstc-date-bold">${timeStart.format('DD')}</span> <span class="${className}-content gstc-date-thin">${timeStart.format('dddd')}</span>`;
                                }
                            },
                            {
                                zoomTo: 20,
                                period: 'day',
                                default: true,
                                format({ timeStart, vido, className }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('DD')}</div><div class="${className}-content gstc-date-small">${timeStart.format('dddd')}</div>`;
                                }
                            },
                            {
                                zoomTo: 21,
                                period: 'day',
                                format({ timeStart, vido, className }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('DD')}</div><div class="${className}-content gstc-date-small">${timeStart.format('ddd')}</div>`;
                                }
                            },
                            {
                                zoomTo: 22,
                                period: 'day',
                                className: 'gstc-date-vertical',
                                format({ timeStart, className, vido }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('DD')}</div><div class="${className}-content gstc-date-extra-small">${timeStart.format('ddd')}</div>`;
                                }
                            },
                            {
                                zoomTo: 23,
                                period: 'week',
                                default: true,
                                format({ timeStart, timeEnd, className, vido }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('DD')} - ${timeEnd.format('DD')}</div><div class="${className}-content gstc-date-small gstc-date-thin">${timeStart.format('ddd')} - ${timeEnd.format('dd')}</div>`;
                                }
                            },
                            {
                                zoomTo: 25,
                                period: 'week',
                                className: 'gstc-date-vertical',
                                format({ timeStart, timeEnd, className, vido }) {
                                    return vido.html `<div class="${className}-content gstc-date-top gstc-date-small gstc-date-normal">${timeStart.format('DD')}</div><div class="gstc-dash gstc-date-small">-</div><div class="${className}-content gstc-date-small gstc-date-normal">${timeEnd.format('DD')}</div>`;
                                }
                            },
                            {
                                zoomTo: 26,
                                period: 'month',
                                default: true,
                                className: 'gstc-date-month-level-1',
                                format({ timeStart, vido, className }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('MMM')}</div><div class="${className}-content gstc-date-small gstc-date-bottom">${timeStart.format('MM')}</div>`;
                                }
                            },
                            {
                                zoomTo: 27,
                                period: 'month',
                                className: 'gstc-date-vertical',
                                format({ timeStart, className, vido }) {
                                    return vido.html `<div class="${className}-content gstc-date-top">${timeStart.format('MM')}</div><div class="${className}-content gstc-date-extra-small">${timeStart.format('MMM')}</div>`;
                                }
                            },
                            {
                                zoomTo: 28,
                                period: 'year',
                                default: true,
                                className: 'gstc-date-big',
                                format({ timeStart }) {
                                    return timeStart.format('YYYY');
                                }
                            },
                            {
                                zoomTo: 29,
                                period: 'year',
                                className: 'gstc-date-medium',
                                format({ timeStart }) {
                                    return timeStart.format('YYYY');
                                }
                            },
                            {
                                zoomTo: 30,
                                period: 'year',
                                className: 'gstc-date-medium',
                                format({ timeStart }) {
                                    return timeStart.format('YY');
                                }
                            },
                            {
                                zoomTo: 100,
                                period: 'year',
                                default: true,
                                format() {
                                    return null;
                                }
                            }
                        ]
                    }
                ]
            },
            grid: {
                block: {
                    onCreate: []
                }
            },
            items: {},
            spacing: 1
        },
        slots,
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
            ordinal: (n) => {
                const s = ['th', 'st', 'nd', 'rd'];
                const v = n % 100;
                return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
            }
        },
        utcMode: false,
        usageStatistics: true
    };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i;}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u,$offset:n.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
});

var utc = createCommonjsModule(function (module, exports) {
!function(t,i){module.exports=i();}(commonjsGlobal,function(){return function(t,i,e){var s=(new Date).getTimezoneOffset(),n=i.prototype;e.utc=function(t,e){return new i({date:t,utc:!0,format:e})},n.utc=function(){return e(this.toDate(),{locale:this.$L,utc:!0})},n.local=function(){return e(this.toDate(),{locale:this.$L,utc:!1})};var u=n.parse;n.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),u.call(this,t);};var o=n.init;n.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else o.call(this);};var f=n.utcOffset;n.utcOffset=function(t){var i=this.$utils().u;if(i(t))return this.$u?0:i(this.$offset)?f.call(this):this.$offset;var e,n=Math.abs(t)<=16?60*t:t;return 0!==t?(e=this.local().add(n+s,"minute")).$offset=n:e=this.utc(),e};var r=n.format;n.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return r.call(this,i)},n.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+s;return this.$d.valueOf()-6e4*t},n.isUTC=function(){return !!this.$u},n.toISOString=function(){return this.toDate().toISOString()},n.toString=function(){return this.toDate().toUTCString()};}});
});

var advancedFormat = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){return function(e,t,r){var n=t.prototype,o=n.format;r.en.ordinal=function(e){var t=["th","st","nd","rd"],r=e%100;return "["+e+(t[(r-20)%10]||t[r]||t[0])+"]"},n.format=function(e){var t=this,r=this.$locale(),n=this.$utils(),a=(e||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|gggg|Do|X|x|k{1,2}|S/g,function(e){switch(e){case"Q":return Math.ceil((t.$M+1)/3);case"Do":return r.ordinal(t.$D);case"gggg":return t.weekYear();case"wo":return r.ordinal(t.week(),"W");case"w":case"ww":return n.s(t.week(),"w"===e?1:2,"0");case"k":case"kk":return n.s(String(0===t.$H?24:t.$H),"k"===e?1:2,"0");case"X":return Math.floor(t.$d.getTime()/1e3);case"x":return t.$d.getTime();default:return e}});return o.bind(this)(a)};}});
});

var weekOfYear = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){var e="year";return function(t,i,n){var r=i.prototype;r.week=function(t){if(void 0===t&&(t=null),null!==t)return this.add(7*(t-this.week()),"day");var i=this.$locale().weekStart||0,r=n(this).endOf(e);if(0===i&&6!==r.day()&&11===this.month()&&31-this.date()<=r.day())return 1;var d=n(this).startOf(e),a=d.subtract(d.day()-i,"day").subtract(1,"millisecond"),o=this.diff(a,"week",!0);return Math.ceil(o)},r.weeks=function(e){return void 0===e&&(e=null),this.week(e)};}});
});

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0
 */
dayjs_min.extend(advancedFormat);
dayjs_min.extend(weekOfYear);
class TimeApi {
    constructor(state) {
        this.utcMode = false;
        this.state = state;
        this.locale = state.get('config.locale');
        this.utcMode = state.get('config.utcMode');
        if (this.utcMode) {
            dayjs_min.extend(utc);
        }
        // @ts-ignore
        dayjs_min.locale(this.locale, null, true);
    }
    date(time) {
        const _dayjs = this.utcMode ? dayjs_min.utc : dayjs_min;
        return time ? _dayjs(time).locale(this.locale.name) : _dayjs().locale(this.locale.name);
    }
    addAdditionalSpace(time) {
        if (time.additionalSpaces && time.additionalSpaces[time.period]) {
            const add = time.additionalSpaces[time.period];
            if (add.before) {
                time.finalFrom = this.date(time.from)
                    .subtract(add.before, add.period)
                    .valueOf();
            }
            if (add.after) {
                time.finalTo = this.date(time.to)
                    .add(add.after, add.period)
                    .valueOf();
            }
        }
        return time;
    }
    recalculateFromTo(time) {
        const period = time.period;
        time = Object.assign({}, time);
        time.from = +time.from;
        time.to = +time.to;
        let from = Number.MAX_SAFE_INTEGER, to = 0;
        const items = this.state.get('config.chart.items');
        if (Object.keys(items).length === 0) {
            return time;
        }
        if (time.from === 0 || time.to === 0) {
            for (const itemId in items) {
                const item = items[itemId];
                if (item.time.start < from && item.time.start) {
                    from = item.time.start;
                }
                if (item.time.end > to) {
                    to = item.time.end;
                }
            }
            if (time.from === 0) {
                time.from = this.date(from)
                    .startOf(period)
                    .valueOf();
            }
            if (time.to === 0) {
                time.to = this.date(to)
                    .endOf(period)
                    .valueOf();
            }
        }
        time.finalFrom = time.from;
        time.finalTo = time.to;
        time = this.addAdditionalSpace(time);
        return time;
    }
    getCenter(time) {
        return time.leftGlobal + (time.rightGlobal - time.leftGlobal) / 2;
    }
    timeToPixelOffset(milliseconds) {
        const timePerPixel = this.state.get('_internal.chart.time.timePerPixel') || 1;
        return milliseconds / timePerPixel;
    }
    globalTimeToViewPixelOffset(milliseconds, withCompensation = false) {
        const time = this.state.get('_internal.chart.time');
        let xCompensation = this.state.get('config.scroll.compensation.x') || 0;
        const viewPixelOffset = (milliseconds - time.leftGlobal) / time.timePerPixel;
        if (withCompensation)
            return viewPixelOffset + xCompensation;
        return viewPixelOffset;
    }
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
        if (copiedPath.length === 0 || typeof obj === "undefined") {
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
        if (!obj) {
            obj = {};
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
const defaultOptions$1 = {
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
class DeepState {
    constructor(data = {}, options = defaultOptions$1) {
        this.listeners = new Map();
        this.waitingListeners = new Map();
        this.data = data;
        this.options = Object.assign(Object.assign({}, defaultOptions$1), options);
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
        this.listeners = new Map();
    }
    match(first, second) {
        if (first === second)
            return true;
        if (first === this.options.wildcard || second === this.options.wildcard)
            return true;
        return this.scan.match(first, second);
    }
    getIndicesOf(searchStr, str) {
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
    }
    getIndicesCount(searchStr, str) {
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
    }
    cutPath(longer, shorter) {
        longer = this.cleanNotRecursivePath(longer);
        shorter = this.cleanNotRecursivePath(shorter);
        const shorterPartsLen = this.getIndicesCount(this.options.delimeter, shorter);
        const longerParts = this.getIndicesOf(this.options.delimeter, longer);
        return longer.substr(0, longerParts[shorterPartsLen]);
    }
    trimPath(path) {
        path = this.cleanNotRecursivePath(path);
        if (path.charAt(0) === this.options.delimeter) {
            return path.substr(1);
        }
        return path;
    }
    split(path) {
        return path === "" ? [] : path.split(this.options.delimeter);
    }
    isWildcard(path) {
        return path.includes(this.options.wildcard);
    }
    isNotRecursive(path) {
        return path.endsWith(this.options.notRecursive);
    }
    cleanNotRecursivePath(path) {
        return this.isNotRecursive(path)
            ? path.substring(0, path.length - 1)
            : path;
    }
    hasParams(path) {
        return path.includes(this.options.param);
    }
    getParamsInfo(path) {
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
    waitForAll(userPaths, fn) {
        const paths = {};
        for (let path of userPaths) {
            paths[path] = { dirty: false };
            if (this.hasParams(path)) {
                paths[path].paramsInfo = this.getParamsInfo(path);
            }
            paths[path].isWildcard = this.isWildcard(path);
            paths[path].isRecursive = !this.isNotRecursive(path);
        }
        this.waitingListeners.set(userPaths, { fn, paths });
        fn(paths);
        return function unsubscribe() {
            this.waitingListeners.delete(userPaths);
        };
    }
    executeWaitingListeners(updatePath) {
        for (const waitingListener of this.waitingListeners.values()) {
            const { fn, paths } = waitingListener;
            let dirty = 0;
            let all = 0;
            for (let path in paths) {
                const pathInfo = paths[path];
                let match = false;
                if (pathInfo.isRecursive)
                    updatePath = this.cutPath(updatePath, path);
                if (pathInfo.isWildcard && this.match(path, updatePath))
                    match = true;
                if (updatePath === path)
                    match = true;
                if (match) {
                    pathInfo.dirty = true;
                }
                if (pathInfo.dirty) {
                    dirty++;
                }
                all++;
            }
            if (dirty === all) {
                fn(paths);
            }
        }
    }
    subscribeAll(userPaths, fn, options = defaultListenerOptions) {
        let unsubscribers = [];
        for (const userPath of userPaths) {
            unsubscribers.push(this.subscribe(userPath, fn, options));
        }
        return function unsubscribe() {
            for (const unsubscribe of unsubscribers) {
                unsubscribe();
            }
        };
    }
    getCleanListenersCollection(values = {}) {
        return Object.assign({ listeners: new Map(), isRecursive: false, isWildcard: false, hasParams: false, match: undefined, paramsInfo: undefined, path: undefined, count: 0 }, values);
    }
    getCleanListener(fn, options = defaultListenerOptions) {
        return {
            fn,
            options: Object.assign(Object.assign({}, defaultListenerOptions), options)
        };
    }
    getListenerCollectionMatch(listenerPath, isRecursive, isWildcard) {
        listenerPath = this.cleanNotRecursivePath(listenerPath);
        const self = this;
        return function listenerCollectionMatch(path) {
            if (isRecursive)
                path = self.cutPath(path, listenerPath);
            if (isWildcard && self.match(listenerPath, path))
                return true;
            return listenerPath === path;
        };
    }
    getListenersCollection(listenerPath, listener) {
        if (this.listeners.has(listenerPath)) {
            let listenersCollection = this.listeners.get(listenerPath);
            listenersCollection.listeners.set(++this.id, listener);
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
    }
    subscribe(listenerPath, fn, options = defaultListenerOptions, type = "subscribe") {
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
        const listenersCollection = listeners.get(path);
        return function unsub() {
            listenersCollection.listeners.delete(id);
            listenersCollection.count--;
            if (listenersCollection.count === 0) {
                listeners.delete(path);
            }
        };
    }
    same(newValue, oldValue) {
        return ((["number", "string", "undefined", "boolean"].includes(typeof newValue) ||
            newValue === null) &&
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
    }
    getSubscribedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
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
    }
    notifySubscribedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
        return this.notifyListeners(this.getSubscribedListeners(updatePath, newValue, options, type, originalPath));
    }
    getNestedListeners(updatePath, newValue, options, type = "update", originalPath = null) {
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
    }
    notifyNestedListeners(updatePath, newValue, options, type = "update", alreadyNotified, originalPath = null) {
        return this.notifyListeners(this.getNestedListeners(updatePath, newValue, options, type, originalPath), alreadyNotified, false);
    }
    getNotifyOnlyListeners(updatePath, newValue, options, type = "update", originalPath = null) {
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
    }
    notifyOnly(updatePath, newValue, options, type = "update", originalPath = "") {
        return (typeof this.notifyListeners(this.getNotifyOnlyListeners(updatePath, newValue, options, type, originalPath))[0] !== "undefined");
    }
    canBeNested(newValue) {
        return typeof newValue === "object" && newValue !== null;
    }
    getUpdateValues(oldValue, split, fn) {
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
        const waitingPaths = [];
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
            waitingPaths.push(path);
        }
        let alreadyNotified = [];
        for (const groupedListeners of groupedListenersPack) {
            alreadyNotified = [
                ...alreadyNotified,
                ...this.notifyListeners(groupedListeners, alreadyNotified)
            ];
        }
        for (const path of waitingPaths) {
            this.executeWaitingListeners(path);
        }
    }
    update(updatePath, fn, options = defaultUpdateOptions) {
        if (this.isWildcard(updatePath)) {
            return this.wildcardUpdate(updatePath, fn, options);
        }
        const split = this.split(updatePath);
        const { oldValue, newValue } = this.getUpdateValues(this.pathGet(split, this.data), split, fn);
        if (options.debug) {
            this.options.log(`Updating ${updatePath} ${options.source ? `from ${options.source}` : ""}`, { oldValue, newValue });
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
            this.executeWaitingListeners(updatePath);
            return newValue;
        }
        const alreadyNotified = this.notifySubscribedListeners(updatePath, newValue, options);
        if (this.canBeNested(newValue)) {
            this.notifyNestedListeners(updatePath, newValue, options, "update", alreadyNotified);
        }
        this.executeWaitingListeners(updatePath);
        return newValue;
    }
    get(userPath = undefined) {
        if (typeof userPath === "undefined" || userPath === "") {
            return this.data;
        }
        return this.pathGet(this.split(userPath), this.data);
    }
    debugSubscribe(listener, listenersCollection, listenerPath) {
        if (listener.options.debug) {
            this.options.log("listener subscribed", {
                listenerPath,
                listener,
                listenersCollection
            });
        }
    }
    debugListener(time, groupedListener) {
        if (groupedListener.eventInfo.options.debug ||
            groupedListener.listener.options.debug) {
            this.options.log("Listener fired", {
                time: Date.now() - time,
                info: groupedListener
            });
        }
    }
    debugTime(groupedListener) {
        return groupedListener.listener.options.debug ||
            groupedListener.eventInfo.options.debug
            ? Date.now()
            : 0;
    }
}

/**
 * Schedule - a throttle function that uses requestAnimationFrame to limit the rate at which a function is called.
 *
 * @param {function} fn
 * @returns {function}
 */
/**
 * Is object - helper function to determine if specified variable is an object
 *
 * @param {any} item
 * @returns {boolean}
 */
function isObject$1(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Merge deep - helper function which will merge objects recursively - creating brand new one - like clone
 *
 * @param {object} target
 * @params {object} sources
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
            }
            else if (Array.isArray(source[key])) {
                target[key] = [];
                for (let item of source[key]) {
                    if (isObject$1(item)) {
                        target[key].push(mergeDeep$1({}, item));
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
    return mergeDeep$1(target, ...sources);
}

/**
 * Api functions
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0
 */
const lib = 'gantt-schedule-timeline-calendar';
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
    return (this.state = new DeepState(state, { delimeter: '.' }));
}
const publicApi = {
    name: lib,
    stateFromConfig,
    mergeDeep: mergeDeep$1,
    date(time) {
        return time ? dayjs_min(time) : dayjs_min();
    },
    setPeriod(period) {
        this.state.update('config.chart.time.period', period);
        return this.state.get('config.chart.time.zoom');
    },
    dayjs: dayjs_min
};
function getInternalApi(state) {
    let $state = state.get();
    let unsubscribes = [];
    const iconsCache = {};
    const api = {
        name: lib,
        debug: false,
        setVido(Vido) {
        },
        log(...args) {
            if (this.debug) {
                console.log.call(console, ...args);
            }
        },
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
            if (!this.allActions.includes(name))
                this.allActions.push(name);
            let actions = state.get('config.actions.' + name);
            if (typeof actions === 'undefined') {
                actions = [];
            }
            return actions.slice();
        },
        isItemInViewport(item, left, right) {
            return ((item.time.start >= left && item.time.start < right) ||
                (item.time.end >= left && item.time.end < right) ||
                (item.time.start <= left && item.time.end >= right));
        },
        prepareItems(items) {
            for (const item of items) {
                item.time.start = +item.time.start;
                item.time.end = +item.time.end;
                item.id = String(item.id);
            }
            return items;
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
                const parentId = row[parentName] !== undefined && row[parentName] !== null ? row[parentName] : '';
                if (parents[parentId] === undefined) {
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
                row._internal.items = itemParents[row.id] !== undefined ? Object.values(itemParents[row.id]) : [];
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
            if (!flatTreeMap ||
                !flatTreeMapById ||
                !rows ||
                flatTreeMap.length === 0 ||
                flatTreeMapById.length === 0 ||
                Object.keys(rows).length === 0) {
                return [];
            }
            const rowsWithParentsExpanded = [];
            next: for (const rowId of flatTreeMap) {
                for (const parentId of flatTreeMapById[rowId]._internal.parents) {
                    const parent = rows[parentId];
                    if (!parent || !parent.expanded) {
                        continue next;
                    }
                }
                rowsWithParentsExpanded.push(rowId);
            }
            return rowsWithParentsExpanded;
        },
        getRowsHeight(rows) {
            let height = 0;
            for (const row of rows) {
                if (row)
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
                if (row === undefined)
                    continue;
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
            const lineHeight = state.get('config.list.rowHeight');
            let scale = 1;
            switch (mode) {
                case 1:
                    if (lineHeight) {
                        scale = lineHeight;
                    }
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
        normalizePointerEvent(event) {
            const result = { x: 0, y: 0, pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 };
            switch (event.type) {
                case 'wheel':
                    const wheel = this.normalizeMouseWheelEvent(event);
                    result.x = wheel.x;
                    result.y = wheel.y;
                    result.pageX = result.x;
                    result.pageY = result.y;
                    result.screenX = result.x;
                    result.screenY = result.y;
                    result.clientX = result.x;
                    result.clientY = result.y;
                    break;
                case 'touchstart':
                case 'touchmove':
                case 'touchend':
                case 'touchcancel':
                    result.x = event.changedTouches[0].screenX;
                    result.y = event.changedTouches[0].screenY;
                    result.pageX = event.changedTouches[0].pageX;
                    result.pageY = event.changedTouches[0].pageY;
                    result.screenX = event.changedTouches[0].screenX;
                    result.screenY = event.changedTouches[0].screenY;
                    result.clientX = event.changedTouches[0].clientX;
                    result.clientY = event.changedTouches[0].clientY;
                    break;
                default:
                    result.x = event.x;
                    result.y = event.y;
                    result.pageX = event.pageX;
                    result.pageY = event.pageY;
                    result.screenX = event.screenX;
                    result.screenY = event.screenY;
                    result.clientX = event.clientX;
                    result.clientY = event.clientY;
                    break;
            }
            return result;
        },
        limitScroll(which, scroll) {
            if (which === 'top') {
                const height = state.get('_internal.list.rowsHeight') - state.get('_internal.height');
                if (scroll < 0) {
                    scroll = 0;
                }
                else if (scroll > height) {
                    scroll = height;
                }
                return Math.round(scroll);
            }
            else {
                const width = state.get('_internal.chart.time.totalViewDurationPx') - state.get('_internal.chart.dimensions.width');
                if (scroll < 0) {
                    scroll = 0;
                }
                else if (scroll > width) {
                    scroll = width;
                }
                return Math.round(scroll);
            }
        },
        time: new TimeApi(state),
        /**
         * Get scrollbar height - compute it from element
         *
         * @returns {number}
         */
        getScrollBarHeight(add = 0) {
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.height = '100px';
            document.body.appendChild(outer);
            const noScroll = outer.offsetHeight;
            outer.style.msOverflowStyle = 'scrollbar';
            outer.style.overflow = 'scroll';
            const inner = document.createElement('div');
            inner.style.height = '100%';
            outer.appendChild(inner);
            const withScroll = inner.offsetHeight;
            outer.parentNode.removeChild(outer);
            return noScroll - withScroll + add;
        },
        scrollToTime(toTime) {
            const time = state.get('_internal.chart.time');
            state.update('config.scroll', scroll => {
                const chartWidth = state.get('_internal.chart.dimensions.width');
                const halfTime = (chartWidth / 2) * time.timePerPixel;
                const leftGlobal = toTime - halfTime - time.finalFrom;
                scroll.left = this.limitScroll('left', Math.round(leftGlobal / time.timePerPixel));
                return scroll;
            });
        },
        recenterScroll() { },
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
            if (!main)
                return [];
        },
        getCompensationX() {
            return state.get('config.scroll.compensation.x') || 0;
        },
        getCompensationY() {
            return state.get('config.scroll.compensation.y') || 0;
        },
        getSVGIconSrc(svg) {
            if (typeof iconsCache[svg] === 'string')
                return iconsCache[svg];
            iconsCache[svg] = 'data:image/svg+xml;base64,' + btoa(svg);
            return iconsCache[svg];
        },
        /**
         * Destroy things to release memory
         */
        destroy() {
            $state = undefined;
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
            unsubscribes = [];
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
 * @license   AGPL-3.0
 */
function GSTC(options) {
    const state = options.state;
    const api = getInternalApi(state);
    const _internal = {
        components: {
            Main
        },
        scrollBarHeight: api.getScrollBarHeight(2),
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
                levels: [],
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
        elements: {},
        cache: {
            calendar: {}
        },
        loaded: {}
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
    api.setVido(vido);
    const app = vido.createApp({ component: Main, props: {}, element: options.element });
    const internalApi = app.vidoInstance.api;
    return { state, app, api: internalApi };
}
GSTC.api = publicApi;

export default GSTC;
//# sourceMappingURL=index.esm.js.map
