/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-06-09 14:42:12
 * @Description: 
 */
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
          .defaultValue_field .antd-Form-item:first-child{
              flex-grow: 1;
          }
          .defaultValue_field .defaultValue_field_formula{
              margin: 4px;
          }
          .defaultValue_field .defaultValue_field_formula .antd-Form-label{
              visibility: hidden;
          }

      </style>`);
      $("head").append(styleCss);
  } catch (error) {
      console.log(error);
  }
})();