(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var _ = Package.underscore._;

/* Package-scope variables */
var __, translations, _regEx, local_reg;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/package-i18n.js                                //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
TAPi18n.packages["gwendall:simple-schema-i18n"] = {"namespace":"project","translation_function_name":"__","helper_name":"_"};

// define package's translation function (proxy to the i18next)
__ = TAPi18n._getPackageI18nextProxy("project");

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/ar.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["ar"])) {
  TAPi18n.translations["ar"] = {};
}

if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {
  TAPi18n.translations["ar"][namespace] = {};
}

_.extend(TAPi18n.translations["ar"][namespace], {"simpleschema":{"messages":{"required":"[label] مطلوب","minString":"[label] يجب أن يكون علي الأقل [min] حروف","maxString":"[label] لا يجب أن يتعدي [max] حروف","minNumber":"[label] يجب أن يكون علي الأقل [min]","maxNumber":"[label] لا يجب أن يتعدي [max]","minNumberExclusive":"[label] يجب أن يكون أكبر من [min]","maxNumberExclusive":"[label] يجب أن يكون أقل من [max]","minDate":"[label] يجب أن يكون في أو بعد [min]","maxDate":"[label] لا يمكن أن يكون بعد [max]","badDate":"[label] تاريخ غير صحيح","minCount":"يجب أن تحدد علي الأقل [minCount] قيم","maxCount":"لا يمكنك تحديد أكثر من [maxCount] قيم","noDecimal":"[label] يجب أن يكون رقم صحيح","notAllowed":"[value] قيمة غير مسموح بها","expectedString":"[label] يجب أن يكون حروف","expectedNumber":"[label] يجب أن يكون رقم","expectedBoolean":"[label] يجب أن تكون قيمة بولينية","expectedArray":"[label] يجب أن تكون مصفوفة","expectedObject":"[label] يجب أن يكون نموذج","expectedConstructor":"[label] يجب أن يكون [type]","keyNotInSchema":"[key] غير مسموح به بواسطة المخطط","regEx":{"0":{"msg":"[label] خطأ في تقييم الريجلر إيكسبريشن"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] يجب أن يكون بريد إلكتروني صحيح"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] يجب أن يكون بريد إلكتروني صحيح"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] يجب أن يكون موقع صحيح"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] يجب أن يكون موفع صحيح"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] يجب أن يكون عنوان بروتوكول الجيل الرابع أو السادس صحيح"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] يجب أن يكون عنوان بروتوكول الجيل الرابع صحيح"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] يجب أن يكون بروتوكول الجيل السادس صحيح"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] يجب أن يمثل عنوان موقع صحيح"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] يجب أن يكون الرقم التحقيقي مكون من حروف وأرقام"}}}}});
TAPi18n._registerServerTranslator("ar", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/bg.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["bg"])) {
  TAPi18n.translations["bg"] = {};
}

if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {
  TAPi18n.translations["bg"][namespace] = {};
}

_.extend(TAPi18n.translations["bg"][namespace], {"simpleschema":{"messages":{"required":"[label] е задължително","minString":"[label] трябва да е минимум [min] знака","maxString":"[label] не може да е повече от [max] знака","minNumber":"[label] трябва да е минимум [min]","maxNumber":"[label] не може да е повече от [max]","minNumberExclusive":"[label] трябва да е повече от [min]","maxNumberExclusive":"[label] трябва да е по малко от[max]","minDate":"[label] трябва да е на или след [min]","maxDate":"[label] не може да е по късно от [max]","badDate":"[label] е невалидна дата","minCount":"Трябва да изберете минимум [minCount] стойности","maxCount":"Трябва да са не повече от [maxCount] стойности","noDecimal":"[label] трябва да е цяло число","notAllowed":"[value] не е позволена стойност","expectedString":"[label] трябва да е  низ","expectedNumber":"[label] трябва да е число","expectedBoolean":"[label] трябва да е булева стойност","expectedArray":"[label] трябва да е масив","expectedObject":"[label] трябва да е обект","expectedConstructor":"[label] трябва да е [type]","keyNotInSchema":"[key] е непозволен в тази схема","regEx":{"0":{"msg":"[label] нвалиден регулярен израз"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] трябва да е валиден e-mail адрес"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] трябва да е валиден e-mail адрес"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] трябва да е валиден домейн"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] трябва да е валиден домейн"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] трябва да е валиден IPv4 или IPv6 адрес"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] трябва да е валиден IPv4 адрес"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] трябва да е валиден IPv6 адрес"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] трябва да е валиден URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] трябва да е валиден низ от букви и числа"}}}}});
TAPi18n._registerServerTranslator("bg", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/cs.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["cs"])) {
  TAPi18n.translations["cs"] = {};
}

if(_.isUndefined(TAPi18n.translations["cs"][namespace])) {
  TAPi18n.translations["cs"][namespace] = {};
}

_.extend(TAPi18n.translations["cs"][namespace], {"simpleschema":{"messages":{"required":"[label] je povinné pole","minString":"[label] musí být alespoň [min] písmen","maxString":"[label] nesmí být vice jak [max] písmen","minNumber":"[label] musí být alespoň [min]","maxNumber":"[label] nesmí být vice jak [max]","minNumberExclusive":"[label] musí být více než [min]","maxNumberExclusive":"[label] musí být méně než [max]","minDate":"[label] musí být [min] nebo později","maxDate":"[label] nemůže být po [max]","badDate":"[label] není validní datum","minCount":"Musíte vybrat alespoň [minCount] hodnot","maxCount":"Nemůžete vybrat více jak [maxCount] hodnot","noDecimal":"[label] musí být celé číslo","notAllowed":"[value] není povolená hodnota","expectedString":"[label] musí být text","expectedNumber":"[label] musí být číslo","expectedBoolean":"[label] musí být boolean","expectedArray":"[label] musí být seznam","expectedObject":"[label] musí být objekt","expectedConstructor":"[label] musí být [type]","keyNotInSchema":"[key] není povoleno schématem","notUnique":"[label] musí být unikátní","regEx":{"0":{"msg":"[label] neprošlo kontrolou regularního výrazu"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] musí být validní e-mailová adresa"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] musí být validní e-mailová adresa"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] musí být validní doména"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] musí být validní doména"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] musí být validní IPv4 nebo IPv6 adresa"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] musí být validní IPv4 adresa"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] musí být validní IPv6 adresa"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] musí být validní URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] musí být validní alphanumerické ID"}}}}});
TAPi18n._registerServerTranslator("cs", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/cy.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["cy"])) {
  TAPi18n.translations["cy"] = {};
}

if(_.isUndefined(TAPi18n.translations["cy"][namespace])) {
  TAPi18n.translations["cy"][namespace] = {};
}

