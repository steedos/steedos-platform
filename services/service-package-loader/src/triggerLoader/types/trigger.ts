export type Trigger = {
    name: string,
    listenTo: string,
    when: string | Array<string>,
    action: string
}