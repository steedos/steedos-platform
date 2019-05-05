import { SteedosIDType } from ".";

export type SteedosUserSession = {
    userId: SteedosIDType,
    spaceId: string,
    roles: string[],
    name: string,
    steedos_id?: string,
    email?: string
}