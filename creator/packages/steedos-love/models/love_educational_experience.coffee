Creator.Objects.love_educational_experience =
	name: "love_educational_experience"
	label: "教育经历"
	icon: "event"
	enable_search: true
	fields:
		name:
			type:'text'
			label:"学校名称"
			inlineHelpText:'例如:北京航空航天大学'
			required:true
			group:'-'
		
		educational_background:
			type:'select'
			label:"学历"	
			options: "高中:高中,大专:大专,本科:本科,硕士:硕士,博士及博士以上:博士及博士以上"
			group:'-'
		
		profession:
			type:'text'
			label:"院系"
			inlineHelpText:'例如:计算机系'
			group:'-'
		
		entry_year:
			type:'select'
			label:"入学年份"
			options:"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018"
			group:'-'
		
		end_year:
			type:'select'
			label:"毕业年份"
			options:"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022"
	list_views:
		all:
			label: "所有"
			columns: ["school", "educational_background", "profession", "entry_time","separation_time"]
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
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
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
