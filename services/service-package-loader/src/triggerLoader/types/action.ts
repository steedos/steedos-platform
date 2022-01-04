export type Action = {
    trigger: {
        when: string | string[],
        listenTo: string,
        name: string
    },
    name: string,
    handler: Function
}