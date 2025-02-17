
import { Account } from './account'
import { Space } from './space';
import { Object } from './object';
import { User } from './user';

export const Steedos = {
    isSpaceAdmin: ()=>{
        return (window as any).Builder.settings.context?.user?.is_space_admin
    },
    Account,
    Space,
    Object,
    User
}