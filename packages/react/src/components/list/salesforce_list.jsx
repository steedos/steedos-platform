import React from 'react';
import _ from 'underscore';
import { DataTableColumn, DataTableCell, Illustration, Icon, Button } from '@steedos/design-system-react';
import Lookup from '../lookup'
import { createGridAction } from '../../actions'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import classNames from 'classnames';
import { getRelativeUrl, getObjectRecordUrl, getObjectUrl } from '../../utils';
import Listbox from './listbox'
import Pullable from '../pullable';
import FieldLabel from '../field_label';

let ListContainer = styled.div`
	position: relative;
	height: 100%;
	.slds-split-view__list-item-action{
		padding: 0.6rem 1rem;
		.slds-text-heading_small{
			.slds-grid{
				color: #777;
				margin-bottom: 0.35rem;
				&:first-child{
					color: #080707;
					.list-item-left-label{
						font-weight: bold;
					}
				}
				&:last-child{
					margin-bottom: 0;
				}
				.slds-text-body_regular{
					font-size: unset;
				}
			}
		}
	}
	&.list-filtering{
		.list-filtering-bar{
			height: 2.5rem;
			line-height: 2.5rem;
			padding: 0 1rem;
			border-bottom: solid 1px #ddd;
			.slds-truncate{
				font-size: 1rem;
				color: #666;
			}
			.slds-button{
				float: right;
				height: 2.5rem;
				line-height: 2.5rem;
				padding: 0 0.5rem;
				margin-right: -0.5rem;
				.slds-button__icon{
					width: 1.25rem;
					height: 1.25rem;
				}
			}
		}
		.pullable-container{
			margin-top: 2.5rem;
			padding-bottom: 2.5rem;
		}
	}
	&.slds-grid-no-header{
		.slds-table thead{
			display: none;
		}
	}
	&>.slds-grid_vertical{
		/*fix IE11 宽度在门户界面会跳出widget范围*/
		width: 100%;
		/*fix IE11 grid列表顶部th列标题栏文字高度没有居中对齐*/
		.slds-table_header-fixed{
			.slds-cell-fixed{
				.slds-p-horizontal_x-small{
					line-height: 2rem!important
				}
			}
		}
	}
	.slds-illustration.slds-illustration_small .slds-illustration__svg {
		/*fix IE11 高度未定义会造成footer有内容时底部界面错乱*/
		height: 10rem;
	}
	.steedos-list-footer{
		display: flex;
		justify-content: flex-end;
		padding: 0.35rem 1rem 0.35rem 1rem;
	}
`

class List extends React.Component {
	static displayName = 'SteedosDataList';
	static defaultProps = {
		rows: [],
		rowIconKey: "",
		selection: [],
		showIllustration: true
	};

	static propTypes = {
		objectName: PropTypes.string.isRequired,
		columns: PropTypes.arrayOf(PropTypes.shape({
			field: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			hidden: PropTypes.bool,
			type: PropTypes.oneOf(['date', 'datetime', 'boolean', 'lookup', 'master_detail', 
				'text', 'select', 'number', 'currency', 'autonumber', 'filesize', 'file',
				'grid', 'location', 'image', 'avatar', 'code', 'password', 'url', 'email', 'textarea', 'html', 'markdown'
			]),
			options: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
			allOptions: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
			reference_to: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
			optionsFunction: PropTypes.func,
			scale: PropTypes.number,
			is_wide: PropTypes.bool,
			format: PropTypes.func
		})).isRequired,
		pageSize: PropTypes.number,
		sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
		rowIcon: PropTypes.shape({
			width: PropTypes.string,
			category: PropTypes.string,
			name: PropTypes.string,
			size: PropTypes.string
		}),
		rowIconKey: PropTypes.string,
		showIllustration: PropTypes.bool,
		illustration: PropTypes.shape({
			heading: PropTypes.string,
			messageBody: PropTypes.string,
			name: PropTypes.string,
			path: PropTypes.string
		}),
		/**
		 * Custom list item template for the list item content. The select and unread functionality wraps the custom list item.
		 * This should be a React component that accepts props.
		 */
		listItem: PropTypes.func,
		/**
		 * The list item href generate function
		 */
		listItemHref: PropTypes.func,
		/**
		 * Whether to show the more link on footer
		 */
		showMoreLink: PropTypes.bool,
		/**
		 * The more link href generate function
		 */
		moreLinkHref: PropTypes.func,
		/**
		 * The reset function for filtering state
		 */
		resetFiltering: PropTypes.func
	}

	componentDidMount() {
		if (this.props.init) {
			this.props.init(this.props)
		}
	}

	componentWillUnmount(){
		let {keep, removeViewAction, id} = this.props
		if(!keep){
			removeViewAction(id)
		}
	}

	state = {
		items: this.props.rows,
		selection: this.props.selection
	};

	isEnableSearch = ()=>{
		let { enableSearch } = this.props
		return enableSearch || false
	}

	getObjectName = ()=>{
		let { objectName } = this.props
		return objectName
	}

	handleChanged = (event, data) => {
		this.setState({ selection: data.selection });
		console.log(event, data);
	};

	getDataTableEmpty(isEmpty){
		if (!isEmpty){
			return React.Fragment;
		}
		let showIllustration = this.props.showIllustration;
		if (!showIllustration){
			return React.Fragment;
		}
		let illustration = this.props.illustration;
		if (!illustration) {
			illustration = {};
		}
		if (!illustration.messageBody) {
			illustration.messageBody = "没有可显示的项目";
		}
		if (!illustration.path) {
			illustration.path = getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
		}
		return () => {
			return (
				<Illustration
					heading={illustration.heading}
					messageBody={illustration.messageBody}
					name={illustration.name}
					path={illustration.path}
				/>
			);
		};
	}

