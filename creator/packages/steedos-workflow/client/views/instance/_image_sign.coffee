ImageSign.helpers =
	spaceUserSign: (userId)->
		space = ""

		if Meteor.isServer
			space = Template.instance().view.template.steedosData.space
		else
			space = Session.get("spaceId")

		spaceUserSign = db.space_user_signs.findOne({space: space, user: userId});
		return spaceUserSign

	imageURL: (userId)->

		spaceUserSign = ImageSign.helpers.spaceUserSign(userId);

		absolute = false

		if Meteor.isServer
			absolute = Template.instance().view.template.steedosData.absolute

		if spaceUserSign?.sign
			if absolute
				return Meteor.absoluteUrl("api/files/avatars/" + spaceUserSign.sign);
			else
				return Steedos.absoluteUrl("api/files/avatars/" + spaceUserSign.sign);
