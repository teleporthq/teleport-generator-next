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
var teleport = require("@teleporthq/teleport-lib-js");
var component_1 = require("./generators/component");
var project_1 = require("./generators/project");
var Target = teleport.Target, Generator = teleport.Generator, FileSet = teleport.FileSet;
var TeleportGeneratorNext = (function (_super) {
    __extends(TeleportGeneratorNext, _super);
    function TeleportGeneratorNext() {
        var _this = _super.call(this, 'next-generator', 'next') || this;
        _this.type = 'generator';
        _this.componentGenerator = new component_1.default(_this);
        _this.projectGenerator = new project_1.default(_this, _this.componentGenerator);
        return _this;
    }
    TeleportGeneratorNext.prototype.generateComponent = function (component, options) {
        return this.componentGenerator.generate(component, options);
    };
    TeleportGeneratorNext.prototype.generateProject = function (component, options) {
        return this.projectGenerator.generate(component, options);
    };
    return TeleportGeneratorNext;
}(Generator));
exports.default = TeleportGeneratorNext;
//# sourceMappingURL=index.js.map