	getListOptions(items, columns, rowIcon, rowIconKey){
		let results = items.map((item)=>{
			let itemRows = [], itemTag = 0, itemOption = {}, fieldNode, fieldValue;
			columns.forEach((column)=>{
				if(column.hidden){
					return;
				}
				// 调用_.reduce函数是因为column.field可能是a.b这种格式，比如cfs_files_filerecord对象的original.name
				fieldValue = _.reduce(column.field.split("."), function(value, key) {
					return value[key];
				}, item);
				fieldNode = (<FieldLabel field={column} options={this.props} doc={item}>{fieldValue}</FieldLabel>);
				if(column.is_wide){
					if(itemTag !== 0){
						itemRows.push(itemOption);
					}
					itemOption = {key: `${item._id}_${itemRows.length}_wide`};
					itemOption.label = fieldNode;
					itemTag = 0;
					itemRows.push(itemOption);
				}
				else{
					if(itemTag === 0){
						itemOption = {key: `${item._id}_${itemRows.length}`};
						itemOption.label = fieldNode;
						itemTag++;
					}
					else{
						itemOption.topRightText = fieldNode;
						itemTag = 0;
						itemRows.push(itemOption);
					}
				}
			});
			if(itemTag !== 0){
				itemRows.push(itemOption);
			}
			if(rowIconKey){
				rowIcon = item[rowIconKey];
				if(typeof rowIcon === "string"){
					rowIcon = {
						category: "standard",
						name: rowIcon
					};
				}
			}
			return {
				key: item._id,
				rows: itemRows,
				rowIcon: rowIcon,
				content: item
			}
		});
		return results;
	}

	render() {
		const { rows, handleChanged, selection, selectionLabel, selectRows, objectName, 
			search, columns, id, noHeader, unborderedRow, sort, rowIcon, rowIconKey, 
			pager, handlePageChanged, handleLoadMore, totalCount, pageSize, currentPage, 
			showMoreLink, filteringText, resetFiltering } = this.props;
		const isLoading = this.props.loading;
		const items = rows;
		if(!currentPage){
			// 每次currentPage为0或undefined时，清空滚动条数据
			this.state.items = [];
		}
		let listOptions = this.state.items;
		if(!isLoading && items.length){
			const currentPageListOptions = this.getListOptions(items, columns, rowIcon, rowIconKey);
			listOptions = _.union(this.state.items, currentPageListOptions);
			this.state.items = listOptions;
		}
		const isEmpty = isLoading ? false : items.length === 0;
		let DataTableEmpty = this.getDataTableEmpty(isEmpty);

		let listItemHref = this.props.listItemHref ? this.props.listItemHref : (item) => {
			return getObjectRecordUrl(this.props.objectName, item.content._id)
		}
		
		let moreLinkHref = this.props.moreLinkHref ? this.props.moreLinkHref : (props) => {
			return getObjectUrl(props.objectName)
		}

		let pagerTotal = Math.ceil(totalCount / pageSize);
		let hasMore = (currentPage ? currentPage : 0) < pagerTotal - 1;

		let onLoadMore = ()=>{
			this.props.handleLoadMore((currentPage ? currentPage : 0) + 1);
		}

		let onRefresh = ()=>{
			this.state.items = [];
			this.props.handleRefresh((currentPage ? currentPage : 0) + 1);
		}

		let onResetFiltering = ()=>{
			if(typeof resetFiltering === "function"){
				resetFiltering();
			}
			this.props.handleResetFiltering();
		}

		let footer;
		if (showMoreLink && !pager && hasMore) {
			footer = (
				<div className="steedos-list-footer">
					<a href={moreLinkHref(this.props)}>
						更多
					</a>
				</div>
			)
		}

		let ListContent = ()=>(
			<React.Fragment>
				<Listbox
					key="2"
					options={listOptions}
					events={{
						// onSort: this.sortList,
						onSelect: (event, { selectedItems, item }) => {
							// this.setState({
							// 	unread: this.state.unread.filter((i) => i !== item),
							// 	selected: selectedItems,
							// });
						},
					}}
					// selection={this.state.selected}
					// unread={this.state.unread}
					listItem={this.props.listItem}
					listItemHref={listItemHref}
				/>
				{(footer ? footer : null)}
			</React.Fragment>);

		let FilteringBar = ()=>(
			<div className="list-filtering-bar">
				<span className="slds-truncate">{filteringText}</span>
				<Button
					assistiveText={{ icon: 'Icon Bare Small' }}
					iconCategory="utility"
					iconName="clear"
					iconSize="large"
					iconVariant="bare"
					onClick={() => {
						onResetFiltering();
					}}
					variant="icon"
				/>
			</div>
		);

		return (
			<ListContainer
				className={classNames(
					'steedos-list slds-nowrap',
					filteringText ? 'list-filtering' : null
				)}
			>
				{
					filteringText ? 
					<FilteringBar /> :
					null
				}
				{
					(
						isEmpty ? (
							<DataTableEmpty />
						) : (
							pager ? (
								<Pullable
									onRefresh={onRefresh}
									onLoadMore={onLoadMore}
									hasMore={hasMore}
									loading={isLoading}
								>
									<ListContent />
								</Pullable>
							) : (
								<ListContent />
							)
						)
					)
				}
			</ListContainer>
		);
	}
}

export default List
