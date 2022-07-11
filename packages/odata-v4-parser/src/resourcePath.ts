import Utils from "./utils";
import Lexer from "./lexer";
import PrimitiveLiteral from "./primitiveLiteral";
import NameOrIdentifier from "./nameOrIdentifier";
import Expressions from "./expressions";

export namespace ResourcePath {
    export function resourcePath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        if (value[index] === 0x2f) index++;
        let token = ResourcePath.batch(value, index) ||
            ResourcePath.entity(value, index, metadataContext) ||
            ResourcePath.metadata(value, index);
        if (token) return token;

        let resource = NameOrIdentifier.entitySetName(value, index, metadataContext) ||
            ResourcePath.functionImportCall(value, index, metadataContext) ||
            ResourcePath.crossjoin(value, index) ||
            ResourcePath.all(value, index) ||
            ResourcePath.actionImportCall(value, index, metadataContext) ||
            NameOrIdentifier.singletonEntity(value, index);

        if (!resource) return;
        let start = index;
        index = resource.next;
        let navigation: Lexer.Token;

        switch (resource.type) {
            case Lexer.TokenType.EntitySetName:
                navigation = ResourcePath.collectionNavigation(value, resource.next, resource.metadata);
                metadataContext = resource.metadata;
                delete resource.metadata;
                break;
            case Lexer.TokenType.EntityCollectionFunctionImportCall:
                navigation = ResourcePath.collectionNavigation(value, resource.next, resource.value.import.metadata);
                metadataContext = resource.value.import.metadata;
                delete resource.value.import.metadata;
                break;
            case Lexer.TokenType.SingletonEntity:
                navigation = ResourcePath.singleNavigation(value, resource.next, resource.metadata);
                metadataContext = resource.metadata;
                delete resource.metadata;
                break;
            case Lexer.TokenType.EntityFunctionImportCall:
                navigation = ResourcePath.singleNavigation(value, resource.next, resource.value.import.metadata);
                metadataContext = resource.value.import.metadata;
                delete resource.value.import.metadata;
                break;
            case Lexer.TokenType.ComplexCollectionFunctionImportCall:
            case Lexer.TokenType.PrimitiveCollectionFunctionImportCall:
                navigation = ResourcePath.collectionPath(value, resource.next, resource.value.import.metadata);
                metadataContext = resource.value.import.metadata;
                delete resource.value.import.metadata;
                break;
            case Lexer.TokenType.ComplexFunctionImportCall:
                navigation = ResourcePath.complexPath(value, resource.next, resource.value.import.metadata);
                metadataContext = resource.value.import.metadata;
                delete resource.value.import.metadata;
                break;
            case Lexer.TokenType.PrimitiveFunctionImportCall:
                navigation = ResourcePath.singlePath(value, resource.next, resource.value.import.metadata);
                metadataContext = resource.value.import.metadata;
                delete resource.value.import.metadata;
                break;
        }

