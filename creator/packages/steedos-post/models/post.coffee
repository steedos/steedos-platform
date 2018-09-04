Creator.Objects.post =
	name: "post"
	label: "动态"
	icon: "contract"
	enable_files:true
	fields:
		name:
			label:'标题'
			type:'text'
			required:true
			is_wide:true
		summary:
			label:'简介'
			type:'textarea'
			omit:true
		description:
			label:'正文'
			is_wide:true
			type:'markdown'
			rows: 8
		comment_count:
			label:'评论数'
			type:'number'
			omit:true
		star_count:
			label:'点赞数'
			type:'number'
			omit:true
		read_count:
			label:'阅读数'
			type:'number'
			omit:true
		forward_count:
			label:'转发数'
			type:'number'
			omit:true
		enable_comment:
			label:'是否允许评论'
			type:'boolean'
			defaultValue:true
			omit:true
		start_time:
			label:'开始时间'
			type:'datetime'
			omit:true
		end_time:
			label:'结束时间'
			type:'datetime'
			omit:true
		# store:
		# 	label:'门店'
		# 	type:'master_detail'
		# 	reference_to:'vip_store'
		cover:
			label: '封面'
			type: 'image'
			group:"-"
		images:
			label: '图片'
			type: 'image'
			multiple : true			
		video:
			label: '视频'
			type: 'video'
			# omit:true
		video_url:
			label: '视频地址'
			type: 'text'
			omit:true
		# audio:
		# 	label: '音频'
		# 	type: 'audio'
		# 	omit:true
		categories:
			label:'栏目'
			type:'lookup'
			reference_to:'post_category'
			multiple:true
			index:true
		type:
			label:'信息分类'
			type:'select'
			options:[
				{label:'公告通知',value:'announcements'},
				{label:'关于我们',value:'about'},
				{label:'新闻动态',value:'news'},
				{label:'会员指南',value:'help'},
				{label:'招兵买马',value:'jobs'},
				{label:'线上课程',value:'course'},
				# {label:'优惠券',value:'coupon'},
				# {label:'社区',value:'community'},
				# {label:'红包',value:'red_packet'}
			]
			omit:true
		mini_type:
			label:'内容样式'
			type:'select'
			options:[
				{label:'文章',value:'article'},
				{label:'照片',value:'photo'},
				{label:'视频',value:'video'},
				{label:'音乐',value:'music'}
			]
			omit:true
		visible_type:
			label:'可见范围'
			type:'select'
			omit:true
			options:[
				{label:'公开',value:'public'},
				{label:'秘密',value:'private'},
				{label:'会员可见',value:'member'},
				{label:'员工可见',value:'user'}
			]
			omit:true
		featured:
			label:'推荐'
			type:'boolean'
			index:true
			group:'-'
	list_views:
		all:
			label: "所有"
			columns: ["name", "comment_count", "star_count","forward_count"]
			filter_scope: "space"

	triggers:
		"before.insert.server.post":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				# if doc.description
				# 	doc.summary = doc.description.substring(0,100)

				if doc.video
					if Meteor.settings.public.cfs?.store is 'OSS'
						video = cfs.videos.findOne(doc.video)
						if video
							doc.video_url = 'https://' + Meteor.settings.cfs.aliyun.bucket + '.' + Meteor.settings.cfs.aliyun.region.split('-internal')[0] + '.aliyuncs.com/videos/videos-' + video._id + '-' + encodeURIComponent(video.original.name)

		"before.update.server.post":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				# if modifier.$set.description
				# 	modifier.$set.summary = modifier.$set.description.substring(0,100)
				# if modifier.$unset and modifier.$unset.hasOwnProperty('description')
				# 	modifier.$unset.summary = 1

				if modifier.$set.video
					if Meteor.settings.public.cfs?.store is 'OSS'
						video = cfs.videos.findOne(modifier.$set.video)
						if video
							modifier.$set.video_url = 'https://' + Meteor.settings.cfs.aliyun.bucket + '.' + Meteor.settings.cfs.aliyun.region.split('-internal')[0] + '.aliyuncs.com/videos/videos-' + video._id + '-' + encodeURIComponent(video.original.name)

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
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
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true