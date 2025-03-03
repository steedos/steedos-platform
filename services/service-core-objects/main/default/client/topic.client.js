var today = new Date();
var v = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0');

loadCss(Steedos.absoluteUrl('/topic.css?v='+v));