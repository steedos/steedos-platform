AutoForm.addInputType('steedosLookups', {
	template: 'steedosLookups',
	valueIn: function(val, atts) {
		atts._value = _.clone(val)

		if(_.isObject(val) && !_.isArray(val)){
			return AutoForm.valueConverters.stringToStringArray(val.ids)
		}else{
			if(_.isArray(val)){
				return val;
			}else{
				return AutoForm.valueConverters.stringToStringArray(val);
			}
		}
	},
	valueOut: function(){

		val = this.val();

		if(this[0] && this[0].dataset.init === "0"){
			val = this[0].dataset.oldValue
		}

		ordered_val = [];

		if(this.context.multiple){
			$("li", $(".slds-selected-items-" + this.context.id)).each(function(e){
				ordered_val.push($(this)[0].dataset.value)
			});
			val = ordered_val;
		}

		if(this.context.dataset.reference){
			return {o:this.context.dataset.reference, ids: AutoForm.valueConverters.stringToStringArray(val)}
		}else{
			return val;
		}
	},
	contextAdjust: function(context) {
		context.items = _.map(context.selectOptions, function (opt) {
			return {
				label: opt.label,
				value: opt.value,
				selected: _.contains(context.value, opt.value)
			};
		});

		//autosave option
		if (AutoForm && typeof AutoForm.getCurrentDataForForm === 'function') {
			context.atts.autosave = AutoForm.getCurrentDataForForm().autosave || false;
			context.atts.placeholder = AutoForm.getCurrentDataForForm().placeholder || context.atts.uniPlaceholder || null;
			if(_.has(context.atts, "disabled")){
				context.atts.disabled = true
			}

			context.atts.disabled = !!AutoForm.getCurrentDataForForm().disabled || context.atts.disabled || false;
		}

		context.atts.removeButton = context.atts.removeButton || context.atts.remove_button; // support for previous version

		context.atts.dataSchemaKey = context.atts['data-schema-key'];

		return context;
	}
});


Template.steedosLookups.onCreated(function () {
    var template = this;

	_.extend(template.data, template.data.atts);

	var fieldSchema = AutoForm.getSchemaForField(template.data.name);

	var filtersFunction = null;
	var optionsFunction = null;

	if(fieldSchema){
		filtersFunction = fieldSchema.filtersFunction;
		optionsFunction = fieldSchema.optionsFunction;
		createFunction = fieldSchema.createFunction;
	}

    template.uniSelectize = new UniSelectize(template.data, template, filtersFunction, optionsFunction, createFunction);
});

