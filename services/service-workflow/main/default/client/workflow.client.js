/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 11:10:59
 * @Description: 
 */

; (function () {
        
    try {
        let workflowStyle = document.createElement("link");
        workflowStyle.setAttribute("rel", "stylesheet");
        workflowStyle.setAttribute("type", "text/css");
        workflowStyle.setAttribute("href", Steedos.absoluteUrl("/workflow/index.css?t="+new Date().getTime()));
        document.getElementsByTagName("head")[0].appendChild(workflowStyle);
    } catch (error) {
        console.error(error)
    };
})();