_.extend(TAPi18n.translations["cy"][namespace], {"simpleschema":{"messages":{"required":"Mae [label] yn ofynnol","minString":"Rhaid i [label] fod yn oleiaf [min] nod o hyd","maxString":"Ni all [label] fod yn fwy na [max] nod o hyd","minNumber":"Rhaid i [label] fod yn oleiaf [min]","maxNumber":"Ni all [label] fod yn fwy na [max]","minNumberExclusive":"Rhaid i [label] fod yn fwy na [min]","maxNumberExclusive":"Rhaid i [label] fod yn llai na [max]","minDate":"Rhaid i [label] for ar neu ar ôl [min]","maxDate":"Ni all [label] for ar ôl [max]","badDate":"Nid yw [label] yn ddyddiad dilys","minCount":"Rhaid dewis oleiaf [minCount] gwerth","maxCount":"Ni ellir dewis mwy na [maxCount] gwerth","noDecimal":"Rhaid i [label] fod yn gyfanrif","notAllowed":"Ni ganiateir gwerth [value]","expectedString":"Rhaid i [label] fod yn linyn","expectedNumber":"Rhaid i [label] fod yn rif","expectedBoolean":"Rhaid i [label] fod yn fath Boole","expectedArray":"Rhaid i [label] fod yn arae","expectedObject":"Rhaid i [label] fod yn wrthrych","expectedConstructor":"Rhaid i [label] fod yn [type]","keyNotInSchema":"Ni ganiateir [key] gan y sgema","notUnique":"Rhaid i [label] fod yn unigryw","regEx":{"0":{"msg":"Methodd [label] ddilysiad mynegiad rheolaidd"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"Rhaid i [label] fod yn gyfeiriad ebost dilys"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"Rhaid i [label] fod yn gyfeiriad ebost dilys"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[Rhaid i [label] fod yn barth dilys"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"Rhaid i [label] fod yn barth dilys"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[Rhaid i [label] fod yn gyfeiriad IPv4 neu IPv6 dilys"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"Rhaid i [label] fod yn gyfeiriad IPv4 dilys"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"Rhaid i [label] fod yn gyfeiriad IPv6 dilys"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[Rhaid i [label] fod yn URL dilys"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"Rhaid i [label] fod yn ddynodiad alffaniwmerig dilys"}}}}});
TAPi18n._registerServerTranslator("cy", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/de.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["de"])) {
  TAPi18n.translations["de"] = {};
}

if(_.isUndefined(TAPi18n.translations["de"][namespace])) {
  TAPi18n.translations["de"][namespace] = {};
}

_.extend(TAPi18n.translations["de"][namespace], {"simpleschema":{"messages":{"required":"[label] ist erforderlich","minString":"[label] muss mindestens [min] Buchstaben enthalten","maxString":"[label] kann nicht mehr als [max] Buchstaben haben","minNumber":"[label] muss mindestens [min] sein","maxNumber":"[label] darf nicht mehr als [max] sein","minNumberExclusive":"[label] muss grösser als [min] sein","maxNumberExclusive":"[label] muss kleiner als [max] sein","minDate":"[label] muss am oder nach dem [min] sein","maxDate":"[label] darf nicht nach dem [max] sein","badDate":"[label] ist kein valides Datum","minCount":"Sie müssen mindestens [minCount] Werte angeben","maxCount":"Sie können nicht mehr als [maxCount] Werte angeben","noDecimal":"[label] muss eine Ganzzahl sein","notAllowed":"[value] ist ein nicht erlaubter Wert","expectedString":"[label] muss eine Buchstabenkette sein","expectedNumber":"[label] muss eine Nummer sein","expectedBoolean":"[label] muss ein Wahrheitswert sein","expectedArray":"[label] muss ein Array sein","expectedObject":"[label] muss ein Objekt sein","expectedConstructor":"[label] muss von Type [type] sein","keyNotInSchema":"[key] ist vom Schema nicht erlaubt","regEx":{"0":{"msg":"[label] entspricht nicht dem regulären Ausdruck"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] muss eine valide Email Adresse sein"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] muss eine valide Email Adresse sein"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] muss eine valide Domain sein"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] muss eine valide Domain sein"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] muss eine IPv4 oder IPv6 Adresse sein"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] muss eine valide IPv4 Adresse sein"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] muss eine valide IPv6 Adresse sein"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] muss eine valide URL sein"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] muss eine valide alphanumerische ID sein"}}}}});
TAPi18n._registerServerTranslator("de", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/el.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["el"])) {
  TAPi18n.translations["el"] = {};
}

if(_.isUndefined(TAPi18n.translations["el"][namespace])) {
  TAPi18n.translations["el"][namespace] = {};
}

_.extend(TAPi18n.translations["el"][namespace], {"simpleschema":{"messages":{"required":"Το πεδίο [label] είναι απαραίτητο","minString":"To πεδίο [label] πρέπει να είναι τουλάχιστον [min] χαρακτήρες","maxString":"To πεδίο [label] δεν μπορεί να υπερβαίνει τους [max] χαρακτήρες","minNumber":"To πεδίο [label] πρέπει να είναι τουλάχιστον [min]","maxNumber":"To πεδίο [label] δεν μπορεί να είναι μεγαλύτερο από [max]","minNumberExclusive":"To πεδίο [label] πρέπει να είναι μεγαλύτερο από [min]","maxNumberExclusive":"To πεδίο [label] πρέπει να είναι μικρότερο από [max]","minDate":"Το πεδίο [label] πρέπει να είναι μία ημερομηνία μετά από [min]","maxDate":"Το πεδίο [label] πρέπει να είναι μία ημερομηνία πρίν από [max]","badDate":"Το πεδίο [label] δεν είναι έγκυρη ημερομηνία","minCount":"Πρέπει να επιλέξετε τουλάχιστον [minCount] τιμές","maxCount":"Δεν μπορείτε να επιλέξετε περισσότερες από [maxCount] τιμές","noDecimal":"Το πεδίο [label] πρέπει να είναι ακέραιος αριθμός","notAllowed":"To [value] δεν είναι αποδεκτή τιμή","expectedString":"Το πεδίο [label] πρέπει να είναι μια σειρά χαρακτήρων","expectedNumber":"Το πεδίο [label] πρέπει να είναι ένας αριθμός","expectedBoolean":"Το πεδίο [label] πρέπει να είναι true ή false","expectedArray":"Το πεδίο [label] πρέπει να είναι ένας πίνακας","expectedObject":"Το πεδίο [label] πρέπει να είναι ένα αντικείμενο","expectedConstructor":"Το πεδίο [label] πρέπει να είναι ένα [τύπος]","keyNotInSchema":"Το πεδίο [key] δεν είναι επιτρεπτό","regex":{"0":{"msg":"Η μορφή του πεδίου [label] δεν είναι αποδεκτή"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση e-mail"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση e-mail"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"Το πεδίο [label] πρέπει να είναι ένα έγκυρο domain"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"Το πεδίο [label] πρέπει να είναι ένα έγκυρο domain"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση IPv4 ή IPv6"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση IPv4"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση IPv6"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"Το πεδίο [label] πρέπει να είναι μια έγκυρη διεύθυνση URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"Το πεδίο [label] πρέπει να είναι ένα έγκυρο ID"}}}}});
TAPi18n._registerServerTranslator("el", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/en.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
// integrate the fallback language translations 
translations = {};
translations[namespace] = {"simpleschema":{"messages":{"required":"[label] is required","minString":"[label] must be at least [min] characters","maxString":"[label] cannot exceed [max] characters","minNumber":"[label] must be at least [min]","maxNumber":"[label] cannot exceed [max]","minNumberExclusive":"[label] must be greater than [min]","maxNumberExclusive":"[label] must be less than [max]","minDate":"[label] must be on or after [min]","maxDate":"[label] cannot be after [max]","badDate":"[label] is not a valid date","minCount":"You must specify at least [minCount] values","maxCount":"You cannot specify more than [maxCount] values","noDecimal":"[label] must be an integer","notAllowed":"[value] is not an allowed value","expectedString":"[label] must be a string","expectedNumber":"[label] must be a number","expectedBoolean":"[label] must be a boolean","expectedArray":"[label] must be an array","expectedObject":"[label] must be an object","expectedConstructor":"[label] must be a [type]","keyNotInSchema":"[key] is not allowed by the schema","notUnique":"[label] must be unique","regEx":{"0":{"msg":"[label] failed regular expression validation"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] must be a valid e-mail address"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] must be a valid e-mail address"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] must be a valid domain"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] must be a valid domain"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] must be a valid IPv4 or IPv6 address"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] must be a valid IPv4 address"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] must be a valid IPv6 address"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] must be a valid URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] must be a valid alphanumeric ID"}}}}};
TAPi18n._loadLangFileObject("en", translations);
TAPi18n._registerServerTranslator("en", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/es.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["es"])) {
  TAPi18n.translations["es"] = {};
}

if(_.isUndefined(TAPi18n.translations["es"][namespace])) {
  TAPi18n.translations["es"][namespace] = {};
}

_.extend(TAPi18n.translations["es"][namespace], {"simpleschema":{"messages":{"required":"[label] es obligatorio","minString":"[label] tiene que tener por lo menos [min] caracteres","maxString":"[label] no puede tener mas de [max] caracteres","minNumber":"[label] tiene que ser por lo menos [min]","maxNumber":"[label] no puede exceder [max]","minNumberExclusive":"[label] tiene que ser mas grande que [min]","maxNumberExclusive":"[label] tiene que ser mas pequeño que [max]","minDate":"[label] tiene que ser anterior a [min]","maxDate":"[label] no puede ser posterior a [max]","badDate":"[label] no es una fecha válida","minCount":"Tiene que especificar por lo menos [minCount] valores","maxCount":"No puede especificar mas de [maxCount] valores","noDecimal":"[label] tiene que ser un número entero","notAllowed":"[value] no es un valor permitido","expectedString":"[label] tiene que ser una cadena de caracteres","expectedNumber":"[label] tiene que ser un numero","expectedBoolean":"[label] tiene que ser de tipo 'si/no'","expectedArray":"[label] tiene que ser una lista","expectedObject":"[label] tiene que ser un objeto","expectedConstructor":"[label] tiene que ser de tipo [type]","keyNotInSchema":"[key] no está permitido por el esquema","regEx":{"0":{"msg":"[label] falló la validación por Expresión Regular (Regex)"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] tiene que ser una dirección de correo electrónico válida"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] tiene que ser una dirección de correo electrónico válida"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] tiene que ser un nombre de dominio válido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] tiene que ser un nombre de dominio válido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] tiene que ser una dirección de IPv4 o IPv6 válida"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] tiene que ser una dirección de IPv4 válida"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] tiene que ser una dirección de IPv6 válida"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] tiene que ser una URL válida"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] tiene que ser un ID alfanumérico"}}}}});
TAPi18n._registerServerTranslator("es", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/es-ES //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["es-ES"])) {
  TAPi18n.translations["es-ES"] = {};
}

if(_.isUndefined(TAPi18n.translations["es-ES"][namespace])) {
  TAPi18n.translations["es-ES"][namespace] = {};
}

_.extend(TAPi18n.translations["es-ES"][namespace], {"simpleschema":{"messages":{"required":"[label] es obligatorio","minString":"[label] tiene que tener por lo menos [min] caracteres","maxString":"[label] no puede tener más de [max] caracteres","minNumber":"[label] tiene que ser por lo menos [min]","maxNumber":"[label] no puede exceder [max]","minNumberExclusive":"[label] tiene que ser más grande que [min]","maxNumberExclusive":"[label] tiene que ser más chico que [max]","minDate":"[label] tiene que ser anterior [min]","maxDate":"[label] no puede ser posterior a[max]","badDate":"[label] no es una fecha válida","minCount":"No puede ser menor que [minCount]","maxCount":"No puede ser mayor que [maxCount]","noDecimal":"[label] tiene que ser un numero entero","notAllowed":"[value] no es un valor permitido","expectedString":"[label] tiene que ser una cadena de caracteres","expectedNumber":"[label] tiene que ser un número","expectedBoolean":"[label] tiene que ser de tipo 'si/no'","expectedArray":"[label] tiene que ser una lista","expectedObject":"[label] tiene que ser un objeto","expectedConstructor":"[label] tiene que ser de tipo [type]","keyNotInSchema":"[key] no esta permitido por el esquema","regEx":{"0":{"msg":"[label] falló la validación por Expresión Regular (Regex)"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] tiene que ser una dirección de correo electrónico válida"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] tiene que ser una dirección de correo electrónico válida"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] tiene que ser un nombre de dominio válido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] tiene que ser un nombre de dominio válido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] tiene que ser una dirección de IPv4 o IPv6 válida"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] tiene que ser una dirección de IPv4 válida"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] tiene que ser una dirección de IPv6 válida"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] tiene que ser una URL válida"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] tiene que ser un ID alfanumérico"}}}}});
TAPi18n._registerServerTranslator("es-ES", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/et.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["et"])) {
  TAPi18n.translations["et"] = {};
}

if(_.isUndefined(TAPi18n.translations["et"][namespace])) {
  TAPi18n.translations["et"][namespace] = {};
}

_.extend(TAPi18n.translations["et"][namespace], {"simpleschema":{"messages":{"required":"[label] on kohustuslik","minString":"[label] peab olema vähemalt [min] tähemärki","maxString":"[label] ei tohi ületada [max] tähemärki","minNumber":"[label] peab olema vähemalt [min]","maxNumber":"[label] ei tohi ületada [max]","minNumberExclusive":"[label] peab olema enam kui [min]","maxNumberExclusive":"[label] peab olema vähem kui [max]","minDate":"[label] varaseim lubatud kuupäev on [min]","maxDate":"[label] hiliseim lubatud kuupäev on [max]","badDate":"[label] ei ole korrektne kuupäev","minCount":"Pead valima vähemalt [minCount] väärtust","maxCount":"Ei saa valida enam kui [maxCount] väärtust","noDecimal":"[label] peab olema arv","notAllowed":"[value] ei ole lubatud väärtus","expectedString":"[label] peab olema sõne","expectedNumber":"[label] peab olema number","expectedBoolean":"[label] peab olema boolean","expectedArray":"[label] peab olema massiiv","expectedObject":"[label] peab olema objekt","expectedConstructor":"[label] peab olema tüüpi [type]","keyNotInSchema":"[key] ei ole lubatud skeemas","regEx":{"0":{"msg":"[label] ei läbinud regulaaravaldise kontrolli"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] ei ole korrektne e-posti aadress"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] ei ole korrektne e-posti aadress"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] ei ole korrektne domeen"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] ei ole korrektne domeen"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] ei ole korrektne IPv4 või IPv6 aadress"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] ei ole korrektne IPv4 aadress"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] ei ole korrektne IPv6 aadress"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] ei ole korrektne URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] peab koosnema tähtedest ja numbritest"}}}}});
TAPi18n._registerServerTranslator("et", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/fr.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["fr"])) {
  TAPi18n.translations["fr"] = {};
}

