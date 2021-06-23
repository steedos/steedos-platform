export type Trigger = {
    name: string,
    listenTo: string,
    when: string | string[],
    handler: Function
}