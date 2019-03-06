/**
 * An interface for a config object with a persistent store.
 */
export interface SteedosObject {
    getFields(): Object[]
}

export interface SteedosObjectLoader {
    validate(obj: Object): boolean
    load(obj: Object): Object
    remove(name: String): boolean
}


export class BaseObject implements SteedosObject  {
    protected obj: Object;

    public constructor(obj: Object) {
        this.obj = obj;
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