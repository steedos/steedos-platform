/* Meteor need globals */
/* eslint strict: 0 */
/* jshint strict: false */

UniSelectize = function (options, template, filtersFunction, optionsFunction) {
	this.items = new ReactiveVar([]);
	this.itemsSelected = new ReactiveVar([]);
	this.itemsUnselected = new ReactiveVar([]);

	this.open = new ReactiveVar(false);
	this.loading = new ReactiveVar(false);
	this.searchText = new ReactiveVar();
	this.activeOption = new ReactiveVar(-1);
	this.inputPosition = new ReactiveVar(-1);
	this.optionsMethodParams = new ReactiveVar();
	this.selectedReference = new ReactiveVar();
	this.dependValues = new ReactiveVar();

	this.defaultIcon = new ReactiveVar(options.defaultIcon);
	this.optionsFunction = optionsFunction;
	this.references = options.references;
	this.create = options.create;
	this.createText = options.createText;
	this.template = template;
	this.multiple = options.multiple;
	this.sortMethod = _.isUndefined(options.sortMethod) ? '' : options.sortMethod; //label，只有配置了排序方式才排序，移除默认排序规则
	this.placeholder = options.placeholder;
	this.removeButton = options.removeButton !== false;
	this.createMethod = options.createMethod;
	this.optionsMethod = options.optionsMethod;
	this.optionsPlaceholder = options.optionsPlaceholder;
	this.filters = options.filters;
	this.dependOn = options.dependOn;
	this.optionsSort = options.optionsSort
	this.filtersFunction = filtersFunction;

	this.initialized = new ReactiveVar(0);

	if(this.optionsSort){
		if(!_.isObject(this.optionsSort)){
			console.error("无效的sort属性值", this.optionsSort)
		}
	}

	if (optionsFunction || !options.optionsMethod) {
		this.initialized.set(1);
	}

	if (options.items && _.isArray(options.items)) {
		this.items.set(options.items)
	}

	this.setSelectedReference(options._value)
};

UniSelectize.prototype.getFiltersSelectors = function () {
	var filters = this.filters;

	var query = {};

	var dependValues = this.dependValues.get();

	if (dependValues) {
		_.keys(dependValues).forEach(function (key) {
			filters.forEach(function (filter) {
				var field_code = filter[0];
				var query_selectors = filter[1];   //mongodb Query Selectors
				var selectors_value = filter[2];
				var reg = new RegExp("{" + key + "}", "g");
				selectors_value = selectors_value.replace(reg, dependValues[key]);
				query[field_code] = {}
				query[field_code][query_selectors] = selectors_value
			})
		})
	}
	return query;
}

UniSelectize.prototype.setSelectedReference = function (_value) {
	if (this.references && this.references.length > 0) {

		var _object = "";

		if (_.isObject(_value)) {
			_object = _value.o
		}

		if (_object) {
			var _reference = _.find(this.references, function (_item) {
				return _item.object === _object
			})

			if (_reference) {
				this.selectedReference.set(_reference)
			} else {
				this.selectedReference.set(this.references[0])
			}

		} else {
			this.selectedReference.set(this.references[0])
		}
	}
}

UniSelectize.prototype.triggerChangeEvent = function () {
	var self = this;
	Meteor.defer(function () {
		$(self.template.find('select')).change();
	});
};


UniSelectize.prototype.setItems = function (items, value) {
	if (!_.isArray(items)) {
		console.warn('invalid options format');
	}

	var values = value && (_.isArray(value) ? value : [value]);

	items = _.filter(items, function (item) {
		if (!item.value || !item.label) {
			console.info('invalid option', item);
			return false;
		}
		return true;
	});

	var itemValues = items.map(function (item) {
		return item.value;
	});

	_.each(values, function (val) {
		if (!_.contains(itemValues, val) && val) {
			items.push({
				value: val,
				label: val
			});
		}
	});

	var self = this;

	_.each(items, function (item) {
		if (_.contains(values, item.value)) {
			item.selected = true;
			if (item.icon) {
				self.defaultIcon.set(item.icon)
			}
		}
	});

	if (values) {
		//按照值排序
		items = _.sortBy(items, function (doc) {
			return values.indexOf(doc.value)
		});
	}

	this.items.set(items);
};

