schedule = Npm.require('node-schedule')

logger = new Logger 'Instances_Statistics'

InstancesStat = {}

#	*    *    *    *    *    *
#	┬    ┬    ┬    ┬    ┬    ┬
#	│    │    │    │    │    |
#	│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
#	│    │    │    │    └───── month (1 - 12)
#	│    │    │    └────────── day of month (1 - 31)
#	│    │    └─────────────── hour (0 - 23)
#	│    └──────────────────── minute (0 - 59)
#	└───────────────────────── second (0 - 59, OPTIONAL)

InstancesStat.rule = Meteor.settings?.instances_stat

InstancesStat.costTime = (space)->
	logger.info "[#{new Date()}] start run InstancesStat.costTime"
	console.log "[#{new Date()}] start run InstancesStat.costTime"
	userCostTime = new UserCostTime(space)
	userCostTime.startStat()
	logger.info "[#{new Date()}] end run InstancesStat.costTime"
	return


InstancesStat.run = ()->
	try
		space = InstancesStat.rule.space
		console.log "space", space
		InstancesStat.costTime space
	catch  e
		logger.error "InstancesStat.costTime", e

Meteor.startup ->
	if InstancesStat.rule?.schedule
		# 开始同步任务，同步任务的schedule
		if InstancesStat.rule?.space
			schedule.scheduleJob InstancesStat.rule.schedule, Meteor.bindEnvironment(InstancesStat.run)
		else
			logger.error "Miss settings: instances_stat.space"
	else
		logger.error "Miss settings: instances_stat.schedule"

# ==================================================================

# InstancesStat.init('h8BomfvK7cZhyg9ub', 2018, 4)
# InstancesStat.init('Af8eM6mAHo7wMDqD3', 2018, 1)
InstancesStat.init = (space, year, month)->
	userCostTime = new UserCostTime(space, year, month)
	userCostTime.startStat()
	return
	
# InstancesStat.test('Af8eM6mAHo7wMDqD3')
InstancesStat.test = (space) ->
	InstancesStat.run space