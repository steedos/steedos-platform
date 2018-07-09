@GlobalSettings = {
	"core": {
		"db_hash": {
			"defaultValue": null
		},
		"next_update_check": {
			"defaultValue": null
		},
		"notifications": {
			"defaultValue": "[]"
		}
	},
	"blog": {
		"title": {
			"defaultValue": "华炎微站",
			"validations": {
				"isLength": {
					"max": 150
				}
			}
		},
		"description": {
			"defaultValue": "The professional publishing platform",
			"validations": {
				"isLength": {
					"max": 200
				}
			}
		},
		"logo": {
			"defaultValue": "https://casper.ghost.org/v1.0.0/images/ghost-logo.svg"
		},
		"cover_image": {
			"defaultValue": "https://casper.ghost.org/v1.0.0/images/blog-cover.jpg"
		},
		"icon": {
			"defaultValue": ""
		},
		"default_locale": {
			"defaultValue": "en",
			"validations": {
				"isEmpty": false
			}
		},
		"active_timezone": {
			"defaultValue": "Etc/UTC",
			"validations": {
				"isTimezone": true,
				"isEmpty": false
			}
		},
		"force_i18n": {
			"defaultValue": "true",
			"validations": {
				"isEmpty": false,
				"isIn": [["true", "false"]]
			}
		},
		"permalinks": {
			"defaultValue": "/:slug/",
			"validations": {
				"matches": "^(\/:?[a-z0-9_-]+){1,5}\/$",
				"matches": "(:id|:slug|:year|:month|:day|:author|:primary_tag|:primary_author)",
				"notContains": "/ghost/"
			}
		},
		"amp": {
			"defaultValue": "true"
		},
		"ghost_head": {
			"defaultValue": ""
		},
		"ghost_foot": {
			"defaultValue": ""
		},
		"labs": {
			"defaultValue": "{\"publicAPI\": true}"
		},
		"navigation": {
			"defaultValue": [{"label":"Home", "url":"vip.web"}]
		},
		"slack": {
			"defaultValue": "[{\"url\":\"\"}]"
		},
		"unsplash": {
			"defaultValue": "{\"isActive\": true}"
		}
	}
}