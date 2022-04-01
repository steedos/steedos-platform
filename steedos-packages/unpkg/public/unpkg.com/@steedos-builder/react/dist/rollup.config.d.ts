declare const _default: ({
    output: {
        file: string;
        name: string;
        format: string;
        sourcemap: boolean;
    };
    input: string;
    external: string[];
    watch: {
        include: string;
    };
    plugins: any[];
} | {
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    }[];
    external: string[];
    plugins: any[];
    input: string;
    watch: {
        include: string;
    };
} | {
    input: string;
    plugins: {
        name: string;
        options(config: import("rollup-plugin-typescript2/dist/irollup-options").IRollupOptions): void;
        resolveId(importee: string, importer: string): string | null;
        load(id: string): string | undefined;
        transform(this: import("rollup-plugin-typescript2/dist/context").IRollupContext, code: string, id: string): import("rollup-plugin-typescript2/dist/tscache").ICode | undefined;
        ongenerate(): void;
        onwrite({ dest, file }: import("rollup-plugin-typescript2/dist/irollup-options").IRollupOptions): void;
    }[];
    output: {
        file: string;
        format: string;
        name: string;
        sourcemap: boolean;
    };
})[];
export default _default;
