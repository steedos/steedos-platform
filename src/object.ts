/**
 * An interface for a config object with a persistent store.
 */
export interface SteedosObject {
    name: String
    fields: Object
    getFields(): Object[]
}

export interface SteedosObjectLoader {
    validate(obj: Object): boolean
    load(obj: Object): Object
    remove(name: String): boolean
}


export class BaseSteedosObject implements SteedosObject  {
    name: String
    fields: Object

    public constructor(obj: SteedosObject) {
        this.name = obj.name;
        this.fields = obj.fields;
    }

    public getFields(): Object[] {
        return []
    }

}

export class BaseObjectLoader implements SteedosObjectLoader {

    public validate(obj: Object): boolean {
        return true
    };

    public load(obj: Object): Object {
        return {}
    };

    public remove(name: String): boolean {
        return true;
    }

}