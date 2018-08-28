getAstro = (month,day)->    
	s="魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
	arr=[20,19,21,21,21,22,23,23,23,23,22,22];
	if day<arr[month-1]
		return s.substr(month*2-2,2);
	else
		return s.substr(month*2,2);

getzodiac = (year)->
	arr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
	return arr[year % 12]
		
Creator.Objects.love_about_me =
	name: "love_about_me"
	label: "关于我"
	icon: "client"
	enable_search: true
	fields:
		sex:
			type:'select'
			label:"你的性别？"
			options:[{label:'男生',value:'男'},{label:'女生',value:'女'}]
		
		height:
			type:'select'
			label:"你的身高？"
			options:"140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200"
		
		birthday:
			type:'date'
			label:"你的生日？"
		
		live:
			type:'selectCity'
			label:"你的现居地？"
		
		hometown:
			type:'selectCity'
			label:"你的家乡？"
		
		# photos:
		# 	label:'照片'
		# 	type:'image'
		# 	multiple:true
		# 	max: 9
		# 	group:'-'
		
		self_introduction:
			type:'textarea'
			is_wide:true
			label:"自我介绍:"
		
		age:
			type:'number'
			label:"年龄"
			hidden:true
		
		zodiac:
			type:'text'
			label:"生肖"
			hidden:true

		constellation:
			type:'text'
			label:"星座"
			hidden:true
	
	list_views:
		all:
			label: "所有"
			columns: ["age", "sex", "birthday","live", "height", "hometown", "constellation", "zodiac" ]
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
	
	triggers:
		"before.update.server.love_about_me":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.birthday
					date = new Date()
					birthday = new Date(modifier?.$set?.birthday)
					age = date.getFullYear() - birthday.getFullYear()
					birthday_year = birthday.getFullYear()
					birthday_month = birthday.getMonth()
					birthday_day = birthday.getDate()
					if !(age> 18 or (age==18 and birthday_month-date.getMonth()<=0 and birthday_day-date.getDate()<=0))
						Creator.Collections['vip_customers'].direct.update({owner: doc.owner}, {$set: {disable: "未满18周岁，不予匹配"}}, {multi: true})
					else
						Creator.Collections['vip_customers'].direct.update({owner: doc.owner}, {$unset: {disable: ""}}, {multi: true})
					constellation = getAstro(birthday_month+1,birthday_day)
					zodiac = getzodiac(birthday_year)
					Creator.Collections['love_about_me'].direct.update({_id:doc._id},{$set:{age:age,zodiac:zodiac,constellation:constellation}})
				if modifier?.$set?.name
					Creator.getCollection("users").direct.update(doc.owner,{$set:{name:modifier.$set.name}})
					Creator.Collections['vip_customers'].direct.update({owner: doc.owner}, {$set: {name: modifier.$set.name}}, {multi: true})