UniSelectize.prototype.addItems = function (newItems, value) {
	if (!_.isArray(newItems)) {
		console.warn('invalid options format');
	}

	var values = value && (_.isArray(value) ? value : [value]);
	var items = this.items.get();
	var itemsValues = items.map(function (item) {
		return item.value;
	});

	_.each(newItems, function (newItem) {
		if (!newItem.value || !newItem.label) {
			console.info('invalid option', newItem);
			return;
		}

		if (!_.contains(itemsValues, newItem.value)) {
			var item = {
				value: newItem.value,
				label: newItem.label,
				icon: newItem.icon,
				selected: newItem.selected
			};

			if (_.contains(values, newItem.value)) {
				item.selected = true;
			}

			items.push(item);
		} else if (typeof newItem.selected !== 'undefined') {
			var item = _.find(items, function (item) {
				return item.value === newItem.value;
			});
			item.selected = newItem.selected;
		}
	});

	if (values) {
		//按照值排序
		items = _.sortBy(items, function (doc) {
			return values.indexOf(doc.value)
		});
	}

	this.items.set(items);
};


UniSelectize.prototype.removeUnusedItems = function (newItems) {
	if (!_.isArray(newItems)) {
		console.warn('invalid options format');
	}

	var items = this.items.get();
	var newItemsValues = newItems.map(function (item) {
		return item.value;
	});

	items = _.filter(items, function (item) {
		return _.contains(newItemsValues, item.value) || item.selected;
	});

	this.items.set(items);
};

UniSelectize.prototype.itemsAutorun = function () {
	var items = this.items.get();
	var itemsSelected = [];
	var itemsUnselected = [];

	_.each(items, function (item) {
		if (item.selected) {
			itemsSelected.push(item);
		} else {
			itemsUnselected.push(item);
		}
	});

	if (this.sortMethod) {
		itemsSelected = _.sortBy(itemsSelected, this.sortMethod);
		itemsUnselected = _.sortBy(itemsUnselected, this.sortMethod);
	}

	var itemsSelectedPrev = this.itemsSelected.get();
	if (!_.isEqual(itemsSelectedPrev, itemsSelected)) {
		this.itemsSelected.set(itemsSelected);
	}

	if (this.placeholder && this.optionsPlaceholder) {
		itemsUnselected.unshift({
			value: '',
			label: _.isString(this.optionsPlaceholder) ? this.optionsPlaceholder : this.placeholder
		});
	}

	this.itemsUnselected.set(itemsUnselected);
};

UniSelectize.prototype.itemsSelectedAutorun = function () {
	var itemsSelected = this.template.uniSelectize.itemsSelected.get();
	this.template.uniSelectize.inputPosition.set(itemsSelected.length - 1);
};

UniSelectize.prototype.inputFocus = function () {
	var self = this;
	Meteor.defer(function () {
		var $input = $(self.template.find('input'));
		$input.focus();
	});
};

UniSelectize.prototype.selectItem = function (value) {
	var items = this.items.get();
	var multiple = this.multiple;

	var self = this;

	_.each(items, function (item) {
		if (value === '') {
			item.selected = false;
		} else if (item.value === value) {
			item.selected = true;
			if (item.icon) {
				self.defaultIcon.set(item.icon)
			}
		} else if (!multiple) {
			item.selected = false;
		}
	});

	values = items.getProperty("value");

	items = _.sortBy(items, function (doc) {
		if(value === doc.value){
			return items.length + 1
		}else{
			return _.indexOf(values, doc.value)
		}
	});

	this.setItems(items);
	this.triggerChangeEvent();
};

UniSelectize.prototype.unselectItem = function (value, reset) {
	var items = this.items.get();

	_.each(items, function (item) {
		if (item.value === value || reset) {
			item.selected = false;
		}
	});

	this.setItems(items);
	this.triggerChangeEvent()
};

UniSelectize.prototype.removeItemBeforeInput = function () {
	var items = this.itemsSelected.get();
	var inputPosition = this.inputPosition.get();
	var itemToRemove;

	_.each(items, function (item, index) {
		if (index === inputPosition) {
			itemToRemove = item;
		}
	});

	if (itemToRemove) {
		this.unselectItem(itemToRemove.value, false);
	}
};

UniSelectize.prototype.removeItemAfterInput = function () {
	var items = this.itemsSelected.get();
	var inputPosition = this.inputPosition.get();
	var itemToRemove;

	_.each(items, function (item, index) {
		if (index === inputPosition + 1) {
			itemToRemove = item;
		}
	});

	if (itemToRemove) {
		this.unselectItem(itemToRemove.value, false);
	}
};

