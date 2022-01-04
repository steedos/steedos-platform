
export function generateActionRestProp(actionName: string) {
    let rest = {
        path: `/${actionName}`,
        method: ''
    }
    switch (actionName) {
        case 'aggregate':
            rest.method = 'GET';
            break;
        case 'find':
            rest.method = 'GET';
            break;
        case 'findOne':
            rest.method = 'GET';
            break;
        case 'insert':
            rest.method = 'POST';
            break;
        case 'updateOne':
            rest.method = 'PUT';
            break;
        case 'updateMany':
            rest.method = 'PUT';
            break;
        case 'delete':
            rest.method = 'DELETE';
            break;
        case 'directAggregate':
            rest.method = 'GET';
            break;
        case 'directAggregatePrefixalPipeline':
            rest.method = 'GET';
            break;
        case 'directFind':
            rest.method = 'GET';
            break;
        case 'directInsert':
            rest.method = 'POST';
            break;
        case 'directUpdate':
            rest.method = 'PUT';
            break;
        case 'directDelete':
            rest.method = 'DELETE';
            break;
        case 'getField':
            rest.method = 'GET';
            break;
        case 'toConfig':
            rest.method = 'GET';
            break;
        default:
            break;
    }
    return rest;
}