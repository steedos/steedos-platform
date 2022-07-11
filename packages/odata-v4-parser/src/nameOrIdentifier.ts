import Utils from "./utils";
import Lexer from "./lexer";
import PrimitiveLiteral from "./primitiveLiteral";

export namespace NameOrIdentifier {
    export function enumeration(value: Utils.SourceArray, index: number): Lexer.Token {
        let type = qualifiedEnumTypeName(value, index);
        if (!type) return;
        let start = index;
        index = type.next;

        let squote = Lexer.SQUOTE(value, index);
        if (!squote) return;
        index = squote;

        let enumVal = NameOrIdentifier.enumValue(value, index);
        if (!enumVal) return;
        index = enumVal.next;

        squote = Lexer.SQUOTE(value, index);
        if (!squote) return;
        index = squote;

        return Lexer.tokenize(value, start, index, {
            name: type,
            value: enumVal
        }, Lexer.TokenType.Enum);
    }
    export function enumValue(value: Utils.SourceArray, index: number): Lexer.Token {
        let val = NameOrIdentifier.singleEnumValue(value, index);
        if (!val) return;
        let start = index;

        let arr = [];
        while (val) {
            arr.push(val);
            index = val.next;
            let comma = Lexer.COMMA(value, val.next);
            if (comma) {
                index = comma;
                val = NameOrIdentifier.singleEnumValue(value, index);
            }else break;
        }

        return Lexer.tokenize(value, start, index, { values: arr }, Lexer.TokenType.EnumValue);
    }
    export function singleEnumValue(value: Utils.SourceArray, index: number): Lexer.Token {
        return NameOrIdentifier.enumerationMember(value, index) ||
            NameOrIdentifier.enumMemberValue(value, index);
    }
    export function enumMemberValue(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = PrimitiveLiteral.int64Value(value, index);
        if (token) {
            token.type = Lexer.TokenType.EnumMemberValue;
            return token;
        }
    }
    export function singleQualifiedTypeName(value: Utils.SourceArray, index: number): Lexer.Token {
        return NameOrIdentifier.qualifiedEntityTypeName(value, index) ||
            NameOrIdentifier.qualifiedComplexTypeName(value, index) ||
            NameOrIdentifier.qualifiedTypeDefinitionName(value, index) ||
            NameOrIdentifier.qualifiedEnumTypeName(value, index) ||
            NameOrIdentifier.primitiveTypeName(value, index);
    }
    export function qualifiedTypeName(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "Collection")) {
            let start = index;
            index += 10;

            let squote = Lexer.SQUOTE(value, index);
            if (!squote) return;
            index = squote;

            let token = NameOrIdentifier.singleQualifiedTypeName(value, index);
            if (!token) return;
            else index = token.next;

            squote = Lexer.SQUOTE(value, index);
            if (!squote) return;
            index = squote;

            token.position = start;
            token.next = index;
            token.raw = Utils.stringify(value, token.position, token.next);
            token.type = Lexer.TokenType.Collection;
        } else return NameOrIdentifier.singleQualifiedTypeName(value, index);
    }
    export function qualifiedEntityTypeName(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let start = index;
        let namespaceNext = NameOrIdentifier.namespace(value, index);

        if (namespaceNext === index || value[namespaceNext] !== 0x2e) return;
        let schema;
        if (typeof metadataContext === "object") {
            schema = NameOrIdentifier.getMetadataRoot(metadataContext).schemas.filter(it => it.namespace === Utils.stringify(value, start, namespaceNext))[0];
        }
        let name = NameOrIdentifier.entityTypeName(value, namespaceNext + 1, schema);
        if (!name) return;
        name.value.namespace = Utils.stringify(value, start, namespaceNext);

        return Lexer.tokenize(value, start, name.next, name, Lexer.TokenType.QualifiedEntityTypeName);
    }
    export function qualifiedComplexTypeName(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let start = index;
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index || value[namespaceNext] !== 0x2e) return;
        let schema;
        if (typeof metadataContext === "object") {
            schema = NameOrIdentifier.getMetadataRoot(metadataContext).schemas.filter(it => it.namespace === Utils.stringify(value, start, namespaceNext))[0];
        }
        let name = NameOrIdentifier.complexTypeName(value, namespaceNext + 1, schema);
        if (!name) return;
        name.value.namespace = Utils.stringify(value, start, namespaceNext);

        return Lexer.tokenize(value, start, name.next, name, Lexer.TokenType.QualifiedComplexTypeName);
    }
    export function qualifiedTypeDefinitionName(value: Utils.SourceArray, index: number): Lexer.Token {
        let start = index;
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index || value[namespaceNext] !== 0x2e) return;
        let nameNext = NameOrIdentifier.typeDefinitionName(value, namespaceNext + 1);
        if (nameNext && nameNext.next === namespaceNext + 1) return;

        return Lexer.tokenize(value, start, nameNext.next, "TypeDefinitionName", Lexer.TokenType.Identifier);
    }
    export function qualifiedEnumTypeName(value: Utils.SourceArray, index: number): Lexer.Token {
        let start = index;
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index || value[namespaceNext] !== 0x2e) return;
        let nameNext = NameOrIdentifier.enumerationTypeName(value, namespaceNext + 1);
        if (nameNext && nameNext.next === namespaceNext + 1) return;

        return Lexer.tokenize(value, start, nameNext.next, "EnumTypeName", Lexer.TokenType.Identifier);
    }
    export function namespace(value: Utils.SourceArray, index: number): number {
        let part = NameOrIdentifier.namespacePart(value, index);
        while (part && part.next > index) {
            index = part.next;
            if (value[part.next] === 0x2e) {
                index++;
                part = NameOrIdentifier.namespacePart(value, index);
                if (part && value[part.next] !== 0x2e) return index - 1;
            }
        }

        return index - 1;
    }
    export function odataIdentifier(value: Utils.SourceArray, index: number, tokenType?: Lexer.TokenType): Lexer.Token {
        let start = index;
        if (Lexer.identifierLeadingCharacter(value[index])) {
            index++;
            while (index < value.length && (index - start < 128) && Lexer.identifierCharacter(value[index])) {
                index++;
            }
        }

        if (index > start) return Lexer.tokenize(value, start, index, { name: Utils.stringify(value, start, index) }, tokenType || Lexer.TokenType.ODataIdentifier);
    }
    export function namespacePart(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.NamespacePart); }
    export function entitySetName(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntitySetName);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let entitySet;
            metadataContext.dataServices.schemas.forEach(schema => schema.entityContainer.forEach(container => container.entitySets.filter((set) => {
                let eq = set.name === token.raw;
                if (eq) entitySet = set;
                return eq;
            })));
            if (!entitySet) return;

            let entityType;
            metadataContext.dataServices.schemas.forEach(schema => entitySet.entityType.indexOf(schema.namespace + ".") === 0 && schema.entityTypes.filter((type) => {
                let eq = type.name === entitySet.entityType.replace(schema.namespace + ".", "");
                if (eq) entityType = type;
                return eq;
            }));
            if (!entityType) return;

            token.metadata = entityType;
        }

        return token;
    }
    export function singletonEntity(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.SingletonEntity); }
    export function entityTypeName(value: Utils.SourceArray, index: number, schema?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityTypeName);
        if (!token) return;

        if (typeof schema === "object") {
            let type = schema.entityTypes.filter(it => it.name === token.raw)[0];
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function complexTypeName(value: Utils.SourceArray, index: number, schema?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexTypeName);
        if (!token) return;

        if (typeof schema === "object") {
            let type = schema.complexTypes.filter(it => it.name === token.raw)[0];
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function typeDefinitionName(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.TypeDefinitionName); }
    export function enumerationTypeName(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EnumerationTypeName); }
    export function enumerationMember(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EnumerationMember); }
    export function termName(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.TermName); }
    export function primitiveTypeName(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "Edm.")) return;
        let start = index;
        index += 4;
        let end = index + (Utils.equals(value, index, "Binary") ||
            Utils.equals(value, index, "Boolean") ||
            Utils.equals(value, index, "Byte") ||
            Utils.equals(value, index, "Date") ||
            Utils.equals(value, index, "DateTimeOffset") ||
            Utils.equals(value, index, "Decimal") ||
            Utils.equals(value, index, "Double") ||
            Utils.equals(value, index, "Duration") ||
            Utils.equals(value, index, "Guid") ||
            Utils.equals(value, index, "Int16") ||
            Utils.equals(value, index, "Int32") ||
            Utils.equals(value, index, "Int64") ||
            Utils.equals(value, index, "SByte") ||
            Utils.equals(value, index, "Single") ||
            Utils.equals(value, index, "Stream") ||
            Utils.equals(value, index, "String") ||
            Utils.equals(value, index, "TimeOfDay") ||
            Utils.equals(value, index, "GeographyCollection") ||
            Utils.equals(value, index, "GeographyLineString") ||
            Utils.equals(value, index, "GeographyMultiLineString") ||
            Utils.equals(value, index, "GeographyMultiPoint") ||
            Utils.equals(value, index, "GeographyMultiPolygon") ||
            Utils.equals(value, index, "GeographyPoint") ||
            Utils.equals(value, index, "GeographyPolygon") ||
            Utils.equals(value, index, "GeometryCollection") ||
            Utils.equals(value, index, "GeometryLineString") ||
            Utils.equals(value, index, "GeometryMultiLineString") ||
            Utils.equals(value, index, "GeometryMultiPoint") ||
            Utils.equals(value, index, "GeometryMultiPolygon") ||
            Utils.equals(value, index, "GeometryPoint") ||
            Utils.equals(value, index, "GeometryPolygon")
            );

        if (end > index) return Lexer.tokenize(value, start, end, "PrimitiveTypeName", Lexer.TokenType.Identifier);
    }
    const primitiveTypes: string[] = [
        "Edm.Binary", "Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Duration", "Edm.Guid",
        "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.Stream", "Edm.String", "Edm.Array", "Edm.TimeOfDay",
        "Edm.GeographyCollection", "Edm.GeographyLineString", "Edm.GeographyMultiLineString", "Edm.GeographyMultiPoint", "Edm.GeographyMultiPolygon", "Edm.GeographyPoint", "Edm.GeographyPolygon",
        "Edm.GeometryCollection", "Edm.GeometryLineString", "Edm.GeometryMultiLineString", "Edm.GeometryMultiPoint", "Edm.GeometryMultiPolygon", "Edm.GeometryPoint", "Edm.GeometryPolygon"
    ];
    export function isPrimitiveTypeName(type: string, metadataContext?: any): boolean {
        let root = NameOrIdentifier.getMetadataRoot(metadataContext);
        let schemas = root.schemas || (root.dataServices && root.dataServices.schemas) || [];
        let schema = schemas.filter(function (it) { return type.indexOf(it.namespace + ".") === 0; })[0];
        if (schema) {
            return ((schema.enumTypes && schema.enumTypes.filter(function (it) { return it.name === type.split(".").pop(); })[0]) ||
                (schema.typeDefinitions && schema.typeDefinitions.filter(function (it) { return it.name === type.split(".").pop(); })[0])) &&
                !(
                    (schema.entityTypes && schema.entityTypes.filter(function (it) { return it.name === type.split(".").pop(); })[0]) ||
                    (schema.complexTypes && schema.complexTypes.filter(function (it) { return it.name === type.split(".").pop(); })[0])
                );
        }
        return primitiveTypes.indexOf(type) >= 0;
    }
    export function getMetadataRoot(metadataContext: any) {
        let root = metadataContext;
        while (root.parent) {
            root = root.parent;
        }
        return root.dataServices || root;
    }
    export function primitiveProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.properties.length; i++) {
                let prop = metadataContext.properties[i];
                if (prop.name === token.raw) {
                    if (prop.type.indexOf("Collection") === 0 || !NameOrIdentifier.isPrimitiveTypeName(prop.type, metadataContext)) return;
                    token.metadata = prop;

                    if (metadataContext.key && metadataContext.key.propertyRefs.filter(it => it.name === prop.name).length > 0) {
                        token.type = Lexer.TokenType.PrimitiveKeyProperty;
                    }

                    break;
                }
            }

            if (!token.metadata) return;
        }

        return token;
    }
    export function primitiveKeyProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.primitiveProperty(value, index, metadataContext);
        if (token && token.type === Lexer.TokenType.PrimitiveKeyProperty) return token;
    }
    export function primitiveNonKeyProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.primitiveProperty(value, index, metadataContext);
        if (token && token.type === Lexer.TokenType.PrimitiveProperty) return token;
    }
    export function primitiveColProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveCollectionProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.properties.length; i++) {
                let prop = metadataContext.properties[i];
                if (prop.name === token.raw) {
                    if (prop.type.indexOf("Collection") === -1 || !NameOrIdentifier.isPrimitiveTypeName(prop.type.slice(11, -1), metadataContext)) return;
                    token.metadata = prop;

                    if (metadataContext.key.propertyRefs.filter(it => it.name === prop.name).length > 0) {
                        token.type = Lexer.TokenType.PrimitiveKeyProperty;
                    }

                    break;
                }
            }

            if (!token.metadata) return;
        }

        return token;
    }
    export function complexProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.properties.length; i++) {
                let prop = metadataContext.properties[i];
                if (prop.name === token.raw) {
                    if (prop.type.indexOf("Collection") === 0 || NameOrIdentifier.isPrimitiveTypeName(prop.type, metadataContext)) return;
                    let root = NameOrIdentifier.getMetadataRoot(metadataContext);
                    let schema = root.schemas.filter(it => prop.type.indexOf(it.namespace + ".") === 0)[0];
                    if (!schema) return;

                    let complexType = schema.complexTypes.filter(it => it.name === prop.type.split(".").pop())[0];
                    if (!complexType) return;

                    token.metadata = complexType;
                    break;
                }
            }

            if (!token.metadata) return;
        }

        return token;
    }
    export function complexColProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexCollectionProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.properties.length; i++) {
                let prop = metadataContext.properties[i];
                if (prop.name === token.raw) {
                    if (prop.type.indexOf("Collection") === -1 || NameOrIdentifier.isPrimitiveTypeName(prop.type.slice(11, -1), metadataContext)) return;
                    let root = NameOrIdentifier.getMetadataRoot(metadataContext);
                    let schema = root.schemas.filter(it => prop.type.slice(11, -1).indexOf(it.namespace + ".") === 0)[0];
                    if (!schema) return;

                    let complexType = schema.complexTypes.filter(it => it.name === prop.type.slice(11, -1).split(".").pop())[0];
                    if (!complexType) return;

                    token.metadata = complexType;
                    break;
                }
            }

            if (!token.metadata) return;
        }

        return token;
    }
    export function streamProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.StreamProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.properties.length; i++) {
                let prop = metadataContext.properties[i];
                if (prop.name === token.raw) {
                    if (prop.type !== "Edm.Stream") return;
                    token.metadata = prop;
                    break;
                }
            }

            if (!token.metadata) return;
        }

        return token;
    }

    export function navigationProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        return NameOrIdentifier.entityNavigationProperty(value, index, metadataContext) ||
            NameOrIdentifier.entityColNavigationProperty(value, index, metadataContext);
    }
    export function entityNavigationProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityNavigationProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.navigationProperties.length; i++) {
                let prop = metadataContext.navigationProperties[i];
                if (prop.name === token.raw && prop.type.indexOf("Collection") === -1 && !NameOrIdentifier.isPrimitiveTypeName(prop.type.slice(11, -1), metadataContext)) {
                    let root = NameOrIdentifier.getMetadataRoot(metadataContext);
                    let schema = root.schemas.filter(it => prop.type.indexOf(it.namespace + ".") === 0)[0];
                    if (!schema) return;

                    let entityType = schema.entityTypes.filter(it => it.name === prop.type.split(".").pop())[0];
                    if (!entityType) return;

                    token.metadata = entityType;
                }
            }
            if (!token.metadata) return;
        }

        return token;
    }
    export function entityColNavigationProperty(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityCollectionNavigationProperty);
        if (!token) return;

        if (typeof metadataContext === "object") {
            for (let i = 0; i < metadataContext.navigationProperties.length; i++) {
                let prop = metadataContext.navigationProperties[i];
                if (prop.name === token.raw && prop.type.indexOf("Collection") === 0 && !NameOrIdentifier.isPrimitiveTypeName(prop.type.slice(11, -1), metadataContext)) {
                    let root = NameOrIdentifier.getMetadataRoot(metadataContext);
                    let schema = root.schemas.filter(it => prop.type.slice(11, -1).indexOf(it.namespace + ".") === 0)[0];
                    if (!schema) return;

                    let entityType = schema.entityTypes.filter(it => it.name === prop.type.slice(11, -1).split(".").pop())[0];
                    if (!entityType) return;

                    token.metadata = entityType;
                }
            }
            if (!token.metadata) return;
        }

        return token;
    }

    export function action(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.Action);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("action", metadataContext, token, isCollection, false, false, "entityTypes");
            if (!type) return;
        }

        return token;
    }
    export function actionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ActionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("action", metadataContext, token);
            if (!type) return;
        }

        return token;
    }

    export function odataFunction(value: Utils.SourceArray, index: number): Lexer.Token {
        return NameOrIdentifier.entityFunction(value, index) ||
            NameOrIdentifier.entityColFunction(value, index) ||
            NameOrIdentifier.complexFunction(value, index) ||
            NameOrIdentifier.complexColFunction(value, index) ||
            NameOrIdentifier.primitiveFunction(value, index) ||
            NameOrIdentifier.primitiveColFunction(value, index);
    }

    export function getOperationType(operation: string, metadataContext: any, token: Lexer.Token, isBoundCollection: boolean, isCollection: boolean, isPrimitive: boolean, types?: string) {
        let bindingParameterType = metadataContext.parent.namespace + "." + metadataContext.name;
        if (isBoundCollection) bindingParameterType = "Collection(" + bindingParameterType + ")";

        let fnDef;
        let root = NameOrIdentifier.getMetadataRoot(metadataContext);
        for (let i = 0; i < root.schemas.length; i++) {
            let schema = root.schemas[i];
            for (let j = 0; j < schema[operation + "s"].length; j++) {
                let fn = schema[operation + "s"][j];
                if (fn.name === token.raw && fn.isBound) {
                    for (let k = 0; k < fn.parameters.length; k++) {
                        let param = fn.parameters[k];
                        if (param.name === "bindingParameter" && param.type === bindingParameterType) {
                            fnDef = fn;
                            break;
                        }
                    }
                }
                if (fnDef) break;
            }
            if (fnDef) break;
        }
        if (!fnDef) return;

        if (operation === "action") return fnDef;

        if (fnDef.returnType.type.indexOf("Collection") === isCollection ? -1 : 0) return;
        let elementType = isCollection ? fnDef.returnType.type.slice(11, -1) : fnDef.returnType.type;
        if (NameOrIdentifier.isPrimitiveTypeName(elementType, metadataContext) && !isPrimitive) return;
        if (!NameOrIdentifier.isPrimitiveTypeName(elementType, metadataContext) && isPrimitive) return;
        if (isPrimitive) return elementType;

        let type;
        for (let i = 0; i < root.schemas.length; i++) {
            let schema = root.schemas[i];
            if (elementType.indexOf(schema.namespace + ".") === 0) {
                for (let j = 0; j < schema[types].length; j++) {
                    let it = schema[types][j];
                    if (schema.namespace + "." + it.name === elementType) {
                        type = it;
                        break;
                    }
                }
            }
            if (type) break;
        }

        return type;
    }
    export function entityFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, false, false, "entityTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function entityColFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityCollectionFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, true, false, "entityTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function complexFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, false, false, "complexTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function complexColFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexCollectionFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, true, false, "complexTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function primitiveFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, false, true);
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function primitiveColFunction(value: Utils.SourceArray, index: number, isCollection?: boolean, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveCollectionFunction);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationType("function", metadataContext, token, isCollection, true, true);
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }

    export function getOperationImportType(operation: string, metadataContext: any, token: Lexer.Token, isCollection?: boolean, isPrimitive?: boolean, types?: string) {
        let fnImport;

        for (let i = 0; i < metadataContext.dataServices.schemas.length; i++) {
            let schema = metadataContext.dataServices.schemas[i];
            for (let j = 0; j < schema.entityContainer.length; j++) {
                let container = schema.entityContainer[j];
                for (let k = 0; k < container[operation + "Imports"].length; k++) {
                    let it = container[operation + "Imports"][k];
                    if (it.name === token.raw) {
                        fnImport = it;
                        break;
                    }
                }
                if (fnImport) break;
            }
            if (fnImport) break;
        }
        if (!fnImport) return;

        let fn;
        for (let i = 0; i < metadataContext.dataServices.schemas.length; i++) {
            let schema = metadataContext.dataServices.schemas[i];
            if (fnImport[operation].indexOf(schema.namespace + ".") === 0) {
                for (let j = 0; j < schema[operation + "s"].length; j++) {
                    let it = schema[operation + "s"][j];
                    if (it.name === fnImport.name) {
                        fn = it;
                        break;
                    }
                }
            }
            if (fn) break;
        }
        if (!fn) return;

        if (operation === "action") return fn;
        if (fn.returnType.type.indexOf("Collection") === isCollection ? -1 : 0) return;
        let elementType = isCollection ? fn.returnType.type.slice(11, -1) : fn.returnType.type;
        if (NameOrIdentifier.isPrimitiveTypeName(elementType, metadataContext) && !isPrimitive) return;
        if (!NameOrIdentifier.isPrimitiveTypeName(elementType, metadataContext) && isPrimitive) return;
        if (isPrimitive) return elementType;

        let type;
        for (let i = 0; i < metadataContext.dataServices.schemas.length; i++) {
            let schema = metadataContext.dataServices.schemas[i];
            if (elementType.indexOf(schema.namespace + ".") === 0) {
                for (let j = 0; j < schema[types].length; j++) {
                    let it = schema[types][j];
                    if (schema.namespace + "." + it.name === elementType) {
                        type = it;
                        break;
                    }
                }
            }
            if (type) break;
        }

        return type;
    }
    export function entityFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, false, false, "entityTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function entityColFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.EntityCollectionFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, true, false, "entityTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function complexFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, false, false, "complexTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function complexColFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ComplexCollectionFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, true, false, "complexTypes");
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function primitiveFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, false, true);
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
    export function primitiveColFunctionImport(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.PrimitiveCollectionFunctionImport);
        if (!token) return;

        if (typeof metadataContext === "object") {
            let type = NameOrIdentifier.getOperationImportType("function", metadataContext, token, true, true);
            if (!type) return;
            token.metadata = type;
        }

        return token;
    }
}

export default NameOrIdentifier;