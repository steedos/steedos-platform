"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionHandlers = void 0;
function transformMetadata(ctx) {
    console.log('ctx', ctx);
    return Object.assign(Object.assign({}, ctx.meta), { metadata: ctx.params.data });
}
exports.ActionHandlers = {
    get(ctx) {
        return ctx.broker.cacher.get(ctx.params.key);
    },
    add: (ctx) => {
        ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
        return true;
    },
    delete: (ctx) => {
        ctx.broker.cacher.del(ctx.params.key);
        return true;
    },
};
//# sourceMappingURL=actionsHandler.js.map