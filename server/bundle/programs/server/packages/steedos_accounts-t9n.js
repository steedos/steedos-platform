(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var translations, __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/steedos_accounts-t9n/packages/steedos_accounts-t9ni18n/e //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _ = Package.underscore._,
    package_name = "project",
    namespace = "project";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","preloaded_langs":[],"cdn_path":null});
TAPi18n.languages_names["en"] = ["English","English"];
// integrate the fallback language translations 
translations = {};
translations[namespace] = {"atTitle":"Steedos","add":"add","and":"and","back":"back","cancel":"Cancel","changePassword":"Change Password","choosePassword":"Choose a Password","clickAgree":"By clicking Register, you agree to our","configure":"Configure","createAccount":"Create an Account","currentPassword":"Current Password","dontHaveAnAccount":"No account?","email":"Email","emailAddress":"Email Address","emailResetLink":"Reset Password","pwdResetLink":"Reset Password","forgotPwdToken":"Forgot Password Token","forgotPassword":"Forgot your password?","ifYouAlreadyHaveAnAccount":"If you already have an account?","newPassword":"New Password","newPasswordAgain":"New Password (again)","optional":"Optional","OR":"OR","password":"Password","passwordAgain":"Password (again)","privacyPolicy":"Privacy Policy","remove":"remove","resetYourPassword":"Reset your password","inputTokenFromEmail":"Input token code from email","setPassword":"Set Password","sign":"Sign","signIn":"Sign In","signin":"sign in","signOut":"Sign Out","signUp":"Register","signupCode":"Registration Code","signUpWithYourEmailAddress":"Register with your email address","terms":"Terms of Use","updateYourPassword":"Update your password","username":"Username","usernameOrEmail":"Username or email","with":"with","requiredField":"Required Field","maxAllowedLength":"Maximum allowed length","minRequiredLength":"Minimum required length for ","resendVerificationEmail":"Send email again","resendVerificationEmailLink_pre":"Verification email lost?","resendVerificationEmailLink_link":"Send again","enterPassword":"Enter password","enterNewPassword":"Enter new password","enterEmail":"Enter email","enterUsername":"Enter username","enterUsernameOrEmail":"Enter username or email","orUse":"Or use","info":{"emailSent":"Email sent","emailVerified":"Email verified","passwordChanged":"Password changed","passwordReset":"Password reset"},"alert":{"ok":"Ok","type":{"info":"Notice","error":"Error","warning":"Warning"}},"error":{"emailRequired":"Email is required.","minChar":"7 character minimum password.","pwdsDontMatch":"Passwords don't match","pwOneDigit":"Password must have at least one digit.","pwOneLetter":"Password requires 1 letter.","signInRequired":"You must be signed in to do that.","signupCodeIncorrect":"Registration code is incorrect.","signupCodeRequired":"Registration code is required.","usernameIsEmail":"Username cannot be an email address.","usernameRequired":"Username is required."},"Username_and_email":"Phone, mail, username","Username":"Username","loginWithPhone":"Login with phone","email_input_placeholder":"Please enter the email address","signUpFree":"Free trial","signUpEnt":"Free trial"};
TAPi18n._loadLangFileObject("en", translations);
TAPi18n._registerServerTranslator("en", namespace);

///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/steedos_accounts-t9n/packages/steedos_accounts-t9ni18n/z //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _ = Package.underscore._,
    package_name = "project",
    namespace = "project";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","简体中文"];
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {
  TAPi18n.translations["zh-CN"] = {};
}

if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {
  TAPi18n.translations["zh-CN"][namespace] = {};
}

_.extend(TAPi18n.translations["zh-CN"][namespace], {"atTitle":"Steedos","add":"添加","and":"和","back":"返回","cancel":"取消","changePassword":"修改密码","choosePassword":"新密码","clickAgree":"点击注册表示您同意","configure":"配置","createAccount":"创建账户","currentPassword":"当前密码","dontHaveAnAccount":"没有账号？","email":"电子邮箱","emailAddress":"电邮地址","emailResetLink":"重置密码","pwdResetLink":"重置密码","forgotPwdToken":"验证码","forgotPassword":"忘记密码？","ifYouAlreadyHaveAnAccount":"已有账户？","newPassword":"新密码","newPasswordAgain":"再输一遍新密码","optional":"可选的","OR":"或","password":"密码","passwordAgain":"再输一遍密码","privacyPolicy":"隐私条例","remove":"移除","resetYourPassword":"重置您的密码","inputTokenFromEmail":"请输入邮件中的验证码","setPassword":"设置密码","sign":"登","signIn":"登录","signin":"登录","signOut":"退出","signUp":"注册","signupCode":"注册码","signUpWithYourEmailAddress":"用您的电子邮件地址注册","terms":"使用条例","updateYourPassword":"更新您的密码","username":"用户名","usernameOrEmail":"用户名或电子邮箱","with":"与","requiredField":"不能为空","maxAllowedLength":"长度超出最大允许范围","minRequiredLength":"最小长度不能小于","resendVerificationEmail":"再发一次","resendVerificationEmailLink_pre":"没有收到验证邮件?","resendVerificationEmailLink_link":"再发一次","enterPassword":"输入密码","enterNewPassword":"输入新密码","enterEmail":"输入电子邮件","enterUsername":"输入用户名","enterUsernameOrEmail":"输入用户名或电子邮件","orUse":"或是使用","info":{"emailSent":"邮件已发出","emailVerified":"邮件验证成功","passwordChanged":"密码修改成功","passwordReset":"密码重置成功"},"error":{"emailRequired":"必须填写电子邮件","minChar":"密码至少7个字符长","pwdsDontMatch":"两次密码不一致","pwOneDigit":"密码中至少有一位数字","pwOneLetter":"密码中至少有一位字母","signInRequired":"您必须登录后才能查看","signupCodeIncorrect":"注册码错误","signupCodeRequired":"必须有注册码","usernameIsEmail":"是用户名而不是电子邮件地址","usernameRequired":"必须填写用户名。","accounts":{"Email already exists.":"该电子邮件地址已被使用。","Email doesn't match the criteria.":"错误的的电子邮件地址。","Invalid login token":"登录密匙错误","Login forbidden":"用户名或密码错误","Service unknown":"未知服务","Unrecognized options for login request":"登录请求存在无法识别的选项","User validation failed":"用户验证失败","Username already exists.":"用户名已被占用。","You are not logged in.":"您还没有登录。","You've been logged out by the server. Please log in again.":"您被服务器登出了。请重新登录。","Your session has expired. Please log in again.":"会话过期，请重新登录。","Invalid email or username":"不合法的电子邮件或用户名","Internal server error":"内部服务器错误","undefined":"未知错误","No matching login attempt found":"未发现对应登录请求","Password is old. Please reset your password.":"密码过于老了，请重置您的密码。","Incorrect password":"错误的密码","Invalid email":"不合法的电子邮件地址","Must be logged in":"必须先登录","Need to set a username or email":"必须设置用户名或电子邮件地址","old password format":"较老的密码格式","Password may not be empty":"密码不应该为空","Signups forbidden":"注册被禁止","Token expired":"密匙过期","Token has invalid email address":"密匙对应的电子邮箱地址不合法","User has no password set":"用户没有密码","User not found":"未找到该用户","Verify email link expired":"激活验证邮件的链接已过期","Verify email link is for unknown address":"验证邮件的链接去向未知地址","Match failed":"匹配失败","Unknown error":"未知错误"}},"User has no password set":"该账户没有设置密码","User not found":"未找到该用户","Username_and_email":"手机、邮件、用户名","Username":"用户名","loginWithPhone":"手机验证码登录","email_input_placeholder":"请输入邮件地址","signUpFree":"企业注册","signUpEnt":"企业注册"});
TAPi18n._registerServerTranslator("zh-CN", namespace);

///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/steedos_accounts-t9n/core.coffee                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.T9n = {};

T9n.get = function (key) {
  if (key) {
    return TAPi18n.__(key);
  } else {
    return "";
  }
};

T9n.setLanguage = function () {};
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:accounts-t9n");

})();

