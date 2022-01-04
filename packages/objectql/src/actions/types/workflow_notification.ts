export type WorkflowNotification = {
    _id: string,
    object_name: string,
    name: string,
    title: string,
    body: string,
    assigned_users: string[],
    assigned_user_field: string[]
}