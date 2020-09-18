/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const DISPLAY_NAME = 'ListItemWithContent';

const propsTypes = {
	/**
	 * **Assistive text for accessibility**
	 * * `unreadItem`: The unread indicator.
	 */
	assistiveText: PropTypes.shape({
		unreadItem: PropTypes.string,
	}),
	/**
	 * Item to be displayed
	 */
	item: PropTypes.object.isRequired,
	/**
	 * Allows multiple item to be selection
	 */
	multiple: PropTypes.bool,
	/**
	 * Shows the item as `focused`.
	 */
	isFocused: PropTypes.bool.isRequired,
	/**
	 * Shows the item as `selected`.
	 */
	isSelected: PropTypes.bool.isRequired,
	/**
	 * Shows the item as `unread`.
	 */
	isUnread: PropTypes.bool,
	/**
	 * **Event Callbacks**
	 * * `onClick`: Called when the item is clicked.
	 * * * Event
	 * * * Meta data
	 * * * * `item`: The original item.
	 * * * * `isSelected`: Is the item selected.
	 * * * * `isUnread`: Is the item unread.
	 */
	events: PropTypes.shape({
		onClick: PropTypes.func.isRequired,
	}),
	/**
	 * Reference to the list item component
	 */
	listItemRef: PropTypes.func,
	/**
	 * The list item href generate function
	 */
	listItemHref: PropTypes.func,
};

const defaultProps = {
	assistiveText: {
		unreadItem: 'Unread Item',
	},
	events: {},
};

/**
 * HOC that wraps the list item content with selection and unread functionality.
 * @param ListItemContent {node} A React component
 * @returns {ListItemWithContent} A React component
 */
const listItemWithContent = (ListItemContent) => {
	class ListItemWithContent extends React.Component {
		static displayName = `${DISPLAY_NAME}(${ListItemContent.displayName ||
			ListItemContent.name ||
			'Component'})`;

		static propTypes = propsTypes;

		static defaultProps = defaultProps;

		onClick(event) {
			this.props.events.onClick(event, {
				item: this.props.item,
				isSelected: this.props.isSelected,
				isUnread: this.props.isUnread,
			});
		}

		unread() {
			return this.props.isUnread ? (
				<abbr
					className="slds-indicator_unread"
					title={this.props.assistiveText.unreadItem}
					aria-label={this.props.assistiveText.unreadItem}
				>
					{/* eslint-disable-next-line react/jsx-curly-brace-presence */}
					<span className="slds-assistive-text">{'●'}</span>
				</abbr>
			) : null;
		}

		render() {
			return (
				<li
					className={classNames('slds-split-view__list-item', {
						'slds-is-unread': this.props.isUnread,
					})}
					role="presentation"
				>
					<a
						className="slds-split-view__list-item-action slds-grow slds-has-flexi-truncate"
						role="option"
						ref={this.props.listItemRef}
						aria-selected={
							this.props.multiple
								? !!this.props.isSelected
								: this.props.isSelected
						}
						tabIndex={this.props.isFocused ? 0 : -1}
						href={this.props.listItemHref ? this.props.listItemHref(this.props.item) : "javascript:void(0);"} // eslint-disable-line no-script-url
						onClick={(e) => this.onClick(e)}
					>
						{this.unread()}
						<ListItemContent {...this.props} />
					</a>
				</li>
			);
		}
	}

	return ListItemWithContent;
};

export default listItemWithContent;
