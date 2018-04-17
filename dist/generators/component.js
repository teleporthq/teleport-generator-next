"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var prettier = require("prettier-standalone");
var teleport_lib_js_1 = require("../../teleport-lib-js");
var jsx_1 = require("../renderers/jsx");
var component_1 = require("../renderers/component");
var prettier_1 = require("../options/prettier");
function findNextIndexedKeyInObject(object, key) {
    if (!object[key])
        return key;
    var i = 1;
    while (object[key + "_" + i] !== undefined) {
        i++;
    }
    return key + "_" + i;
}
var NextComponentGenerator = (function (_super) {
    __extends(NextComponentGenerator, _super);
    function NextComponentGenerator(generator) {
        return _super.call(this, generator) || this;
    }
    NextComponentGenerator.prototype.processStyles = function (componentContent, styles) {
        var _this = this;
        var content = JSON.parse(JSON.stringify(componentContent));
        if (content.style) {
            var className = content.name || findNextIndexedKeyInObject(styles, content.type);
            styles[className] = content.style;
            delete content.style;
            content.className = [className];
        }
        if (content.children && content.children.length > 0) {
            if (typeof content.children !== "string") {
                content.children = content.children.map(function (child) {
                    var childStyledResults = _this.processStyles(child, styles);
                    styles = __assign({}, styles, childStyledResults.styles);
                    return childStyledResults.content;
                });
            }
        }
        return { styles: styles, content: content };
    };
    NextComponentGenerator.prototype.computeDependencies = function (content) {
        var _this = this;
        var dependencies = {};
        var source = content.source, type = content.type, children = content.children, otherProps = __rest(content, ["source", "type", "children"]);
        if (source && type) {
            if (source === 'components') {
                return _a = {},
                    _a["components/" + type] = [type],
                    _a;
            }
            var mapping = this.generator.target.map(source, type);
            if (mapping) {
                if (mapping.library) {
                    if (!dependencies[mapping.library])
                        dependencies[mapping.library] = [];
                    if (dependencies[mapping.library].indexOf(mapping.type) < 0)
                        dependencies[mapping.library].push(mapping.type);
                }
            }
            else {
                console.error("could not map '" + type + "' from '" + source + "' for target '" + this.generator.targetName + "'");
            }
        }
        if (children && children.length > 0 && typeof children !== "string") {
            var childrenDependenciesArray = children.map(function (child) { return _this.computeDependencies(child); });
            if (childrenDependenciesArray.length) {
                childrenDependenciesArray.forEach(function (childrenDependency) {
                    Object.keys(childrenDependency).forEach(function (childrenDependencyLibrary) {
                        if (!dependencies[childrenDependencyLibrary])
                            dependencies[childrenDependencyLibrary] = [];
                        dependencies[childrenDependencyLibrary] = _.union(dependencies[childrenDependencyLibrary], childrenDependency[childrenDependencyLibrary]);
                    });
                });
            }
        }
        return dependencies;
        var _a;
    };
    NextComponentGenerator.prototype.renderComponentJSX = function (content, isRoot, styles) {
        var _this = this;
        if (isRoot === void 0) { isRoot = false; }
        var source = content.source, type = content.type, className = content.className, props = __rest(content, ["source", "type", "className"]);
        var mapping = null;
        var mappedType = type;
        if (source !== 'components') {
            mapping = this.generator.target.map(source, type);
            if (mapping)
                mappedType = mapping.type;
        }
        var children = null;
        if (props.children)
            children = props.children;
        delete props.children;
        var childrenJSX = [];
        if (children && children.length > 0) {
            if (typeof children === "string") {
                if (children.indexOf("$props.") >= 0) {
                    var propKey = children.replace('$props.', '');
                    childrenJSX = "{" + propKey + "}";
                }
                else {
                    childrenJSX = children;
                }
            }
            else {
                childrenJSX = children.map(function (child) { return _this.renderComponentJSX(child); });
            }
        }
        if (Array.isArray(childrenJSX)) {
            childrenJSX = childrenJSX.join('');
        }
        var name = props.name, componentProps = props.props, otherProps = __rest(props, ["name", "props"]);
        var mappedProps = __assign({}, componentProps, otherProps);
        if (mapping && typeof mapping.props === 'function') {
            mappedProps = mapping.props(mappedProps);
        }
        return jsx_1.default(mappedType, childrenJSX, className, isRoot, styles, mappedProps);
    };
    NextComponentGenerator.prototype.generate = function (component, options) {
        if (options === void 0) { options = {}; }
        var name = component.type;
        var content = component.content;
        var dependencies = this.computeDependencies(content);
        var stylingResults = this.processStyles(content, {});
        var styles = stylingResults.styles;
        content = stylingResults.content;
        var css = teleport_lib_js_1.default.transformers.styles.jsstocss.stylesheet(styles).css;
        var jsx = this.renderComponentJSX(content, true, css);
        var props = (component.editableProps ? Object.keys(component.editableProps) : null);
        var result = new teleport_lib_js_1.RenderResult();
        result.addFile(_.upperFirst(component.name) + ".js", prettier.format(component_1.default(name, jsx, dependencies, css, props), prettier_1.default));
        return result;
    };
    return NextComponentGenerator;
}(teleport_lib_js_1.ComponentGenerator));
exports.default = NextComponentGenerator;
//# sourceMappingURL=component.js.map