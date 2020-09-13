import { RequestStatusOption } from '../constants'

export type RequestStatusType = {
    status: RequestStatusOption,
    error: null | Object
};