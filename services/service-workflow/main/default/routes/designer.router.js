/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 15:07:11
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-18 17:37:37
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const { getObject } = require('@steedos/objectql')
const he = require('he');

var DesignerAPI = {
    getAbsoluteUrl: function (url) {
        var rootUrl;
        rootUrl = __meteor_runtime_config__ ? __meteor_runtime_config__.ROOT_URL_PATH_PREFIX : "";
        if (rootUrl) {
            url = rootUrl + url;
        }
        return url;
    },
    writeResponse: function (res, httpCode, body) {
        res.statusCode = httpCode;
        return res.end(body);
    },
    sendInvalidURLResponse: function (res) {
        return this.writeResponse(res, 404, "the param 'url' is required as querys.");
    },
    sendAuthTokenExpiredResponse: function (res) {
        return this.writeResponse(res, 401, "the auth_token has expired.");
    },
    sendHtmlResponse: async function (req, res, type) {
        var error_msg, query, title, url;
        query = req.query;
        url = query.url;
        if (url) {
            url = he.encode(decodeURIComponent(url));
        } else {
            DesignerAPI.sendInvalidURLResponse(res);
        }
        title = query.title;
        if (title) {
            title = he.encode(decodeURIComponent(title));
        } else {
            title = "Steedos Designer";
        }
        error_msg = "";

		const space = await getObject("spaces").findOne(req.user.spaceId);

		let faviconLinkHref = this.getAbsoluteUrl("/favicons/favicon.ico");

        if(space && space.favicon){
            faviconLinkHref = this.getAbsoluteUrl("/api/files/avatars/"+space.favicon);
        }
        return this.writeResponse(res, 200, `<html>
        	<head>
        		<style>
        			html,body{
            				margin: 0;
            				padding: 0;
            				height: 100%;
        			}
        			body { 
            				font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        				text-align: center;
        				background-color: #fff;
    			}
        			.loading{
            				position: absolute;
            				left: 0px;
            				right: 0px;
            				top: 50%;
            				z-index: -1;/*设置为-1，可以在iframe加载出来后自动消失*/
        				text-align: center;
        				margin-top: -30px;
        				font-size: 36px;
        				color: #dfdfdf;
    			}
        			.error-msg{
            				position: absolute;
            				left: 0px;
            				right: 0px;
            				bottom: 20px;
            				z-index: 1100;
            				text-align: center;
            				font-size: 20px;
            				color: #a94442;
        			}
        		</style>
        		<meta charset="utf-8">
        		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        		<title>${title}</title>
        		<link rel="manifest" href="${this.getAbsoluteUrl("/favicons/manifest.json")}">
        		<meta name="mobile-web-app-capable" content="yes">
        		<meta name="theme-color" content="#000">
        		<meta name="application-name">
        		<link rel="apple-touch-icon" sizes="57x57" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-57x57.png")}">
        		<link rel="apple-touch-icon" sizes="60x60" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-60x60.png")}">
        		<link rel="apple-touch-icon" sizes="72x72" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-72x72.png")}">
        		<link rel="apple-touch-icon" sizes="76x76" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-76x76.png")}">
        		<link rel="apple-touch-icon" sizes="114x114" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-114x114.png")}">
        		<link rel="apple-touch-icon" sizes="120x120" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-120x120.png")}">
        		<link rel="apple-touch-icon" sizes="144x144" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-144x144.png")}">
        		<link rel="apple-touch-icon" sizes="152x152" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-152x152.png")}">
        		<link rel="apple-touch-icon" sizes="180x180" href="${this.getAbsoluteUrl("/favicons/apple-touch-icon-180x180.png")}">
        		<meta name="apple-mobile-web-app-capable" content="yes">
        		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        		<meta name="apple-mobile-web-app-title">
        		<link rel="shortcut icon" href="${faviconLinkHref}">
        		<link rel="yandex-tableau-widget" href="${this.getAbsoluteUrl("/favicons/yandex-browser-manifest.json")}">
        		<meta name="msapplication-TileColor" content="#fff">
        		<meta name="msapplication-TileImage" content="${this.getAbsoluteUrl("/favicons/mstile-144x144.png")}">
        		<meta name="msapplication-config" content="${this.getAbsoluteUrl("/favicons/browserconfig.xml")}">
        		<meta property="twitter:image" content="${this.getAbsoluteUrl("/favicons/twitter.png")}">
        		<meta property="og:image" content="${this.getAbsoluteUrl("/favicons/open-graph.png")}">
        	</head>
        	<body>
        		<div class = "loading">Loading...</div>
        		<div class = "error-msg">${error_msg}</div>
        		<iframe id="ifrDesigner" src="" width="100%" height="100%" nwdisable="true" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
        		<script type="text/javascript" src="${this.getAbsoluteUrl("/lib/jquery/jquery-1.11.2.min.js")}"></script>
        		<script type="text/javascript">
					$("#ifrDesigner").on("load", function(){
						var self = this;
						var sId = setInterval(function(){
							let bar = $($(self)[0].contentWindow.document).find(".navigation-bar");
							var scope = $($(bar[1]).next()[0]).children(":first");
							let leftBtn = $(".htv3.designer.square.sc-view.sc-segment-view.sc-static-layout.segment.sc-first-segment.sc-segment-0.sc-large-size", scope)
							if(leftBtn.length > 0){
								clearInterval(sId);
								leftBtn.css("display","none");
								let reftBtn = $(".htv3.designer.square.sc-view.sc-segment-view.sc-static-layout.segment.sc-last-segment.sc-segment-1.sc-large-size.sel", scope);
								if(window.devicePixelRatio == 2){
									$('.left',reftBtn).css("background-position", "0px -3536px")
								}else{
									$('.left',reftBtn).css("background-position", "0px -3034px")
								}
							}
						}, 100);
						
					});
        			var designer = {
            				urlQuery:function(name){
            					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        					var r = window.location.search.substr(1).match(reg);
        					if (r != null) return unescape(r[2]);
        					return null;
    				},
        				run:function(){
            					var url = this.urlQuery("url");
        					url = decodeURIComponent(url);
        					
        					if(url){
            						$("#ifrDesigner").attr("src",url);
    					}
        					var Steedos = window.opener.Steedos || null;
        					if (Steedos) {
            						Steedos.forbidNodeContextmenu(window);
        					}
    				}
    			};
        			$(function(){
            				designer.run();
        			});
        		</script>
        	<body>
        </html>`);
    }
};

/**
@api {get} /api/workflow/designer 接口说明
@apiVersion 0.0.0
@apiName /api/workflow/designer
@apiGroup service-workflow
@apiBody {String} companyId 组织ID
@apiParam {String} companyId 组织ID
@apiQuery {String} companyId 组织ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'Spaces': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/designer', core.requireAuthentication, async function (req, res) {
    try {
		res.writeHead(200, {
			"Content-Type": "text/html;charset=utf-8"
		});
        return await DesignerAPI.sendHtmlResponse(req, res)
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