        if (navigation) index = navigation.next;
        if (value[index] === 0x2f) index++;
        if (resource) return Lexer.tokenize(value, start, index, { resource, navigation }, Lexer.TokenType.ResourcePath, navigation || <any>{ metadata: metadataContext });
    }

    export function batch(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "$batch")) return Lexer.tokenize(value, index, index + 6, "$batch", Lexer.TokenType.Batch);
    }

    export function entity(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        if (Utils.equals(value, index, "$entity")) {
            let start = index;
            index += 7;

            let name;
            if (value[index] === 0x2f) {
                name = NameOrIdentifier.qualifiedEntityTypeName(value, index + 1, metadataContext);
                if (!name) return;
                index = name.next;
            }

            return Lexer.tokenize(value, start, index, name || "$entity", Lexer.TokenType.Entity);
        }
    }

    export function metadata(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "$metadata")) return Lexer.tokenize(value, index, index + 9, "$metadata", Lexer.TokenType.Metadata);
    }

    export function collectionNavigation(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let start = index;
        let name;
        if (value[index] === 0x2f) {
            name = NameOrIdentifier.qualifiedEntityTypeName(value, index + 1, metadataContext);
            if (name) {
                index = name.next;
                metadataContext = name.value.metadata;
                delete name.value.metadata;
            }
        }

        let path = ResourcePath.collectionNavigationPath(value, index, metadataContext);
        if (path) index = path.next;

        if (!name && !path) return;

        return Lexer.tokenize(value, start, index, { name, path }, Lexer.TokenType.CollectionNavigation, path || name);
    }

    export function collectionNavigationPath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let start = index;
        let token = ResourcePath.collectionPath(value, index, metadataContext) ||
            Expressions.refExpr(value, index);
        if (token) return token;

        let predicate = Expressions.keyPredicate(value, index, metadataContext);
        if (predicate) {
            let tokenValue: any = { predicate };
            index = predicate.next;

            let navigation = ResourcePath.singleNavigation(value, index, metadataContext);
            if (navigation) {
                tokenValue = { predicate, navigation };
                index = navigation.next;
            }

            return Lexer.tokenize(value, start, index, tokenValue, Lexer.TokenType.CollectionNavigationPath, navigation || <any>{ metadata: metadataContext });
        }
    }

    export function singleNavigation(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = ResourcePath.boundOperation(value, index, false, metadataContext) ||
            Expressions.refExpr(value, index) ||
            Expressions.valueExpr(value, index);
        if (token) return token;

        let start = index;
        let name;

        if (value[index] === 0x2f) {
            name = NameOrIdentifier.qualifiedEntityTypeName(value, index + 1, metadataContext);
            if (name) {
                index = name.next;
                metadataContext = name.value.metadata;
                delete name.value.metadata;
            }
        }

        if (value[index] === 0x2f) {
            token = ResourcePath.propertyPath(value, index + 1, metadataContext);
            if (token) index = token.next;
        }

        if (!name && !token) return;

        return Lexer.tokenize(value, start, index, { name: name, path: token }, Lexer.TokenType.SingleNavigation, token);
    }

    export function propertyPath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token =
            NameOrIdentifier.entityColNavigationProperty(value, index, metadataContext) ||
            NameOrIdentifier.entityNavigationProperty(value, index, metadataContext) ||
            NameOrIdentifier.complexColProperty(value, index, metadataContext) ||
            NameOrIdentifier.complexProperty(value, index, metadataContext) ||
            NameOrIdentifier.primitiveColProperty(value, index, metadataContext) ||
            NameOrIdentifier.primitiveProperty(value, index, metadataContext) ||
            NameOrIdentifier.streamProperty(value, index, metadataContext);

        if (!token) return;
        let start = index;
        index = token.next;

        let navigation;
        switch (token.type) {
            case Lexer.TokenType.EntityCollectionNavigationProperty:
                navigation = ResourcePath.collectionNavigation(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.EntityNavigationProperty:
                navigation = ResourcePath.singleNavigation(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.ComplexCollectionProperty:
                navigation = ResourcePath.collectionPath(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.ComplexProperty:
                navigation = ResourcePath.complexPath(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.PrimitiveCollectionProperty:
                navigation = ResourcePath.collectionPath(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.PrimitiveKeyProperty:
            case Lexer.TokenType.PrimitiveProperty:
                navigation = ResourcePath.singlePath(value, index, token.metadata);
                delete token.metadata;
                break;
            case Lexer.TokenType.StreamProperty:
                navigation = ResourcePath.boundOperation(value, index, token.metadata);
                delete token.metadata;
                break;
        }

        if (navigation) index = navigation.next;

        return Lexer.tokenize(value, start, index, { path: token, navigation }, Lexer.TokenType.PropertyPath, navigation);
    }

    export function collectionPath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        return Expressions.countExpr(value, index) ||
            ResourcePath.boundOperation(value, index, true, metadataContext);
    }

    export function singlePath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        return Expressions.valueExpr(value, index) ||
            ResourcePath.boundOperation(value, index, false, metadataContext);
    }

    export function complexPath(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let start = index;
        let name, token;
        if (value[index] === 0x2f) {
            name = NameOrIdentifier.qualifiedComplexTypeName(value, index + 1, metadataContext);
            if (name) index = name.next;
        }

        if (value[index] === 0x2f) {
            token = ResourcePath.propertyPath(value, index + 1, metadataContext);
            if (!token) return;
            index = token.next;
        }else token = ResourcePath.boundOperation(value, index, false, metadataContext);

        if (!name && !token) return;

        return Lexer.tokenize(value, start, index, { name: name, path: token }, Lexer.TokenType.ComplexPath, token);
    }

    export function boundOperation(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        if (value[index] !== 0x2f) return;
        let start = index;
        index++;

        let operation = ResourcePath.boundEntityColFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundEntityFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundComplexColFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundComplexFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundPrimitiveColFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundPrimitiveFuncCall(value, index, isCollection, metadataContext) ||
            ResourcePath.boundActionCall(value, index, isCollection, metadataContext);
        if (!operation) return;
        index = operation.next;

        let name, navigation;
        switch (operation.type) {
            case Lexer.TokenType.BoundActionCall:
                break;
            case Lexer.TokenType.BoundEntityCollectionFunctionCall:
                navigation = ResourcePath.collectionNavigation(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
            case Lexer.TokenType.BoundEntityFunctionCall:
                navigation = ResourcePath.singleNavigation(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
            case Lexer.TokenType.BoundComplexCollectionFunctionCall:
                if (value[index] === 0x2f) {
                    name = NameOrIdentifier.qualifiedComplexTypeName(value, index + 1, operation.value.call.metadata);
                    if (name) index = name.next;
                }
                navigation = ResourcePath.collectionPath(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
            case Lexer.TokenType.BoundComplexFunctionCall:
                navigation = ResourcePath.complexPath(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
            case Lexer.TokenType.BoundPrimitiveCollectionFunctionCall:
                navigation = ResourcePath.collectionPath(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
            case Lexer.TokenType.BoundPrimitiveFunctionCall:
                navigation = ResourcePath.singlePath(value, index, operation.value.call.metadata);
                delete operation.metadata;
                break;
        }

        if (navigation) index = navigation.next;

        return Lexer.tokenize(value, start, index, { operation, name, navigation }, Lexer.TokenType.BoundOperation, navigation);
    }

    export function boundActionCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index) return;
        let start = index;
        index = namespaceNext;

        if (value[index] !== 0x2e) return;
        index++;

        let action = NameOrIdentifier.action(value, index, isCollection, metadataContext);
        if (!action) return;
        action.value.namespace = Utils.stringify(value, start, namespaceNext);

        return Lexer.tokenize(value, start, action.next, action, Lexer.TokenType.BoundActionCall, action);
    }

    export function boundFunctionCall(value: Utils.SourceArray, index: number, odataFunction: Function, tokenType: Lexer.TokenType, isCollection: boolean, metadataContext?: any): Lexer.Token {
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index) return;
        let start = index;
        index = namespaceNext;

        if (value[index] !== 0x2e) return;
        index++;

        let call = odataFunction(value, index, isCollection, metadataContext);
        if (!call) return;
        call.value.namespace = Utils.stringify(value, start, namespaceNext);
        index = call.next;

        let params = ResourcePath.functionParameters(value, index);
        if (!params) return;
        index = params.next;

        return Lexer.tokenize(value, start, index, { call, params }, tokenType, call);
    }

    export function boundEntityFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.entityFunction, Lexer.TokenType.BoundEntityFunctionCall, isCollection, metadataContext);
    }
    export function boundEntityColFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.entityColFunction, Lexer.TokenType.BoundEntityCollectionFunctionCall, isCollection, metadataContext);
    }
    export function boundComplexFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.complexFunction, Lexer.TokenType.BoundComplexFunctionCall, isCollection, metadataContext);
    }
    export function boundComplexColFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.complexColFunction, Lexer.TokenType.BoundComplexCollectionFunctionCall, isCollection, metadataContext);
    }
    export function boundPrimitiveFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.primitiveFunction, Lexer.TokenType.BoundPrimitiveFunctionCall, isCollection, metadataContext);
    }
    export function boundPrimitiveColFuncCall(value: Utils.SourceArray, index: number, isCollection: boolean, metadataContext?: any): Lexer.Token {
        return ResourcePath.boundFunctionCall(value, index, NameOrIdentifier.primitiveColFunction, Lexer.TokenType.BoundPrimitiveCollectionFunctionCall, isCollection, metadataContext);
    }

    export function actionImportCall(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let action = NameOrIdentifier.actionImport(value, index, metadataContext);
        if (action) return Lexer.tokenize(value, index, action.next, action, Lexer.TokenType.ActionImportCall, action);
    }

    export function functionImportCall(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let fnImport = NameOrIdentifier.entityFunctionImport(value, index, metadataContext) ||
            NameOrIdentifier.entityColFunctionImport(value, index, metadataContext) ||
            NameOrIdentifier.complexFunctionImport(value, index, metadataContext) ||
            NameOrIdentifier.complexColFunctionImport(value, index, metadataContext) ||
            NameOrIdentifier.primitiveFunctionImport(value, index, metadataContext) ||
            NameOrIdentifier.primitiveColFunctionImport(value, index, metadataContext);

        if (!fnImport) return;
        let start = index;
        index = fnImport.next;

        let params = ResourcePath.functionParameters(value, index);
        if (!params) return;
        index = params.next;

        return Lexer.tokenize(value, start, index, { import: fnImport, params: params.value }, <Lexer.TokenType>(fnImport.type + "Call"), fnImport);
    }

    export function functionParameters(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;

        let params = [];
        let token = ResourcePath.functionParameter(value, index);
        while (token) {
            params.push(token);
            index = token.next;

            let comma = Lexer.COMMA(value, index);
            if (comma) {
                index = comma;
                token = ResourcePath.functionParameter(value, index);
                if (!token) return;
            }else break;
        }

        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, params, Lexer.TokenType.FunctionParameters);
    }

    export function functionParameter(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let name = Expressions.parameterName(value, index);
        if (!name) return;
        let start = index;
        index = name.next;

        let eq = Lexer.EQ(value, index);
        if (!eq) return;
        index = eq;

        let token = Expressions.parameterAlias(value, index) ||
            PrimitiveLiteral.primitiveLiteral(value, index);

        if (!token) return;
        index = token.next;

        return Lexer.tokenize(value, start, index, { name, value: token }, Lexer.TokenType.FunctionParameter);
    }

    export function crossjoin(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        if (!Utils.equals(value, index, "$crossjoin")) return;
        let start = index;
        index += 10;

        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;

        let names = [];
        let token = NameOrIdentifier.entitySetName(value, index, metadataContext);
        if (!token) return;

        while (token) {
            names.push(token);
            index = token.next;

            let comma = Lexer.COMMA(value, index);
            if (comma) {
                index = comma;
                token = NameOrIdentifier.entitySetName(value, index, metadataContext);
                if (!token) return;
            }else break;
        }

        let close = Lexer.CLOSE(value, index);
        if (!close) return;

        return Lexer.tokenize(value, start, index, { names }, Lexer.TokenType.Crossjoin);
    }

    export function all(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "$all")) return Lexer.tokenize(value, index, index + 4, "$all", Lexer.TokenType.AllResource);
    }
}

export default ResourcePath;
