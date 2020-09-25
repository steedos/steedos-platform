/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import eventUtil from '../../utilities/event';

// import { SPLIT_VIEW_LISTBOX } from '../../utilities/constants';

import { Icon } from '@steedos/design-system-react';
import ListItemContent from './private/list-item-content';
import listItemWithContent from './private/list-item-with-content';

export const SORT_OPTIONS = Object.freeze({
	UP: 'up',
	DOWN: 'down',
});

const propTypes = {
	/**
	 * **Assistive text for accessibility**
	 * * `list`: aria label for the list
	 * * `sort`
	 *    * `sortedBy`: Clickable sort header for the list.
	 *    * `descending`: Descending sorting.
	 *    * `ascending`: Ascending sorting.
	 */
	assistiveText: PropTypes.shape({
		list: PropTypes.string,
		sort: PropTypes.shape({
			sortedBy: PropTypes.string,
			descending: PropTypes.string,
			ascending: PropTypes.string,
		}),
		unreadItem: PropTypes.string,
	}),
	/**
	 * CSS classes to be added to the parent `div` tag.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Event Callbacks
	 * * `onSelect`: Called when a list item is selected. Previously, this event was called when an item was focused. The UX pattern has changed and this event is now called on pressing enter or mouse click.
	 *    * event {object} List item click event
	 *    * Meta {object}
	 *       * selectedItems {array} List of selected items.
	 *       * item {object} Last selected item.
	 * * `onSort`: Called when the list is sorted.
	 *    * event {object} Sort click event
	 */
	events: PropTypes.shape({
		onSelect: PropTypes.func.isRequired,
		onSort: PropTypes.func,
	}),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 * **Text labels for internationalization**
	 * * `header`: This is the header of the list.
	 */
	labels: PropTypes.shape({
		header: PropTypes.string,
	}),
	/**
	 * The direction of the sort arrow. Option are:
	 * * SORT_OPTIONS.UP: `up`
	 * * SORT_OPTIONS.DOWN: `down`
	 */
	sortDirection: PropTypes.oneOf([SORT_OPTIONS.UP, SORT_OPTIONS.DOWN]),
	/**
	 * Allows multiple item to be selection
	 */
	multiple: PropTypes.bool,
	/**
	 * The list of items.
	 * It is recommended that you have a unique `id` for each item.
	 */
	options: PropTypes.array.isRequired,
	/**
	 * Accepts an array of item objects. For single selection, pass in an array of one object.
	 */
	selection: PropTypes.array,
	/**
	 * Accepts an array of item objects. For single unread, pass in an array of one object.
	 */
	unread: PropTypes.array,
	/**
	 * Custom list item template for the list item content. The select and unread functionality wraps the custom list item.
	 * This should be a React component that accepts props.
	 */
	listItem: PropTypes.func,
	/**
	 * The list item href generate function
	 */
	listItemHref: PropTypes.func
};

const defaultProps = {
	assistiveText: {
		list: 'Select an item to open it in a new workspace tab.',
		sort: {
			sortedBy: 'Sorted by',
			descending: 'Descending',
			ascending: 'Ascending',
		},
	},
	events: {},
	labels: {},
	selection: [],
	unread: [],
};

/**
 * The menu with the ARIA role of a listbox.
 */
class Listbox extends React.Component {
	static displayName = "LISTBOX";

	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		this.listItemComponents = {};

		this.state = {
			currentSelectedItem: null,
			currentFocusedListItem: {
				index: 0,
				item: null,
			},
		};