if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {
  TAPi18n.translations["fr"][namespace] = {};
}

_.extend(TAPi18n.translations["fr"][namespace], {"simpleschema":{"messages":{"required":"Veuillez saisir quelque chose","minString":"Veuillez saisir au moins [min] caractères","maxString":"Veuillez saisir moins de [max] caractères","minNumber":"Ce champ doit être superieur ou égal à [min]","maxNumber":"Ce champ doit être inferieur ou égal à [max]","minNumberExclusive":"Ce champ doit être superieur à [min]","maxNumberExclusive":"Ce champ doit être inferieur à [max]","minDate":"La date doit est posterieure au [min]","maxDate":"La date doit est anterieure au [max]","badDate":"Cette date est invalide","minCount":"Vous devez saisir plus de [minCount] valeurs","maxCount":"Vous devez saisir moins de [maxCount] valeurs","noDecimal":"Ce champ doit être un entier","notAllowed":"[value] n'est pas une valeur acceptée","expectedString":"Ce champ doit être une chaine de caractères","expectedNumber":"Ce champ doit être un nombre","expectedBoolean":"Ce champ doit être un booléen","expectedArray":"Ce champ doit être un tableau","expectedObject":"Ce champ doit être une objet","expectedConstructor":"Ce champ doit être du type [type]","keyNotInSchema":"Le champ [key] n'est pas permis par le schéma","regEx":{"0":{"msg":"Ce champ a échoué la validation par Regex"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"Cette adresse e-mail est incorrecte"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"Cette adresse e-mail est incorrecte"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"Ce champ doit être un domaine valide"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"Ce champ doit être un domaine valide"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"Cette adresse IP est invalide"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"Cette adresse IPv4 est invalide"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"Cette adresse IPv6 est invalide"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"Cette URL is invalide"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"Cet identifiant alphanumérique est invalide"}}}}});
TAPi18n._registerServerTranslator("fr", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/he.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["he"])) {
  TAPi18n.translations["he"] = {};
}

if(_.isUndefined(TAPi18n.translations["he"][namespace])) {
  TAPi18n.translations["he"][namespace] = {};
}

