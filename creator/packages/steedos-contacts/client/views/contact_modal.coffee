Template.contacts_modal.helpers
    contactsListData: ()->
        console.log("contactsListData...")
        # return {defaultValues:MailManager.getContacts(this.targetId)}; 
        return {}
    subsReady: ->
        return Steedos.subsAddressBook.ready() and Steedos.subsSpace.ready();

Template.contacts_modal.events
#	'shown.bs.modal #contacts_modal': (event, template) ->
#		debugger;
#		$(".steedos-mail-contacts-modal").css("max-height", ($(window).height() - 180 - 25) + "px")

    'click #confirm': (event, template) ->
        console.log("..confirm");
        
        target = template.data.target;
        targetId = template.data.targetId;
        ifrFsshWebMail = $("#fssh-webmail-iframe");
        ifrSogoWeb = $("#sogo-web-iframe");

        if targetId and $("#"+targetId).length > 0

            selectize = $("#"+targetId)[0].selectize

            values = ContactsManager.getContactModalValue();

            values.forEach (value)->
    #           console.log value.name
               selectize.createItem(value.name + "<" + value.email + ">")
        else if ifrSogoWeb.length
            # sogo邮件系统
            values = ContactsManager.getContactModalValue();
            # "editor.message.editable.to"/"editor.message.editable.cc"/"editor.message.editable.bcc"
            ngModel = $(target).next().attr("ng-model")
            targetInput = $(target).next().find("md-autocomplete-wrap input")
            if ngModel
                ngModel = ngModel.replace(/editor.message.editable./,"")
                values.forEach (value)->
                    ifrSogoWeb[0].contentWindow.addRecipient(value.name + " <" + value.email + ">", ngModel)
                    targetInput.trigger("click")
        else if ifrFsshWebMail.length
            # fssh中邮邮件系统
            values = ContactsManager.getContactModalValue();
            values.forEach (value)->
                ifrFsshWebMail[0].contentWindow.O(targetId).addressAdd('"'+value.name+'" &lt;'+value.email+'&gt;')

        Modal.hide(template);

Template.contacts_modal.onRendered ->
	$(".steedos-mail-contacts-modal").css("height", ($(window).height() - 180 - 25) + "px")
