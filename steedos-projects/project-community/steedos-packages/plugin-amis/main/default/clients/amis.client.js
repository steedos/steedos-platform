;(function() {
    import("https://unpkg.com/amis@1.7.0/sdk/sdk.js").then(()=>{
        //处理mobx多个实例问题
        try {
            let mobx = amisRequire('mobx');
            mobx.configure({ isolateGlobalState: true })
        } catch (error) {
            
        }

    //   let amisEmbed = amisRequire('amis/embed');
    //   let amis = amisRequire('amis');


    var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    var react_1 = __importDefault(require("react"));
    // Register amis render 
    var Amis = function (props) {
        var schema = props.schema, data = props.data;
        return react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { id: "amis-root" }),
        // amisRequire('amis').render(schema, data),
            function(){setTimeout(function(){
                amisRequire('amis/embed').embed('#amis-root', schema, data)
            }, 100)}()
        );
         
    };


    // var Amis = function (props) {
    //     var schema = props.schema, data = props.data;
    //     return react_1.default.createElement(react_1.default.Fragment, null,
    //         react_1.default.createElement("div", { id: "amis-root" }, amisRequire('amis').render(schema, data)));
    // };
    // function (props) {
    //     var schema = props.schema, data = props.data;
    //     console.log(`amis==========>`, props);
    //     // return amisRequire('amis').render(schema, data);
    //     return amisRequire('amis/embed').embed('.builder-blocks', schema, data)
    // }

    BuilderReact.Builder.registerComponent(Amis, {
        name: 'Amis',
        inputs: [
          { name: 'schema', type: 'object' },
          { name: 'data', type: 'object' }
        ]
      })
  });
  })();