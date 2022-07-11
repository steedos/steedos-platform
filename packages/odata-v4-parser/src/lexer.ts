import Utils from "./utils";

export enum TokenType {
    Literal = "Literal",
    ArrayOrObject = "ArrayOrObject",
    Array = "Array",
    Object = "Object",
    Property = "Property",
    Annotation = "Annotation",
    Enum = "Enum",
    EnumValue = "EnumValue",
    EnumMemberValue = "EnumMemberValue",
    Identifier = "Identifier",
    QualifiedEntityTypeName = "QualifiedEntityTypeName",
    QualifiedComplexTypeName = "QualifiedComplexTypeName",
    ODataIdentifier = "ODataIdentifier",
    Collection = "Collection",
    NamespacePart = "NamespacePart",
    EntitySetName = "EntitySetName",
    SingletonEntity = "SingletonEntity",
    EntityTypeName = "EntityTypeName",
    ComplexTypeName = "ComplexTypeName",
    TypeDefinitionName = "TypeDefinitionName",
    EnumerationTypeName = "EnumerationTypeName",
    EnumerationMember = "EnumerationMember",
    TermName = "TermName",
    PrimitiveProperty = "PrimitiveProperty",
    PrimitiveKeyProperty = "PrimitiveKeyProperty",
    PrimitiveNonKeyProperty = "PrimitiveNonKeyProperty",
    PrimitiveCollectionProperty = "PrimitiveCollectionProperty",
    ComplexProperty = "ComplexProperty",
    ComplexCollectionProperty = "ComplexCollectionProperty",
    StreamProperty = "StreamProperty",
    NavigationProperty = "NavigationProperty",
    EntityNavigationProperty = "EntityNavigationProperty",
    EntityCollectionNavigationProperty = "EntityCollectionNavigationProperty",
    Action = "Action",
    ActionImport = "ActionImport",
    Function = "Function",
    EntityFunction = "EntityFunction",
    EntityCollectionFunction = "EntityCollectionFunction",
    ComplexFunction = "ComplexFunction",
    ComplexCollectionFunction = "ComplexCollectionFunction",
    PrimitiveFunction = "PrimitiveFunction",
    PrimitiveCollectionFunction = "PrimitiveCollectionFunction",
    EntityFunctionImport = "EntityFunctionImport",
    EntityCollectionFunctionImport = "EntityCollectionFunctionImport",
    ComplexFunctionImport = "ComplexFunctionImport",
    ComplexCollectionFunctionImport = "ComplexCollectionFunctionImport",
    PrimitiveFunctionImport = "PrimitiveFunctionImport",
    PrimitiveCollectionFunctionImport = "PrimitiveCollectionFunctionImport",
    CommonExpression = "CommonExpression",
    AndExpression = "AndExpression",
    OrExpression = "OrExpression",
    EqualsExpression = "EqualsExpression",
    NotEqualsExpression = "NotEqualsExpression",
    LesserThanExpression = "LesserThanExpression",
    LesserOrEqualsExpression = "LesserOrEqualsExpression",
    GreaterThanExpression = "GreaterThanExpression",
    GreaterOrEqualsExpression = "GreaterOrEqualsExpression",
    HasExpression = "HasExpression",
    AddExpression = "AddExpression",
    SubExpression = "SubExpression",
    MulExpression = "MulExpression",
    DivExpression = "DivExpression",
    ModExpression = "ModExpression",
    NotExpression = "NotExpression",
    BoolParenExpression = "BoolParenExpression",
    ParenExpression = "ParenExpression",
    MethodCallExpression = "MethodCallExpression",
    IsOfExpression = "IsOfExpression",
    CastExpression = "CastExpression",
    NegateExpression = "NegateExpression",
    FirstMemberExpression = "FirstMemberExpression",
    MemberExpression = "MemberExpression",
    PropertyPathExpression = "PropertyPathExpression",
    ImplicitVariableExpression = "ImplicitVariableExpression",
    LambdaVariable = "LambdaVariable",
    LambdaVariableExpression = "LambdaVariableExpression",
    LambdaPredicateExpression = "LambdaPredicateExpression",
    AnyExpression = "AnyExpression",
    AllExpression = "AllExpression",
    CollectionNavigationExpression = "CollectionNavigationExpression",
    SimpleKey = "SimpleKey",
    CompoundKey = "CompoundKey",
    KeyValuePair = "KeyValuePair",
    KeyPropertyValue = "KeyPropertyValue",
    KeyPropertyAlias = "KeyPropertyAlias",
    SingleNavigationExpression = "SingleNavigationExpression",
    CollectionPathExpression = "CollectionPathExpression",
    ComplexPathExpression = "ComplexPathExpression",
    SinglePathExpression = "SinglePathExpression",
    FunctionExpression = "FunctionExpression",
    FunctionExpressionParameters = "FunctionExpressionParameters",
    FunctionExpressionParameter = "FunctionExpressionParameter",
    ParameterName = "ParameterName",
    ParameterAlias = "ParameterAlias",
    ParameterValue = "ParameterValue",
    CountExpression = "CountExpression",
    RefExpression = "RefExpression",
    ValueExpression = "ValueExpression",
    RootExpression = "RootExpression",
    QueryOptions = "QueryOptions",
    CustomQueryOption = "CustomQueryOption",
    Expand = "Expand",
    ExpandItem = "ExpandItem",
    ExpandPath = "ExpandPath",
    ExpandCountOption = "ExpandCountOption",
    ExpandRefOption = "ExpandRefOption",
    ExpandOption = "ExpandOption",
    Levels = "Levels",
    Search = "Search",
    SearchExpression = "SearchExpression",
    SearchParenExpression = "SearchParenExpression",
    SearchNotExpression = "SearchNotExpression",
    SearchOrExpression = "SearchOrExpression",
    SearchAndExpression = "SearchAndExpression",
    SearchTerm = "SearchTerm",
    SearchPhrase = "SearchPhrase",
    SearchWord = "SearchWord",
    Filter = "Filter",
    OrderBy = "OrderBy",
    OrderByItem = "OrderByItem",
    Skip = "Skip",
    Top = "Top",
    Format = "Format",
    InlineCount = "InlineCount",
    Select = "Select",
    SelectItem = "SelectItem",
    SelectPath = "SelectPath",
    AliasAndValue = "AliasAndValue",
    SkipToken = "SkipToken",
    Id = "Id",
    Crossjoin = "Crossjoin",
    AllResource = "AllResource",
    ActionImportCall = "ActionImportCall",
    FunctionImportCall = "FunctionImportCall",
    EntityCollectionFunctionImportCall = "EntityCollectionFunctionImportCall",
    EntityFunctionImportCall = "EntityFunctionImportCall",
    ComplexCollectionFunctionImportCall = "ComplexCollectionFunctionImportCall",
    ComplexFunctionImportCall = "ComplexFunctionImportCall",
    PrimitiveCollectionFunctionImportCall = "PrimitiveCollectionFunctionImportCall",
    PrimitiveFunctionImportCall = "PrimitiveFunctionImportCall",
    FunctionParameters = "FunctionParameters",
    FunctionParameter = "FunctionParameter",
    ResourcePath = "ResourcePath",
    CollectionNavigation = "CollectionNavigation",
    CollectionNavigationPath = "CollectionNavigationPath",
    SingleNavigation = "SingleNavigation",
    PropertyPath = "PropertyPath",
    ComplexPath = "ComplexPath",
    BoundOperation = "BoundOperation",
    BoundActionCall = "BoundActionCall",
    BoundEntityFunctionCall = "BoundEntityFunctionCall",
    BoundEntityCollectionFunctionCall = "BoundEntityCollectionFunctionCall",
    BoundComplexFunctionCall = "BoundComplexFunctionCall",
    BoundComplexCollectionFunctionCall = "BoundComplexCollectionFunctionCall",
    BoundPrimitiveFunctionCall = "BoundPrimitiveFunctionCall",
    BoundPrimitiveCollectionFunctionCall = "BoundPrimitiveCollectionFunctionCall",
    ODataUri = "ODataUri",
    Batch = "Batch",
    Entity = "Entity",
    Metadata = "Metadata",
    InExpression= "InExpression",
}

