"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var teleport = null;
if (process.env.TELEPORT_ENV === 'development') {
    console.info('teleport-generator-react: LOADING DEV teleport-lib-js');
    teleport = require('../teleport-lib-js');
}
else {
    teleport = require('teleport-lib-js');
}
exports.default = teleport;
//# sourceMappingURL=teleport.js.map