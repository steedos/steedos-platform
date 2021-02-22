export type Trigger = {
    name: string,
    listenTo: string,
    when: string | Array<string>,
    Action: string 
}

export type MetadataTrigger = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: Trigger
}