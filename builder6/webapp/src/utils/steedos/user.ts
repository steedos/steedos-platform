export const User = {
    get: ()=>{
        return (window as any).Builder.settings.context?.user
    }
}