"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenGaurd = void 0;
const passport_1 = require("@nestjs/passport");
class AuthTokenGaurd extends (0, passport_1.AuthGuard)('jwt') {
}
exports.AuthTokenGaurd = AuthTokenGaurd;
//# sourceMappingURL=auth-token.gaurd.js.map