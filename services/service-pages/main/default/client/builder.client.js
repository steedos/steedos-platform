/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:44:02
 * @Description: 
 */
// ;(function() {
//     try {
//         var hm = document.createElement("script");
//         hm.src = "/requirejs/require.js";
//         var s = document.getElementsByTagName("script")[0]; 
//         s.parentNode.insertBefore(hm, s);
//       } catch (error) {
//         console.log(error);
//       }
// })();

function injectScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', e => reject(e.error));
        document.head.appendChild(script);
    });
}

injectScript('https://unpkg.com/@steedos-builder/react@0.2.11/dist/builder-react.unpkg.js')
    .then(() => {
        console.log('Builder loaded!');
        const BuilderSDK = BuilderReact;

        window.BuilderReact = BuilderReact;
        window.BuilderSDK = BuilderSDK;

        window.Builder = BuilderReact.Builder;
        window.BuilderComponent = BuilderReact.BuilderComponent;
        window.builder = BuilderReact.builder;

        Builder.set({rootUrl: __meteor_runtime_config__.ROOT_URL})
        window['React'] = require('react'); 
        window['ReactDOM'] = require('react-dom'); 
        // window['lodash'] = require('lodash'); 

        Builder.registerImportMap({
            "lodash": '/requirejs/lodash',
            "react": '/requirejs/react',
            "react-dom": '/requirejs/react-dom',
            "@steedos-builder/sdk": '/requirejs/builder-sdk',
            "@steedos-builder/react": '/requirejs/builder-react',
        })
        Builder.require(['lodash',"react", "react-dom"])

    }).catch(error => {
        console.error(error);
    });

// import("https://unpkg.com/@steedos-builder/react@0.2.11/dist/builder-react.umd.js").then(function(BuilderReact) {

//     console.log('Builder loaded!');
//     const BuilderSDK = BuilderReact;
    
//     window.BuilderReact = BuilderReact;
//     window.BuilderSDK = BuilderSDK;
    
//     window.Builder = BuilderReact.Builder;
//     window.BuilderComponent = BuilderReact.BuilderComponent;
//     window.builder = BuilderReact.builder;
    
//     Builder.set({rootUrl: __meteor_runtime_config__.ROOT_URL})
//     window['React'] = require('react'); 
//     window['ReactDOM'] = require('react-dom'); 
//     // window['lodash'] = require('lodash'); 
    
//     Builder.registerImportMap({
//         // "lodash": '/requirejs/lodash',
//         "react": '/requirejs/react',
//         "react-dom": '/requirejs/react-dom',
//         "@steedos-builder/sdk": '/requirejs/builder-sdk',
//         "@steedos-builder/react": '/requirejs/builder-react',
//     })
//     Builder.require(['lodash',"react", "react-dom"])
    
// });

