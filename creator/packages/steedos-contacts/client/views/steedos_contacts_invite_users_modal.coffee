Template.steedos_contacts_invite_users_modal.helpers


Template.steedos_contacts_invite_users_modal.events
  "click .btn-primary": (event, template) ->
    newEmails = []
    is_all_correct = true
    emails_value = $('textarea').val()

    if !emails_value.trim()
      toastr.warning(TAPi18n.__('steedos_contacts_invite_users_input'))
      return

    $(document.body).addClass('loading')

    emails = emails_value.split(/，|;|；|,|\n/)


    regexp = new RegExp(/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i)

    emails.forEach (email) ->
      # 去除空格
      email = email.replace(/\s/g, '')
      # 去除空元素
      if email
        if regexp.test(email)
          newEmails.push(email)
        else
          is_all_correct = false
          $(document.body).removeClass('loading')
          toastr.error(TAPi18n.__('email_format_error') + "</br>" + email)

    if is_all_correct != true
      return


    space_id = Session.get('spaceId')
    organizations = [Session.get('contacts_orgId')]
    Meteor.call('invite_users_by_email', newEmails, space_id, organizations, (error, result) ->
      $(document.body).removeClass('loading')
      if error
        if error.error
          toastr.error TAPi18n.__ error.reason
        else
          toastr.error error.message

      if result
        Modal.hide()
        toastr.success(TAPi18n.__('steedos_contacts_invite_users_success'))

    )

  'click #invite_users_help': (event, template) ->
    Steedos.openWindow(t("invite_users_help"));