_.extend(TAPi18n.translations["he"][namespace], {"simpleschema":{"messages":{"required":"[label] נדרש","minString":"[label] חייב להיות לפחות [min] תווים","maxString":"[label] מקסימום [max] תווים","minNumber":"[label] חייב להיות לפחות [min]","maxNumber":"[label] לא יותר מ [max]","minNumberExclusive":"[label] חייב להיות יותר מ[min]","maxNumberExclusive":"[label] חייב להיות פחות מ[max]","minDate":"[label] חייב להיות אחרי [min]","maxDate":"[label] לא יכול להיות אחרי [max]","badDate":"[label] התאריך אינו חוקי","minCount":"חייבים להיות לפחות [minCount] ערכים","maxCount":"אין אפשרות לבחור יותר מ[maxCount] ערכים","noDecimal":"[label] חייב להיות מספר","notAllowed":"[value] ערך זה אינו מאופשר","expectedString":"[label] חייב להיות מחרוזת תוים","expectedNumber":"[label] חייב להיות מספר","expectedBoolean":"[label] חייב להיות כן או לא","expectedArray":"[label] חייב להיות מערך","expectedObject":"[label] חייב להיות אובייקט","expectedConstructor":"[label] חייב להיות מסוג [type]","keyNotInSchema":"[key] המפתח אינו מאופשר על ידי הסכימה","regEx":{"0":{"msg":"[label] נכשל באימות תבנית הטקסט"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] חייב להיות אימייל חוקי"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] חייב להיות אימייל חוקי"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] חייב להיות דומיין חוקי"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] חייב להיות דומיין חוקי"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] חייב להיות כתובת IPv4 או IPv6 חוקית"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] חייב להיות כתובת IPv4 חוקית"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] חייב להיות כתובת IPv6 חוקית"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] חייב להיות כתובת URL חוקית"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] חייב להיות מזהה אלפאנומרי חוקי"}}}}});
TAPi18n._registerServerTranslator("he", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/hu.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["hu"])) {
  TAPi18n.translations["hu"] = {};
}

if(_.isUndefined(TAPi18n.translations["hu"][namespace])) {
  TAPi18n.translations["hu"][namespace] = {};
}

_.extend(TAPi18n.translations["hu"][namespace], {"simpleschema":{"messages":{"required":"[label] megadása kötelező","minString":"[label] legalább [min] karakter hosszú legyen","maxString":"[label] nem lehet [max] karakternél hosszabb","minNumber":"[label] minimum [min] legyen","maxNumber":"[label] maximum [max] lehet","minNumberExclusive":"[label] nagyobbnak kell lennie mint [min]","maxNumberExclusive":"[label] kisebbnek kell lennie mint [max]","minDate":"[label] később vagy aznap kell lennie mint [min]","maxDate":"[label] nem lehet [max] után","badDate":"[label] nem megfelelő formátumú dátum","minCount":"Legalább [minCount] értéket meg kell adnod","maxCount":"Nem adhatsz meg [maxCount] értéknél többet","noDecimal":"[label] egész számnak kell lennie","notAllowed":"[value] nem megengedett érték","expectedString":"[label] szövegnek kell lennie","expectedNumber":"[label] számnak kell lennie","expectedBoolean":"[label] logikai értéknek kell lennie","expectedArray":"[label] tömbnek kell lennie","expectedObject":"[label] objektum tipusúnak kell lennie","expectedConstructor":"[label] [type] típusúnak kell lennie","keyNotInSchema":"[key] érték a séma miatt nem engedélyezett","regEx":{"0":{"msg":"[label] sikertelen ellenőrzés a reguláris kifejezésre"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] érvényes e-mail címnek kell lennie"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] érvényes e-mail címnek kell lennie"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] érvényes tartománynak kell lennie"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] érvényes tartománynak kell lennie"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] érvényes IPv4 vagy IPv6 címnek kell lennie"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] érvényes IPv4 címnek kell lennie"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] érvényes IPv6 címnek kell lennie"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] érvényes URL címnek kell lennie"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] érvényes alfanumerikus azonosítónak kell lennie"}}}}});
TAPi18n._registerServerTranslator("hu", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/id.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["id"])) {
  TAPi18n.translations["id"] = {};
}

if(_.isUndefined(TAPi18n.translations["id"][namespace])) {
  TAPi18n.translations["id"][namespace] = {};
}

_.extend(TAPi18n.translations["id"][namespace], {"simpleschema":{"messages":{"required":"[label] harus diisi","minString":"[label] harus diisi dengan minimal [min] karakter","maxString":"[label] tidak bisa melebihi [max] karakter","minNumber":"[label] harus lebih besar atau sama dengan [min]","maxNumber":"[label] tidak boleh lebih besar dari [max]","minNumberExclusive":"[label] harus lebih besar dari [min]","maxNumberExclusive":"[label] harus kurang dari [max]","minDate":"[label] harus diisi dengan tanggal [min] atau setelahnya","maxDate":"[label] tidak bisa diisi dengan tanggal yang lebih dari [max]","badDate":"[label] tidak sesuai dengan format tanggal yang valid","minCount":"Anda harus mengisi dengan nilai setidaknya [minCount]","maxCount":"Anda tidak dapat mengisi dengan nilai lebih dari [maxCount]","noDecimal":"[label] harus integer","notAllowed":"[value] tidak boleh diisi","expectedString":"[label] harus diisi dengan aksara","expectedNumber":"[label] harus diisi dengan angkat","expectedBoolean":"[label] harus diisi dengan boolean","expectedArray":"[label] harus diisi dengan array","expectedObject":"[label] harus diisi dengan objek","expectedConstructor":"[label] harus berupa tipe [type]","keyNotInSchema":"[key] tidak diperbolehkan oleh skema","regEx":{"0":{"msg":"[label] tidak lolos validasi expresi reguler"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] harus diisi dengan format email yang valid"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] harus diisi dengan email yang valid"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] harus diisi dengan format domain yang valid"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] harus diisi dengan domain yang valid"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] harus diisi dengan format IPv4 atau IPv6 yang valid"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] harus diisi dengan format IPv4 yang valid"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] harus diisi dengan format IPv6 yang valid"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] harus diisi dengan format URL yang valid"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] harus diisi dengan format alphanumerik yang valid"}}}}});
TAPi18n._registerServerTranslator("id", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/it.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["it"])) {
  TAPi18n.translations["it"] = {};
}

if(_.isUndefined(TAPi18n.translations["it"][namespace])) {
  TAPi18n.translations["it"][namespace] = {};
}

_.extend(TAPi18n.translations["it"][namespace], {"simpleschema":{"messages":{"required":"[label] è richiesto","minString":"[label] deve essere almeno [min] caratteri","maxString":"[label] non può essere più di [max] caratteri","minNumber":"[label] deve essere almeno [min]","maxNumber":"[label] non può essere più di [max]","minNumberExclusive":"[label] deve essere maggiore di [min]","maxNumberExclusive":"[label] deve essere minore di [max]","minDate":"[label] deve coincidere o essere successivo a [min]","maxDate":"[label] non può essere successivo a [max]","badDate":"[label] non è una data valida","minCount":"Devi specificare almeno [minCount] valori","maxCount":"Non puoi specificare più di [maxCount] valori","noDecimal":"[label] deve essere un intero","notAllowed":"[value] non è un valore consentito","expectedString":"[label] deve essere una stringa","expectedNumber":"[label] deve essere un numero","expectedBoolean":"[label] deve essere un booleano","expectedArray":"[label] deve essere un vettore","expectedObject":"[label] deve essere un oggetto","expectedConstructor":"[label] deve essere un [type]","keyNotInSchema":"[key] non è consentito dallo schema","regEx":{"0":{"msg":"[label] ha fallito la validazione dell'espressione regolare"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] deve essere un indirizzo e-mail valido"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] deve essere un indirizzo e-mail valido"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] deve essere un dominio valido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] deve essere un dominio valido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] deve essere un indirizzo IPv4 o IPv6 valido"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] deve essere un indirizzo IPv4 valido"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] deve essere un indirizzo IPv6 valido"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] deve essere uno URL valido"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] deve essere un ID alfanumerico valido"}}}}});
TAPi18n._registerServerTranslator("it", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/ja.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["ja"])) {
  TAPi18n.translations["ja"] = {};
}

if(_.isUndefined(TAPi18n.translations["ja"][namespace])) {
  TAPi18n.translations["ja"][namespace] = {};
}

