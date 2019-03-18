## 提供给用户使用的odata标准函数
### 查询一条记录
 - api:Creator.odata.get(object_name, id, field_name)
 - 参数介绍：
 	- object_name:对象名/表名
 	- id:要查询记录的id
 	- field_name:要查询的字段
 - 实例：
 	- 无field_name:
 		```
 		调用：Creator.odata.get("qhd_informations","pKLcEGHsWXD5YmhY8")
 		返回：{
			"_id": "pKLcEGHsWXD5YmhY8",
			"title": "九公司紧密结合铁路集中修，完成70项设备维修改造工作，为生产运行提供强大支撑",
			"company": "九公司",
			"content": "4月份，九公司紧密结合铁路集中修，完成70项重点设备维修、改造工作，为生产运行保驾护航。一是强化业务系统与设备系统协同配合，根据生产实际，利用作业间隙，周密制定设备检修和保养工作计划。二是加强开工前、开工中、完工后管理控制，开好活前会，理顺维修流程，明确注意事项和验收标准，确保维修质量和维修效率。三是制定《铁路开天窗期间维修安全重点强调内容》，加强对作业现场的安全监督检查和管理工作，规范了现场维修作业，有效杜绝了安全风险。",
			"owner": "hC6oJuGgdjXDRXrDL",
			"space": "Af8eM6mAHo7wMDqD3",
			"created": "2018-04-28T12:05:52.789Z",
			"modified": "2018-04-28T12:05:52.789Z",
			"created_by": "hC6oJuGgdjXDRXrDL",
			"modified_by": "hC6oJuGgdjXDRXrDL",
			"score": 0
			 }
		```
	- 有field_name:
		```
		调用：Creator.odata.get("qhd_informations","pKLcEGHsWXD5YmhY8","title,company")
		返回：{
			"_id": "pKLcEGHsWXD5YmhY8",
			"title": "九公司紧密结合铁路集中修，完成70项设备维修改造工作，为生产运行提供强大支撑",
			"company": "九公司"
			}
		```	
