_.each(AccountsTemplates.atInputRendered, function(callback){
  Template.atInput.onRendered(callback);
  Template.atHiddenInput.onRendered(callback);
});

// Simply 'inherites' helpers from AccountsTemplates
Template.atInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atInput.events(AccountsTemplates.atInputEvents);

// Simply 'inherites' helpers from AccountsTemplates
Template.atTextInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atCheckboxInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atSelectInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atRadioInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atHiddenInput.helpers(AccountsTemplates.atInputHelpers);


// Sets up default Bootstrap icon classes for social button icons
AccountsTemplates.configure({
    texts: {
        inputIcons: {
            isValidating: "glyphicon glyphicon-refresh",
            hasError: "glyphicon glyphicon-remove",
            hasSuccess: "glyphicon glyphicon-ok",
        }
    },
});
