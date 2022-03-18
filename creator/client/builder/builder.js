import { Builder, BuilderComponent, builder} from '@builder.io/react';
window.Builder = Builder;
window.BuilderComponent = BuilderComponent;
builder.init('steedos-builder');
Builder.registryChange.subscribe(function(registry){
    _.each(registry, function(value, key){
        _.each(value, function(item){
            const {component, ...options} = item
            Builder.registerComponent(component, options)
        })
    })
})