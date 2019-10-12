// Simply 'inherites' helpers from AccountsTemplates
Template.atSignupLink.helpers(AccountsTemplates.atSignupLinkHelpers);
Template.atSignupLink.helpers({
    showRegister: function() {       
        if (Steedos.getSpaceId()){
            return db.spaces.findOne(Steedos.getSpaceId()).enable_register;
        }
        else
        { return true;}
    }
})
// Simply 'inherites' events from AccountsTemplates
Template.atSignupLink.events(AccountsTemplates.atSignupLinkEvents);