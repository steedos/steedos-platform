import SteedosButtonIcon from "@steedos-widgets/design-system/dist/types/components/ButtonIcon"

export function settingsStateSelector(state: any){
    return state.settings ? state.settings: undefined
}

export function dataServicesSelector(state: any){
    var steedosService = '/'
    if(window && (window as any).Meteor){
        steedosService = (window as any).Steedos.absoluteUrl('', true);
    }
    if (steedosService){
        // 去掉url中的最后一个斜杠
        steedosService = steedosService.replace(/\/$/, "");
    }
    return steedosService
}