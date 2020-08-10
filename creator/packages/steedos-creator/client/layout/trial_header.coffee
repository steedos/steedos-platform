Template.trialHearder.helpers
	t: (k)->
		return TAPi18n.__(k);
	hasLicense: ()->
		return Creator.__l?.get()?.days_left
	showTrialHearder: ()->
		return false
		__l = Creator.__l.get()
		if !__l
			return true
		if __l.is_trial || __l.is_develop
			return true
		if __l.verify_status != 'SUCCESS'
			return true
#		if Creator.__l.is_develop
#			if  Creator.__l.days_left <= 7
#				return true
	days_left: ()->
		return Creator.__l?.get()?.days_left || 1
Template.trialHearder.events
	"click .trial-guide": (e, t)->
		window.open("https://www.steedos.com/developer");
	"click .trial-feedback": (e, t)->
		window.open("https://www.steedos.com/company/contact-us");
	"click #subscribeNow": (e, t)->
		if !Creator.isSpaceAdmin()
			return toastr.info("请联系管理员")
		window.open(Steedos.absoluteUrl("/app/-/license/grid/all"))
#		spaceId = Session.get("spaceId");
#		spaceName = Creator.getCollection("spaces").findOne(spaceId).name;
#		licenseServer = 'https://community.trial.steedos.com:8443'; #TODO
#		licenseSpaceId = 'LHXoSJWEtDKuHFyge'; #TODO
#		window.open(licenseServer + "/accounts/a/#/signup?X-Space-Id="+licenseSpaceId+"&redirect_uri=" + encodeURIComponent(licenseServer + "/api/v4/product_license/apply/new?q=" + spaceId + "&n=" + spaceName));
#		swal({
#			title: TAPi18n.__('license_trial_header_swal_title'),
#			type: "warning",
#			showCancelButton: true,
#			cancelButtonText: TAPi18n.__('license_trial_header_swal_cancelButtonText'),
#			confirmButtonColor: "#DD6B55",
#			confirmButtonText: TAPi18n.__('license_trial_header_swal_confirmButtonText'),
#			closeOnConfirm: true
#		}, (isConfirm)->
#			if isConfirm
#				$("body").addClass("loading");
#				userSession = Creator.USER_CONTEXT;
#				spaceId = userSession.spaceId;
#				if userSession.authToken
#					authToken = userSession.authToken
#				else
#					authToken = userSession.user.authToken;
#				url = "/api/v4/spaces/" + spaceId + "/clean_license";
#				url = Steedos.absoluteUrl(url);
#				authorization = "Bearer " + spaceId + "," + authToken;
#				headers = [{
#					name: 'Content-Type',
#					value: 'application/json'
#				}, {
#					name: 'Authorization',
#					value: authorization
#				}];
#				$.ajax({
#					type: "get",
#					url: url,
#					dataType: "json",
#					contentType: 'application/json',
#					beforeSend:  (XHR) ->
#						if (headers && headers.length)
#							headers.forEach( (header)->
#								XHR.setRequestHeader(header.name, header.value);
#							);
#					success:  (data)->
#						$("body").removeClass("loading");
#						window.location.reload()
#					error:  (XMLHttpRequest, textStatus, errorThrown) ->
#						$("body").removeClass("loading");
#						if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error)
#							toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')))
#						else
#							toastr.error(XMLHttpRequest.responseJSON)
#				});
#		);