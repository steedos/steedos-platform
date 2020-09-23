/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

// # App Launcher Tile Component

// ## Dependencies

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// This component's `checkProps` which issues warnings to developers about properties when in development mode (similar to React's built in development tools)
// import checkProps from './check-props';
// import checkProps from '@steedos/design-system-react/components/app-launcher/check-props';
// import componentDoc from './component.json';
// import componentDoc from '@steedos/design-system-react/components/app-launcher/component.json';

// ## Children
// import Button from '../button';
import { Button } from '@steedos/design-system-react';
// import Highlighter from '../slds_utilities/highlighter';
import Highlighter from '@steedos/design-system-react/components/utilities/highlighter';
// import Tooltip from '../tooltip';
import { Tooltip } from '@steedos/design-system-react';
// import Truncate from '../slds_utilities/truncate';
import Truncate from '@steedos/design-system-react/components/utilities/truncate';

// import { APP_LAUNCHER_TILE } from '../../utilities/constants';
import { APP_LAUNCHER_TILE } from '@steedos/design-system-react/utilities/constants';

const propTypes = {
	/**
	 * **Assistive text for accessibility.**
	 * * `dragIconText`: Text that describes the purpose of the drag handle icon.
	 */
	assistiveText: PropTypes.shape({
		dragIconText: PropTypes.string,
	}),
	/**
	 * Class names to be added to the tile.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * The description of the app. Not visible on small tiles.
	 */
	description: PropTypes.string,
	/**
	 * Heading for app description. NOTE: this prop is DEPRECATED and use should be avoided
	 */
	descriptionHeading: PropTypes.string,
	/**
	 * The `href` attribute of the tile. Please pass in bookmarkable URLs from your routing library. If the `onClick` callback is specified this URL will be prevented from changing the browser's location.
	 */
	href: PropTypes.string,
	/**
	 * Background color to be used on the icon. Only applied if iconNode is undefined
	 */
	iconBackgroundColor: PropTypes.string,
	/**
	 * Icon node for app tile. Takes priority over `iconText`
	 */
	iconNode: PropTypes.node,
	/**
	 * Text to be used as an icon. Only renders if iconNode is undefined
	 */
	iconText: PropTypes.string,
	/**
	 * Open the More Tooltip
	 */
	isOpenTooltip: PropTypes.bool,
	/**
	 * The localized text for the "More information" tooltip.
	 */
	moreLabel: PropTypes.string,
	/**
	 * Function that will be executed when clicking on a tile
	 */
	onClick: PropTypes.func,
	/**
	 * Text used to highlight content in app tiles
	 */
	search: PropTypes.string,
	/**
	 * App name for the tile's title.
	 */
	title: PropTypes.string.isRequired,
	/**
	 * target attr of link tag <a target="_blank">...</a>
	 */
	target: PropTypes.string,
	/**
	 * is the tile draggable
	 */
	isDraggable: PropTypes.bool,

	// Future feature: add Highlighter to Truncate text (https://github.com/ShinyChang/React-Text-Truncate/issues/32)
};

const defaultProps = {
	assistiveText: {
		dragIconText: 'Reorder',
	},
	href: 'javascript:void(0);', // eslint-disable-line no-script-url
	moreLabel: ' More',
	isDraggable: true
};

/**
 * App Launcher Tiles provide information and links to a user's apps
 */
class AppLauncherTile extends React.Component {
	constructor(props) {
		super(props);

		// `checkProps` issues warnings to developers about properties (similar to React's built in development tools)
		// checkProps(APP_LAUNCHER_TILE, props, componentDoc);
	}

	handleClick = (event) => {
		if (this.props.onClick) {
			// event.preventDefault();//preventDefault功能可以放在click脚本中，不需要默认执行
			this.props.onClick(event, { href: this.props.href });
		}
	};

	componentDidMount() {
		this.tileLink.addEventListener("click", this.handleClick);
	}
	
	componentWillUnmount() {
		this.tileLink.removeEventListener("click", this.handleClick);
	}

	render() {
		const dragButtonAriaProps = { 'aria-pressed': false };
		const iconStyles = {};

		if (this.props.iconBackgroundColor) {
			iconStyles.backgroundColor = this.props.iconBackgroundColor;
		}

		return (
			<a
				className={classNames(
					`slds-app-launcher__tile slds-text-link_reset ${this.props.isDraggable ? 'slds-is-draggable' : ''}`, // NOTE: while the draggable class is here for stylistic purposes, the draggable attribute is not present as draggability has not been implemented yet
					this.props.className
				)}
				// onClick={this.handleClick} //creator中a链接带href时可能不会触发onClick事件，只能用removeEventListener原生事件绑定来处理
				role="button"
				tabIndex="0"
				href={this.props.href}
				target={this.props.target}
				ref={elem => this.tileLink = elem}
			>
				<div className="slds-app-launcher__tile-figure">
					{this.props.iconNode || (
						<span className="slds-avatar slds-avatar_large">
							<abbr
								className="slds-avatar__initials slds-icon-custom-27"
								style={iconStyles}
								title={this.props.title}
							>
								{this.props.iconText}
							</abbr>
						</span>
					)}
					{this.props.isDraggable ? (
						<div className="slds-m-top_xxx-small">
							<Button
								assistiveText={{
									icon: this.props.assistiveText.dragIconText,
								}}
								iconCategory="utility"
								iconName="rows"
								title={this.props.assistiveText.dragIconText}
								variant="icon"
								{...dragButtonAriaProps}
							/>
						</div>
					) : null}
				</div>
				<div className="slds-app-launcher__tile-body">
					<span className="slds-link">
						<Highlighter search={this.props.search}>
							{this.props.title}
						</Highlighter>
					</span>
					<Truncate
						line={2}
						prefix={
							this.props.descriptionHeading &&
							this.props.descriptionHeading.toUpperCase()
						}
						suffix={this.props.moreLabel}
						text={this.props.description}
						textTruncateChild={
							<Tooltip
								align="bottom"
								content={
									<Highlighter search={this.props.search}>
										{this.props.description}
									</Highlighter>
								}
								isOpen={this.props.isOpenTooltip}
							>
								<Button
									className="slds-button_reset slds-text-link"
									variant="base"
								>
									{this.props.moreLabel}
								</Button>
							</Tooltip>
						}
						wrapper={(text, textTruncateChild) => (
							<React.Fragment>
								{this.props.descriptionHeading && (
									// inline style override
									<div
										className="slds-text-heading_label"
										style={{ letterSpacing: '0.025rem' }}
									>
										{this.props.descriptionHeading}{' '}
									</div>
								)}
								<Highlighter search={this.props.search}>{text}</Highlighter>
								{textTruncateChild && ' '}
								{textTruncateChild}
							</React.Fragment>
						)}
					/>
				</div>
			</a>
		);
	}
}

AppLauncherTile.displayName = APP_LAUNCHER_TILE;
AppLauncherTile.defaultProps = defaultProps;
AppLauncherTile.propTypes = propTypes;

export default AppLauncherTile;