		// Generates the list item template
		this.ListItemWithContent = listItemWithContent(
			props.listItem || ListItemContent
		);
	}

	componentDidMount() {
		this.focusFirstItem();
	}

	isListItemFocused(item) {
		return this.state.currentFocusedListItem.item === item;
	}

	isSelected(item) {
		return this.props.selection.includes(item);
	}

	isUnread(item) {
		return this.props.unread.includes(item);
	}

	handleKeyDown(event) {
		// if (this.props.multiple && event.key === 'a' && event.ctrlKey) {
		// 	// select / deselect all
		// 	eventUtil.trap(event);
		// 	if (this.props.options === this.props.selection) {
		// 		this.deselectAllListItems(event);
		// 	} else {
		// 		this.selectAllListItems(event);
		// 	}
		// } else if (event.key === 'ArrowUp') {
		// 	eventUtil.trap(event);
		// 	this.moveToPreviousItem(event);
		// } else if (event.key === 'ArrowDown') {
		// 	eventUtil.trap(event);
		// 	this.moveToNextItem(event);
		// }
	}

	moveToNextItem(event) {
		const nextFocusIndex =
			this.state.currentFocusedListItem.index === this.props.options.length - 1
				? 0
				: this.state.currentFocusedListItem.index + 1;

		this.moveToIndex(event, nextFocusIndex);
	}

	moveToPreviousItem(event) {
		const previousFocusIndex =
			this.state.currentFocusedListItem.index === 0
				? this.props.options.length - 1
				: this.state.currentFocusedListItem.index - 1;

		this.moveToIndex(event, previousFocusIndex);
	}

	moveToIndex(event, index) {
		const item = this.props.options[index];

		this.focusItem(item);
	}

	focusFirstItem() {
		const firstSelectedItem =
			this.props.options.find((item) => this.props.selection.includes(item)) ||
			this.props.options[0];

		if (firstSelectedItem) {
			this.focusItem(firstSelectedItem, true);
		}
	}

	focusItem(item, setDataOnly) {
		const index = this.props.options.indexOf(item);

		if (!setDataOnly) {
			this.listItemComponents[index].focus();
		}

		this.setState({
			currentFocusedListItem: {
				index,
				item,
			},
		});
	}

	deselectAllListItems(event) {
		this.setState({ currentSelectedItem: null });
		this.props.events.onSelect(event, {
			selectedItems: [],
			item: null,
		});
	}

	selectAllListItems(event) {
		this.props.events.onSelect(event, {
			selectedItems: this.props.options,
			item: this.state.currentSelectedItem,
		});
	}

	selectListItem(item, event) {
		let selectedItems = [item];

		if (this.props.multiple) {
			if (event.metaKey) {
				selectedItems = this.props.selection.includes(item)
					? this.props.selection.filter((i) => i !== item)
					: [item, ...this.props.selection];
			} else if (event.shiftKey) {
				const [begin, end] = [
					this.props.options.indexOf(this.state.currentSelectedItem),
					this.props.options.indexOf(item),
				].sort();

				const addToSelection = this.props.options.slice(begin, end + 1);

				selectedItems = [
					...addToSelection,
					...this.props.selection.filter((i) => !addToSelection.includes(i)),
				];
			}
		}

		this.setState({ currentSelectedItem: item });

		this.props.events.onSelect(event, { selectedItems, item });
	}

	handleOnSelect(event, { item }) {
		this.selectListItem(item, event);
		this.focusItem(item);
	}

	sortDirection() {
		return this.props.sortDirection ? (
			<Icon
				category="utility"
				name={
					this.props.sortDirection === SORT_OPTIONS.DOWN
						? 'arrowdown'
						: 'arrowup'
				}
				size="xx-small"
				className="slds-align-top"
			/>
		) : null;
	}

	headerWrapper(children) {
		return this.props.events.onSort ? (
			<a
				aria-live="polite"
				style={{ borderTop: '0' }}
				href="javascript:void(0);" // eslint-disable-line no-script-url
				role="button"
				className="slds-split-view__list-header slds-grid slds-text-link_reset"
				onClick={this.props.events.onSort}
			>
				{children}
			</a>
		) : (
			<div
				style={{ borderTop: '0' }}
				className="slds-split-view__list-header slds-grid"
			>
				{children}
			</div>
		);
	}

	header() {
		return this.props.labels.header
			? this.headerWrapper(
					<span
						aria-sort={
							this.props.sortDirection === SORT_OPTIONS.DOWN
								? this.props.assistiveText.sort.descending
								: this.props.assistiveText.sort.ascending
						}
					>
						<span className="slds-assistive-text">
							{this.props.assistiveText.sort.sortedBy}
							{': '}
						</span>
						<span>
							{this.props.labels.header}
							{this.sortDirection()}
						</span>
						<span className="slds-assistive-text">
							{'- '}
							{this.props.sortDirection === SORT_OPTIONS.DOWN
								? this.props.assistiveText.sort.descending
								: this.props.assistiveText.sort.ascending}
						</span>
					</span>
				)
			: null;
	}

	addListItemComponent(component, index) {
		this.listItemComponents[index] = component;
	}

	listItems() {
		const { ListItemWithContent } = this;

		return this.props.options.map((item, index) => (
			<ListItemWithContent
				key={item.id || index}
				assistiveText={{
					unreadItem: this.props.assistiveText.unreadItem,
				}}
				listItemRef={(component) => {
					this.addListItemComponent(component, index);
				}}
				item={item}
				listItemHref={this.props.listItemHref}
				isFocused={this.isListItemFocused(item)}
				isSelected={this.isSelected(item)}
				isUnread={this.isUnread(item)}
				events={{
					onClick: (event, meta) => this.handleOnSelect(event, meta),
				}}
				multiple={this.props.multiple}
			/>
		));
	}

	render() {
		return (
			<div
				id={this.props.id}
				className={classNames(
					'slds-grid slds-grid_vertical slds-scrollable_none',
					this.props.className
				)}
			>
				{this.header()}
				<ul
					className="slds-scrollable_y"
					aria-label={this.props.assistiveText.list}
					aria-multiselectable={this.props.multiple}
					role="listbox"
					onKeyDown={(event) => this.handleKeyDown(event)}
				>
					{this.listItems()}
				</ul>
			</div>
		);
	}
}

export default Listbox;
