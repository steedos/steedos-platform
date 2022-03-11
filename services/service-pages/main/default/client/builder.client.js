;(function() {
    import("/@builder.io/react/dist/builder-react.browser.js").then(()=>{
        console.log(`import builder react browser...`);
        BuilderReact.builder.init("test...");
    });
})();