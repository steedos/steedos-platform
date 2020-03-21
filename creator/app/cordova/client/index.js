Meteor.startup(function () {
	if (Steedos.isCordova && Steedos.isCordova()) {
		window.fileOpen = function (url) {
			var fileUrl;
			fileUrl = decodeURI(url);
			window.resolveLocalFileSystemURL(fileUrl, (function (fileEntry) {
				return fileEntry.file((function (f) {
					cordova.plugins.fileOpener2.open(fileUrl, f.type, {
						error: function (e) {
							console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
						},
						success: function () {
							console.log('file opened successfully');
						}
					});
				}));
			}));
		};

		window.BrowserOpen = function (url, target, options, callbacks) {
			var popup;
			if (!options) {
				if(Steedos.isAndroidApp()){
					options = 'location=yes,hideurlbar=yes,zoom=yes';
				}else{
					options = 'location=no,enableViewportScale=yes';
				}

			}
			popup = cordova.InAppBrowser.open(url, target, options);
			callbacks = callbacks || {};
			for (var callbackName in callbacks) {
				popup.addEventListener(callbackName, callbacks[callbackName]);
			}
			popup.show = function () {
			};
			return popup;
		};

		window.AppBrowserOpen = function (strUrl, strWindowName, strWindowFeatures, callbacks) {
			return window.BrowserOpen(strUrl, strWindowName, null, {
				loaderror: function (e) {
					console.error(e.message);
				},
				message: function (e) {
					console.log(e.message);
				}
			});
		};
	}
});


