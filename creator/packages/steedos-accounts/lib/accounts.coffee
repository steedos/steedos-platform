# Options
sendVerificationEmail = true
if !process.env.MAIL_URL || ! Package["email"]
  sendVerificationEmail = false
AccountsTemplates.configure
  defaultLayout: 'loginLayout',
  defaultLayoutRegions: 
    nav: 'loginNav',
  defaultContentRegion: 'main',

  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,

  sendVerificationEmail: sendVerificationEmail,
  # enforceEmailVerification: true,
  # confirmPassword: true,
  # continuousValidation: false,
  # displayFormLabels: true,
  # forbidClientAccountCreation: true,
  # formValidationFeedback: true,
  homeRoutePath: '/',
  # showAddRemoveServices: false,
  # showPlaceholders: true,

  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true,
  showLabels: false,

  # Privacy Policy and Terms of Use
  # privacyUrl: 'privacy',
  # termsUrl: 'terms-of-use',

  preSignUpHook: (password, options) ->
    options.profile.locale = Steedos.getLocale();




AccountsTemplates.configureRoute 'changePwd',
  path: '/steedos/change-password'
AccountsTemplates.configureRoute 'forgotPwd',
  path: '/steedos/forgot-password'
  redirect: '/steedos/forgot-password-token'
AccountsTemplates.configureRoute 'resetPwd',
  path: '/steedos/reset-password'
AccountsTemplates.configureRoute 'signIn',
  path: '/steedos/sign-in'
  redirect: ()->
    # path = FlowRouter.current().path
    # if /^\/oauth2\b/.test(path)
    #   location.reload()
    # else
    #   FlowRouter.go(FlowRouter.current().queryParams?.redirect || "/");
    if FlowRouter.current().queryParams?.redirect 
      document.location.href = FlowRouter.current().queryParams?.redirect 
    else
      FlowRouter.go("/")
      
AccountsTemplates.configureRoute 'signUp',
  path: '/steedos/sign-up'
AccountsTemplates.configureRoute 'verifyEmail',
  path: '/steedos/verify-email'
  redirect: ()->
    # 当且仅当用户只有一个邮箱时,设置主要邮箱
    emails = Meteor.user()?.emails
    if emails and emails.length == 1
      email = emails[0].address
      $(document.body).addClass("loading")
      Meteor.call "users_set_primary_email", email, (error, result)->
        $(document.body).removeClass('loading')
        if result?.error
          toastr.error t(result.message)
    FlowRouter.go "/"
AccountsTemplates.configureRoute 'enrollAccount',
  path: '/steedos/enroll-account'

# add fields within sign-up form
pwdField = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'company',
    type: 'text'
  },
  {
    _id: 'name',
    type: 'text'
  },
  {
    _id: 'email',
    type: 'email',
    required: true
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email',
    placeholder: {
      forgotPwd:"email_input_placeholder"
    }
  },
  {
    _id: 'username_and_email',
    type: 'text',
    required: true,
    displayName: "Login"
  },
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: false,#企业注册界面没有该字段，所以改为非必填
    minLength: 6
  },
  pwdField
]);


if Meteor.isServer and Accounts.emailTemplates
  Accounts.emailTemplates.siteName = "Steedos";
  Accounts.emailTemplates.from = Meteor.settings.email?.from;


if Meteor.settings?.public?.accounts?.disableAccountRegistration
  AccountsTemplates.options.forbidClientAccountCreation = true