_.extend(TAPi18n.translations["ja"][namespace], {"simpleschema":{"messages":{"required":"[label] を入力してください","minString":"[label] は[min]文字以上で入力してください","maxString":"[label] は[max]文字以内で入力してください","minNumber":"[label] は[min]またそれ以上の値にしてください","maxNumber":"[label] は[max]またそれ以下の値にしてください","minNumberExclusive":"[label] は[min]以上の値にしてください","maxNumberExclusive":"[label] は[max]以下の値にしてください","minDate":"[label] は[min]以降で入力してください","maxDate":"[label] は[max]以前で入力してください","badDate":"[label] は日付で入力してください","minCount":"[label] は[minCount]項目以上で指定してください","maxCount":"[label] は[maxCount]項目以内で指定してください","noDecimal":"[label] は整数で入力してください","notAllowed":"[value] は有効ではない","expectedString":"[label] は文字列で入力してください","expectedNumber":"[label] は数値で入力してください","expectedBoolean":"[label] は真偽で入力してください","expectedArray":"[label] は配列で入力してください","expectedObject":"[label] はオブジェクトで入力してください","expectedConstructor":"[label] は[type]で入力してください","keyNotInSchema":"[key] は無効なスキーマです","regEx":{"0":{"msg":"[label] は正規表現で失敗しました"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] はメールアドレスで入力してください"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] はメールアドレスで入力してください"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] はドメインで入力してください"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] はドメインで入力してください"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] はIPv4またはIPv6アドレスで入力してください"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] はIPv4アドレスで入力してください"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] はIPv6アドレスで入力してください"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] はURLで入力してください"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] は英数字で入力してください"}}}}});
TAPi18n._registerServerTranslator("ja", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/nb.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["nb"])) {
  TAPi18n.translations["nb"] = {};
}

if(_.isUndefined(TAPi18n.translations["nb"][namespace])) {
  TAPi18n.translations["nb"][namespace] = {};
}

_.extend(TAPi18n.translations["nb"][namespace], {"simpleschema":{"messages":{"required":"[label] kreves","minString":"[label] må ha mist [min] tegn","maxString":"[label] kan ikke ha flere enn [max] tegn","minNumber":"[label] må være minst [min]","maxNumber":"[label] kan ikke være større enn [max]","minNumberExclusive":"[label] må være større enn [min]","maxNumberExclusive":"[label] må være mindre enn [max]","minDate":"[label] må være på eller etter [min]","maxDate":"[label] kan ikke være etter [max]","badDate":"[label] er ikke en gyldig dato","minCount":"Du må spesifisere minst [minCount] verdier","maxCount":"Du kan ikke spesifisere mer enn [maxCount] verdier","noDecimal":"[label] må være ett heltall","notAllowed":"[value] er ikke en tillatt verdi","expectedString":"[label] må være en streng","expectedNumber":"[label] må være et tall","expectedBoolean":"[label] må ha en boolsk verdi","expectedArray":"[label] må være en matrise","expectedObject":"[label] må være et objekt","expectedConstructor":"[label] må være en [type]","keyNotInSchema":"[key] er ikke tillatt etter skjemaet","regEx":{"0":{"msg":"[label] validering av det regulære utrykket feilet"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] må være en gyldig epostadresse"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] må være en gyldig epostadresse"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] må være et gyldig domene"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] må være et gyldig domene"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] må være en gyldig IPv4 eller IPv6 adresse"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] må være en gyldig IPv4 adresse"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] må være en gyldig IPv6 adresse"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] må være en gyldig URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] må være en gyldig alphanumerisk ID"}}}}});
TAPi18n._registerServerTranslator("nb", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/nl.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["nl"])) {
  TAPi18n.translations["nl"] = {};
}

if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {
  TAPi18n.translations["nl"][namespace] = {};
}

_.extend(TAPi18n.translations["nl"][namespace], {"simpleschema":{"messages":{"required":"[label] is vereist","minString":"[label] moet minimaal [min] karakters bevatten","maxString":"[label] kan maximaal [max] karakters bevatten","minNumber":"[label] moet minstens [min] zijn","maxNumber":"[label] kan niet meer dan [max] zijn","minNumberExclusive":"[label] moet minstens [min] zijn","maxNumberExclusive":"[label] kan niet meer dan [max] zijn","minDate":"[label] moet minimaal datum [min] zijn","maxDate":"[label] kan niet de datum [max] overschrijden","badDate":"[label] is niet een datum in het gevraagde formaat","minCount":"Minimaal [minCount] waardes invoeren","maxCount":"Er kunnen niet meer dan [maxCount] waardes worden ingevoerd","noDecimal":"[label] kan geen kommagetal zijn","notAllowed":"[value] mag niet ingevoerd worden","expectedString":"[label] moet van het type tekst zijn","expectedNumber":"[label] moet van het type getal zijn","expectedBoolean":"[label] moet van het type ja/nee zijn","expectedArray":"[label] moet van het type Array zijn","expectedObject":"[label] moet van het type Object zijn","expectedConstructor":"[label] moet het type [type] zijn","keyNotInSchema":"[key] mag niet als waarde worden ingevoerd","regEx":{"0":{"msg":"[label] is niet juist ingevoerd"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] moet een valide e-mailadres zijn"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] moet een valide e-mailadres zijn"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] moet een valide domeinnaam zijn"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] moet een valide domeinnaam zijn"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] moet een valide IPv4 of IPv6 adres zijn"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] moet een valide IPv4 adres zijn"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] moet een valide IPv6 adres zijn"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] moet een valide URL zijn"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] moet een valide alfanumeriek ID zijn"}}}}});
TAPi18n._registerServerTranslator("nl", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/pl.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["pl"])) {
  TAPi18n.translations["pl"] = {};
}

if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {
  TAPi18n.translations["pl"][namespace] = {};
}

_.extend(TAPi18n.translations["pl"][namespace], {"simpleschema":{"messages":{"required":"[label] jest wymagane","minString":"[label] wymaga co najmniej [min] znaków","maxString":"[label] przekracza maksymalną liczbę [max] znaków","minNumber":"[label] musi być co najmniej [min]","maxNumber":"[label] przekracza maksymalną wartość [max]","minNumberExclusive":"[label] musi być większe niż [min]","maxNumberExclusive":"[label] musi być mniejsze niż [max]","minDate":"[label] nie wcześniej niż [min]","maxDate":"[label] nie później niż [max]","badDate":"[label] nie jest prawidłową datą","minCount":"Trzeba podać co najmniej [minCount] wartości","maxCount":"Nie można podać więcej niż [maxCount] wartości","noDecimal":"[label] musi być liczbą całkowitą","notAllowed":"[value] nie ma prawidłowej wartości","expectedString":"[label] musi być łańcuchem znaków","expectedNumber":"[label] musi być liczbą","expectedBoolean":"[label] musi być typu Boolean","expectedArray":"[label] musi być tablicą","expectedObject":"[label] musi być obiektem","expectedConstructor":"[label] musi być typu [type]","keyNotInSchema":"[key] nie jest dozwolony","notUnique":"[label] musi być unikalne","regEx":{"0":{"msg":"[label] nie spełnia kryteriów wyrażenia regularnego"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] nie jest prawidłowym adresem e-mail"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] musi być prawidłowym adresem e-mail"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] must be a valid domain"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] musi być prawidłową domeną"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] musi być prawidłowym adresem IPv4 lub IPv6"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] musi być prawidłowym adresem IPv4"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] musi być prawidłowym adresem IPv6"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] musi być prawidłowym adresem URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] musi być prawidłowym alfanumerycznym ID"}}}}});
TAPi18n._registerServerTranslator("pl", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/pt.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["pt"])) {
  TAPi18n.translations["pt"] = {};
}

if(_.isUndefined(TAPi18n.translations["pt"][namespace])) {
  TAPi18n.translations["pt"][namespace] = {};
}

