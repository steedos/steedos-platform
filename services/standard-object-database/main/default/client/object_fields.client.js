Steedos.ObjectFieldManager = {};

Steedos.ObjectFieldManager.getSummaryFiltersOperation = function(field_type) {
  var operations, optionals;
  optionals = {
    equal: {
      label: t("creator_filter_operation_equal"),
      value: "="
    },
    unequal: {
      label: t("creator_filter_operation_unequal"),
      value: "<>"
    },
    less_than: {
      label: t("creator_filter_operation_less_than"),
      value: "<"
    },
    greater_than: {
      label: t("creator_filter_operation_greater_than"),
      value: ">"
    },
    less_or_equal: {
      label: t("creator_filter_operation_less_or_equal"),
      value: "<="
    },
    greater_or_equal: {
      label: t("creator_filter_operation_greater_or_equal"),
      value: ">="
    },
    contains: {
      label: t("creator_filter_operation_contains"),
      value: "contains"
    },
    not_contain: {
      label: t("creator_filter_operation_does_not_contain"),
      value: "notcontains"
    },
    starts_with: {
      label: t("creator_filter_operation_starts_with"),
      value: "startswith"
    }
  };
  if (field_type === void 0) {
    return _.values(optionals);
  }
  operations = [];
  if (field_type === "text" || field_type === "textarea" || field_type === "html" || field_type === "code") {
    operations.push(optionals.equal, optionals.unequal, optionals.contains, optionals.not_contain, optionals.starts_with);
  } else if (field_type === "lookup" || field_type === "master_detail" || field_type === "select") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (["currency", "number", "percent", "date", "datetime"].indexOf(field_type) > -1){
    operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal);
  } else if (field_type === "boolean") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "checkbox") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "[text]") {
    operations.push(optionals.equal, optionals.unequal);
  } else {
    operations.push(optionals.equal, optionals.unequal);
  }
  return operations;
};

(function () {
  try {
    var styleCss = $(`<style>
      .defaultValue_field.steedos-defaultValue-flex-grow div:first-child {
        /*有steedos-defaultValue-flex-grow样式类时才加上flex-grow，是为了排除掉html字段类型，因为html类型字段不可以配置flex-grow属性(配置为0或unset也不行)，否则html字段类型的顶部toolbar高度样式异常*/
        flex-grow: 1;
      }
      
      .defaultValue_field .defaultValue_field_formula {
        /* margin: 4px; */
      }
      
      .defaultValue_field .defaultValue_field_formula .antd-Form-label {
        visibility: visible;
      }
      
      .defaultValue_field .defaultValue_field_formula_visible {
        flex-grow: 1;
      }
      
      .defaultValue_field .defaultValue_field_formula_visible .antd-Form-label .antd-TplField {
        visibility: visible;
      }
      
      .defaultValue_field .defaultValue_field_hidden {
        display: none;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden {
        flex-grow: 0;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden > .antd-Form-label {
        display: none;
      }
      .defaultValue_field .defaultValue_field_formula_hidden > .antd-Form-value .antd-FormulaPicker .antd-InputBox {
        display: none;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden {
        margin-left: 0.5rem;
      }
      
      .defaultValue_field.steedos-defaultValue-html-edit .defaultValue_field_formula_hidden {
        margin-left: 7rem;
      }

      @media (max-width: 767px) {
        .defaultValue_field.steedos-defaultValue-html-edit .defaultValue_field_formula_hidden {
          margin-left: 0rem;
        }
      }
      </style>`);
    $("head").append(styleCss);
  } catch (error) {
    console.log(error);
  }
})();