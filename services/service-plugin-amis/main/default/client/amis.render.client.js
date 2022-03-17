; (function () {
    try {
        let amisStyle = document.createElement("link");
        amisStyle.setAttribute("rel", "stylesheet");
        amisStyle.setAttribute("type", "text/css");
        amisStyle.setAttribute("href", "/amis/amis.css");
        document.getElementsByTagName("head")[0].appendChild(amisStyle);
    } catch (error) {
        console.error(error)
    }
    import('/amis/sdk/sdk.noreact.js').then(() => {
        //处理mobx多个实例问题
        try {
            let mobx = amisRequire('mobx');
            mobx.configure({ isolateGlobalState: true })
        } catch (error) {

        }

        let React = window.React || amisRequire("react");

        // Register amis render 
        var Amis = function (props) {
            var schema = props.schema, data = props.data;
            return React.createElement(React.Fragment, null,
                React.createElement("div", { id: "amis-root" }),
                // amisRequire('amis').render(schema, data, {theme: 'cxd'}))
                function () {
                    setTimeout(function () {
                        amisRequire('amis/embed').embed('#amis-root', schema, data)
                    }, 100)
                }()
            );
        };

        BuilderReact.Builder.registerComponent(Amis, {
            name: 'Amis',
            inputs: [
                { name: 'schema', type: 'object' },
                { name: 'data', type: 'object' }
            ]
        })
    });
})();