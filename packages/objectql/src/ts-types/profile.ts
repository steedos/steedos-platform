export type SteedosProfileTypeConfig = {
    name: string,
    label: string,
    type: 'profile',
    license: string,
    assigned_apps: Array<string>,
    is_system: boolean,
    password_history: string,
    max_login_attempts: string,
    lockout_interval: string
}