UniSelectize.prototype.selectActiveItem = function () {
	var itemsUnselected = this.getItemsUnselectedFiltered();
	var activeOption = this.activeOption.get();
	var itemToSelect = itemsUnselected && itemsUnselected[activeOption];

	if (activeOption === itemsUnselected.length && this.create) {
		this.createItem();
		return;
	}

	itemToSelect && this.selectItem(itemToSelect.value);

	if (this.multiple) {
		this.open.set(true);
		this.inputFocus();
	} else {
		this.open.set(false);
	}
};

UniSelectize.prototype.insertItem = function (item) {
	var items = this.items.get();

	if (!_.find(items, function (obj) {
			if (obj.value === item.value) {
				obj.selected = item.selected;
				return true;
			}
			return false;
		})) {
		items.push(item);
	}

	this.setItems(items);
	this.triggerChangeEvent();
};

UniSelectize.prototype.createItem = function () {
	var self = this;
	var template = this.template;
	var searchText = this.searchText.get();

	if (!searchText) {
		return false;
	}

	var item = {
		label: searchText,
		value: searchText,
		selected: true
	};

	if (template.uniSelectize.createMethod) {
		Meteor.call(template.uniSelectize.createMethod, searchText, searchText, function (error, value) {
			if (error) {
				console.error('universe selectize create method error:', error);
				return;
			}

			Meteor.defer(function () {
				item.value = value || item.value;
				self.insertItem(item);
			});
		});
	} else {
		this.insertItem(item);
	}

	if (this.multiple) {
		this.inputFocus();
	} else {
		this.open.set(false);
	}
};

UniSelectize.prototype.getItemsUnselectedFiltered = function () {
	var items = this.itemsUnselected.get();
	var searchText = this.searchText.get();

	return _.filter(items, function (item) {
		if (item.label && typeof(item.label) == 'string' && item.label.search(new RegExp(searchText, 'i')) !== -1) {
			return true;
		}
		return false;
	});
};


UniSelectize.prototype.checkDisabled = function () {
	if (this.template.data.disabled) {
		throw new Meteor.Error('This field is disabled');
	}
};

UniSelectize.prototype.measureString = function (str, $parent) {
	if (!str) {
		return 0;
	}

	var $test = $('<test>').css({
		position: 'absolute',
		top: -99999,
		left: -99999,
		width: 'auto',
		padding: 0,
		whiteSpace: 'pre'
	}).text(str).appendTo('body');

	this.transferStyles($parent, $test, [
		'letterSpacing',
		'fontSize',
		'fontFamily',
		'fontWeight',
		'textTransform'
	]);

	var width = $test.width();
	$test.remove();

	return width;
};

UniSelectize.prototype.transferStyles = function ($from, $to, properties) {
	var i, n, styles = {};

	if (properties) {
		for (i = 0, n = properties.length; i < n; i++) {
			styles[properties[i]] = $from.css(properties[i]);
		}
	} else {
		styles = $from.css();
	}

	$to.css(styles);
};

UniSelectize.prototype.clearItem = function () {
	this.items.set([]);
	this.itemsSelected.set([]);
	this.itemsUnselected.set([]);
};

UniSelectize.prototype.clearSelected = function () {
	this.itemsSelected.set([]);
};

UniSelectize.prototype.getOptionsFromMethod = function (values) {

	var self = this;
	var methodName = this.optionsMethod;
	var searchText = this.searchText.get();
	var params = this.optionsMethodParams.get();
	var optionsFunction = this.optionsFunction;

	if (optionsFunction) {
		return false;
	}

	if (this.selectedReference.get()) {
		if (_.isObject(params)) {
			params.reference_to = this.selectedReference.get().object;
		} else {
			params = {reference_to: this.selectedReference.get().object}
		}
	}

	if (!methodName) {
		return false;
	}

	var seleted = this.itemsSelected.get() || [];

	var filterQuery = {};

	if (this.filtersFunction && _.isFunction(this.filtersFunction)) {
		filterQuery = this.filtersFunction(this.filters, this.dependValues.get());
	} else {
		filterQuery = this.getFiltersSelectors();
	}

	var searchVal = {
		searchText: searchText,
		values: values || [],
		params: params || null,
		selected: _.pluck(seleted, 'value'),
		filterQuery: filterQuery
	};

	if(this.optionsSort){
		searchVal.sort = this.optionsSort
	}

	// self.loading.set(true);

	Meteor.call(methodName, searchVal, function (err, options) {
		// self.loading.set(false);
		if(err){
			console.error(err)
		}

		if (params) {
			self.removeUnusedItems(options);
		}

		self.addItems(options, values);

		Meteor.setTimeout(function () {
			self.initialized.set(1);
		}, 1)
	});
};
