"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPass = void 0;
const randomPass = () => {
    return (Math.random() + 1).toString(36).substring(2);
};
exports.randomPass = randomPass;
//# sourceMappingURL=random.js.map