_.extend(TAPi18n.translations["pt"][namespace], {"simpleschema":{"messages":{"required":"[label] é obrigatório","minString":"[label] deve ter no mínimo [min] caracteres","maxString":"[label] não pode ter mais do que [max] caracteres","minNumber":"[label] deve ser pelo menos [min]","maxNumber":"[label] não pode ser maior do que [max]","minNumberExclusive":"[label] deve ser maior que [min]","maxNumberExclusive":"[label] deve ser menor que [max]","minDate":"[label] deve ser igual ou depois de [min]","maxDate":"[label] não pode ser depois de [max]","badDate":"[label] não é uma data válida","minCount":"Você deve especificar no mínimo [minCount] valores","maxCount":"Você não pode especificar mais do que [maxCount] valores","noDecimal":"[label] deve ser um número inteiro","notAllowed":"[value] não é um valor permitido","expectedString":"[label] deve ser uma string","expectedNumber":"[label] deve ser um número","expectedBoolean":"[label] deve ser um booleano","expectedArray":"[label] deve ser um array","expectedObject":"[label] deve ser um objeto","expectedConstructor":"[label] deve ser um(a) [type]","keyNotInSchema":"[key] não é permitido pelo esquema","regEx":{"0":{"msg":"[label] falhou no teste de expressão regular"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] deve ser um endereço de email válido"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] deve ser um endereço de email válido"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] deve ser um domínio válido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] deve ser um domínio válido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] deve ser um endereço IPv4 ou IPv6 válido"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] deve ser um endereço IPv4 válido"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] deve ser um endereço IPv6 válido"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] deve ser uma URL válida"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] deve ser um ID alfanumérico válido"}}}}});
TAPi18n._registerServerTranslator("pt", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/pt-BR //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {
  TAPi18n.translations["pt-BR"] = {};
}

if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {
  TAPi18n.translations["pt-BR"][namespace] = {};
}

_.extend(TAPi18n.translations["pt-BR"][namespace], {"simpleschema":{"messages":{"required":"[label] é obrigatório","minString":"[label] deve ter no mínimo [min] caracteres","maxString":"[label] não pode ter mais do que [max] caracteres","minNumber":"[label] deve ser ao menos [min]","maxNumber":"[label] não pode ser maior do que [max]","minNumberExclusive":"[label] deve ser maior que [min]","maxNumberExclusive":"[label] deve ser menor que [max]","minDate":"[label] deve ser igual a ou antes de [min]","maxDate":"[label] não pode ser depois de [max]","badDate":"[label] não é uma data válida","minCount":"Você deve especificar no mínimo [minCount] valores","maxCount":"Você não pode especificar mais do que [maxCount] valores","noDecimal":"[label] deve ser um número inteiro","notAllowed":"[value] não é um valor permitido","expectedString":"[label] deve ser uma string","expectedNumber":"[label] deve ser um número","expectedBoolean":"[label] deve ser um boolean","expectedArray":"[label] deve ser um array","expectedObject":"[label] deve ser um objeto","expectedConstructor":"[label] deve ser um(a) [type]","keyNotInSchema":"[key] não é permitido pelo esquema","regEx":{"0":{"msg":"[label] falhou no teste de expressão regular"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] deve ser um endereço de email válido"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] deve ser um endereço de email válido"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] deve ser um domínio válido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] deve ser um domínio válido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] deve ser um endereço IPv4 ou IPv6 válido"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] deve ser um endereço IPv4 válido"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] deve ser um endereço IPv6 válido"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] deve ser uma URL válida"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] deve ser um ID alfanumérico válido"}}}}});
TAPi18n._registerServerTranslator("pt-BR", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/pt-PT //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["pt-PT"])) {
  TAPi18n.translations["pt-PT"] = {};
}

if(_.isUndefined(TAPi18n.translations["pt-PT"][namespace])) {
  TAPi18n.translations["pt-PT"][namespace] = {};
}

_.extend(TAPi18n.translations["pt-PT"][namespace], {"simpleschema":{"messages":{"required":"[label] é obrigatório","minString":"[label] deve ter no mínimo [min] caracteres","maxString":"[label] não pode ter mais do que [max] caracteres","minNumber":"[label] deve ser pelo menos [min]","maxNumber":"[label] não pode ser maior do que [max]","minNumberExclusive":"[label] deve ser maior que [min]","maxNumberExclusive":"[label] deve ser menor que [max]","minDate":"[label] deve ser igual a ou antes de [min]","maxDate":"[label] não pode ser depois de [max]","badDate":"[label] não é uma Data válida","minCount":"Deve especificar no mínimo [minCount] valores","maxCount":"Não pode especificar mais do que [maxCount] valores","noDecimal":"[label] tem de ser um número inteiro","notAllowed":"[value] não é um valor permitido","expectedString":"[label] tem de ser um string","expectedNumber":"[label] tem de ser um número","expectedBoolean":"[label] tem de ser um boolean","expectedArray":"[label] tem de ser um array","expectedObject":"[label] tem de ser um objecto","expectedConstructor":"[label] tem de ser um(a) [type]","keyNotInSchema":"[key] não é permitido pelo esquema","regEx":{"0":{"msg":"[label] falhou no teste de expressão regular"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] tem de ser um endereço de email válido"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] tem de ser um endereço de email válido"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] tem de ser um domínio válido"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] tem de ser um domínio válido"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] tem de ser um endereço IPv4 ou IPv6 válido"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] tem de ser um endereço IPv4 válido"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] tem de ser um endereço IPv6 válido"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] tem de ser uma URL válida"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] tem de ser um ID alfanumérico válido"}}}}});
TAPi18n._registerServerTranslator("pt-PT", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/ru.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["ru"])) {
  TAPi18n.translations["ru"] = {};
}

if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {
  TAPi18n.translations["ru"][namespace] = {};
}

_.extend(TAPi18n.translations["ru"][namespace], {"simpleschema":{"messages":{"required":"[label] обязательно","minString":"[label] должно содержать минимум [min] букв","maxString":"[label] не может превышать [max] букв","minNumber":"[label] должно быть не меньше [min]","maxNumber":"[label] не может превышать [max]","minNumberExclusive":"[label] должно быть больше [min]","maxNumberExclusive":"[label] должно быть меньше [max]","minDate":"[label] должно быть не раньше чем [min]","maxDate":"[label] не может быть позже чем [max]","badDate":"[label] не является корректной датой","minCount":"Вы должны указать минимум [minCount] значений","maxCount":"Вы не можете указать больше чем [maxCount] значений","noDecimal":"[label] должно быть числом","notAllowed":"[value] является недопустимым значением","expectedString":"[label] должно быть строкой","expectedNumber":"[label] должно быть числом","expectedBoolean":"[label] должно быть булевым значением","expectedArray":"[label] должно быть массивом","expectedObject":"[label] должно быть объектом","expectedConstructor":"[label] должно быть типа [type]","keyNotInSchema":"[key] недопустимо схемой","regEx":{"0":{"msg":"[label] не прошло валидацию"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] должно быть корректным e-mail адресом"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] должно быть корректным e-mail адресом"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] должно быть корректным доменом"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] должно быть корректным доменом"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] должно быть коррктным IPv4 или IPv6 адресом"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] должно быть корректным IPv4 адресом"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] должно быть корректным IPv6 адресом"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] должно быть корректным URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] должно быть корректным ID"}}}}});
TAPi18n._registerServerTranslator("ru", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/sk.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["sk"])) {
  TAPi18n.translations["sk"] = {};
}

if(_.isUndefined(TAPi18n.translations["sk"][namespace])) {
  TAPi18n.translations["sk"][namespace] = {};
}

_.extend(TAPi18n.translations["sk"][namespace], {"simpleschema":{"messages":{"required":"Pole [label] je povinné","minString":"[label] musí mať aspoň [min] znakov","maxString":"[label] nesmie mať viac ako [max] znakov","minNumber":"[label] nesmie byť menšie ako [min]","maxNumber":"[label] musí byť väčšie ako [max]","minNumberExclusive":"[label] musí byť väčšie ako [min]","maxNumberExclusive":"[label] musí byť menšie ako [max]","minDate":"[label] nesmie byť pred [min]","maxDate":"[label] nesmie byť za [max]","badDate":"[label] nie je validný dátum","minCount":"Musíš definovať aspoň [minCount] hodnôt","maxCount":"Môžeš definovať maximálne [maxCount] hodnôt","noDecimal":"[label] musí byť celé číslo","notAllowed":"[value] nie je povolená hodnota","expectedString":"[label] musí byť slovo alebo veta","expectedNumber":"[label] musí byť číslo","expectedBoolean":"[label] musí byť boolean","expectedArray":"[label] musí byť pole","expectedObject":"[label] musí byť objekt","expectedConstructor":"[label] musí byť typu [type]","keyNotInSchema":"[key] nie je povolená v schéme","regEx":{"0":{"msg":"[label] nie je validný voči regulárnemu výrazu"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] musí byť validná e-mail adresa"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] musí byť validná e-mail adresa"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] musí byť validná doména"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] musí byť validná doména"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] musí byť validná IPv4 alebo IPv6 adresa"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] musí byť validná IPv4 adresa"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] musí byť validná IPv6 adresa"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] musí byť validná URL adresa"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] musí byť validné alfanumerické ID"}}}}});
TAPi18n._registerServerTranslator("sk", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/sv.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["sv"])) {
  TAPi18n.translations["sv"] = {};
}

