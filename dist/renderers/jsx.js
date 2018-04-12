"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-line-length
function jsx(name, childrenJSX, classNames, isRoot, styles, props) {
    var classNamesString = '';
    if (classNames) {
        if (classNames.length > 0) {
            classNamesString = "className=\"" + classNames.join(' ') + "\"";
        }
        else {
            classNamesString = "className=\"" + classNames + "\"";
        }
    }
    var propsArray = [];
    if (props) {
        Object.keys(props).map(function (propName) {
            var propValue = props[propName];
            propsArray.push(propName + "={" + JSON.stringify(propValue) + "}");
        });
    }
    var propsString = (propsArray.length ? ' ' + propsArray.join(' ') : '');
    if (isRoot) {
        return "\n      <" + name + " " + classNamesString + " " + propsString + ">\n        " + childrenJSX + "\n        <style jsx>{`\n          " + styles + "\n        `}</style>\n      </" + name + ">";
    }
    if (childrenJSX && childrenJSX.length > 0) {
        return "\n      <" + name + " " + classNamesString + " " + propsString + ">\n        " + childrenJSX + "\n      </" + name + ">\n    ";
    }
    else {
        return "<" + name + " " + classNamesString + " " + propsString + "/>";
    }
}
exports.default = jsx;
//# sourceMappingURL=jsx.js.map