// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// @flow

import { RequestStatusOption } from '../../constants'
import { RequestStatusType, GenericActionType } from '../../types';

export function initialRequestState(): RequestStatusType {
    return {
        status: RequestStatusOption.NOT_STARTED,
        error: null,
    };
}

export function handleRequest(
    REQUEST: string,
    SUCCESS: string,
    FAILURE: string,
    state: RequestStatusType,
    action: GenericActionType
): RequestStatusType {
    switch (action.type) {
        case REQUEST:
            return {
                ...state,
                status: RequestStatusOption.STARTED,
            };
        case SUCCESS:
            return {
                ...state,
                status: RequestStatusOption.SUCCESS,
                error: null,
            };
        case FAILURE: {
            return {
                ...state,
                status: RequestStatusOption.FAILURE,
                error: action.error,
            };
        }
        default:
            return state;
    }
}