export const LexerTokenType = TokenType;
export type LexerTokenType = TokenType;

export class Token {
    position: number;
    next: number;
    value: any;
    type: TokenType;
    raw: string;
    metadata: any;
    constructor(token) {
        this.position = token.position;
        this.next = token.next;
        this.value = token.value;
        this.type = token.type;
        this.raw = token.raw;
        if (token.metadata) this.metadata = token.metadata;
    }
}

export const LexerToken = Token;
export type LexerToken = Token;

export namespace Lexer {
    export type Token = LexerToken;
    export const Token: typeof LexerToken = exports.Token;
    export type TokenType = LexerTokenType;
    export const TokenType: typeof LexerTokenType = exports.TokenType;

    export function tokenize(value: Utils.SourceArray, index: number, next: number, tokenValue: any, tokenType: TokenType, metadataContextContainer?: Token): Token {
        let token = new exports.Token({
            position: index,
            next: next,
            value: tokenValue,
            type: tokenType,
            raw: Utils.stringify(value, index, next)
        });
        if (metadataContextContainer && metadataContextContainer.metadata) {
            token.metadata = metadataContextContainer.metadata;
            delete metadataContextContainer.metadata;
        }
        return token;
    }

    export function clone(token): Token {
        return new exports.Token({
            position: token.position,
            next: token.next,
            value: token.value,
            type: token.type,
            raw: token.raw
        });
    }

