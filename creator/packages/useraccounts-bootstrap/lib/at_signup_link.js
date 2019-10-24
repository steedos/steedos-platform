// Simply 'inherites' helpers from AccountsTemplates
Template.atSignupLink.helpers(AccountsTemplates.atSignupLinkHelpers);
Template.atSignupLink.helpers({
    showRegister: function() {  
        return false
    }
})
// Simply 'inherites' events from AccountsTemplates
Template.atSignupLink.events(AccountsTemplates.atSignupLinkEvents);