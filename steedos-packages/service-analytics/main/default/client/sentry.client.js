if (Meteor.settings.public.sentry && Meteor.settings.public.sentry.dsn) {

    let sentryScript = document.createElement("script");
    sentryScript.setAttribute("src", Steedos.absoluteUrl('/sentry/sentry.min.js'));
    document.getElementsByTagName("head")[0].appendChild(sentryScript);
    
    sentryScript.onload = function(script){
      
        var release = Creator && Creator.Plugins && Creator.Plugins["@steedos/core"] && Creator.Plugins["@steedos/core"]['version']
    
        Sentry.init({
            dsn: Meteor.settings.public.sentry.dsn,
        
            // Alternatively, use `process.env.npm_package_version` for a dynamic release version
            // if your build tool supports it.
            release: release,
        
            initialScope: scope => {
                scope.setTags({ spaceId: Steedos.getSpaceId() });
                scope.setTags({ userId: Steedos.getUserId() });
                scope.setUser({ 'id': Steedos.getUserId() })
                return scope;
            },
        });
    };
}

