"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var renderDependency = function (libraryName, types) {
    return "import { " + types.join(', ') + " } from '" + libraryName + "'";
};
function component(name, jsx, dependencies, styles, props) {
    if (dependencies === void 0) { dependencies = {}; }
    var dependenciesArray = Object.keys(dependencies).map(function (libraryName) { return renderDependency(libraryName, dependencies[libraryName]); });
    var propsString = '';
    if (props && props.length > 0) {
        propsString = "const { " + props.join(', ') + " } = this.props";
    }
    return "\n    import React, { Component } from 'react'\n    " + dependenciesArray.join("") + "\n\n    export default class " + _.upperFirst(name) + " extends Component {\n      render () {\n        " + propsString + "\n        return (\n          " + jsx + "\n        )\n      }\n    }\n  ";
}
exports.default = component;
//# sourceMappingURL=component.js.map