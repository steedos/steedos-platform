/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@steedos/design-system-react';
import styled from 'styled-components';

export const DISPLAY_NAME = 'ListItemContent';

const propTypes = {
	/**
	 * **Item to be displayed**
	 * * `label`: The main label displayed on the top left.
	 * * `topRightText`: The text displayed on the top right.
	 * * `bottomLeftText`: The text displayed on the bottom left.
	 * * `bottomRightText`: The text displayed on the bottom right.
	 */
	item: PropTypes.shape({
		label: PropTypes.string,
		topRightText: PropTypes.string,
		bottomLeftText: PropTypes.string,
		bottomRightText: PropTypes.string,
		content: PropTypes.object,
		rows: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
			topRightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
		})),
		rowIcon: PropTypes.shape({
			width: PropTypes.string,
			category: PropTypes.string,
			name: PropTypes.string,
			size: PropTypes.string
		})
	})
};

const defaultProps = {};

const ListItemContainer = styled.div`
	display: flex;
	align-items: center;
	.slds-text-heading_small{
		flex: 1;
		width: 100%;
		&>.slds-grid{
			.list-item-left-label{
				flex: 1;
			}
			.list-item-right-text{
				margin-left: 1rem;
				max-width: 50%;
			}
		}
	}
`

const ListItemContent = ({ item }) => (
	<ListItemContainer key={item.key}>
		{item.rowIcon ? (
			<span className="list-item-left-icon">
				<Icon
					category={item.rowIcon.category ? item.rowIcon.category : "standard"}
					name={item.rowIcon.name}
					size={item.rowIcon.size}
				/>
			</span>
		) : null}
		<span 
			className={classNames(
				'slds-text-heading_small',
				item.rowIcon ? 'slds-m-left_medium' : null
			)}>
			{item.rows ? (item.rows.map((itemOption, index)=>(
				<div className="slds-grid slds-wrap" key={itemOption.key}>
					<span
						className={classNames(
							'slds-truncate list-item-left-label',
							index === 0 ? 'slds-text-body_regular slds-text-color_default' : null
						)}
						title={typeof itemOption.label.props.children === "string" ? itemOption.label.props.children : null}
					>
						{itemOption.label}
					</span>
					{itemOption.topRightText ? 
						(<span
							className="slds-truncate slds-col_bump-left list-item-right-text"
							title={typeof itemOption.topRightText.props.children === "string" ? itemOption.topRightText.props.children : null}
						>
							{itemOption.topRightText}
						</span>) : null}
				</div>
			))) : (
				<React.Fragment>
					<div className="slds-grid slds-wrap">
						<span
							className="slds-truncate slds-text-body_regular slds-text-color_default"
							title={item.label}
						>
							{item.label}
						</span>
						<span
							className="slds-truncate slds-col_bump-left"
							title={item.topRightText}
						>
							{item.topRightText}
						</span>
					</div>
					<div className="slds-grid slds-wrap">
						<span className="slds-truncate" title={item.bottomLeftText}>
							{item.bottomLeftText}
						</span>
						<span
							className="slds-truncate slds-col_bump-left"
							title={item.bottomLeftText}
						>
							{item.bottomRightText}
						</span>
					</div>
				</React.Fragment>
			)}
		</span>
	</ListItemContainer>
);

ListItemContent.displayName = DISPLAY_NAME;
ListItemContent.propTypes = propTypes;
ListItemContent.defaultProps = defaultProps;

export default ListItemContent;
