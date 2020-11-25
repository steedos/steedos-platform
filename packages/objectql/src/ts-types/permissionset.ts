export type SteedosPermissionsetTypeConfig = {
    name: string,
    label: string,
    type: 'permission_set',
    license?: string,
    assigned_apps: Array<string>,
    is_system: boolean
}