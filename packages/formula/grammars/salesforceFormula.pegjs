{
  const operators = {
    '^': {
      functionName: 'exponentiate',
      rightAssociative: true,
      precedence: 4,
    },
    '*': {
      functionName: 'multiply',
      rightAssociative: false,
      precedence: 3,
    },
    '/': {
      functionName: 'divide',
      rightAssociative: false,
      precedence: 3,
    },
    '+': {
      functionName: 'add',
      rightAssociative: false,
      precedence: 2,
    },
    '-': {
      functionName: 'subtract',
      rightAssociative: false,
      precedence: 2,
    }
  }

  function stringLiteral(chars) {
      return {
        type: "literal",
        value: chars.join(""),
        dataType: "text",
        options: {
          length: chars.length
        }
      };
  }

  function optionalList(value) {
    return value !== null ? value[0] : [];
  }

  // Shunting Yard Algorithm to order operands by arithmetic precedence
  function infixToPostfixAst(tokens) {
    const operatorStack = []
    const operandStack = []

    tokens.forEach((token) => {
      if(token.type === 'operator') {
        while(operatorStack.length > 0) {
          if(operatorStack[operatorStack.length - 1].precedence < token.precedence) {
            break
          }

          let operator = operatorStack.pop()
          let operand2 = operandStack.pop()
          let operand1 = operandStack.pop()

          operandStack.push(buildOperatorNode(operator, operand1, operand2))
        }

        operatorStack.push(token)
      }
      else {
        operandStack.push(token)
      }
    })

    while(operatorStack.length > 0) {
      let operator = operatorStack.pop()
      let operand2 = operandStack.pop()
      let operand1 = operandStack.pop()

      operandStack.push(buildOperatorNode(operator, operand1, operand2))
    }

    return operandStack.pop()
  }

  function buildOperatorNode(operator, arg1, arg2) {
    return {
      type: "callExpression",
      id: operator.functionName,
      arguments: [arg1, arg2]
    }
  }
}

start
  = PrimaryExpression

PrimaryExpression
  = LogicalConcatinationExpression
  / UnaryExpression
  / CallExpression
  / Identifier
  / Literal

Term
  = CallExpression
  / Identifier
  / Literal
  / "(" __ expression:ArithmeticExpression __ ")" { return expression; }

CallExpression
  = id:FunctionIdentifier __ args:Arguments {
    return {
      type: "callExpression",
      id: id,
      arguments: optionalList(args)
    }
  }

ArithmeticExpression
  = head:Term __ tail:(ArithmeticPart)* {
    return infixToPostfixAst([head, tail].flat(2))
  }

ArithmeticPart
  = __ op:ArithmeticOperator __ expr:Term
  {
    return [Object.assign({ type: 'operator' }, operators[op]), expr]
  }

ArithmeticOperator
  = "^"
  / "*"
  / "/"
  / "+"
  / "-"

LogicalConcatinationExpression
  = head:(LogicalCompareExpression) __ op:(LogicalConcatinationOperator) __ tail:LogicalConcatinationExpression
  {
    var name;
    switch(op) {
      case "||":
        name = "or"
        break;
      case "&&":
        name = "and"
        break;
      default:
    }

    return {
      type: "callExpression",
      id: name,
      arguments: [head, tail]
    }
  }
  / LogicalCompareExpression

LogicalCompareExpression
  = head:(ArithmeticExpression) __ op:(LogicalCompareOperator / ConcatinationOperator) __ tail:LogicalCompareExpression
  {
    var name;
    switch(op) {
      case "<":
        name = "lessThan"
        break;
      case "<=":
        name = "lessThanOrEqual"
        break;
      case ">":
        name = "greaterThan"
        break;
      case ">=":
        name = "greaterThanOrEqual"
        break;
      case "==":
      case "=":
        name = "equal"
        break;
      case "!=":
      case "<>":
        name = "unequal"
        break;
      case "&":
        name = "add"
        break;
      default:
    }

    return {
      type: "callExpression",
      id: name,
      arguments: [head, tail]
    }
  }
  / ArithmeticExpression

LogicalCompareOperator
  = "<="
  / ">="
  / "<>"
  / "<"
  / ">"
  / "=="
  / "="
  / "!="

LogicalConcatinationOperator
  = "&&"
  / "||"

ConcatinationOperator
  = "&"

UnaryExpression
  = UnaryOperator __ tail:PrimaryExpression {
    return {
      type: "callExpression",
      id: "not",
      arguments: [tail]
    }
  }

UnaryOperator
  = "!"

Arguments
  = "(" __ args:(ArgumentList __)? ")" {
      return args;
    }

ArgumentList
  = args:(
    arg:PrimaryExpression __ ","? __ {
      return arg;
    }
  )+ {
    return args;
  }

FunctionIdentifier
  = id:[A-Za-z]+ { return id.join("").toLowerCase(); }

Identifier
  = !ReservedKeyword name:IdentifierName { return name; }

IdentifierName
  = head:IdentifierStart tail:IdentifierPart* {
      return {
        type: "identifier",
        name: head + tail.join("")
      };
    }

IdentifierStart
  = "_"
  / "$"
  / [A-Za-z]

IdentifierPart
  = IdentifierStart
  / '.'
  / DecimalDigit

Literal
  = StringLiteral
  / NumericLiteral
  / BooleanLiteral
  / NullLiteral

StringLiteral
  = SingleQuote chars:(Character / DoubleQuote)* SingleQuote { return stringLiteral(chars); }
  / DoubleQuote chars:(Character / SingleQuote)* DoubleQuote { return stringLiteral(chars); }

NumericLiteral
  = DecimalLiteral

DecimalLiteral
  = sign:(__ "+" / "-" __)? DecimalIntegerLiteral "." DecimalDigit* {
      var splitted = text().replace(/[\+\-]/g, "").split(".")
      return {
        type: "literal",
        value: parseFloat(text()),
        dataType: "number",
        options: {
          length: splitted[0].length,
          scale: splitted[1].length,
        }
      };
    }
  / sign:(__ "+" / "-" __)? DecimalIntegerLiteral {
      return {
        type: "literal",
        value: parseInt(text()),
        dataType: "number",
        options: {
          length: text().replace(/[\+\-]/g, "").length,
          scale: 0,
        }
      };
  }

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

BooleanLiteral
  = "true"i {
    return {
      type: "literal",
      value: true,
      dataType: "checkbox",
      options: {}
    }
  }
  / "false"i {
    return {
      type: "literal",
      value: false,
      dataType: "checkbox",
      options: {}
    }
  }

NullLiteral
  = "null"i {
    return {
      type: "literal",
      value: null,
      dataType: "null",
      options: {}
    }
  }

Character
  = !(Quote / "\\") SourceCharacter { return text(); }

Quote
 = SingleQuote
 / DoubleQuote

SingleQuote
  = '\''

DoubleQuote
  = '"'

SourceCharacter
  = .

LineTerminator
  = [\n\r\u2028\u2029]

ReservedKeyword
  = BooleanLiteral
  / NullLiteral

__
  = (WhiteSpace)*

WhiteSpace
  = "\t"
  / LineTerminator
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\u200b"
  / "\uFEFF"
