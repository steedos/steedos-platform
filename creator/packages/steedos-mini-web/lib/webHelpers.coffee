Template.registerHelper 'subscribe_form', ->
	console.log('subscribe_form...')

Template.registerHelper 'input_email', ->
	console.log('input_email...')

Template.registerHelper 'body_class', ->
	if this.template_type == 'home'
		return 'home-template'
	else if this.template_type == 'post'
		return 'post-template'

Template.registerHelper 'url', (context, options)->
	url = this.url
	if url && url.indexOf('/') == 0
		url = url.substr(1)
	outputUrl = Meteor.absoluteUrl(url)
	outputUrl = encodeURI(decodeURI(outputUrl))
	return new Handlebars.SafeString(outputUrl);


Template.registerHelper 'is', (context, options)->
	if this.template_type == 'home'
		return true
	return false

Template.registerHelper 'encode', (context, options)->
	uri = context || '';
	return new Handlebars.SafeString(encodeURIComponent(uri));

Template.registerHelper 'authorMultiple', (context, options)->
	#count > 1
	return false;


Template.registerHelper 'plural', (number, options)->
	if !number || number == 0
		console.log('if --->', new Handlebars.SafeString(options.hash.empty.replace('%', number)))
		return new Handlebars.SafeString(options.hash.empty.replace('%', number));
	else if number == 1
		return new Handlebars.SafeString(options.hash.singular.replace('%', number));
	else if number >= 2
		return new Handlebars.SafeString(options.hash.plural.replace('%', number));


Template.registerHelper 'excerpt', (context, options)->
	console.log('excerpt...', context, options)

Template.registerHelper 'img_url', (context, options)->
	if (new RegExp(":\/\/")).test(context)
		return context;
	return Meteor.absoluteUrl('api/files/images/' + context)

Template.registerHelper 'date', (date, options)->
	if !options && date.hasOwnProperty('hash')
		options = date;
		date = undefined;
		timezone = options?.data?.blog.timezone;

		if this.published_at
			date = moment(this.published_at).tz(timezone).format();

	date = if date == null then undefined else date;

	format = options.hash.format || 'MMM DD, YYYY';
	timeago = options.hash.timeago;
	timezone = options?.data?.blog.timezone;
	timeNow = moment().tz(timezone);

	dateMoment = moment(date);
	dateMoment.locale('zh-CN'); #TODO

	if timeago
		date = if timezone then dateMoment.tz(timezone).from(timeNow) else dateMoment.fromNow();
	else
		date = if timezone then dateMoment.tz(timezone).format(format) else dateMoment.format(format);

	return new Handlebars.SafeString(date);

@WebHelpers =
	asset: (path, options)->
		return Meteor.absoluteUrl(path)

	block: (state)->
		console.log('block', state)


#	@blog: ()->
#		return {}

