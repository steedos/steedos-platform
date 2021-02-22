export type Permission = {
    name?: string
    object_name?: string
    allowRead?: boolean
    allowCreate?: boolean
    allowEdit?: boolean
    allowDelete?: boolean
    viewAllRecords?: boolean
    modifyAllRecords?: boolean
    viewCompanyRecords?: boolean
    modifyCompanyRecords?: boolean
    disabled_list_views?: []
    disabled_actions?: []
    unreadable_fields?: string[]
    uneditable_fields?: string[]
    unrelated_objects?: string[]
}

export type MetadataPermission = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: Permission
}