Template.steedosLookups.onRendered(function () {
    var template = this;

    template.autorun(function () {
        template.uniSelectize.itemsAutorun();
    });

    template.autorun(function () {
        template.uniSelectize.itemsSelectedAutorun();
    });

    template.autorun(function () {
        var data = Template.currentData();

		_.extend(data, data.atts);

		template.uniSelectize.setSelectedReference(data._value);

        var methodParams = data.optionsMethodParams;

        var params = _.isFunction(methodParams) ? methodParams() : methodParams;

        template.uniSelectize.optionsMethodParams.set(params);
    });

    template.autorun(function () {
		var data = Template.currentData();
		if (data.items && _.isArray(data.items) && !_.isEmpty(data.items)) {
			template.uniSelectize.setItems(data.items, data.value);
		}
	});

	template.autorun(function () {
		var data = Template.currentData();
		var formId = AutoForm.getFormId();
		var value = data.value;

		if (template.uniSelectize.optionsMethod && !template.uniSelectize.optionsFunction) {

			_getOptions = function () {
				template.uniSelectize.getOptionsFromMethod(value);
			};

			Tracker.nonreactive(_getOptions)
		} else {
			var optionsFunction = template.uniSelectize.optionsFunction;

			var _values = AutoForm.getFormValues(formId).insertDoc

			if(_.isFunction(optionsFunction)){
				options = optionsFunction.call(template.uniSelectize, _values)
				template.uniSelectize.setItems(options, _values[template.data.atts.dataSchemaKey] || value);
			}
		}
	});

	template.autorun(function () {
		if(template.uniSelectize.open.get()){
			template.uniSelectize.opened.set(true)
		}
	});

	if(template.uniSelectize.dependOn && _.isArray(template.uniSelectize.dependOn) && template.uniSelectize.dependOn.length > 0){
		template.autorun(function () {

			var data = Template.currentData();

			var value = data.value;

			var dependValues = {};

			template.uniSelectize.dependOn.forEach(function (key) {
				var fid = AutoForm.getFormId();

				var dependValue = AutoForm.getFieldValue(key, fid);

				dependValues[key] = dependValue || '';
			});

			template.uniSelectize.dependValues.set(dependValues);
		});

		var form = $(template.find('select')).parents('form');

		template.uniSelectize.dependOn.forEach(function (key) {
			$($("[data-schema-key='" + key + "']"),form).change(function () {
				template.uniSelectize.clearItem();
			})
		});
	}

    this.form = $(template.find('select')).parents('form');
    this.form.bind('reset', function () {
        template.uniSelectize.unselectItem(null, true);
    });
	if($(".slds-selected-items-" + this.data.id)[0]){
		Sortable.create($(".slds-selected-items-" + this.data.id)[0], {
			group: 'words',
			animation: 150,
			filter: '.js-remove',
			onFilter: function (evt) {
				var el = selectUsersList.closest(evt.item)
				console.log("onFilter-->", el)
			},
			onEnd: function (event) {
				console.log("onEnd-->", event)
			}
		})
	}
});

Template.steedosLookups.onDestroyed(function () {
    if (this.form) {
        this.form.unbind('reset');
    }
});