if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {
  TAPi18n.translations["sv"][namespace] = {};
}

_.extend(TAPi18n.translations["sv"][namespace], {"simpleschema":{"messages":{"required":"[label] krävs","minString":"[label] måste vara minst [min] bokstäver","maxString":"[label] får inte överskrida [max] bokstäver","minNumber":"[label] måste vara minst [min]","maxNumber":"[label] får inte överskrida [max]","minNumberExclusive":"[label] måste vara större  än [min]","maxNumberExclusive":"[label] måste vara mindre än [max]","minDate":"[label] måste vara den [min] eller senare","maxDate":"[label] får inte vara senare än [max]","badDate":"[label] är inte ett godkänt datum","minCount":"Du måste åtminstone ange [minCount] värden","maxCount":"Du får inte ange fler än [maxCount] värden","noDecimal":"[label] måste vara ett nummer","notAllowed":"[value] är inte ett godkänt nummer","expectedString":"[label] måste vara en sträng","expectedNumber":"[label] måste vara ett nummer","expectedBoolean":"[label] måste vara en boolean","expectedArray":"[label] måste vara en lista","expectedObject":"[label] måste vara ett objekt","expectedConstructor":"[label] måste vara av typen [type]","keyNotInSchema":"[key] är inte godkänt av schemat","notUnique":"[label] måste vara unik","regEx":{"0":{"msg":"[label] misslyckades med det reguljära uttrycket vid validering"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] måste vara en godkänd e-postadress"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] måste vara en godkänd e-postadress"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] måste vara en godkänt domän"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] måste vara en godkänt domän"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] måste vara i ett godkänt IPv4 eller IPv6 format"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] måste vara i ett godkänt IPv4 format"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] måste vara i ett godkänt IPv6 format"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] måste vara en godkänd URL."},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] måste vara ett godkänt alfanumerisk ID"}}}}});
TAPi18n._registerServerTranslator("sv", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/tr.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["tr"])) {
  TAPi18n.translations["tr"] = {};
}

if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {
  TAPi18n.translations["tr"][namespace] = {};
}

_.extend(TAPi18n.translations["tr"][namespace], {"simpleschema":{"messages":{"required":"[label] girmek zorunludur","minString":"[label] en az [min] karakter olmalı","maxString":"[label] [max] karakteri geçemez","minNumber":"[label] en az [min] olabilir","maxNumber":"[label] en fazla [max] olabilir","minNumberExclusive":"[label] [min] üzeri olmalı","maxNumberExclusive":"[label] [max] altı olmalı","minDate":"[label] [min] veya daha ileri olmalı","maxDate":"[label] [max] tarihinden sonra olamaz","badDate":"[label] geçerli bir tarih değil","minCount":"En az [minCount] tane değer olmalı","maxCount":"[maxCount] üstü sayıda değer olamaz","noDecimal":"[label] bir tamsayı olmalı","notAllowed":"[value] izin verilen bir değer değil","expectedString":"[label] bir metin olmalı","expectedNumber":"[label] bir rakam olmalı","expectedBoolean":"[label] bir mantıksal değer olmalı","expectedArray":"[label] bir dizi olmalı","expectedObject":"[label] bir nesne olmalı","expectedConstructor":"[label] bir [type] olmalı","keyNotInSchema":"[key] şemada izin verilen bir anahtar değil","regEx":{"0":{"msg":"[label] kurallı ifade testini geçemedi"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] geçerli bir eposta adresi olmalı"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] geçerli bir eposta adresi olmalı"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] geçerli bir alan adı olmalı"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] geçerli bir alan adı olmalı"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] geçerli bir IPv4 veya IPv6 adresi olmalı"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] geçerli bir IPv4 adresi olmalı"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] geçerli bir IPv6 adresi olmalı"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] geçerli bir URL olmalı"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] geçerli bir alfasayısal ID olmalı"}}}}});
TAPi18n._registerServerTranslator("tr", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/uk.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["uk"])) {
  TAPi18n.translations["uk"] = {};
}

if(_.isUndefined(TAPi18n.translations["uk"][namespace])) {
  TAPi18n.translations["uk"][namespace] = {};
}

_.extend(TAPi18n.translations["uk"][namespace], {"simpleschema":{"messages":{"required":"[label] є обов'язковим","minString":"[label] має містити щонайменше [min] символів","maxString":"[label] не може перевищувати [max] символів","minNumber":"[label] має бути не меншим, ніж [min]","maxNumber":"[label] має бути не більшим, ніж [max]","minNumberExclusive":"[label] має бути більшим, ніж [min]","maxNumberExclusive":"[label] має бути меншим, ніж [max]","minDate":"[label] має бути не раніше, ніж [min]","maxDate":"[label] не може бути пізніше, ніж [max]","badDate":"[label] не є коректною датою","minCount":"Ви повинні задати хоча б [minCount] значень","maxCount":"Ви не можете задати більше, ніж [maxCount] значень","noDecimal":"[label] має бути цілим числом","notAllowed":"[value] не є допустимим значенням","expectedString":"[label] має бути стрічкою","expectedNumber":"[label] має бути числом","expectedBoolean":"[label] має бути булевим значенням","expectedArray":"[label] має бути масивом","expectedObject":"[label] має бути об'єктом","expectedConstructor":"[label] має відповідати типу [type]","keyNotInSchema":"[key] не дозволено схемою","regEx":{"0":{"msg":"[label] не відповідає заданим критеріям"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] має бути коректною e-mail адресою"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] має бути коректною e-mail адресою"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] має бути коректним доменом"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] має бути коректним доменом"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] має бути коректною IPv4 або IPv6 адресою"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] має бути коректною IPv4 адресою"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] має бути коректною IPv6 адресою"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] має бути коректним URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] має бути коректним ідентифікатором"}}}}});
TAPi18n._registerServerTranslator("uk", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/zh-CN //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {
  TAPi18n.translations["zh-CN"] = {};
}

if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {
  TAPi18n.translations["zh-CN"][namespace] = {};
}

