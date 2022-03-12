;(function() {
    import("/builder.io/react/dist/builder-react.browser.js").then(()=>{
        BuilderReact.builder.init("builder-token");
    });
})();