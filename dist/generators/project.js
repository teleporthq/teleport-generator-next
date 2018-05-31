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
Object.defineProperty(exports, "__esModule", { value: true });
var teleport = require("teleport-lib-js");
var package_1 = require("../renderers/package");
var ProjectGenerator = teleport.ProjectGenerator, Generator = teleport.Generator, RenderResult = teleport.RenderResult;
var ReactProjectGenerator = (function (_super) {
    __extends(ReactProjectGenerator, _super);
    function ReactProjectGenerator(generator, componentGenerator) {
        var _this = _super.call(this, generator) || this;
        _this.componentGenerator = componentGenerator;
        return _this;
    }
    ReactProjectGenerator.prototype.generate = function (project, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var name = project.name, components = project.components, pages = project.pages;
        var result = new RenderResult();
        var pkg = package_1.default(project);
        result.addFile('package.json', pkg);
        console.log('after pkg render');
        if (components) {
            Object.keys(components).map(function (componentName) {
                var component = components[componentName];
                var componentResults = _this.componentGenerator.generate(component);
                componentResults.getFileNames().map(function (fileName) {
                    result.addFile("components/" + fileName, componentResults.getContent(fileName));
                });
            });
        }
        if (pages) {
            Object.keys(pages).map(function (pageName) {
                var page = pages[pageName];
                var pageResults = _this.componentGenerator.generate(page);
                pageResults.getFileNames().map(function (fileName) {
                    result.addFile("pages/" + fileName, pageResults.getContent(fileName));
                });
            });
        }
        return result;
    };
    ReactProjectGenerator.prototype.publish = function (path, archive) {
        if (archive === void 0) { archive = false; }
    };
    return ReactProjectGenerator;
}(ProjectGenerator));
exports.default = ReactProjectGenerator;
//# sourceMappingURL=project.js.map