    // core definitions
    export function ALPHA(value: number): boolean { return (value >= 0x41 && value <= 0x5a) || (value >= 0x61 && value <= 0x7a) || value >= 0x80; }
    export function DIGIT(value: number): boolean { return (value >= 0x30 && value <= 0x39); }
    export function HEXDIG(value: number): boolean { return Lexer.DIGIT(value) || Lexer.AtoF(value); }
    export function AtoF(value: number): boolean { return (value >= 0x41 && value <= 0x46) || (value >= 0x61 && value <= 0x66); }
    export function DQUOTE(value: number): boolean { return value === 0x22; }
    export function SP(value: number): boolean { return value === 0x20; }
    export function HTAB(value: number): boolean { return value === 0x09; }
    export function VCHAR(value: number): boolean { return value >= 0x21 && value <= 0x7e; }

    // punctuation
    export function whitespaceLength(value, index) {
        if (Utils.equals(value, index, "%20") || Utils.equals(value, index, "%09")) return 3;
        else if (Lexer.SP(value[index]) || Lexer.HTAB(value[index]) || value[index] === 0x20 || value[index] === 0x09) return 1;
    }

    export function OWS(value: Utils.SourceArray, index: number): number {
        index = index || 0;
        let inc = Lexer.whitespaceLength(value, index);
        while (inc) {
            index += inc;
            inc = Lexer.whitespaceLength(value, index);
        }
        return index;
    }
    export function RWS(value: Utils.SourceArray, index: number): number {
        return Lexer.OWS(value, index);
    }
    export function BWS(value: Utils.SourceArray, index: number): number {
        return Lexer.OWS(value, index);
    }

