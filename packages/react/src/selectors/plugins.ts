export function pluginInstanceSelector(state: any, name: string){
    let instances = state.plugins ? state.plugins.instances : {};
    return instances[name];
}

export function pluginComponentsSelector(state: any, name: string) {
    let components = state.plugins ? state.plugins.components : {};
    if (components){
        return components[name] ? components[name] : [];
    }
    else{
        return [];
    }
}

export function pluginComponentObjectSelector(state: any, name: string, id: string) {
    let components = pluginComponentsSelector(state, name);
    return components.find((n: any) => { return n.id === id });
}

export function pluginComponentSelector(state: any, name: string, id: string) {
    let componentObject = pluginComponentObjectSelector(state, name, id);
    return componentObject ? componentObject.component : null;
}