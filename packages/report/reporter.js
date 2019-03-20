
let reporter = {
  getReport() {
    return {
      "_id": "sHd9WBbPfxwxm8akZ",
      "name": "按优先级统计数量",
      "report_type": "matrix",
      "object_name": "project_issues",
      "charting": true,
      "grouping": true,
      "totaling": true,
      "counting": true,
      "filter_scope": "space",
      "space": "jYgTB7xC3ScqmXYdW",
      "owner": "97zjiueTefx5aKnco",
      "created": new Date("2019-01-22T05:39:49.145Z"),
      "modified": new Date("2019-03-15T01:22:38.384Z"),
      "created_by": "97zjiueTefx5aKnco",
      "modified_by": "97zjiueTefx5aKnco",
      "rows": [
        "priority"
      ],
      "columns": [
        "category"
      ],
      "filter_fields": [
        "organization"
      ]
    };
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
    let dataUrl = "/report/data/xxx";
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
  getReportMrt(report) {
    let object = this.getObject(report.object_name);
    let databases = this.getDatabases(report, object);
    let dataSources = this.getDataSources(report, object);
    return {
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
  },
  getData(){
    return {
      "project_issues": [{
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('XR8qwMNMw2Nu6mTt7')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('XR8qwMNMw2Nu6mTt7')",
          "_id": "XR8qwMNMw2Nu6mTt7",
          "name": "超时显示测试1",
          "priority": "中",
          "modified": "2019-03-14T02:35:01.926Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('8YEbj7o2vXEFQDEK5')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('8YEbj7o2vXEFQDEK5')",
          "_id": "8YEbj7o2vXEFQDEK5",
          "name": "0225-1",
          "priority": "低",
          "modified": "2019-02-28T03:10:25.656Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('ndJJv243fgqsHQ2aZ')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('ndJJv243fgqsHQ2aZ')",
          "_id": "ndJJv243fgqsHQ2aZ",
          "name": "石油二厂催化车间泵房热油泵缺乏实时监控",
          "priority": "high",
          "modified": "2019-02-25T09:19:21.112Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('G9QBQX8n65jGNkCvx')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('G9QBQX8n65jGNkCvx')",
          "_id": "G9QBQX8n65jGNkCvx",
          "name": "问题管理系统与督办系统打通",
          "priority": "medium",
          "modified": "2019-02-25T09:17:15.146Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('beL6LEMKYtitKAqyB')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('beL6LEMKYtitKAqyB')",
          "_id": "beL6LEMKYtitKAqyB",
          "name": "建设督办系统",
          "priority": "medium",
          "modified": "2019-02-25T09:16:45.393Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('EXArjgBopwnBpLGc2')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('EXArjgBopwnBpLGc2')",
          "_id": "EXArjgBopwnBpLGc2",
          "name": "分子筛生产线技术改造升级项目",
          "priority": "medium",
          "modified": "2019-02-25T09:16:23.788Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('xhrEFjWiYmSSjfY46')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('xhrEFjWiYmSSjfY46')",
          "_id": "xhrEFjWiYmSSjfY46",
          "name": "问题台账测试",
          "priority": "中",
          "modified": "2019-02-25T08:51:47.409Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('5qwTRthMkkQjesXF5')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('5qwTRthMkkQjesXF5')",
          "_id": "5qwTRthMkkQjesXF5",
          "name": "问题标题问题标题问题标题2",
          "priority": "中",
          "modified": "2019-02-25T08:51:28.754Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('Q3iJKGDkRLoHGoyCR')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('Q3iJKGDkRLoHGoyCR')",
          "_id": "Q3iJKGDkRLoHGoyCR",
          "name": "问题标题3",
          "priority": "低",
          "modified": "2019-02-25T08:50:36.654Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('FJwqqGQS6Xy8aEA4y')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('FJwqqGQS6Xy8aEA4y')",
          "_id": "FJwqqGQS6Xy8aEA4y",
          "name": "问题标题问题标题问题标题问题标题4",
          "priority": "中",
          "modified": "2019-02-25T08:50:15.402Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('22vJpRMedJ8AGnMCB')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('22vJpRMedJ8AGnMCB')",
          "_id": "22vJpRMedJ8AGnMCB",
          "name": "问题标题5",
          "priority": "中",
          "modified": "2019-02-25T08:49:47.433Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('ATQvQKaYgfDqCAAZD')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('ATQvQKaYgfDqCAAZD')",
          "_id": "ATQvQKaYgfDqCAAZD",
          "name": "问题标题6",
          "modified": "2019-02-25T08:49:08.794Z",
          "priority": "中"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('t27m2QTqjWKvqiq3t')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('t27m2QTqjWKvqiq3t')",
          "_id": "t27m2QTqjWKvqiq3t",
          "name": "问题提报0128-2",
          "modified": "2019-02-25T08:48:52.690Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('28SKtb7xW2MMNNjMj')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('28SKtb7xW2MMNNjMj')",
          "_id": "28SKtb7xW2MMNNjMj",
          "name": "问题标题0129-1",
          "priority": "中",
          "modified": "2019-02-25T08:48:22.172Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('GiAJwfLAToK93RXvf')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('GiAJwfLAToK93RXvf')",
          "_id": "GiAJwfLAToK93RXvf",
          "name": "问题标题 问题标题 问题标题 0129-2",
          "priority": "高",
          "modified": "2019-02-25T08:48:05.655Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('u8Kev8rgWbJDbtYBg')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('u8Kev8rgWbJDbtYBg')",
          "_id": "u8Kev8rgWbJDbtYBg",
          "name": "问题标题 问题标题 0129-3",
          "priority": "中",
          "modified": "2019-02-25T08:47:44.522Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('mi8sfPTzvsSoAq2As')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('mi8sfPTzvsSoAq2As')",
          "_id": "mi8sfPTzvsSoAq2As",
          "name": "问题标题问题标题0129-4",
          "priority": "中",
          "modified": "2019-02-25T08:47:12.499Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('BCpZxaYDqMFRzjL7w')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('BCpZxaYDqMFRzjL7w')",
          "_id": "BCpZxaYDqMFRzjL7w",
          "name": "超时设置-2",
          "priority": "中",
          "modified": "2019-02-25T08:46:15.046Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('eRg3vmKe2yrvCxjzT')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('eRg3vmKe2yrvCxjzT')",
          "_id": "eRg3vmKe2yrvCxjzT",
          "name": "1",
          "priority": "中",
          "modified": "2019-02-25T08:45:43.445Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('qCWewxbaQhNapTiwX')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('qCWewxbaQhNapTiwX')",
          "_id": "qCWewxbaQhNapTiwX",
          "name": "222",
          "priority": "中",
          "modified": "2019-02-25T08:45:22.381Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('XFctTsmT4LG7EJ8q9')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('XFctTsmT4LG7EJ8q9')",
          "_id": "XFctTsmT4LG7EJ8q9",
          "name": "333",
          "priority": "中",
          "modified": "2019-02-25T08:44:48.996Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('JRacZ5AGCfWDtczSQ')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('JRacZ5AGCfWDtczSQ')",
          "_id": "JRacZ5AGCfWDtczSQ",
          "name": "111",
          "priority": "中",
          "modified": "2019-02-25T08:44:24.704Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('v7JaRtAS2tEgWxem4')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('v7JaRtAS2tEgWxem4')",
          "_id": "v7JaRtAS2tEgWxem4",
          "name": "444",
          "priority": "中",
          "modified": "2019-02-25T08:43:58.703Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('WqhDsstrEB7wCWu3L')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('WqhDsstrEB7wCWu3L')",
          "_id": "WqhDsstrEB7wCWu3L",
          "name": "附件测试",
          "priority": "中",
          "modified": "2019-02-25T08:43:26.573Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('6Z3woRvEgevxQZdWh')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('6Z3woRvEgevxQZdWh')",
          "_id": "6Z3woRvEgevxQZdWh",
          "name": "超时设置0220-1",
          "priority": "高",
          "modified": "2019-02-25T08:43:10.236Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('H3LzaHkvaDhG8KigX')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('H3LzaHkvaDhG8KigX')",
          "_id": "H3LzaHkvaDhG8KigX",
          "name": "超时设置0220-2",
          "priority": "低",
          "modified": "2019-02-25T08:42:36.498Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('MaR2pDESshWZe7aSY')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('MaR2pDESshWZe7aSY')",
          "_id": "MaR2pDESshWZe7aSY",
          "name": "3",
          "priority": "高",
          "modified": "2019-02-25T08:42:09.008Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('wg7evabLLB964Ky6R')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('wg7evabLLB964Ky6R')",
          "_id": "wg7evabLLB964Ky6R",
          "name": "4",
          "priority": "中",
          "modified": "2019-02-25T08:41:52.503Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('tChBMtZvynMu53A6z')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('tChBMtZvynMu53A6z')",
          "_id": "tChBMtZvynMu53A6z",
          "name": "测试问题提报",
          "priority": "中",
          "modified": "2019-02-25T08:41:33.595Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('SQqrZrS2hCyJtKkS9')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('SQqrZrS2hCyJtKkS9')",
          "_id": "SQqrZrS2hCyJtKkS9",
          "name": "问题平台测试",
          "priority": "medium",
          "modified": "2019-02-25T08:38:04.540Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('csQvXds6NGc2Ho2G8')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('csQvXds6NGc2Ho2G8')",
          "_id": "csQvXds6NGc2Ho2G8",
          "name": "建设抚顺石化问题管理系统",
          "priority": "high",
          "modified": "2019-02-25T08:35:46.899Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('oHHLX4pkkDBCFDPJ7')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('oHHLX4pkkDBCFDPJ7')",
          "_id": "oHHLX4pkkDBCFDPJ7",
          "name": "测试2-15",
          "priority": "高",
          "modified": "2019-02-15T08:54:01.043Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('heyyDoHx6Kj9R8cv9')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('heyyDoHx6Kj9R8cv9')",
          "_id": "heyyDoHx6Kj9R8cv9",
          "name": "超时设置-1",
          "priority": "中",
          "modified": "2019-02-14T08:12:23.333Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('if9C5sBy2tXRY8wTR')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('if9C5sBy2tXRY8wTR')",
          "_id": "if9C5sBy2tXRY8wTR",
          "name": "问题标题0129-1",
          "priority": "高",
          "modified": "2019-01-30T05:56:55.136Z"
        },
        {
          "@odata.id": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('8DB46yLEnpi3atKBR')",
          "@odata.etag": "W/\"08D589720BBB3DB1\"",
          "@odata.editLink": "http://192.168.0.195:5000/creator/api/odata/v4/jYgTB7xC3ScqmXYdW/project_issues('8DB46yLEnpi3atKBR')",
          "_id": "8DB46yLEnpi3atKBR",
          "name": "问题提报0128-1",
          "priority": "中",
          "modified": "2019-01-28T07:07:22.540Z"
        }
      ]
    }
  }
};

module.exports.core = reporter;
