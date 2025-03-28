module.exports = {
    invite_space_usersVisible: function () {
        return false
        // if (Steedos.isSpaceAdmin() && Steedos.Account.disabledAccountRegister() != true) {
        //     let space = Steedos.Space.get();
        //     if (space && space.enable_register) {
        //         return true;
        //     }
        // }
    }
}