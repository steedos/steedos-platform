import Utils from "./utils";
import Lexer from "./lexer";
import PrimitiveLiteral from "./primitiveLiteral";
import NameOrIdentifier from "./nameOrIdentifier";
import ArrayOrObject from "./json";

export namespace Expressions {
    export function commonExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = PrimitiveLiteral.primitiveLiteral(value, index) ||
            parameterAlias(value, index) ||
            ArrayOrObject.arrayOrObject(value, index) ||
            rootExpr(value, index) ||
            methodCallExpr(value, index) ||
            firstMemberExpr(value, index) ||
            functionExpr(value, index) ||
            negateExpr(value, index) ||
            parenExpr(value, index) ||
            castExpr(value, index);
        if (!token) return;

        let expr = addExpr(value, token.next) ||
            subExpr(value, token.next) ||
            mulExpr(value, token.next) ||
            divExpr(value, token.next) ||
            modExpr(value, token.next);

        if (expr) {
            token.value = {
                left: Lexer.clone(token),
                right: expr.value
            };
            token.next = expr.value.next;
            token.type = expr.type;
            token.raw = Utils.stringify(value, token.position, token.next);
        }

        if (token) return Lexer.tokenize(value, token.position, token.next, token, Lexer.TokenType.CommonExpression);
    }

    export function boolCommonExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = isofExpr(value, index) ||
            boolMethodCallExpr(value, index) ||
            notExpr(value, index) ||
            commonExpr(value, index) ||
            boolParenExpr(value, index);

        if (!token) return;
        let commonMoreExpr = undefined;
        if (token.type === Lexer.TokenType.CommonExpression) {
            commonMoreExpr = eqExpr(value, token.next) ||
            neExpr(value, token.next) ||
            ltExpr(value, token.next) ||
            leExpr(value, token.next) ||
            gtExpr(value, token.next) ||
            geExpr(value, token.next) ||
            hasExpr(value, token.next) ||
            inExpr(value, token.next)
            ;

            if (commonMoreExpr) {
                token.value = {
                    left: token.value,
                    right: commonMoreExpr.value
                };
                token.next = commonMoreExpr.value.next;
                token.type = commonMoreExpr.type;
                token.raw = Utils.stringify(value, token.position, token.next);
            }
        }

        let expr = andExpr(value, token.next) ||
            orExpr(value, token.next);

        if (expr) {
            let left = Lexer.clone(token);
            token.next = expr.value.next;
            token.value = {
                left: left,
                right: expr.value
            };
            token.type = expr.type;
            token.raw = Utils.stringify(value, token.position, token.next);

            if (token.type === Lexer.TokenType.AndExpression && token.value.right.type === Lexer.TokenType.OrExpression) {
                token.value.left = Lexer.tokenize(value, token.value.left.position, token.value.right.value.left.next, {
                    left: token.value.left,
                    right: token.value.right.value.left
                }, token.type);
                token.type = token.value.right.type;
                token.value.right = token.value.right.value.right;
            }
        }

        return token;
    }

    export function andExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let rws = Lexer.RWS(value, index);
        if (rws === index || !Utils.equals(value, rws, "and")) return;
        let start = index;
        index = rws + 3;
        rws = Lexer.RWS(value, index);
        if (rws === index) return;
        index = rws;
        let token = boolCommonExpr(value, index);
        if (!token) return;

        return Lexer.tokenize(value, start, index, token, Lexer.TokenType.AndExpression);
    }

    export function orExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let rws = Lexer.RWS(value, index);
        if (rws === index || !Utils.equals(value, rws, "or")) return;
        let start = index;
        index = rws + 2;
        rws = Lexer.RWS(value, index);
        if (rws === index) return;
        index = rws;
        let token = boolCommonExpr(value, index);
        if (!token) return;

        return Lexer.tokenize(value, start, index, token, Lexer.TokenType.OrExpression);
    }

    export function leftRightExpr(value: Utils.SourceArray, index: number, expr: string, tokenType: Lexer.TokenType): Lexer.Token {
        let rws = Lexer.RWS(value, index);
        if (rws === index) return;
        let start = index;
        index = rws;
        if (!Utils.equals(value, index, expr)) return;
        index += expr.length;
        rws = Lexer.RWS(value, index);
        if (rws === index) return;
        index = rws;
        let token = commonExpr(value, index);
        if (!token) return;
        return Lexer.tokenize(value, start, index, token.value, tokenType);
    }
    export function eqExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "eq", Lexer.TokenType.EqualsExpression); }
    export function neExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "ne", Lexer.TokenType.NotEqualsExpression); }
    export function ltExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "lt", Lexer.TokenType.LesserThanExpression); }
    export function leExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "le", Lexer.TokenType.LesserOrEqualsExpression); }
    export function gtExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "gt", Lexer.TokenType.GreaterThanExpression); }
    export function geExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "ge", Lexer.TokenType.GreaterOrEqualsExpression); }
    export function hasExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "has", Lexer.TokenType.HasExpression); }

    export function addExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "add", Lexer.TokenType.AddExpression); }
    export function subExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "sub", Lexer.TokenType.SubExpression); }
    export function mulExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "mul", Lexer.TokenType.MulExpression); }
    export function divExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "div", Lexer.TokenType.DivExpression); }
    export function modExpr(value: Utils.SourceArray, index: number): Lexer.Token { return leftRightExpr(value, index, "mod", Lexer.TokenType.ModExpression); }

    export function inExpr(value: Utils.SourceArray, index: number): Lexer.Token { 
        // return leftRightExpr(value, index, "in", Lexer.TokenType.InExpression); 
        const expr: string = 'in';
        const tokenType: Lexer.TokenType = Lexer.TokenType.InExpression;
        let rws = Lexer.RWS(value, index);
        if (rws === index) return;
        let start = index;
        index = rws;
        if (!Utils.equals(value, index, expr)) return;
        index += expr.length;
        rws = Lexer.RWS(value, index);
        if (rws === index) return;
        index = rws;
        let token = boolCommonExpr(value, index);
        if (!token) return;

        return Lexer.tokenize(value, start, index, token.value, tokenType);
    }

    export function notExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "not")) return;
        let start = index;
        index += 3;
        let rws = Lexer.RWS(value, index);
        if (rws === index) return;
        index = rws;
        let token = boolCommonExpr(value, index);
        if (!token) return;

        return Lexer.tokenize(value, start, token.next, token, Lexer.TokenType.NotExpression);
    }

    export function boolParenExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;
        index = Lexer.BWS(value, index);
        let token = boolCommonExpr(value, index);
        if (!token) return;
        index = Lexer.BWS(value, token.next);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, token, Lexer.TokenType.BoolParenExpression);
    }
    export function parenExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;
        index = Lexer.BWS(value, index);
        let token = commonExpr(value, index);
        if (!token) return;
        index = Lexer.BWS(value, token.next);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, token.value, Lexer.TokenType.ParenExpression);
    }

    export function boolMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        return endsWithMethodCallExpr(value, index) ||
            startsWithMethodCallExpr(value, index) ||
            containsMethodCallExpr(value, index) ||
            intersectsMethodCallExpr(value, index);
    }
    export function methodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        return indexOfMethodCallExpr(value, index) ||
            toLowerMethodCallExpr(value, index) ||
            toUpperMethodCallExpr(value, index) ||
            trimMethodCallExpr(value, index) ||
            substringMethodCallExpr(value, index) ||
            substringOfMethodCallExpr(value, index) ||
            concatMethodCallExpr(value, index) ||
            lengthMethodCallExpr(value, index) ||
            yearMethodCallExpr(value, index) ||
            monthMethodCallExpr(value, index) ||
            dayMethodCallExpr(value, index) ||
            hourMethodCallExpr(value, index) ||
            minuteMethodCallExpr(value, index) ||
            secondMethodCallExpr(value, index) ||
            fractionalsecondsMethodCallExpr(value, index) ||
            totalsecondsMethodCallExpr(value, index) ||
            dateMethodCallExpr(value, index) ||
            timeMethodCallExpr(value, index) ||
            roundMethodCallExpr(value, index) ||
            floorMethodCallExpr(value, index) ||
            ceilingMethodCallExpr(value, index) ||
            distanceMethodCallExpr(value, index) ||
            geoLengthMethodCallExpr(value, index) ||
            totalOffsetMinutesMethodCallExpr(value, index) ||
            minDateTimeMethodCallExpr(value, index) ||
            maxDateTimeMethodCallExpr(value, index) ||
            nowMethodCallExpr(value, index);
    }
    export function methodCallExprFactory(value: Utils.SourceArray, index: number, method: string, min?: number, max?: number): Lexer.Token {
        if (typeof min === "undefined") min = 0;
        if (typeof max === "undefined") max = min;

        if (!Utils.equals(value, index, method)) return;
        let start = index;
        index += method.length;
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;
        index = Lexer.BWS(value, index);
        let parameters;
        if (min > 0) {
            parameters = [];
            while (parameters.length < max) {
                let expr = commonExpr(value, index);
                if (parameters.length < min && !expr) return;
                else if (expr) {
                    parameters.push(expr.value);
                    index = expr.next;
                    index = Lexer.BWS(value, index);
                    let comma = Lexer.COMMA(value, index);
                    if (parameters.length < min && !comma) return;
                    if (comma) index = comma;
                    else break;
                    index = Lexer.BWS(value, index);
                } else break;
            }
        }
        index = Lexer.BWS(value, index);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, {
            method: method,
            parameters: parameters
        }, Lexer.TokenType.MethodCallExpression);
    }
    export function containsMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "contains", 2); }
    export function startsWithMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "startswith", 2); }
    export function endsWithMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "endswith", 2); }
    export function lengthMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "length", 1); }
    export function indexOfMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "indexof", 2); }
    export function substringMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "substring", 2, 3); }
    export function substringOfMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "substringof", 2); }
    export function toLowerMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "tolower", 1); }
    export function toUpperMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "toupper", 1); }
    export function trimMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "trim", 1); }
    export function concatMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "concat", 2); }

    export function yearMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "year", 1); }
    export function monthMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "month", 1); }
    export function dayMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "day", 1); }
    export function hourMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "hour", 1); }
    export function minuteMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "minute", 1); }
    export function secondMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "second", 1); }
    export function fractionalsecondsMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "fractionalseconds", 1); }
    export function totalsecondsMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "totalseconds", 1); }
    export function dateMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "date", 1); }
    export function timeMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "time", 1); }
    export function totalOffsetMinutesMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "totaloffsetminutes", 1); }

    export function minDateTimeMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "mindatetime", 0); }
    export function maxDateTimeMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "maxdatetime", 0); }
    export function nowMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "now", 0); }

    export function roundMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "round", 1); }
    export function floorMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "floor", 1); }
    export function ceilingMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "ceiling", 1); }

    export function distanceMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "geo.distance", 2); }
    export function geoLengthMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "geo.length", 1); }
    export function intersectsMethodCallExpr(value: Utils.SourceArray, index: number): Lexer.Token { return methodCallExprFactory(value, index, "geo.intersects", 2); }

    export function isofExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "isof")) return;
        let start = index;
        index += 4;
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;
        index = Lexer.BWS(value, index);
        let expr = commonExpr(value, index);
        if (expr) {
            index = expr.next;
            index = Lexer.BWS(value, index);
            let comma = Lexer.COMMA(value, index);
            if (!comma) return;
            index = comma;
            index = Lexer.BWS(value, index);
        }
        let typeName = NameOrIdentifier.qualifiedTypeName(value, index);
        if (!typeName) return;
        index = typeName.next;
        index = Lexer.BWS(value, index);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, {
            target: expr,
            typename: typeName
        }, Lexer.TokenType.IsOfExpression);
    }
    export function castExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "cast")) return;
        let start = index;
        index += 4;
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;
        index = Lexer.BWS(value, index);
        let expr = commonExpr(value, index);
        if (expr) {
            index = expr.next;
            index = Lexer.BWS(value, index);
            let comma = Lexer.COMMA(value, index);
            if (!comma) return;
            index = comma;
            index = Lexer.BWS(value, index);
        }
        let typeName = NameOrIdentifier.qualifiedTypeName(value, index);
        if (!typeName) return;
        index = typeName.next;
        index = Lexer.BWS(value, index);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, {
            target: expr,
            typename: typeName
        }, Lexer.TokenType.CastExpression);
    }

    export function negateExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (value[index] !== 0x2d) return;
        let start = index;
        index++;
        index = Lexer.BWS(value, index);
        let expr = commonExpr(value, index);
        if (!expr) return;

        return Lexer.tokenize(value, start, expr.next, expr, Lexer.TokenType.NegateExpression);
    }

    export function firstMemberExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = inscopeVariableExpr(value, index);
        let member;
        let start = index;

        if (token) {
            if (value[token.next] === 0x2f) {
                index = token.next + 1;
                member = memberExpr(value, index);
                if (!member) return;

                return Lexer.tokenize(value, start, member.next, [token, member], Lexer.TokenType.FirstMemberExpression);
            }
        } else member = memberExpr(value, index);

        token = token || member;
        if (!token) return;

        return Lexer.tokenize(value, start, token.next, token, Lexer.TokenType.FirstMemberExpression);
    }
    export function memberExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let start = index;
        let token = NameOrIdentifier.qualifiedEntityTypeName(value, index);
        if (token) {
            if (value[token.next] !== 0x2f) return;
            index = token.next + 1;
        }

        let next = propertyPathExpr(value, index) ||
            boundFunctionExpr(value, index);
        if (!next) return;
        return Lexer.tokenize(value, start, next.next, token ? { name: token, value: next } : next, Lexer.TokenType.MemberExpression);
    }
    export function propertyPathExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token: any = NameOrIdentifier.odataIdentifier(value, index);
        let start = index;
        if (token) {
            index = token.next;
            let nav = collectionPathExpr(value, token.next) ||
                collectionNavigationExpr(value, token.next) ||
                singleNavigationExpr(value, token.next) ||
                complexPathExpr(value, token.next) ||
                singlePathExpr(value, token.next);

            if (nav) {
                index = nav.next;
                token = {
                    current: Lexer.clone(token),
                    next: nav
                };
            }
        }else if (!token) {
            token = NameOrIdentifier.streamProperty(value, index);
            if (token) index = token.next;
        }

        if (!token) return;
        return Lexer.tokenize(value, start, index, token, Lexer.TokenType.PropertyPathExpression);
    }
    export function inscopeVariableExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        return implicitVariableExpr(value, index) ||
            (isLambdaPredicate ? lambdaVariableExpr(value, index) : undefined);
    }
    export function implicitVariableExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "$it")) return Lexer.tokenize(value, index, index + 3, "$it", Lexer.TokenType.ImplicitVariableExpression);
    }
    let isLambdaPredicate = false;
    let hasLambdaVariableExpr = false;
    export function lambdaVariableExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.LambdaVariableExpression);
        if (token) {
            hasLambdaVariableExpr = true;
            return token;
        }
    }
    export function lambdaPredicateExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        isLambdaPredicate = true;
        let token = boolCommonExpr(value, index);
        isLambdaPredicate = false;
        if (token && hasLambdaVariableExpr) {
            hasLambdaVariableExpr = false;
            return Lexer.tokenize(value, token.position, token.next, token, Lexer.TokenType.LambdaPredicateExpression);
        }
    }
    export function anyExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "any")) return;
        let start = index;
        index += 3;
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;
        index = Lexer.BWS(value, index);
        let variable = lambdaVariableExpr(value, index);
        let predicate;
        if (variable) {
            index = variable.next;
            index = Lexer.BWS(value, index);
            let colon = Lexer.COLON(value, index);
            if (!colon) return;
            index = colon;
            index = Lexer.BWS(value, index);
            predicate = lambdaPredicateExpr(value, index);
            if (!predicate) return;
            index = predicate.next;
        }
        index = Lexer.BWS(value, index);
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, {
            variable: variable,
            predicate: predicate
        }, Lexer.TokenType.AnyExpression);
    }
    export function allExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "all")) return;
        let start = index;
        index += 3;

        let open = Lexer.OPEN(value, index);
        if (!open) return;
        index = open;

        index = Lexer.BWS(value, index);
        let variable = lambdaVariableExpr(value, index);
        if (!variable) return;
        index = variable.next;

        index = Lexer.BWS(value, index);

        let colon = Lexer.COLON(value, index);
        if (!colon) return;
        index = colon;

        index = Lexer.BWS(value, index);

        let predicate = lambdaPredicateExpr(value, index);
        if (!predicate) return;
        index = predicate.next;

        index = Lexer.BWS(value, index);

        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, {
            variable: variable,
            predicate: predicate
        }, Lexer.TokenType.AllExpression);
    }

    export function collectionNavigationExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let start = index;
        let entity, predicate, navigation, path;
        if (value[index] === 0x2f) {
            index++;
            entity = NameOrIdentifier.qualifiedEntityTypeName(value, index);
            if (!entity) return;
            index = entity.next;
        }

        predicate = keyPredicate(value, index);

        if (predicate) {
            index = predicate.next;
            navigation = singleNavigationExpr(value, index);
            if (navigation) index = navigation.next;
        } else {
            path = collectionPathExpr(value, index);
            if (path) index = path.next;
        }

        if (index > start) {
            return Lexer.tokenize(value, start, index, {
                entity: entity,
                predicate: predicate,
                navigation: navigation,
                path: path
            }, Lexer.TokenType.CollectionNavigationExpression);
        }
    }
    export function keyPredicate(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        return simpleKey(value, index, metadataContext) ||
            compoundKey(value, index);
    }
    export function simpleKey(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;

        let token = keyPropertyValue(value, index);
        if (!token) return;

        let close = Lexer.CLOSE(value, token.next);
        if (!close) return;

        let key;
        if (typeof metadataContext === "object" &&
            metadataContext.key &&
            metadataContext.key.propertyRefs &&
            metadataContext.key.propertyRefs[0] &&
            metadataContext.key.propertyRefs[0].name) {
            key = metadataContext.key.propertyRefs[0].name;
        }

        return Lexer.tokenize(value, start, close, { key: key, value: token }, Lexer.TokenType.SimpleKey);
    }
    export function compoundKey(value: Utils.SourceArray, index: number): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;

        let pair = keyValuePair(value, index);
        if (!pair) return;

        let keys = [];
        while (pair) {
            keys.push(pair);
            let comma = Lexer.COMMA(value, pair.next);
            if (comma) pair = keyValuePair(value, comma);
            else pair = null;
        }

        index = keys[keys.length - 1].next;
        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, keys, Lexer.TokenType.CompoundKey);
    }
    export function keyValuePair(value: Utils.SourceArray, index: number): Lexer.Token {
        let prop = NameOrIdentifier.primitiveKeyProperty(value, index) ||
            keyPropertyAlias(value, index);

        if (!prop) return;
        let eq = Lexer.EQ(value, prop.next);
        if (!eq) return;

        let val = keyPropertyValue(value, eq);
        if (val) return Lexer.tokenize(value, index, val.next, {
            key: prop,
            value: val
        }, Lexer.TokenType.KeyValuePair);
    }
    export function keyPropertyValue(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = PrimitiveLiteral.primitiveLiteral(value, index);
        if (token) {
            token.type = Lexer.TokenType.KeyPropertyValue;
            return token;
        }
    }
    export function keyPropertyAlias(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.KeyPropertyAlias); }

    export function singleNavigationExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (value[index] !== 0x2f) return;
        let member = memberExpr(value, index + 1);
        if (member) return Lexer.tokenize(value, index, member.next, member, Lexer.TokenType.SingleNavigationExpression);
    }
    export function collectionPathExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = countExpr(value, index);
        if (!token) {
            if (value[index] === 0x2f) {
                token = boundFunctionExpr(value, index + 1) ||
                anyExpr(value, index + 1) ||
                allExpr(value, index + 1);
            }
        }

        if (token) return Lexer.tokenize(value, index, token.next, token, Lexer.TokenType.CollectionPathExpression);
    }
    export function complexPathExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (value[index] !== 0x2f) return;
        let start = index;
        index++;
        let token = NameOrIdentifier.qualifiedComplexTypeName(value, index);
        if (token) {
            if (value[token.next] !== 0x2f) return;
            index = token.next + 1;
        }

        let expr = propertyPathExpr(value, index) ||
            boundFunctionExpr(value, index);

        if (expr) return Lexer.tokenize(value, start, expr.next, token ? [token, expr] : [expr], Lexer.TokenType.ComplexPathExpression);
    }
    export function singlePathExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (value[index] !== 0x2f) return;
        let boundFunction = boundFunctionExpr(value, index + 1);
        if (boundFunction) return Lexer.tokenize(value, index, boundFunction.next, boundFunction, Lexer.TokenType.SinglePathExpression);
    }
    export function functionExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        let namespaceNext = NameOrIdentifier.namespace(value, index);
        if (namespaceNext === index || value[namespaceNext] !== 0x2e) return;
        let start = index;
        index = namespaceNext + 1;

        let token = NameOrIdentifier.odataIdentifier(value, index);

        if (!token) return;
        token.position = start;
        token.value.namespace = Utils.stringify(value, start, namespaceNext);
        token.raw = Utils.stringify(value, start, token.next);

        index = token.next;
        let params = functionExprParameters(value, index);

        if (!params) return;

        index = params.next;
        let expr = collectionPathExpr(value, index) ||
            collectionNavigationExpr(value, index) ||
            singleNavigationExpr(value, index) ||
            complexPathExpr(value, index) ||
            singlePathExpr(value, index);

        if (expr) index = expr.next;

        return Lexer.tokenize(value, start, index, {
            fn: token,
            params: params,
            expression: expr
        }, Lexer.TokenType.FunctionExpression);
    }
    export function boundFunctionExpr(value: Utils.SourceArray, index: number): Lexer.Token { return functionExpr(value, index); }

    export function functionExprParameters(value: Utils.SourceArray, index: number): Lexer.Token {
        let open = Lexer.OPEN(value, index);
        if (!open) return;
        let start = index;
        index = open;

        let params = [];
        let expr = functionExprParameter(value, index);
        while (expr) {
            params.push(expr);
            let comma = Lexer.COMMA(value, expr.next);
            if (comma) {
                index = comma;
                expr = functionExprParameter(value, index);
                if (!expr) return;
            } else {
                index = expr.next;
                expr = null;
            }
        }

        let close = Lexer.CLOSE(value, index);
        if (!close) return;
        index = close;

        return Lexer.tokenize(value, start, index, params, Lexer.TokenType.FunctionExpressionParameters);
    }
    export function functionExprParameter(value: Utils.SourceArray, index: number): Lexer.Token {
        let name = parameterName(value, index);
        if (!name) return;
        let eq = Lexer.EQ(value, name.next);
        if (!name || !eq) return;

        let start = index;
        index = eq;

        let param = parameterAlias(value, index) ||
            parameterValue(value, index);

        if (!param) return;
        return Lexer.tokenize(value, start, param.next, {
            name: name,
            value: param
        }, Lexer.TokenType.FunctionExpressionParameter);
    }
    export function parameterName(value: Utils.SourceArray, index: number): Lexer.Token { return NameOrIdentifier.odataIdentifier(value, index, Lexer.TokenType.ParameterName); }
    export function parameterAlias(value: Utils.SourceArray, index: number): Lexer.Token {
        let at = Lexer.AT(value, index);
        if (!at) return;
        let id = NameOrIdentifier.odataIdentifier(value, at);
        if (id) return Lexer.tokenize(value, index, id.next, id.value, Lexer.TokenType.ParameterAlias);
    }
    export function parameterValue(value: Utils.SourceArray, index: number): Lexer.Token {
        let token = ArrayOrObject.arrayOrObject(value, index) ||
            commonExpr(value, index);
        if (token) return Lexer.tokenize(value, index, token.next, token.value, Lexer.TokenType.ParameterValue);
    }

    export function countExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "/$count")) return Lexer.tokenize(value, index, index + 7, "/$count", Lexer.TokenType.CountExpression);
    }
    export function refExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "/$ref")) return Lexer.tokenize(value, index, index + 5, "/$ref", Lexer.TokenType.RefExpression);
    }
    export function valueExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (Utils.equals(value, index, "/$value")) return Lexer.tokenize(value, index, index + 7, "/$value", Lexer.TokenType.ValueExpression);
    }

    export function rootExpr(value: Utils.SourceArray, index: number): Lexer.Token {
        if (!Utils.equals(value, index, "$root/")) return;
        let start = index;
        index += 6;

        let entitySet = NameOrIdentifier.entitySetName(value, index);
        let predicate, entity, token;
        if (entitySet) predicate = keyPredicate(value, entitySet.next);
        if (!(entitySet && predicate)) {
            entity = NameOrIdentifier.singletonEntity(value, index);
            if (!entity) return;
            token = {
                entity: entity
            };
        }else token = {
            entitySet: entitySet,
            keys: predicate
        };

        index = (predicate || entity).next;
        let nav = singleNavigationExpr(value, index);
        if (nav) index = nav.next;

        return Lexer.tokenize(value, start, index, {
            current: token,
            next: nav
        }, Lexer.TokenType.RootExpression);
    }
}

export default Expressions;
