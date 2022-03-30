/**
 * Uses a LRU cache to make a given parametrized function cached.
 * Caches just the last value.
 * The key must be JSON serializable.
*/
export class LRUCachedComputed {
    constructor(computeFn) {
        this.computeFn = computeFn;
        this.lastCache = undefined;
        this.lastArgKey = undefined;
    }
    get(arg) {
        const key = JSON.stringify(arg);
        if (this.lastArgKey !== key) {
            this.lastArgKey = key;
            this.lastCache = this.computeFn(arg);
        }
        return this.lastCache;
    }
}
