"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAuthGaurd = void 0;
const passport_1 = require("@nestjs/passport");
class LocalAuthGaurd extends (0, passport_1.AuthGuard)('local') {
}
exports.LocalAuthGaurd = LocalAuthGaurd;
//# sourceMappingURL=auth-local.gaurd.js.map