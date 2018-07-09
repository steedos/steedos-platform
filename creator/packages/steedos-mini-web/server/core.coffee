
fs = Npm.require('fs')
path = Npm.require('path')

compileTemplate = (path, templateName)->
	templateStr = Assets.getText(path)
	SSR.compileTemplate(templateName, templateStr);

#compileTemplateIcoms = ()->
#	pathDir = 'D://icons'
#	files = fs.readdirSync(pathDir)
#	files.forEach (name, index)->
#		iconStr = fs.readFileSync(path.join(pathDir, name), 'utf8')
#		console.log('icons', 'icons_' + name.split('.')[0])
#		SSR.compileTemplate('icons_' + name.split('.')[0], iconStr);

# 注册模板
Meteor.startup ()->
#	compileTemplateIcoms()

	compileTemplate('themes/casper/partials/icons/point.hbs', 'icons_point')
	compileTemplate('themes/casper/partials/icons/weichat.hbs', 'icons_weichat')
	compileTemplate('themes/casper/partials/icons/avatar.hbs', 'icons_avatar')

	compileTemplate('themes/casper/partials/floating-header.hbs', 'floating_header')
	compileTemplate('themes/casper/partials/navigation.hbs', 'navigation')
	compileTemplate('themes/casper/partials/primary_tag.hbs', 'primary_tag')
	compileTemplate('themes/casper/partials/byline-multiple.hbs', 'byline_multiple')
	compileTemplate('themes/casper/partials/byline-single.hbs', 'byline_single')

	compileTemplate('themes/casper/partials/post-card.hbs', 'post_card')
	compileTemplate('themes/casper/partials/site-nav.hbs', 'site_nav')
	compileTemplate('themes/casper/index.hbs', 'casper_index')
	compileTemplate('themes/casper/post.hbs', 'post')
	compileTemplate('themes/casper/tag.hbs', 'tag')