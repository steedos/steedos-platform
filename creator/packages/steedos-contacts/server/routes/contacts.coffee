vCard = require('vcf')

Cookies = require("cookies")

Meteor.startup ->
	WebApp.connectHandlers.use "/contacts/books/export/cvf", (req, res, next)->
		cookies = new Cookies( req, res );

		# first check request body
		if req.body
			userId = req.body["X-User-Id"]
			authToken = req.body["X-Auth-Token"]

		# then check cookie
		if !userId or !authToken
			userId = cookies.get("X-User-Id")
			authToken = cookies.get("X-Auth-Token")

		if !(userId and authToken)
				res.writeHead(401);
				res.end JSON.stringify({
					"error": "Validate Request -- Missing X-Auth-Token",
					"instance": "1329598861",
					"success": false
				})
				return ;

		data = "";

		ids = req.query?.ids.split(",")

		books = db.address_books.find({_id: {$in: ids}, owner: userId}).fetch()

		fileName = ""

		books.forEach (book) ->
			vcard = new vCard()
			vcard.set("n", book.name)
			vcard.set("fn", book.name)
			vcard.set("email", book.email)
			
			if book.mobile
				vcard.set("tel", book.mobile)

			if book.company
				vcard.set("org", book.company)

			data = data + vcard.toString("3.0", 'utf-8') + "\n"

		if books.length == 1
			fileName = books[0].name
		else
			fileName = "个人联系人"

		res.setHeader('Content-type', 'application/x-msdownload');
		res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(fileName)+'.vcf');
		res.end(data)