    export function AT(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x40) return index + 1;
        else if (Utils.equals(value, index, "%40")) return index + 3;
    }
    export function COLON(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x3a) return index + 1;
        else if (Utils.equals(value, index, "%3A")) return index + 3;
    }
    export function COMMA(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x2c) return index + 1;
        else if (Utils.equals(value, index, "%2C")) return index + 3;
    }
    export function EQ(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x3d) return index + 1;
    }
    export function SIGN(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x2b || value[index] === 0x2d) return index + 1;
        else if (Utils.equals(value, index, "%2B")) return index + 3;
    }
    export function SEMI(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x3b) return index + 1;
        else if (Utils.equals(value, index, "%3B")) return index + 3;
    }
    export function STAR(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x2a) return index + 1;
        else if (Utils.equals(value, index, "%2A")) return index + 3;
    }
    export function SQUOTE(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x27) return index + 1;
        else if (Utils.equals(value, index, "%27")) return index + 3;
    }
    export function OPEN(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x28) return index + 1;
        else if (Utils.equals(value, index, "%28")) return index + 3;
    }
    export function CLOSE(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x29) return index + 1;
        else if (Utils.equals(value, index, "%29")) return index + 3;
    }
    // unreserved ALPHA / DIGIT / "-" / "." / "_" / "~"
    export function unreserved(value: number): boolean { return Lexer.ALPHA(value) || Lexer.DIGIT(value) || value === 0x2d || value === 0x2e || value === 0x5f || value === 0x7e; }
    // other-delims "!" /                   "(" / ")" / "*" / "+" / "," / ";"
    export function otherDelims(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x21 || value[index] === 0x2b) return index + 1;
        else return Lexer.OPEN(value, index) || Lexer.CLOSE(value, index) || Lexer.STAR(value, index) || Lexer.COMMA(value, index) || Lexer.SEMI(value, index);
    }
    // sub-delims     =       "$" / "&" / "'" /                                     "=" / other-delims
    export function subDelims(value: Utils.SourceArray, index: number): number {
        if (value[index] === 0x24 || value[index] === 0x26) return index + 1;
        else return Lexer.SQUOTE(value, index) || Lexer.EQ(value, index) || Lexer.otherDelims(value, index);
    }
    export function pctEncoded(value: Utils.SourceArray, index: number): number {
        if (value[index] !== 0x25 || !Lexer.HEXDIG(value[index + 1]) || !Lexer.HEXDIG(value[index + 2])) return index;
        return index + 3;
    }
    // pct-encoded-no-SQUOTE = "%" ( "0" / "1" /   "3" / "4" / "5" / "6" / "8" / "9" / A-to-F ) HEXDIG
    //                       / "%" "2" ( "0" / "1" / "2" / "3" / "4" / "5" / "6" /   "8" / "9" / A-to-F )
    export function pctEncodedNoSQUOTE(value: Utils.SourceArray, index: number): number {
        if (Utils.equals(value, index, "%27")) return index;
        return Lexer.pctEncoded(value, index);
    }
    export function pctEncodedUnescaped(value: Utils.SourceArray, index: number): number {
        if (Utils.equals(value, index, "%22") ||
            Utils.equals(value, index, "%3") ||
            Utils.equals(value, index, "%4") ||
            Utils.equals(value, index, "%5C")) return index;
        return Lexer.pctEncoded(value, index);
    }
    export function pchar(value: Utils.SourceArray, index: number): number {
        if (Lexer.unreserved(value[index])) return index + 1;
        else return Lexer.subDelims(value, index) || Lexer.COLON(value, index) || Lexer.AT(value, index) || Lexer.pctEncoded(value, index) || index;
    }
    export function pcharNoSQUOTE(value: Utils.SourceArray, index: number): number {
        if (Lexer.unreserved(value[index]) || value[index] === 0x24 || value[index] === 0x26) return index + 1;
        else return Lexer.otherDelims(value, index) || Lexer.EQ(value, index) || Lexer.COLON(value, index) || Lexer.AT(value, index) || Lexer.pctEncodedNoSQUOTE(value, index) || index;
    }
    export function qcharNoAMP(value: Utils.SourceArray, index: number): number {
        if (Lexer.unreserved(value[index]) || value[index] === 0x3a || value[index] === 0x40 || value[index] === 0x2f || value[index] === 0x3f || value[index] === 0x24 || value[index] === 0x27 || value[index] === 0x3d) return index + 1;
        else return Lexer.pctEncoded(value, index) || Lexer.otherDelims(value, index) || index;
    }
    export function qcharNoAMPDQUOTE(value: Utils.SourceArray, index: number): number {
        index = Lexer.BWS(value, index);
        if (Lexer.unreserved(value[index]) || value[index] === 0x3a || value[index] === 0x40 || value[index] === 0x2f || value[index] === 0x3f || value[index] === 0x24 || value[index] === 0x27 || value[index] === 0x3d) return index + 1;
        else return Lexer.otherDelims(value, index) || Lexer.pctEncodedUnescaped(value, index);
    }
    // export function pchar(value:number):boolean { return unreserved(value) || otherDelims(value) || value == 0x24 || value == 0x26 || EQ(value) || COLON(value) || AT(value); }
    export function base64char(value: number): boolean { return Lexer.ALPHA(value) || Lexer.DIGIT(value) || value === 0x2d || value === 0x5f; }
    export function base64b16(value: Utils.SourceArray, index: number): number {
        let start = index;
        if (!Lexer.base64char(value[index]) && !Lexer.base64char(value[index + 1])) return start;
        index += 2;

        if (!Utils.is(value[index], "AEIMQUYcgkosw048")) return start;
        index++;

        if (value[index] === 0x3d) index++;
        return index;
    }
    export function base64b8(value: Utils.SourceArray, index: number): number {
        let start = index;
        if (!Lexer.base64char(value[index])) return start;
        index++;

        if (value[index] !== 0x41 || value[index] !== 0x51 || value[index] !== 0x67 || value[index] !== 0x77) return start;
        index++;

        if (value[index] === 0x3d && value[index + 1] === 0x3d) index += 2;
        return index;
    }
    export function nanInfinity(value: Utils.SourceArray, index: number): number {
        return Utils.equals(value, index, "NaN") || Utils.equals(value, index, "-INF") || Utils.equals(value, index, "INF");
    }
    export function oneToNine(value: number): boolean { return value !== 0x30 && Lexer.DIGIT(value); }
    export function zeroToFiftyNine(value: Utils.SourceArray, index: number): number {
        if (value[index] >= 0x30 && value[index] <= 0x35 && Lexer.DIGIT(value[index + 1])) return index + 2;
        return index;
    }
    export function year(value: Utils.SourceArray, index: number): number {
        let start = index;
        let end = index;
        if (value[index] === 0x2d) index++;
        if ((value[index] === 0x30 && (end = Utils.required(value, index + 1, Lexer.DIGIT, 3, 3))) ||
            (Lexer.oneToNine(value[index]) && (end = Utils.required(value, index + 1, Lexer.DIGIT, 3)))) return end;
        return start;
    }
    export function month(value: Utils.SourceArray, index: number): number {
        if ((value[index] === 0x30 && Lexer.oneToNine(value[index + 1])) ||
            (value[index] === 0x31 && value[index + 1] >= 0x30 && value[index + 1] <= 0x32)) return index + 2;
        return index;
    }
    export function day(value: Utils.SourceArray, index: number): number {
        if ((value[index] === 0x30 && Lexer.oneToNine(value[index + 1])) ||
            ((value[index] === 0x31 || value[index] === 0x32) && Lexer.DIGIT(value[index + 1])) ||
            (value[index] === 0x33 && (value[index + 1] === 0x30 || value[index + 1] === 0x31))) return index + 2;
        return index;
    }
    export function hour(value: Utils.SourceArray, index: number): number {
        if (((value[index] === 0x30 || value[index] === 0x31) && Lexer.DIGIT(value[index + 1])) ||
            (value[index] === 0x32 && (value[index + 1] === 0x30 || value[index + 1] === 0x31 || value[index + 1] === 0x32 || value[index + 1] === 0x33))) return index + 2;
        return index;
    }
    export function minute(value: Utils.SourceArray, index: number): number {
        return Lexer.zeroToFiftyNine(value, index);
    }
    export function second(value: Utils.SourceArray, index: number): number {
        return Lexer.zeroToFiftyNine(value, index);
    }
    export function fractionalSeconds(value: Utils.SourceArray, index: number): number {
        return Utils.required(value, index, DIGIT, 1, 12);
    }
    export function geographyPrefix(value: Utils.SourceArray, index: number): number {
        return Utils.equals(value, index, "geography") ? index + 9 : index;
    }
    export function geometryPrefix(value: Utils.SourceArray, index: number): number {
        return Utils.equals(value, index, "geometry") ? index + 8 : index;
    }
    export function identifierLeadingCharacter(value: number): boolean {
        return Lexer.ALPHA(value) || value === 0x5f;
    }
    export function identifierCharacter(value: number): boolean {
        return Lexer.identifierLeadingCharacter(value) || Lexer.DIGIT(value);
    }
    export function beginObject(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        if (Utils.equals(value, index, "{")) index++;
        else if (Utils.equals(value, index, "%7B")) index += 3;
        if (index === bws) return start;

        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function endObject(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        if (Utils.equals(value, index, "}")) index++;
        else if (Utils.equals(value, index, "%7D")) index += 3;
        if (index === bws) return start;

        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function beginArray(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        if (Utils.equals(value, index, "[")) index++;
        else if (Utils.equals(value, index, "%5B")) index += 3;
        if (index === bws) return start;

        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function endArray(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        if (Utils.equals(value, index, "]")) index++;
        else if (Utils.equals(value, index, "%5D")) index += 3;
        if (index === bws) return start;

        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function quotationMark(value: Utils.SourceArray, index: number): number {
        if (Lexer.DQUOTE(value[index])) return index + 1;
        if (Utils.equals(value, index, "%22")) return index + 3;
        return index;
    }
    export function nameSeparator(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        let colon = Lexer.COLON(value, index);
        if (!colon) return start;
        index = colon;
        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function valueSeparator(value: Utils.SourceArray, index: number): number {
        let bws = Lexer.BWS(value, index);
        let start = index;
        index = bws;
        let comma = Lexer.COMMA(value, index);
        if (!comma) return start;
        index = comma;
        bws = Lexer.BWS(value, index);
        return bws;
    }
    export function escape(value: Utils.SourceArray, index: number): number {
        if (Utils.equals(value, index, "\\")) return index + 1;
        if (Utils.equals(value, index, "%5C")) return index + 3;
        return index;
    }
}

export default Lexer;
