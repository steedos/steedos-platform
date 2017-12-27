/* global _, Template, Tabular, Tracker, ReactiveVar, Session, Meteor, tableInit, getPubSelector, Util */

Template.tabular.helpers({
	atts: function () {
		// We remove the "table" and "selector" attributes and assume the rest belong
		// on the <table> element
		return _.omit(this, "table", "selector");
	}
});

var tabularOnRendered = function () {
	var template = this,
		table, resetTablePaging = false,
		$tableElement = template.$('table');

	template.tabular = {};
	template.tabular.data = [];
	template.tabular.pubSelector = new ReactiveVar({}, Util.objectsAreEqual);
	template.tabular.skip = new ReactiveVar(0);
	template.tabular.limit = new ReactiveVar(10);
	template.tabular.sort = new ReactiveVar(null, Util.sortsAreEqual);
	template.tabular.columns = null;
	template.tabular.fields = null;
	template.tabular.searchFields = null;
	template.tabular.searchCaseInsensitive = true;
	template.tabular.splitSearchByWhitespace = true;
	template.tabular.tableName = new ReactiveVar(null);
	template.tabular.options = new ReactiveVar({}, Util.objectsAreEqual);
	template.tabular.docPub = new ReactiveVar(null);
	template.tabular.collection = new ReactiveVar(null);
	template.tabular.ready = new ReactiveVar(false);
	template.tabular.recordsTotal = 0;
	template.tabular.recordsFiltered = 0;
	template.tabular.isLoading = new ReactiveVar(true);
	template.tabular.search_value = new ReactiveVar(null);

	// These are some DataTables options that we need for everything to work.
	// We add them to the options specified by the user.
	var ajaxOptions = {
		// tell DataTables that we're getting the table data from a server
		serverSide: true,
		processing: true,
		// define the function that DataTables will call upon first load and whenever
		// we tell it to reload data, such as when paging, etc.
		ajax: function (data, callback/*, settings*/) {
			// console.log("data", data)
			// When DataTables requests data, first we set
			// the new skip, limit, order, and pubSelector values
			// that DataTables has requested. These trigger
			// the first subscription, which will then trigger the
			// second subscription.

			// template.tabular.isLoading.set(true);
			//console.log('data', template.tabular.data);

			// Update skip
			template.tabular.skip.set(data.start);
			Session.set('Tabular.LastSkip', data.start);

			// Update limit
			var options = template.tabular.options.get();
			var hardLimit = options && options.limit;
			if (data.length === -1) {
				if (hardLimit === undefined) {
					console.warn('When using no paging or an "All" option with tabular, it is best to also add a hard limit in your table options like {limit: 500}');
					template.tabular.limit.set(null);
				} else {
					template.tabular.limit.set(hardLimit);
				}
			} else {
				template.tabular.limit.set(data.length);
			}

			// Update sort
			template.tabular.sort.set(Util.getMongoSort(data.order, template.tabular.columns));
			// Update pubSelector
			var pubSelector = getPubSelector(
				template.tabular.selector,
				(data.search && data.search.value) || null,
				template.tabular.searchFields,
				template.tabular.searchCaseInsensitive,
				template.tabular.splitSearchByWhitespace,
				data.columns || null
			);
			template.tabular.pubSelector.set(pubSelector);

			template.tabular.search_value.set((data.search && data.search.value) || null);

			// We're ready to subscribe to the data.
			// Matters on the first run only.
			template.tabular.ready.set(true);

			// console.log('ajax');

			callback({
				draw: data.draw,
				recordsTotal: template.tabular.recordsTotal,
				recordsFiltered: template.tabular.recordsFiltered,
				data: template.tabular.data
			});

		},
		initComplete: function () {
			var options = template.tabular.options.get();
			if (options.search && options.search.onEnterOnly) {
				$('.dataTables_filter input')
					.unbind()
					.bind('keyup change', function (event) {
						if (!table) return;
						if (event.keyCode === 13 || this.value === '') {
							table.search(this.value).draw();
						}
					});
			}
		}
	};

	// For testing
	//setUpTestingAutoRunLogging(template);

	// Reactively determine table columns, fields, and searchFields.
	// This will rerun whenever the current template data changes.
	var lastTableName;
	template.autorun(function () {
		var data = Template.currentData();

		//console.log('currentData autorun', data);

		if (!data) {
			return;
		}

		// We get the current TabularTable instance, and cache it on the
		// template instance for access elsewhere
		var tabularTable = template.tabular.tableDef = data.table;

		if (!(tabularTable instanceof Tabular.Table)) {
			throw new Error("You must pass Tabular.Table instance as the table attribute");
		}

		// Always update the selector reactively
		template.tabular.selector = data.selector;

		// The remaining stuff relates to changing the `table`
		// attribute. If we didn't change it, we can stop here,
		// but we need to reload the table if this is not the first
		// run
		if (tabularTable.name === lastTableName) {
			if (table) {
				// passing `false` as the second arg tells it to
				// reset the paging
				table.ajax.reload(null, true);
			}
			return;
		}

		// If we reactively changed the `table` attribute, run
		// onUnload for the previous table
		if (lastTableName !== undefined) {
			var lastTableDef = Tabular.tablesByName[lastTableName];
			if (lastTableDef && typeof lastTableDef.onUnload === 'function') {
				lastTableDef.onUnload();
			}
		}

		// Cache this table name as the last table name for next run
		lastTableName = tabularTable.name;

		// Figure out and update the columns, fields, and searchFields
		tableInit(tabularTable, template);

		// Set/update everything else
		template.tabular.searchCaseInsensitive = true;
		template.tabular.splitSearchByWhitespace = true;

		if (tabularTable.options && tabularTable.options.search) {
			if (tabularTable.options.search.caseInsensitive === false) {
				template.tabular.searchCaseInsensitive = false;
			}
			if (tabularTable.options.search.smart === false) {
				template.tabular.splitSearchByWhitespace = false;
			}
		}
		template.tabular.options.set(tabularTable.options);
		template.tabular.tableName.set(tabularTable.name);
		template.tabular.docPub.set(tabularTable.pub);
		template.tabular.collection.set(tabularTable.collection);

		// userOptions rerun should do this?
		if (table) {
			// passing `true` as the second arg tells it to
			// reset the paging
			// console.log("ajax.reload...")
			table.ajax.reload(null, true);
		}
	});

	template.autorun(function () {
		// these 5 are the parameters passed to "tabular_getInfo" subscription
		// so when they *change*, set the isLoading flag to true
		template.tabular.tableName.get();
		template.tabular.pubSelector.get();
		template.tabular.sort.get();
		template.tabular.skip.get();
		template.tabular.limit.get();
		template.tabular.isLoading.set(true);
	});

	// First Subscription
	// Subscribe to an array of _ids that should be on the
	// current page of the table, plus some aggregate
	// numbers that DataTables needs in order to show the paging.
	// The server will reactively keep this info accurate.
	// It's not necessary to call stop
	// on subscriptions that are within autorun computations.
	template.autorun(function () {
		if (!template.tabular.ready.get()) {
			return;
		}

		function onReady() {
			template.tabular.isLoading.set(false);
		}

		//console.log('tabular_getInfo autorun');
		// console.log("tabular.search_value.get()", template.tabular.search_value.get());
		Meteor.subscribe(
			"tabular_getInfo",
			template.tabular.tableName.get(),
			template.tabular.pubSelector.get(),
			template.tabular.sort.get(),
			template.tabular.skip.get(),
			template.tabular.limit.get(),
			template.tabular.search_value.get(),
			onReady
		);
	});

	// Second Subscription
	// Reactively subscribe to the documents with _ids given to us. Limit the
	// fields to only those we need to display. It's not necessary to call stop
	// on subscriptions that are within autorun computations.
	template.autorun(function () {
		// tableInfo is reactive and causes a rerun whenever the
		// list of docs that should currently be in the table changes.
		// It does not cause reruns based on the documents themselves
		// changing.
		var tableName = template.tabular.tableName.get();
		var tableInfo = Tabular.getRecord(tableName) || {};

		// console.log('tableName and tableInfo autorun', tableName, tableInfo);

		template.tabular.recordsTotal = tableInfo.recordsTotal || 0;
		template.tabular.recordsFiltered = tableInfo.recordsFiltered || 0;

		// In some cases, there is no point in subscribing to nothing
		if (_.isEmpty(tableInfo) ||
			template.tabular.recordsTotal === 0 ||
			template.tabular.recordsFiltered === 0) {
			return;
		}

		// Extend with extraFields from table definition
		var fields = template.tabular.fields;
		if (fields) {
			// Extend with extraFields from table definition
			if (typeof template.tabular.tableDef.extraFields === 'object') {
				fields = _.extend(_.clone(fields), template.tabular.tableDef.extraFields);
			}
		}

		template.tabular.tableDef.sub.subscribe(
			template.tabular.docPub.get(),
			tableName,
			tableInfo.ids || [],
			fields
		);
	});

	// Build the table. We rerun this only when the table
	// options specified by the user changes, which should be
	// only when the `table` attribute changes reactively.
	template.autorun(function (c) {
		var userOptions = template.tabular.options.get();
		var options = _.extend({}, ajaxOptions, userOptions);

		//console.log('userOptions autorun', options);

		// unless the user provides her own displayStart,
		// we use a value from Session. This keeps the
		// same page selected after a hot code push.
		if (c.firstRun && !('displayStart' in options)) {
			options.displayStart = Tracker.nonreactive(function () {
				return Session.get('Tabular.LastSkip');
			});
		}

		if (!('order' in options)) {
			options.order = [];
		}

		// After the first time, we need to destroy before rebuilding.
		if (table) {
			var dt = $tableElement.DataTable();
			if (dt) {
				dt.destroy();
				$tableElement.empty();
			}
		}

		// We start with an empty table.
		// Data will be populated by ajax function now.
		table = $tableElement.DataTable(options);
	});

	template.autorun(function () {
		// Get table name non-reactively
		var tableName = Tracker.nonreactive(function () {
			return template.tabular.tableName.get();
		});
		// Get the collection that we're showing in the table non-reactively
		var collection = Tracker.nonreactive(function () {
			return template.tabular.collection.get();
		});

		// React when the requested list of records changes.
		// This can happen for various reasons.
		// * DataTables reran ajax due to sort changing.
		// * DataTables reran ajax due to page changing.
		// * DataTables reran ajax due to results-per-page changing.
		// * DataTables reran ajax due to search terms changing.
		// * `selector` attribute changed reactively
		// * Docs were added/changed/removed by this user or
		//   another user, causing visible result set to change.
		var tableInfo = Tabular.getRecord(tableName);

		if (!collection || !tableInfo) {
			return;
		}

		// Build options object to pass to `find`.
		// It's important that we use the same options
		// that were used in generating the list of `_id`s
		// on the server.
		var findOptions = {};
		var fields = template.tabular.fields;
		if (fields) {
			// Extend with extraFields from table definition
			if (typeof template.tabular.tableDef.extraFields === 'object') {
				_.extend(fields, template.tabular.tableDef.extraFields);
			}
			findOptions.fields = fields;
		}

		// Sort does not need to be reactive here; using
		// reactive sort would result in extra rerunning.
		var sort = Tracker.nonreactive(function () {
			return template.tabular.sort.get();
		});
		if (sort) {
			findOptions.sort = sort;
		}

		// console.log("tableInfo", tableInfo)

		// Get the updated list of docs we should be showing
		var cursor = collection.find({_id: {$in: tableInfo.ids}}, findOptions);

		// console.log('tableInfo, fields, sort, find autorun', cursor.count());

		// We're subscribing to the docs just in time, so there's
		// a good chance that they aren't all sent to the client yet.
		// We'll stop here if we didn't find all the docs we asked for.
		// This will rerun one or more times as the docs are received
		// from the server, and eventually we'll have them all.
		// Without this check in here, there's a lot of flashing in the
		// table as rows are added.
		if (cursor.count() < tableInfo.ids.length) {
			return;
		}

		// Get data as array for DataTables to consume in the ajax function
		template.tabular.data = cursor.fetch();

		// console.log("template.tabular.data", template.tabular.data)

		// For these types of reactive changes, we don't want to
		// reset the page we're on, so we pass `false` as second arg.
		// The exception is if we changed the results-per-page number,
		// in which cases `resetTablePaging` will be `true` and we will do so.
		if (table) {
			if (resetTablePaging) {
				// console.log("if ............")
				table.ajax.reload(null, true);
				resetTablePaging = false;
			} else {
				// console.log("else ............")
				table.ajax.reload(null, false);
			}
		}

		template.tabular.isLoading.set(false);
	});

	// XXX Not working
	template.autorun(function () {
		console.log("template.autorun=========");
		var tableName = template.tabular.tableName.get();
		var tableLength = template.tabular.limit.get();
		var tableInfo = Tabular.getRecord(tableName) || {};

		var isLoading = template.tabular.isLoading.get();
		//console.log('LOADING', isLoading);
		if (isLoading) {
			template.$('.dataTables_processing').show();
			template.$('.dataTable').hide();
			template.$('.dataTables_paginate').hide();
		} else {
			template.$('.dataTables_processing').hide();
			template.$('.dataTable').show();
			template.$('.dataTables_paginate').show();

			if (tableInfo.recordsTotal < 10) {
				$('div.dataTables_length').hide();
			} else {
				$('div.dataTables_length').show();
			}

			// console.log("tableInfo.recordsTotal / tableLength", tableInfo.recordsTotal / tableLength)
			if ((tableInfo.recordsTotal / tableLength) < 1) {
				template.$('div.dataTables_paginate').hide();
			} else {
				template.$('div.dataTables_paginate').show();
				if (table) {
					table.ajax.reload(null, false);
				}
			}


		}
	});

	template.autorun(function () {
		Session.set("TabularLoading", template.tabular.isLoading.get());
	});

	// force table paging to reset to first page when we change page length
	$tableElement.on('length.dt', function () {
		resetTablePaging = true;
	});
};

