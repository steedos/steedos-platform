if Meteor.isServer
  Meteor.methods
    users_add_email: (email) ->
      if not @userId?
        return {error: true, message: "email_login_required"}
      if not email
        return {error: true, message: "email_required"}
      if not /^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(email)
        return {error: true, message: "email_format_error"}
      if db.users.find({"emails.address": email}).count()>0
        return {error: true, message: "email_exists"}

      user = db.users.findOne(_id: this.userId)
      if user.emails? and user.emails.length > 0 
        db.users.direct.update {_id: this.userId}, 
          $push: 
            emails: 
              address: email
              verified: false
      else
        db.users.direct.update {_id: this.userId}, 
          $set: 
            steedos_id: email
            emails: [
              address: email
              verified: false
            ]

      Accounts.sendVerificationEmail(this.userId, email);

      return {}

    users_remove_email: (email) ->
      if not @userId?
        return {error: true, message: "email_login_required"}
      if not email
        return {error: true, message: "email_required"}

      user = db.users.findOne(_id: this.userId)
      if user.emails? and user.emails.length >= 2
        p = null
        user.emails.forEach (e)->
          if e.address == email
            p = e
            return
        
        db.users.direct.update {_id: this.userId}, 
          $pull: 
            emails: 
              p
      else
        return {error: true, message: "email_at_least_one"}

      return {}

    users_verify_email: (email) ->
      if not @userId?
        return {error: true, message: "email_login_required"}
      if not email
        return {error: true, message: "email_required"}
      if not /^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(email)
        return {error: true, message: "email_format_error"}
      

      Accounts.sendVerificationEmail(this.userId, email);

      return {}

    users_set_primary_email: (email) ->
      if not @userId?
        return {error: true, message: "email_login_required"}
      if not email
        return {error: true, message: "email_required"}

      user = db.users.findOne(_id: this.userId)
      emails = user.emails
      emails.forEach (e)->
        if e.address == email
          e.primary = true
        else
          e.primary = false

      db.users.direct.update {_id: this.userId},
        $set:
          emails: emails
          email: email

      db.space_users.direct.update({user: this.userId},{$set: {email: email}}, {multi: true})
      return {}



if Meteor.isClient
    Steedos.users_add_email = ()->
        swal
            title: t("primary_email_needed"),
            text: t("primary_email_needed_description"),
            type: 'input',
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top"
        , (inputValue) ->
            Meteor.call "users_add_email", inputValue, (error, result)->
                if result?.error
                    toastr.error result.message
                else
                    swal t("primary_email_updated"), "", "success"
###
    Tracker.autorun (c) ->

        if Meteor.user()
          if Meteor.loggingIn()
            # 正在登录中，则不做处理，因为此时Meteor.userId()不足于证明已登录状态
            return
          primaryEmail = Meteor.user().emails?[0]?.address
          if !primaryEmail
              Steedos.users_add_email();
###