_.extend(TAPi18n.translations["zh-CN"][namespace], {"simpleschema":{"messages":{"required":"必须填写[label]","minString":"[label]最短[min]字符长","maxString":"[label]不能超过[max]字符","minNumber":"[label]至少是[min]","maxNumber":"[label]不能超过[max]","minNumberExclusive":"[label]必须大于[min]","maxNumberExclusive":"[label]必须小于[max]","minDate":"[label]必须在[min]时或之后","maxDate":"[label]不能在[max]之后","badDate":"[label]不是一个正确的日期","minCount":"至少包含[minCount]项","maxCount":"不能超过[maxCount]项","noDecimal":"[label]必须是整数","notAllowed":"[value]填写不正确","expectedString":"[label]必须是字符串","expectedNumber":"[label]必须是数字","expectedBoolean":"[label]必须是是/否类型","expectedArray":"[label]必须是一组值","expectedObject":"[label]必须是一个对象","expectedConstructor":"[label]必须是[type]","keyNotInSchema":"[key]不符合结构规则","notUnique":"[label]必须是唯一的","regEx":{"0":{"msg":"[label]正则校验失败"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label]必须是合法的电邮地址"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label]必须是合法的电邮地址"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label]必须是合法的域名"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label]必须是合法的域名"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label]必须是一个合法的 IPv4 或 IPv6 地址"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label]必须是一个合法的 IPv4地址"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label]必须是一个合法的 IPv6 地址"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label]必须是一个合法的 URL"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label]必须是一个数字序号"}}}}});
TAPi18n._registerServerTranslator("zh-CN", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/zh-HK //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["zh-HK"])) {
  TAPi18n.translations["zh-HK"] = {};
}

if(_.isUndefined(TAPi18n.translations["zh-HK"][namespace])) {
  TAPi18n.translations["zh-HK"][namespace] = {};
}

_.extend(TAPi18n.translations["zh-HK"][namespace], {"simpleschema":{"messages":{"required":"必須填寫[label]","minString":"[label]最短為[min]個字符","maxString":"[label]不能超過[max]個字符","minNumber":"[label]至少是[min]","maxNumber":"[label]不能超過[max]","minNumberExclusive":"[label]必須大於[min]","maxNumberExclusive":"[label]必須小於[max]","minDate":"[label]必須在[min]時或之後","maxDate":"[label]不能在[max]之後","badDate":"[label]是無效日期","minCount":"至少包含[minCount]項","maxCount":"不能超過[maxCount]項","noDecimal":"[label]必須是整數","notAllowed":"[value]填寫不正確","expectedString":"[label]必須是字符串","expectedNumber":"[label]必須是數字","expectedBoolean":"[label]必須為（是/否）類型","expectedArray":"[label]必須是一組值","expectedObject":"[label]必須是一個物件 (Object)","expectedConstructor":"[label]必須是[type]","keyNotInSchema":"[key]不符合結構規則","regEx":{"0":{"msg":"[label] 正則校驗失敗"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] 電郵地址格式錯誤"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] 電郵地址格式錯誤"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] 域名格式錯誤"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] 域名格式錯誤"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] IPv4 或 IPv6 地址格式錯誤"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] IPv4 地址格式錯誤"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] IPv6 地址格式錯誤"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] URL 格式錯誤"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] 必須是一個數字序號"}}}}});
TAPi18n._registerServerTranslator("zh-HK", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/zh-TW //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["zh-TW"])) {
  TAPi18n.translations["zh-TW"] = {};
}

if(_.isUndefined(TAPi18n.translations["zh-TW"][namespace])) {
  TAPi18n.translations["zh-TW"][namespace] = {};
}

_.extend(TAPi18n.translations["zh-TW"][namespace], {"simpleschema":{"messages":{"required":"必須填寫[label]","minString":"[label]最短為[min]個字符","maxString":"[label]不能超過[max]個字符","minNumber":"[label]至少是[min]","maxNumber":"[label]不能超過[max]","minNumberExclusive":"[label]必須大於[min]","maxNumberExclusive":"[label]必須小於[max]","minDate":"[label]必須在[min]時或之後","maxDate":"[label]不能在[max]之後","badDate":"[label]是無效日期","minCount":"至少包含[minCount]項","maxCount":"不能超過[maxCount]項","noDecimal":"[label]必須是整數","notAllowed":"[value]填寫不正確","expectedString":"[label]必須是字符串","expectedNumber":"[label]必須是數字","expectedBoolean":"[label]必須為（是/否）類型","expectedArray":"[label]必須是一組值","expectedObject":"[label]必須是一個物件 (Object)","expectedConstructor":"[label]必須是[type]","keyNotInSchema":"[key]不符合結構規則","regEx":{"0":{"msg":"[label] 正則校驗失敗"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] 電郵地址格式錯誤"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] 電郵地址格式錯誤"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] 域名格式錯誤"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] 域名格式錯誤"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] IPv4 或 IPv6 地址格式錯誤"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] IPv4 地址格式錯誤"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] IPv6 地址格式錯誤"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] URL 格式錯誤"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] 必須是一個數字序號"}}}}});
TAPi18n._registerServerTranslator("zh-TW", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/shared/lib.js                                  //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
if (Meteor.isClient) {
	Meteor.startup(function () {
		Meteor.autorun(function () {
			var lang = TAPi18n.getLanguage();
			var localMessages = TAPi18n.__("simpleschema.messages", {returnObjectTrees: true});
			localMessages.regEx = _.map(localMessages.regEx, function (item) {
				if (item.exp) {
					var obj = window;
					var path = item.exp.split('.');
					for (var i = 0; i < path.length; i++) {
						obj = obj[path[i]];
					}
					item.exp = obj;
				}
				return item;
			});

			_regEx = [];

			SimpleSchema._globalMessages.regEx.forEach(function(item){
				local_reg = _.find(localMessages.regEx, function(doc){
					if(_.has(doc,"exp") && _.has(item,"exp")){
						if (doc.exp === item.exp) {
							return true
						}else if(!doc.exp || !item.exp){
							return false
						}else{
							return doc.exp.toString() == item.exp.toString()
						}
					}else if(_.has(doc,"exp") || _.has(item,"exp")){
						return false
					}else{
						return doc.exp === item.exp
					}
				});
				_regEx.push(local_reg || item)
			})

			SimpleSchema._globalMessages.regEx.concat(localMessages.regEx)

			localMessages.regEx = _regEx;

			var messages = _.extend(_.clone(SimpleSchema._globalMessages), localMessages);
			SimpleSchema.messages(messages);
		});
	});
}

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/gwendall_simple-schema-i18n/packages/gwendall_simple-schema-i18ni18n/ca.i1 //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var _ = Package.underscore._,
    package_name = "gwendall:simple-schema-i18n",
    namespace = "gwendall:simple-schema-i18n";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
if(_.isUndefined(TAPi18n.translations["ca"])) {
  TAPi18n.translations["ca"] = {};
}

if(_.isUndefined(TAPi18n.translations["ca"][namespace])) {
  TAPi18n.translations["ca"][namespace] = {};
}

_.extend(TAPi18n.translations["ca"][namespace], {"simpleschema":{"messages":{"required":"[label] és obligatori","minString":"[label] ha de tenir almenys [min] caràcters","maxString":"[label] no pot tenir més de [max] caràcters","minNumber":"[label] ha de ser almenys [min]","maxNumber":"[label] no pot excedir [max]","minNumberExclusive":"[label] ha de ser més gran que [min]","maxNumberExclusive":"[label] ha de ser més petit que [max]","minDate":"[label] ha de ser anterior a [min]","maxDate":"[label] no pot ser posterior a [max]","badDate":"[label] no és una data vàlida","minCount":"Ha d'especificar almenys [minCount] valors","maxCount":"No pot especificar més de [maxCount] valors","noDecimal":"[label] ha de ser un nombre sencer","notAllowed":"[value] no és un valor permès","expectedString":"[label] ha de ser una cadena de caràcters","expectedNumber":"[label] ha de ser un número","expectedBoolean":"[label] ha de ser de tipus 'si/no'","expectedArray":"[label] ha de ser una llista","expectedObject":"[label] ha de ser un objecte","expectedConstructor":"[label] ha de ser de tipus [type]","keyNotInSchema":"[key] no està permès per l'esquema","regEx":{"0":{"msg":"[label] va fallar la validació per Expressió Regular (Regex)"},"1":{"exp":"SimpleSchema.RegEx.Email","msg":"[label] ha de ser una adreça de correu electrònic vàlida"},"2":{"exp":"SimpleSchema.RegEx.WeakEmail","msg":"[label] ha de ser una adreça de correu electrònic vàlida"},"3":{"exp":"SimpleSchema.RegEx.Domain","msg":"[label] ha de ser un nom de domini vàlid"},"4":{"exp":"SimpleSchema.RegEx.WeakDomain","msg":"[label] ha de ser un nom de domini vàlid"},"5":{"exp":"SimpleSchema.RegEx.IP","msg":"[label] ha de ser una adreça de IPv4 o IPv6 vàlida"},"6":{"exp":"SimpleSchema.RegEx.IPv4","msg":"[label] ha de ser una adreça de IPv4 vàlida"},"7":{"exp":"SimpleSchema.RegEx.IPv6","msg":"[label] ha de ser una adreça de IPv6 vàlida"},"8":{"exp":"SimpleSchema.RegEx.Url","msg":"[label] ha de ser un URL vàlid"},"9":{"exp":"SimpleSchema.RegEx.Id","msg":"[label] ha de ser un ID alfanumèric"}}}}});
TAPi18n._registerServerTranslator("ca", namespace);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("gwendall:simple-schema-i18n");

})();
