export type GenericActionType = {
    type: string,
    data: any,
    meta?: any,
    error?: any,
    index?: number,
    displayable?: boolean,
    postId?: string,
    sessionId?: string,
    currentUserId?: string,
    remove?: Function,
    timestamp?: number,
    payload?: any
}