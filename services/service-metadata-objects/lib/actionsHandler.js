"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionHandlers = void 0;
function cacherKey(APIName) {
    return `$steedos.#objects.${APIName}`;
}
exports.ActionHandlers = {
    get(ctx) {
        return ctx.broker.call('metadata.get', { key: cacherKey(ctx.params.objectAPIName) });
    },
    add(ctx) {
        return ctx.broker.call('metadata.add', { key: cacherKey(ctx.params.data.name), data: ctx.params.data });
    },
    change(ctx) {
        const { data, oldData } = ctx.params;
        if (oldData.name != data.name) {
            ctx.broker.call('metadata.delete', { key: cacherKey(oldData.name) });
        }
        return ctx.broker.call('metadata.add', { key: cacherKey(data.name), data: data });
    },
    delete: (ctx) => {
        return ctx.broker.call('metadata.delete', { key: cacherKey(ctx.params.objectAPIName) });
    },
    verify: (ctx) => {
        console.log("verify");
        return true;
    }
};
//# sourceMappingURL=actionsHandler.js.map