### 查询多条记录
 - api:Creator.odata.query("qhd_informations", options)
 - 参数介绍：
 	- object_name:对象名/表名
 	- options:查询选项（包括要查询的记录数，要查询的字段，查询条件等）
 	- 实例：
 		```
 		options = {	top: 3,
				   	select: 
				   	[
				        "title",
				        "company",
				        "content",
				        "owner",
				        "score_point",
				        "created"
				    ],
				    filter: [["company", "=", '二公司']]
				}
		调用：Creator.odata.query(object_name, options)
		返回：{
		{
	      "_id": "oKBpn3mjpASADkNg4",
	      "title": "二公司党委突出“家园文化”，五举措深化职工之家建设",
	      "company": "二公司",
	      "content": "二公司党委突出“家园文化”，五举措深化职工之家建设。一是建设“学习家园”，依托全总“职工书屋”，开展职工学先、读书分享、座谈研讨等活动，积极创建学习型班组，掀起“学知识、练技术、提素质”热潮。二是建设“创新家园”，围绕落实“三二一一”职工技能提升助推活动，开展岗位技术培训、技能练兵、技能竞赛和“五小”创新成果活动，提高职工创新水平、技术能力。三是建设“环境家园”，创建环境卫生文明中小家，提升环境文化建设水平。四是建设“安全家园”，落实职工之家安全文化建设，开展工会劳动保护监督检查、消防“微互动”活动，利用微信公众号普及消防法律法规和消防安全知识，打造安全型班组。五是建设“民主家园”，深化民主管理，开展企务公开、困难帮扶、女职工权益工作，严格落实职代会各项职权，深入研究职工代表提案，保障职工知情权、参与权、表达权、监督权。（二公司）",
	      "created": "2018-04-25T02:45:26.473Z",
	      "owner": "mjLZP2v5FCvzJCKJd",
	      "score_point": [
	        "正常使用"
	      ]
	    },
    	{
	      "_id": "95sXQMmoYCAH43hEP",
	      "title": "二公司开展粉尘防控应急演练",
	      "company": "二公司",
	      "content": "4月24日，二公司在煤二期2号翻堆线开展粉尘防控应急演练。本次演练以煤二期B2D堆料机正常作业、单机洒水设备投用情况下堆料作业依然起尘为背景，依据公司《环保工作应急处置方案》等制度，从场景设置，台词对话，各环节连续性等方面制定演练计划。4个参演科队根据演练计划对发现起尘至起尘情况得到抑制的全过程进行实战演练，检验粉尘防控方案的可操作性和科学性。其他6个基层队的环保工作人员根据岗位职责在相应流程节点实地观摩。演练结束后对演练过程进行评估并建立档案，同时依据评估结果进一步完善演练计划、强化相关岗位人员培训，形成管理闭环，提高公司粉尘防控应急应对工作的经验和能力。（二公司）",
	      "created": "2018-04-25T05:24:23.419Z",
	      "owner": "vBz55fGYthKLiBm9G",
	      "score_point": [
	        "正常使用"
	      ]
	    },
    	{
	      "_id": "kXq837CoqQinSwEAo",
	      "title": "二公司党委三个“早”，严防“四风”反弹回潮",
	      "company": "二公司",
	      "content": "二公司党委抓好三个“早”, 严防“四风”反弹回潮。一是警示教育“早”预防。持续实施以廉洁文化、案例警示、廉洁提醒为主要内容的党风建设与反腐倡廉教育，宣传学习《中共河北港口集团有限公司纪委关于姜敏等人违纪问题处理情况的通报》，发挥先进典型引领示范和反面典型警示教育作用。  二是廉洁文化“早”宣传。开展“讲政治、守纪律、转作风”主题警示教育活动，将主题教育内容纳入党组织理论中心组学习计划，列为党员干部培训安排，不断提高党员干部政治觉悟。三是廉洁提醒“早”部署。抓住“清明”“五一”重要节点，加强重点岗位人员廉洁提醒，针对重点部位、重点人员、重点环节进行自查，扎实开展巡视巡察“回头看”工作，推进纠正“四风”和作风纪律专项整治，从根本上杜绝“四风”问题发生。（二公司）",
	      "created": "2018-04-23T06:31:13.047Z",
	      "owner": "Rssm7LPpNJqT35mLF",
	      "score_point": [
	        "正常使用"
	      ]
	    }
		}
		```
### 新增记录
 - api :Creator.odata.insert(object_name, doc)
 - 参数介绍：
 	- object_name:对象名/表名
 	- doc:插入的数据
 	- 实例：
 		```
 		doc = {
 		"title":"abc",
 		"company":"一公司"，
 		"content":"一公司一季度人事调动"
 		}
 		调用：Creator.odata.insert("qhd_informations", doc)
	 	返回：{
	      "_id": "kXcYfS6yRd8GDwzhz",
	      "title": "abc",
	      "company": "一公司一季度人事调动",
	      "content": "一公司一季度人事调动",
	      "space": "Af8eM6mAHo7wMDqD3",
	      "created": "2018-05-09T07:21:18.907Z",
	      "modified": "2018-05-09T07:21:18.907Z",
	      "created_by": "Mpb5vnogRxGLqoyoR",	 
	      "modified_by": "Mpb5vnogRxGLqoyoR",
	      "score": 0
	    }
		```
### 修改一条记录
 - api :Creator.odata.update(object_name, id, doc)
 - 参数介绍：
 	- object_name:对象名/表名
 	- doc:插入的数据
 	- 实例：
 		```
 		doc = {
 		"title":"二公司一季度人事调动",
 		"company":"二公司"，
 		"content":"二公司一季度人事调动"
 		}
 		调用：Creator.odata.update("qhd_informations","kXcYfS6yRd8GDwzhz" doc)
		```
### 删除一条记录
 - api : Creator.odata.delete(object_name, id)
 - 参数介绍：
 	- object_name:对象名/表名
 	- id:要删除数据的id
 	- 实例：
 		```
 		调用：Creator.odata.delete("qhd_informations","kXcYfS6yRd8GDwzhz")
 		```