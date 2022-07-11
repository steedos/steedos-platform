export namespace Utils {
    export type SourceArray = number[] | Uint16Array;

    export function stringify(value: SourceArray, index: number, next: number): string {
        return Array.prototype.map.call(value.slice(index, next), function (ch) { return String.fromCharCode(ch); }).join("");
    }

    export function is(value: number, compare: string) {
        for (let i = 0; i < compare.length; i++) {
            if (value === compare.charCodeAt(i)) return true;
        }

        return false;
    }

    export function equals(value: SourceArray, index: number, compare: string) {
        let i = 0;
        while (value[index + i] === compare.charCodeAt(i) && i < compare.length) {
            i++;
        }
        return i === compare.length ? i : 0;
    }

    export function required(value: SourceArray, index: number, comparer: Function, min?: number, max?: number) {
        let i = 0;

        max = max || (value.length - index);
        while (i < max && comparer(value[index + i])) {
            i++;
        }

        return i >= (min || 0) && i <= max ? index + i : 0;
    }
}

export default Utils;
