import { ODataClient } from '@steedos/client';

const Reporter = {
  spaceId: "jYgTB7xC3ScqmXYdW",
  getReport(id, callback) {
    let options = {
      filter: [
        ["_id", "=", id]
      ]
    };
    ODataClient.query("reports",{
      space_id: this.spaceId,
      options: options,
      callback: (result, args)=>{
        if (result && result.length){
          callback(result[0], args);
        }
      }
    });
  },
  getObject(object_name) {
    return {
      name: "project_issues",
      label: "问题",
      icon: "location",
      enable_files: true,
      enable_search: true,
      enable_instances: true,
      fields: {
        name: {
          label: '问题标题',
          type: 'text',
          is_wide: true,
          required: true,
          searchable: true
        },
        description: {
          label: '问题描述',
          type: 'textarea',
          is_wide: true,
          rows: 4
        },
        category: {
          label: '问题类型',
          type: 'master_detail',
          reference_to: 'projects',
          filterable: true
        },
        priority: {
          label: '处理优先级',
          type: "select",
          options: [{
            label: "高",
            value: "high"
          }, {
            label: "中",
            value: "medium"
          }, {
            label: "低",
            value: "low"
          }],
          defaultValue: "medium",
          filterable: true
        },
        company_id: {
          label: '提报单位',
          filterable: true,
          omit: false,
          hidden: false
        },
        organization: {
          label: '提报部门',
          type: 'lookup',
          reference_to: 'organizations',
          filterable: true
        },
        owner_organization: {
          label: '受理部门',
          type: 'lookup',
          reference_to: 'organizations'
        },
        deadline: {
          label: '截止时间',
          type: 'date'
        },
        end_organization: {
          label: '办结部门',
          type: 'lookup',
          reference_to: 'organizations'
        },
        enddate: {
          label: '办结时间',
          type: 'date'
        },
        solution: {
          label: '解决方案',
          type: 'textarea',
          is_wide: true,
          rows: 4
        },
        unresolved: {
          label: '未解决说明',
          type: 'textarea',
          is_wide: true,
          rows: 4
        },
        result: {
          label: "问题状态",
          type: "select",
          options: [{
            label: "已提交，未确认",
            value: "submit"
          }, {
            label: "已确认，未处理",
            value: "Confirmed"
          }, {
            label: "已处理，未完成",
            value: "Processed"
          }, {
            label: "已完成，已办结",
            value: "solved"
          }, {
            label: "已办结，未解决",
            value: "Unsolved"
          }],
          defaultValue: "submit",
          filterable: true
        },
        status: {
          label: "状态",
          type: "select",
          options: [{
            label: "进行中",
            value: "open"
          }, {
            label: "已关闭",
            value: "closed"
          }],
          defaultValue: "open",
          filterable: true
        },
        created_by: {
          label: '提报人'
        },
        instance_state: {
          omit: false,
          hidden: false,
          readonly: true
        }
      }
    };
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
    if (!type) {
      return null;
    }
    if (tempField.multiple) {
      // 忽略所有数组字段类型
      return null;
    }
    let ignoreTypes = ["[text]", "[phone]", "password", "[Object]", "checkbox", "grid"];
    if (ignoreTypes.includes(type)) {
      // 忽略这些字段类型
      return null;
    }
    let defaultType = "System.String";
    switch (type) {
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
    let dataUrl = "../reports/Demo2.json";
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
  getSimpleList(report_id, callback) {
    this.getReport(report_id, (result) => {
      let report = result;
      let object = this.getObject(report.object_name);
      let databases = this.getDatabases(report, object);
      let dataSources = this.getDataSources(report, object);
      let simpleList = {
        "ReportVersion": "2015.1.13",
        "ReportGuid": "e124555e3a994d7c894fecd805a15efd",
        "ReportName": "Report",
        "ReportAlias": "Simple List",
        "ReportAuthor": "Stimulsoft",
        "ReportDescription": "This sample demonstrates how to create a simple list report.",
        "ReportCreated": "/Date(1085817540000+0300)/",
        "ReportChanged": "/Date(1437976152612+0300)/",
        "EngineVersion": "EngineV2",
        "PreviewMode": "StandardAndDotMatrix",
        "PreviewSettings": 33538047,
        "Styles": {
          "0": {
            "Ident": "StiStyle",
            "Name": "Title1",
            "HorAlignment": "Right",
            "VertAlignment": "Center",
            "Font": ";19;;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:193,152,89",
            "AllowUseBorderSides": false
          },
          "1": {
            "Ident": "StiStyle",
            "Name": "Title2",
            "VertAlignment": "Center",
            "Font": ";9;;",
            "Border": ";102,77,38;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:102,77,38",
            "AllowUseBorderSides": false
          },
          "2": {
            "Ident": "StiStyle",
            "Name": "Header1",
            "VertAlignment": "Center",
            "Font": ";19;;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:193,152,89",
            "AllowUseBorderSides": false
          },
          "3": {
            "Ident": "StiStyle",
            "Name": "Header2",
            "HorAlignment": "Center",
            "VertAlignment": "Center",
            "Font": ";12;Bold;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:193,152,89",
            "AllowUseBorderSides": false
          },
          "4": {
            "Ident": "StiStyle",
            "Name": "Header3",
            "HorAlignment": "Center",
            "VertAlignment": "Center",
            "Font": ";9;Bold;",
            "Border": "All;193,152,89;;;;;;solid:Black",
            "Brush": "solid:242,234,221",
            "TextBrush": "solid:193,152,89",
            "AllowUseBorderSides": false
          },
          "5": {
            "Ident": "StiStyle",
            "Name": "Data1",
            "VertAlignment": "Center",
            "Font": ";9;;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:102,77,38",
            "AllowUseBorderSides": false
          },
          "6": {
            "Ident": "StiStyle",
            "Name": "Data2",
            "Font": ";9;;",
            "Border": ";;;;;;;solid:Black",
            "Brush": "solid:240,237,232",
            "TextBrush": "solid:Black",
            "AllowUseFont": false,
            "AllowUseBorderFormatting": false,
            "AllowUseBorderSides": false,
            "AllowUseTextBrush": false,
            "AllowUseTextOptions": false
          },
          "7": {
            "Ident": "StiStyle",
            "Name": "Data3",
            "VertAlignment": "Center",
            "Font": ";9;;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:240,237,232",
            "TextBrush": "solid:102,77,38",
            "AllowUseBorderSides": false
          },
          "8": {
            "Ident": "StiStyle",
            "Name": "Footer1",
            "VertAlignment": "Center",
            "Font": ";9;;",
            "Border": "Top;193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:102,77,38",
            "AllowUseBorderSides": false
          },
          "9": {
            "Ident": "StiStyle",
            "Name": "Footer2",
            "HorAlignment": "Right",
            "VertAlignment": "Center",
            "Font": ";12;Bold;",
            "Border": ";193,152,89;;;;;;solid:Black",
            "Brush": "solid:",
            "TextBrush": "solid:193,152,89",
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
            "Brush": "solid:",
            "Components": {
              "0": {
                "Ident": "StiPageFooterBand",
                "Name": "PageFooterBand1",
                "ClientRectangle": "0,27.3,19,0.4",
                "Interaction": {
                  "Ident": "StiInteraction"
                },
                "Border": ";;;;;;;solid:Black",
                "Brush": "solid:",
                "Components": {
                  "0": {
                    "Ident": "StiText",
                    "Name": "Text6",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "6.8,0,12.2,0.4",
                    "ComponentStyle": "Footer1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{PageNofM}"
                    },
                    "HorAlignment": "Right",
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": ";193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38"
                  }
                }
              },
              "1": {
                "Ident": "StiReportTitleBand",
                "Name": "ReportTitleBand2",
                "Guid": "0e78e53250ce4a74baab882ac9d3f6e0",
                "ClientRectangle": "0,0.4,19,2",
                "Interaction": {
                  "Ident": "StiInteraction"
                },
                "Border": ";;;;;;;solid:Black",
                "Brush": "solid:",
                "Components": {
                  "0": {
                    "Ident": "StiText",
                    "Name": "Text20",
                    "Guid": "426e9ac30a6840e7b47553f34723b8df",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "9.4,0,9.6,0.8",
                    "ComponentStyle": "Title1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Stimulsoft"
                    },
                    "HorAlignment": "Right",
                    "VertAlignment": "Center",
                    "Font": ";19;;",
                    "Border": "Bottom;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:193,152,89",
                    "Type": "Expression"
                  },
                  "1": {
                    "Ident": "StiText",
                    "Name": "Text23",
                    "Guid": "1bc08e78ae20472481fe55b04ade5b6a",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0,0,9.4,0.8",
                    "ComponentStyle": "Title1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Simple List"
                    },
                    "VertAlignment": "Center",
                    "Font": ";19;;",
                    "Border": "Bottom;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:193,152,89",
                    "Type": "Expression"
                  },
                  "2": {
                    "Ident": "StiText",
                    "Name": "Text17",
                    "Guid": "75b851754174412ab8c478e5c8479f92",
                    "CanGrow": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0,1,14.6,0.8",
                    "ComponentStyle": "Title2",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{ReportDescription}"
                    },
                    "Font": ";9;;",
                    "Border": ";102,77,38;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    },
                    "Type": "Expression"
                  },
                  "3": {
                    "Ident": "StiText",
                    "Name": "Text18",
                    "Guid": "65f5c368912b4240a21d18c95400ea00",
                    "CanGrow": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "14.6,1,4.4,0.8",
                    "ComponentStyle": "Title2",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Date: {Today.ToString(\"Y\")}"
                    },
                    "HorAlignment": "Right",
                    "Font": ";9;;",
                    "Border": ";102,77,38;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    },
                    "Type": "Expression"
                  }
                }
              },
              "2": {
                "Ident": "StiHeaderBand",
                "Name": "HeaderBand1",
                "ClientRectangle": "0,3.2,19,0.6",
                "Interaction": {
                  "Ident": "StiInteraction"
                },
                "Border": ";;;;;;;solid:Black",
                "Brush": "solid:",
                "Components": {
                  "0": {
                    "Ident": "StiText",
                    "Name": "Text11",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "6.8,0,5.2,0.6",
                    "ComponentStyle": "Header3",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Address"
                    },
                    "HorAlignment": "Center",
                    "VertAlignment": "Center",
                    "Font": ";9;Bold;",
                    "Border": "All;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:242,234,221",
                    "TextBrush": "solid:193,152,89"
                  },
                  "1": {
                    "Ident": "StiText",
                    "Name": "Text12",
                    "ShiftMode": "DecreasingSize, OnlyInWidthOfComponent",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "12,0,3,0.6",
                    "ComponentStyle": "Header3",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Phone"
                    },
                    "HorAlignment": "Center",
                    "VertAlignment": "Center",
                    "Font": ";9;Bold;",
                    "Border": "All;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:242,234,221",
                    "TextBrush": "solid:193,152,89"
                  },
                  "2": {
                    "Ident": "StiText",
                    "Name": "Text13",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "15,0,4,0.6",
                    "ComponentStyle": "Header3",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Contact"
                    },
                    "HorAlignment": "Center",
                    "VertAlignment": "Center",
                    "Font": ";9;Bold;",
                    "Border": "All;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:242,234,221",
                    "TextBrush": "solid:193,152,89"
                  },
                  "3": {
                    "Ident": "StiText",
                    "Name": "Text10",
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0,0,6.8,0.6",
                    "ComponentStyle": "Header3",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "Company"
                    },
                    "HorAlignment": "Center",
                    "VertAlignment": "Center",
                    "Font": ";9;Bold;",
                    "Border": "All;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:242,234,221",
                    "TextBrush": "solid:193,152,89"
                  }
                },
                "PrintIfEmpty": true
              },
              "3": {
                "Ident": "StiDataBand",
                "Name": "DataBand1",
                "ClientRectangle": "0,4.6,19,0.6",
                "Interaction": {
                  "Ident": "StiBandInteraction"
                },
                "Border": ";;;;;;;solid:Black",
                "Brush": "solid:",
                "Components": {
                  "0": {
                    "Ident": "StiText",
                    "Name": "Text4",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "12,0,3,0.6",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{Customers.Phone}"
                    },
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Left;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    }
                  },
                  "1": {
                    "Ident": "StiText",
                    "Name": "Text3",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "15,0,4,0.6",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{Customers.ContactTitle}"
                    },
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Left, Right;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    }
                  },
                  "2": {
                    "Ident": "StiText",
                    "Name": "Text1",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0.6,0,6.2,0.6",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{Customers.CompanyName}"
                    },
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Left;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    },
                    "Type": "Expression"
                  },
                  "3": {
                    "Ident": "StiText",
                    "Name": "Text2",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "6.8,0,5.2,0.6",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{Customers.Address}"
                    },
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Left;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    }
                  },
                  "4": {
                    "Ident": "StiText",
                    "Name": "Text7",
                    "Guid": "5b832677f467498487ebd4777d80e7b0",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0,0,0.6,0.6",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "Text": {
                      "Value": "{Line}"
                    },
                    "HorAlignment": "Center",
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Left;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "Type": "Expression"
                  }
                },
                "DataSourceName": "Customers",
                "EvenStyle": "Data2"
              },
              "4": {
                "Ident": "StiFooterBand",
                "Name": "FooterBand1",
                "ClientRectangle": "0,6,19,0.2",
                "Interaction": {
                  "Ident": "StiInteraction"
                },
                "Border": ";;;;;;;solid:Black",
                "Brush": "solid:",
                "Components": {
                  "0": {
                    "Ident": "StiText",
                    "Name": "Text8",
                    "Guid": "dcc6258185da48c0bee4c3c0395fb37d",
                    "CanGrow": true,
                    "GrowToHeight": true,
                    "MinSize": "0,0",
                    "MaxSize": "0,0",
                    "ClientRectangle": "0,0,19,0.2",
                    "ComponentStyle": "Data1",
                    "Interaction": {
                      "Ident": "StiInteraction"
                    },
                    "VertAlignment": "Center",
                    "Font": ";9;;",
                    "Border": "Top;193,152,89;;;;;;solid:Black",
                    "Brush": "solid:",
                    "TextBrush": "solid:102,77,38",
                    "TextOptions": {
                      "WordWrap": true
                    }
                  }
                },
                "PrintOnAllPages": true
              }
            },
            "PageWidth": 21.0,
            "PageHeight": 29.7,
            "Watermark": {
              "Font": ";;Bold;",
              "TextBrush": "solid:50,0,0,0"
            },
            "Margins": {
              "Left": 1.0,
              "Right": 1.0,
              "Top": 1.0,
              "Bottom": 1.0
            }
          }
        }
      };
      callback(simpleList);
    });
  }
};

export default Reporter;
