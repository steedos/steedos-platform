
AccountsTemplates.atSocialHelpers.buttonText = function() {
        // var service = this;
        // var serviceName = this._id;
        // if (serviceName === "meteor-developer")
        //     serviceName = "meteor";
        // //serviceName = capitalize(serviceName);
        // if (!service.configured)
        //     return T9n.get(AccountsTemplates.texts.socialConfigure, markIfMissing=false) + " " + serviceName;
        // var showAddRemove = AccountsTemplates.options.showAddRemoveServices;
        // var user = Meteor.user();
        // if (user && showAddRemove){
        //     if (user.services && user.services[this._id]){
        //         var numServices = _.keys(user.services).length; // including "resume"
        //         if (numServices === 2)
        //             return serviceName;
        //         else
        //             return T9n.get(AccountsTemplates.texts.socialRemove, markIfMissing=false) + " " + serviceName;
        //     } else
        //             return T9n.get(AccountsTemplates.texts.socialAdd, markIfMissing=false) + " " + serviceName;
        // }
        // var parentData = Template.parentData();
        // var state = (parentData && parentData.state) || AccountsTemplates.getState();
        // var prefix = state === "signIn" ?
        //    AccountsTemplates.texts.socialSignIn:
        //    AccountsTemplates.texts.socialSignUp;
        // return T9n.get( prefix + " " + AccountsTemplates.texts.socialWith + " " + serviceName, markIfMissing=false);
        return T9n.get(this._id)
};


// Simply 'inherites' helpers from AccountsTemplates
Template.atSocial.helpers(AccountsTemplates.atSocialHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atSocial.events(AccountsTemplates.atSocialEvents);
