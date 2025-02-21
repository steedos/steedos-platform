import { getMySpaces } from "@/actions/spaces"

export const Space = {
    get: ()=>{
        return _.find(Steedos.__hotRecords.spaces, {_id: (window as any).Builder.settings.context?.tenantId})
    },
    getMySpaces: ()=>{
        return Steedos.__hotRecords.spaces;
    }
}