if (typeof Template.tabular.onRendered === 'function') {
	Template.tabular.onRendered(tabularOnRendered);
} else {
	Template.tabular.rendered = tabularOnRendered;
}

var tabularOnDestroyed = function () {
	// Clear last skip tracking
	Session.set('Tabular.LastSkip', 0);
	// Run a user-provided onUnload function
	if (this.tabular &&
		this.tabular.tableDef &&
		typeof this.tabular.tableDef.onUnload === 'function') {
		this.tabular.tableDef.onUnload();
	}
	Session.set("TabularLoading", false);
};

if (typeof Template.tabular.onDestroyed === 'function') {
	Template.tabular.onDestroyed(tabularOnDestroyed);
} else {
	Template.tabular.destroyed = tabularOnDestroyed;
}

//function setUpTestingAutoRunLogging(template) {
//  template.autorun(function () {
//    var val = template.tabular.tableName.get();
//    console.log('tableName changed', val);
//  });
//
//  template.autorun(function () {
//    var val = template.tabular.pubSelector.get();
//    console.log('pubSelector changed', val);
//  });
//
//  template.autorun(function () {
//    var val = template.tabular.sort.get();
//    console.log('sort changed', val);
//  });
//
//  template.autorun(function () {
//    var val = template.tabular.skip.get();
//    console.log('skip changed', val);
//  });
//
//  template.autorun(function () {
//    var val = template.tabular.limit.get();
//    console.log('limit changed', val);
//  });
//}
