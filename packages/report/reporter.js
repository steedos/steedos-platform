var objectql = require('@steedos/objectql');

let reporter = {
  async getReport(id) {
    let object = objectql.getSteedosSchema().getObject('reports');
    let report = await object.findOne(id);
    return report;
  },
  getObject(object_name) {
    let object = objectql.getSteedosSchema().getObject(object_name);
    return object ? object.toConfig() : null;
  },
  formatObjectFields(object) {
    let fields = object.fields;
    let tempField, tempFieldType, result, index = 0;
    result = {};
    for (let key in fields) {
      tempField = fields[key];
      tempFieldType = this.convertFieldType(tempField);
      if (tempFieldType) {
        result[index] = {
          "Name": key,
          "Index": -1,
          "NameInSource": key,
          "Alias": tempField.label ? tempField.label : key,
          "Type": tempFieldType
        };
        index++;
      }
    }
    return result;
  },
  convertFieldType(tempField) {
    let type = tempField.type;
    if(!type){
      return null;
    }
    if (tempField.multiple) {
      // 忽略所有数组字段类型
      return null;
    }
    let ignoreTypes = ["[text]", "[phone]", "password", "[Object]", "checkbox", "grid"];
    if(ignoreTypes.includes(type)){
      // 忽略这些字段类型
      return null;
    }
    let defaultType = "System.String";
    switch(type){
      case "date":
        return "System.DateTime"
      case "datetime":
        return "System.DateTime"
      case "currency":
        return "System.Double"
      case "number":
        return "System.Double"
      case "boolean":
        return "System.Boolean"
      case "filesize":
        return "System.Double"
      case "Object":
        return "System.Object"
      case "object":
        return "System.Object"
      case "location":
        return "System.Object"
      default:
        return defaultType
    }
  },
  getDatabases(report, object) {
    if (!(report && object)){
      return {};
    }
    let dataUrl = `/api/report/data/${report._id}`;
    return {
      "0": {
        "Ident": "StiJsonDatabase",
        "Name": report.name,
        "Alias": report.name,
        "PathData": dataUrl
      }
    };
  },
  getDataSources(report, object) {
    if (!(report && object)) {
      return {};
    }
    let columns = this.formatObjectFields(object);
    return {
      "0": {
        "Ident": "StiDataTableSource",
        "Name": object.name,
        "Alias": object.label,
        "Columns": columns,
        "NameInSource": `${report.name}.${object.name}`
      }
    };
  },
  getReportMrt(report) {
    let object = this.getObject(report.object_name);
    let databases = this.getDatabases(report, object);
    let dataSources = this.getDataSources(report, object);
    return {
      "ReportVersion": "2019.2.1",
      "ReportGuid": "448559cd48188338031dcb6edae3a534",
      "ReportName": "TableSimpleTable",
      "ReportAlias": "TableSimpleTable",
      "ReportFile": "kJ4ay8atFMvhdt3oa.mrt",
      "ReportAuthor": "Stimulsoft",
      "ReportDescription": "This sample demontrates how to create a simple report using the Table component.",
      "ReportCreated": "/Date(-28800000+0800)/",
      "ReportChanged": "/Date(-28800000+0800)/",
      "EngineVersion": "EngineV2",
      "CalculationMode": "Interpretation",
      "ReportUnit": "HundredthsOfInch",
      "PreviewSettings": 268435455,
      "Styles": {
        "0": {
          "Ident": "StiStyle",
          "Name": "Header2",
          "HorAlignment": "Center",
          "VertAlignment": "Center",
          "Font": "Segoe UI;21.75;Bold;",
          "Border": "Bottom;158,158,158;;;;;;solid:Black",
          "Brush": "solid:Transparent",
          "TextBrush": "solid:158,158,158",
          "NegativeTextBrush": "solid:Red"
        },
        "1": {
          "Ident": "StiStyle",
          "Name": "Header3",
          "HorAlignment": "Center",
          "VertAlignment": "Center",
          "Font": "Segoe UI;12;Bold;",
          "Border": "Left, Right;White;;;;;;solid:Black",
          "Brush": "solid:77,182,172",
          "TextBrush": "solid:255,255,255",
          "NegativeTextBrush": "solid:Red",
          "AllowUseBorderFormatting": false
        },
        "2": {
          "Ident": "StiStyle",
          "Name": "Data1",
          "VertAlignment": "Center",
          "Font": "Segoe UI;9.75;;",
          "Border": ";182,182,182;;;;;;solid:Black",
          "Brush": "solid:Transparent",
          "TextBrush": "solid:74,74,74",
          "NegativeTextBrush": "solid:Red"
        },
        "3": {
          "Ident": "StiStyle",
          "Name": "Data2",
          "Font": "Segoe UI;9.75;;",
          "Border": ";255,255,255;;;;;;solid:Black",
          "Brush": "solid:224,242,241",
          "TextBrush": "solid:74,74,74",
          "NegativeTextBrush": "solid:Red"
        },
        "4": {
          "Ident": "StiStyle",
          "Name": "Footer2",
          "HorAlignment": "Right",
          "VertAlignment": "Center",
          "Font": "Segoe UI;9.75;;",
          "Border": ";58,78,94;;;;;;solid:Black",
          "Brush": "solid:Transparent",
          "TextBrush": "solid:158,158,158",
          "NegativeTextBrush": "solid:Red",
          "AllowUseBorderSides": false
        }
      },
      "Dictionary": {
        "DataSources": dataSources,
        "Databases": databases
      },
      "Pages": {
        "0": {
          "Ident": "StiPage",
          "Name": "Page1",
          "Guid": "366bfdc35bcf48f3aeb38f2b5f58db21",
          "Interaction": {
            "Ident": "StiInteraction"
          },
          "Border": ";;2;;;;;solid:Black",
          "Brush": "solid:Transparent",
          "Components": {
            "0": {
              "Ident": "StiPageFooterBand",
              "Name": "PageFooterBand1",
              "Guid": "65d14e4c881f4419af82952eafb5e35b",
              "ClientRectangle": "0,1070.92,749,20.08",
              "Interaction": {
                "Ident": "StiInteraction"
              },
              "Border": ";;;;;;;solid:Black",
              "Brush": "solid:Transparent",
              "Components": {
                "0": {
                  "Ident": "StiText",
                  "Name": "Text6",
                  "Guid": "152b4606b3ad456eb6534b3f6776a52e",
                  "ClientRectangle": "0,0,749,20",
                  "ComponentStyle": "Footer2",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{PageNofM}"
                  },
                  "HorAlignment": "Right",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";58,78,94;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:158,158,158"
                }
              }
            },
            "1": {
              "Ident": "StiReportTitleBand",
              "Name": "ReportTitleBand2",
              "Guid": "4487651d81cd4e7b97418fe7e3c0262a",
              "ClientRectangle": "0,20,749,79.92",
              "Interaction": {
                "Ident": "StiInteraction"
              },
              "Border": ";;;;;;;solid:Black",
              "Brush": "solid:Transparent",
              "Components": {
                "0": {
                  "Ident": "StiText",
                  "Name": "Text20",
                  "Guid": "5ddce253f9a040ef98fddf01946d86b5",
                  "ClientRectangle": "570,0,179,40",
                  "ComponentStyle": "Header2",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "Stimulsoft"
                  },
                  "HorAlignment": "Right",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;21.75;Bold;",
                  "Border": "Bottom;158,158,158;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:158,158,158",
                  "Type": "Expression"
                },
                "1": {
                  "Ident": "StiText",
                  "Name": "Text23",
                  "Guid": "2d21d1beb899446db49e8d3ec10cfe1b",
                  "ClientRectangle": "0,0,570.08,40.16",
                  "ComponentStyle": "Header2",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "Simple Table"
                  },
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;21.75;Bold;",
                  "Border": "Bottom;158,158,158;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:158,158,158",
                  "Type": "Expression"
                },
                "2": {
                  "Ident": "StiText",
                  "Name": "Text17",
                  "Guid": "1cd4561011064eb39b3ce1d18847fc9e",
                  "CanGrow": true,
                  "ClientRectangle": "0,40.16,570.08,19.68",
                  "ComponentStyle": "Footer2",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{ReportDescription}"
                  },
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";58,78,94;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:158,158,158",
                  "TextOptions": {
                    "WordWrap": true
                  },
                  "Type": "Expression"
                },
                "3": {
                  "Ident": "StiText",
                  "Name": "Text18",
                  "Guid": "cf920a323ee34ffd8125f674c88833b8",
                  "CanGrow": true,
                  "ClientRectangle": "570,40,179,20",
                  "ComponentStyle": "Footer2",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "Date: {Today.ToString(\"Y\")}"
                  },
                  "HorAlignment": "Right",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";58,78,94;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:158,158,158",
                  "TextOptions": {
                    "WordWrap": true
                  },
                  "Type": "Expression"
                }
              }
            },
            "2": {
              "Ident": "StiTable",
              "Name": "TableCustomers",
              "ClientRectangle": "0,139.92,749,50",
              "Interaction": {
                "Ident": "StiBandInteraction"
              },
              "Border": ";Red;;;;;;solid:Black",
              "Brush": "solid:Transparent",
              "Components": {
                "0": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell1",
                  "Guid": "7993b60eab670ee2b2604ca77cb35687",
                  "GrowToHeight": true,
                  "ClientRectangle": "0,0,187,30",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Header3",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "合同编号"
                  },
                  "HorAlignment": "Center",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;12;Bold;",
                  "Border": "Left, Right;White;;;;;;solid:Black",
                  "Brush": "solid:77,182,172",
                  "TextBrush": "solid:255,255,255",
                  "Type": "Expression",
                  "ID": 0
                },
                "1": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell2",
                  "Guid": "890bda1f0d83971249c50f32f4634934",
                  "GrowToHeight": true,
                  "ClientRectangle": "187,0,187,30",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Header3",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "合同名称"
                  },
                  "HorAlignment": "Center",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;12;Bold;",
                  "Border": "Left, Right;White;;;;;;solid:Black",
                  "Brush": "solid:77,182,172",
                  "TextBrush": "solid:255,255,255",
                  "Type": "Expression",
                  "ID": 1
                },
                "2": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell3",
                  "Guid": "74e89e03b6f962547cc1d057d8c9fb4e",
                  "GrowToHeight": true,
                  "ClientRectangle": "374,0,187,30",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Header3",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "合同金额"
                  },
                  "HorAlignment": "Center",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;12;Bold;",
                  "Border": "Left, Right;White;;;;;;solid:Black",
                  "Brush": "solid:77,182,172",
                  "TextBrush": "solid:255,255,255",
                  "Type": "Expression",
                  "ID": 2
                },
                "3": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell4",
                  "Guid": "9d32cf3b557216e2acf1ea0330447919",
                  "GrowToHeight": true,
                  "ClientRectangle": "561,0,188,30",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Header3",
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "签订日期"
                  },
                  "HorAlignment": "Center",
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;12;Bold;",
                  "Border": "Left, Right;White;;;;;;solid:Black",
                  "Brush": "solid:77,182,172",
                  "TextBrush": "solid:255,255,255",
                  "Type": "Expression",
                  "ID": 3
                },
                "4": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell5",
                  "Guid": "69c90ef6dba459351daadf7dad742401",
                  "CanGrow": true,
                  "GrowToHeight": true,
                  "ClientRectangle": "0,30,187,20",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Data1",
                  "Conditions": {
                    "0": {
                      "Ident": "StiCondition",
                      "Item": "Expression",
                      "Expression": {
                        "Value": "{(Line % 2) != 1}"
                      },
                      "TextColor": "Black",
                      "BackColor": "Bisque",
                      "Font": ";9;;",
                      "Style": "Data2",
                      "BorderSides": "None"
                    }
                  },
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{contracts.no}"
                  },
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";182,182,182;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:74,74,74",
                  "TextOptions": {
                    "Trimming": "Character"
                  },
                  "Margins": {
                    "Left": 3,
                    "Right": 3,
                    "Top": 3,
                    "Bottom": 3
                  },
                  "Type": "DataColumn",
                  "ID": 4
                },
                "5": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell6",
                  "Guid": "9fefd30b82901457521fe2c703bffe3f",
                  "CanGrow": true,
                  "GrowToHeight": true,
                  "ClientRectangle": "187,30,187,20",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Data1",
                  "Conditions": {
                    "0": {
                      "Ident": "StiCondition",
                      "Item": "Expression",
                      "Expression": {
                        "Value": "{(Line % 2) != 1}"
                      },
                      "TextColor": "Black",
                      "BackColor": "Bisque",
                      "Font": ";9;;",
                      "Style": "Data2",
                      "BorderSides": "None"
                    }
                  },
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{contracts.name}"
                  },
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";182,182,182;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:74,74,74",
                  "TextOptions": {
                    "Trimming": "Character"
                  },
                  "Margins": {
                    "Left": 3,
                    "Right": 3,
                    "Top": 3,
                    "Bottom": 3
                  },
                  "Type": "DataColumn",
                  "ID": 5
                },
                "6": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell7",
                  "Guid": "2fed5ffaf25f3a2b826424e239381513",
                  "CanGrow": true,
                  "GrowToHeight": true,
                  "ClientRectangle": "374,30,187,20",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Data1",
                  "Conditions": {
                    "0": {
                      "Ident": "StiCondition",
                      "Item": "Expression",
                      "Expression": {
                        "Value": "{(Line % 2) != 1}"
                      },
                      "TextColor": "Black",
                      "BackColor": "Bisque",
                      "Font": ";9;;",
                      "Style": "Data2",
                      "BorderSides": "None"
                    }
                  },
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{contracts.amount}"
                  },
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";182,182,182;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:74,74,74",
                  "TextOptions": {
                    "Trimming": "Character"
                  },
                  "Margins": {
                    "Left": 3,
                    "Right": 3,
                    "Top": 3,
                    "Bottom": 3
                  },
                  "Type": "DataColumn",
                  "ID": 6
                },
                "7": {
                  "Ident": "StiTableCell",
                  "Name": "TableCustomers_Cell8",
                  "Guid": "90c152ecc152c90cff3a5bea6674449a",
                  "CanGrow": true,
                  "GrowToHeight": true,
                  "ClientRectangle": "561,30,188,20",
                  "Restrictions": "AllowMove, AllowSelect, AllowChange",
                  "ComponentStyle": "Data1",
                  "Conditions": {
                    "0": {
                      "Ident": "StiCondition",
                      "Item": "Expression",
                      "Expression": {
                        "Value": "{(Line % 2) != 1}"
                      },
                      "TextColor": "Black",
                      "BackColor": "Bisque",
                      "Font": ";9;;",
                      "Style": "Data2",
                      "BorderSides": "None"
                    }
                  },
                  "Interaction": {
                    "Ident": "StiInteraction"
                  },
                  "Text": {
                    "Value": "{contracts.signed_date}"
                  },
                  "VertAlignment": "Center",
                  "Font": "Segoe UI;9.75;;",
                  "Border": ";182,182,182;;;;;;solid:Black",
                  "Brush": "solid:Transparent",
                  "TextBrush": "solid:74,74,74",
                  "TextOptions": {
                    "Trimming": "Character"
                  },
                  "Margins": {
                    "Left": 3,
                    "Right": 3,
                    "Top": 3,
                    "Bottom": 3
                  },
                  "Type": "DataColumn",
                  "ID": 7
                }
              },
              "MinHeight": 0.4,
              "DataSourceName": "contracts",
              "RowCount": 2,
              "ColumnCount": 4,
              "HeaderRowsCount": 1,
              "NumberID": 16
            }
          },
          "PaperSize": "A4",
          "Watermark": {
            "Font": ";;Bold;",
            "TextBrush": "solid:50,0,0,0"
          }
        }
      }
    }
  },
  async getData(report) {
    let object = objectql.getSteedosSchema().getObject(report.object_name);
    let dataResult = await object.find({
      filters: report.filters
    });
    let result = {};
    result[`${report.object_name}`] = dataResult;
    return result;
  }
};

module.exports = reporter;
