import React from 'react';

const HelloWorld = () => <div>Hello World</div>;
class HelloWorldPlugin {
    initialize(registry, store) {
        registry.registerObjectHomeComponent(
            'dashboard',
            HelloWorld
        );
    }
}

window.registerPlugin('com.steedos.webapp-hello-world', new HelloWorldPlugin());