Template.steedosLookups.helpers({
	lookupInit: function () {
		var template = Template.instance();
		return template.uniSelectize.initialized.get();
	},
	id: function () {
		return Template.instance().data.atts.id
	},
	dataSchemaKeyFromAtts: function(){
		return Template.instance().data.atts.dataSchemaKey
	},
    createText: function () {
        var template = Template.instance();
        return template.uniSelectize.createText;
    },
    multiple: function () {
        var template = Template.instance();
        return template.uniSelectize.multiple;
    },
    removeButton: function () {
        var template = Template.instance();
        return template.uniSelectize.multiple && template.uniSelectize.removeButton;
    },
    getItems: function () {
        var template = Template.instance();
        return template.uniSelectize.items.get();
    },
    getItemsSelected: function () {
        var template = Template.instance();
        return template.uniSelectize.itemsSelected.get();
    },
    getItemsUnselected: function () {
        var template = Template.instance();
        return template.uniSelectize.getItemsUnselectedFiltered();
    },
    getSearchText: function () {
        var template = Template.instance();
        return template.uniSelectize.searchText.get();
    },
    open: function () {
        var template = Template.instance();
        var $input = $("#for-"+template.data.atts.id);
        if($input.length > 0){
			var element = $("#listbox-unique-id",$input.parent().parent());
			var position = element.position();
			$("#listbox-unique-id .slds-listbox",element.parent().parent()).css({
				top: position.top + element.outerHeight(),
				bottom: 'auto',
				width: $input.parent().parent().parent().width()
			})
		}

        return template.uniSelectize.open.get();
    },
	isOpened: function () {
		var template = Template.instance();
		return template.uniSelectize.opened.get();
	},
    loading: function () {
        var template = Template.instance();
        return template.uniSelectize.loading.get();
    },
    inputPosition: function (position) {
        var template = Template.instance();
        var inputPosition = template.uniSelectize.inputPosition.get();
        return position === inputPosition;
    },
    activeOption: function (position) {
        var template = Template.instance();
        var activeOption = template.uniSelectize.activeOption.get();
        var itemsUnselected = template.uniSelectize.getItemsUnselectedFiltered();
        var createOption = template.uniSelectize.create;

        if (activeOption === itemsUnselected.length && createOption) {
            return position === 'create';
        }

        return position === activeOption;
    },
    getPlaceholder: function () {
        var template = Template.instance();
        var itemsSelected = template.uniSelectize.itemsSelected.get();

        if (itemsSelected.length) {
            return false;
        }

        return template.uniSelectize.placeholder;
    },
    isPlaceholder: function () {
        return this.value === '' ? 'uniPlaceholder' : '';
    },
	isReadOnly: function () {
		var template = Template.instance();

		if(template.uniSelectize.multiple){
			return false;
		}else{
			return template.uniSelectize.itemsSelected.get().length > 0
		}
	},
	isMultiple: function () {
		var template = Template.instance();
		return template.uniSelectize.multiple
	},
	_value: function () {
		var val = {};
		var template = Template.instance();

		if(!template.uniSelectize.multiple){
			_val = template.uniSelectize.itemsSelected.get()
			if(template.uniSelectize.itemsSelected.get().length > 0){
				val.value = _val[0].value
				val.label = _val[0].label
			}
		}

		return val
	},
	_readonlyValues: function () {
		var template = Template.instance();
		return _.filter(template.uniSelectize.items.get(), function (item) {
			return _.contains(template.data.value, item.value)
		})
	},
	hasLink: function () {
		var link = Template.instance().uniSelectize.selectedReference.get().link

		if(link){
			return true;
		}

		return false;
	},
	outPutLookupHref: function (value) {

		var link = Template.instance().uniSelectize.selectedReference.get().link

		link = _.isFunction(link) ? link() : link;

		if(link){
			return link + value
		}
	},

	isLast: function (index) {

		var template = Template.instance();

		var value = template.data.value || []

		if(value.length - 1 === index){
			return true;
		}
		return false;
	},

	placeholder: function () {

		var _selectedReference = Template.instance().uniSelectize.selectedReference.get();

		var placeholder = AutoForm.getLabelForField(Template.instance().data.name)

		if(_selectedReference && _.isObject(_selectedReference) && _selectedReference.label){
			placeholder = _selectedReference.label
		}

		return placeholder
	},

	getFieldName: function () {
		return Template.instance().data.name;
	},
	getReferences: function () {
		return Template.instance().data.references;
	},

	getSelectedReference: function () {
		return Template.instance().uniSelectize.selectedReference.get()
	},

	selectedReferenceIcon: function () {
		var selectedReference = Template.instance().uniSelectize.selectedReference.get();
		if(selectedReference){
			return selectedReference.icon
		}
	},

	selectedReferenceObject: function () {
    	if(Template.instance().data.objectSwitche){
			return Template.instance().uniSelectize.selectedReference.get() ? Template.instance().uniSelectize.selectedReference.get().object : ''
		}
	},

	isDisabled: function () {
		return Template.instance().data.atts.disabled
	},

	isShowIcon: function () {
		if(Template.instance().data.atts.showIcon === false)
			return false
		return true;
	},

	getIcon: function (icon) {
		return this.icon || icon || Template.instance().uniSelectize.defaultIcon.get() || 'document'
	},

	showObjectSwitche: function () {

    	isReadonly = function () {
			var template = Template.instance();

			if(template.uniSelectize.multiple){
				return false;
			}else{
				return template.uniSelectize.itemsSelected.get().length > 0
			}
		}

		return Template.instance().data.objectSwitche && !isReadonly()
	},

	createTitle: function () {
		ref = Template.instance().uniSelectize.selectedReference.get();
		if(ref)
			return ref.label
	},

	canCreate: function () {
		data = Template.instance().data

		if(data.atts.create && !AutoForm.getFormId().startsWith("new"))
			return true
	}
});