//# sourceURL=meteor://💻app/packages/steedos_accounts-t9n.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hY2NvdW50cy10OW4vY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIl0sIm5hbWVzIjpbIlQ5biIsImdldCIsImtleSIsIlRBUGkxOG4iLCJfXyIsInNldExhbmd1YWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsS0FBQ0EsR0FBRCxHQUFPLEVBQVA7O0FBRUFBLElBQUlDLEdBQUosR0FBVSxVQUFDQyxHQUFEO0FBQ0YsTUFBR0EsR0FBSDtBQUNRLFdBQU9DLFFBQVFDLEVBQVIsQ0FBV0YsR0FBWCxDQUFQO0FBRFI7QUFHUSxXQUFPLEVBQVA7QUNDYjtBRExPLENBQVY7O0FBT0FGLElBQUlLLFdBQUosR0FBa0IsY0FBbEIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hY2NvdW50cy10OW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJAVDluID0ge31cclxuXHJcblQ5bi5nZXQgPSAoa2V5KSAtPlxyXG4gICAgICAgIGlmIGtleVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18ga2V5XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcclxuXHJcblxyXG5UOW4uc2V0TGFuZ3VhZ2UgPSAoKSAtPlxyXG4gICAgICAgICMgZG8gbm90aGluZyIsInRoaXMuVDluID0ge307XG5cblQ5bi5nZXQgPSBmdW5jdGlvbihrZXkpIHtcbiAgaWYgKGtleSkge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn07XG5cblQ5bi5zZXRMYW5ndWFnZSA9IGZ1bmN0aW9uKCkge307XG4iXX0=