Template.steedosLookups.events({
    'click .steedos-lookups-input': function (e, template) {
        template.uniSelectize.checkDisabled();

        var $el = $(e.target);

		if($el.prop("readonly")){
			return
		}

		template.uniSelectize.inputFocus(template);

		var formId = AutoForm.getFormId();
		var _values = AutoForm.getFormValues(formId).insertDoc;

		if(template.uniSelectize.optionsFunction){
			template.uniSelectize.addItems(template.uniSelectize.optionsFunction(_values))
		}else{
			template.uniSelectize.getOptionsFromMethod();
		}
    },
    'keydown input.steedos-lookups-input': function (e, template) {
        var uniSelectize = template.uniSelectize;
        var itemsSelected = uniSelectize.itemsSelected.get();
        var itemsUnselected = uniSelectize.getItemsUnselectedFiltered();
        var inputPosition = uniSelectize.inputPosition.get();
        var activeOption = uniSelectize.activeOption.get();

        template.uniSelectize.checkDisabled();

        var $input = $(e.target);
        var width = template.uniSelectize.measureString($input.val(), $input) + 10;

        $input.width(width);
        switch (e.keyCode) {
            case 8: // backspace
                if ($input.val() === '') {
                    e.preventDefault();
                    uniSelectize.removeItemBeforeInput();
                }
                uniSelectize.open.set(true);
                uniSelectize.inputFocus();

                break;

            case 46: // delete
                if ($input.val() === '') {
                    uniSelectize.removeItemAfterInput();
                }
                uniSelectize.open.set(true);
                uniSelectize.inputFocus();

                break;

            case 27: // escape
                $input.blur();
                break;

            case 13: // enter
                e.preventDefault();
                e.stopPropagation();

                if (activeOption === -1 && $input.val() === '') {
                    break;
                }

                if (itemsUnselected && itemsUnselected.length > 0) {
                    uniSelectize.selectActiveItem(template);
                    uniSelectize.searchText.set('');
                    $input.val('');
                } else if (uniSelectize.create /*&& createOnBlur*/) {
                    uniSelectize.createItem();
                    uniSelectize.searchText.set('');
                    $input.val('');
                }

                break;
            case 37:    // left
                if (!uniSelectize.multiple) {
                    break;
                }
                if (inputPosition > -1) {
                    uniSelectize.inputPosition.set(inputPosition - 1);
                    uniSelectize.inputFocus();
                }
                break;
            case 39:    // right
                if (!uniSelectize.multiple) {
                    break;
                }
                if (inputPosition < itemsSelected.length - 1) {
                    uniSelectize.inputPosition.set(inputPosition + 1);
                    uniSelectize.inputFocus();
                }
                break;
            case 38:    // up
                if (activeOption > -1) {
                    uniSelectize.activeOption.set(activeOption - 1);
                    if(activeOption - 1 > -1){
						Meteor.defer(function () {
							var focusElement = $(template.find('.slds-has-focus'));
							focusElement.offsetParent().scrollTop(focusElement.offsetParent().scrollTop() + (focusElement.offset().top-focusElement.offsetParent().offset().top))
						})
					}
                }
                break;
            case 40:    // down
                if (activeOption < itemsUnselected.length - 1 ||
                    (activeOption < itemsUnselected.length && uniSelectize.create)) {
                	// console.debug('activeOption.set', activeOption + 1);
                    uniSelectize.activeOption.set(activeOption + 1);
					Meteor.defer(function () {
						var focusElement = $(template.find('.slds-has-focus'));
						focusElement.offsetParent().scrollTop(focusElement.offsetParent().scrollTop() + (focusElement.offset().top-focusElement.offsetParent().offset().top))
					})
                }
                break;
        }

        if (!template.uniSelectize.multiple && itemsSelected.length) {
            return false;
        }
    },
    'keyup input.steedos-lookups-input': function (e, template) {
        template.uniSelectize.checkDisabled();

        var $el = $(e.target);

		if($el.prop("readonly")){
			return
		}

		Meteor.clearTimeout(template.searchTimeoutId);

		template.searchTimeoutId = Meteor.setTimeout(function(){
			var value = $el.val();
			template.uniSelectize.searchText.set(value);
			template.uniSelectize.getOptionsFromMethod();
		}, 500);
    },
    'focus input.steedos-lookups-input': function (e, template) {
        template.uniSelectize.checkDisabled();

		var $el = $(e.target);

		if($el.prop("readonly")){
			return
		}
		//
		// var _values = AutoForm.getFormValues("cmForm").insertDoc
		//
		// if(template.uniSelectize.optionsFunction){
		// 	template.uniSelectize.setItems(template.uniSelectize.optionsFunction(_values))
		// }

        template.uniSelectize.open.set(true);

        Meteor.clearTimeout(template.uniSelectize.timeoutId);
    },
    'change input.steedos-lookups-input': function(e, template) {
        template.uniSelectize.checkDisabled();

		var $el = $(e.target);

		if($el.prop("readonly")){
			return
		}

        // prevent non-autoform fields changes from submitting the form when autosave is enabled
        e.preventDefault();
        e.stopPropagation();
    },
    'blur input.steedos-lookups-input': function (e, template) {
        template.uniSelectize.checkDisabled();

		var $el = $(e.target);

		if($el.prop("readonly")){
			return
		}

		template.uniSelectize.timeoutId = Meteor.setTimeout(function () {
            template.uniSelectize.open.set(false);
        }, 500);
    },
    // 'scroll .slds-listbox_vertical':  function (e, template) {
    //     Meteor.clearTimeout(template.uniSelectize.timeoutId);
    //     template.uniSelectize.timeoutId = Meteor.setTimeout(function () {
    //         template.uniSelectize.open.set(false);
    //     }, 5000);
    // },
    // 'mouseenter .slds-listbox_vertical > li': function (e, template) {
    //     var $el = $(e.target);
    //     var elIndex = $el.attr('data-index');
    //     var itemsUnselected = template.uniSelectize.getItemsUnselectedFiltered();
	//
    //     if (elIndex === 'create') {
    //         elIndex = itemsUnselected.length;
    //     } else {
    //         elIndex = parseInt(elIndex);
    //     }
	//
    //     template.uniSelectize.activeOption.set(elIndex);
    // },
    'click .createNew': function (e, template) {
        e.preventDefault();
        template.uniSelectize.checkDisabled();
        var $input = $(template.find('input'));

        template.uniSelectize.createItem();
        template.uniSelectize.searchText.set('');
        $input.val('');
    },
    'click .slds-pill__remove': function (e, template) {
        e.preventDefault();
        template.uniSelectize.checkDisabled();

        template.uniSelectize.unselectItem(this.value, false);

		template.uniSelectize.itemsAutorun()

        if(!template.uniSelectize.multiple){
			template.uniSelectize.getOptionsFromMethod();
			template.uniSelectize.inputFocus();
		}
    },
	'click .listbox__item': function (e, template) {
		e.preventDefault();
		template.uniSelectize.checkDisabled();
		var $input = $(template.find('input'));
		var itemsUnselected = template.uniSelectize.getItemsUnselectedFiltered();
		var itemsUnselectedLength = itemsUnselected && itemsUnselected.length;
		template.uniSelectize.selectItem(this.value);
		template.uniSelectize.searchText.set('');
		$input.val('');

		if (template.uniSelectize.multiple && itemsUnselectedLength && this.value) {
			// template.uniSelectize.inputFocus();
			template.uniSelectize.open.set(false);
		} else {
			template.uniSelectize.open.set(false);
		}
	},

	'click .references-item': function (e, template) {
		template.uniSelectize.clearItem()
		template.uniSelectize.selectedReference.set(this)
	},

	'click .steedos-lookups-object-switche': function (e, template) {
		template.uniSelectize.open.set(false);
	}
});
