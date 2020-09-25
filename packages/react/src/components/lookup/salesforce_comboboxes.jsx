/* eslint-disable no-console, react/prop-types */
import React from 'react';
import { Combobox, Icon, comboboxFilterAndLimit} from '@steedos/design-system-react';
import _ from 'underscore'

const accounts = [
];

// const accountsWithIcon = accounts.map((elem) => ({
// 	...elem,
// 	...{
// 		icon: (
// 			<Icon
// 				assistiveText={{ label: 'Account' }}
// 				category="standard"
// 				name={elem.type}
// 			/>
// 		),
// 	},
// }));

/**
 *
 * TODO 
 * 	1 selection Icon 
 *  2 已选中项，文字不居中
 *  3 指定对象，选择对象下的数据
 *  4 支持filters
 * @class lookup
 * @extends {React.Component}
 */
class lookup extends React.Component {

	static defaultProps = {
		object: {},
		rows: [],
		multiple: false,
		variant: "base",
		optionsHiddenSelected: false,
		autoload: false
	};

	constructor(props) {
		super(props);
		this.state = {
			inputValue: props.search || '',
			selection: [
			],
		};
	}

	componentDidMount() {
		if(this.props.autoload && this.props.init && this.props.isOpen !== false){
			this.props.init(this.props)
		}
	}

	render() {
		let { id, className, selection, optionsHiddenSelected, column, placeholderReadOnly, label, onSearch, onRequestRemoveSelectedOption, selectionLabel, search, onChange, objectName, isOpen, rows, multiple, variant} = this.props
		let selections;
		if(selection){
			selections = [];
			_.forEach(selection, (item)=>{
				let label;
				if(selectionLabel){
					if(_.isFunction(selectionLabel)){
						label = selectionLabel(item)
					}else{
						label = item[selectionLabel]
					}
				}else{
					label = item['name']
				}

				// item.icon = (
				// 	<Icon
				// 		assistiveText={{ label: 'Account' }}
				// 		category="standard"
				// 		name="account"
				// 	/>
				// )

				selections.push(Object.assign({}, item, {label}))
			})
		}

		let options = [];
		let _rows = rows
		if(rows.length === 0 && column && column.rows ){
			_rows = column.rows
		}
		_.each( _rows, function(row){
			options.push({id: row._id || row.id, label: row.name})
		})

		return (
				<Combobox
					id={ id || "combobox-base"}
					className={className}
                    disabled={this.props.disabled}
                    isOpen={isOpen}
					events={{
						onChange: onChange || ((event, data) => {
								this.setState({
									inputValue: data.value
								});
								if(data.value=== '' && search){
									onSearch(event, data)
								}
							}
						),
						onRequestRemoveSelectedOption: onRequestRemoveSelectedOption || ((event, data) => {
							if (this.props.action) {
								this.props.action('onSelect')(
									event,
									...Object.keys(data).map((key) => data[key]),
									column
								);
							}
							this.setState({
								inputValue: '',
								selection: data.selection,
							});
						}),
						onSubmit: onSearch,
						onSelect: (event, data) => {
							if (this.props.action) {
								this.props.action('onSelect')(
									event,
									...Object.keys(data).map((key) => data[key]),
									column
								);
							} else if (console) {
								console.log('onSelect', event, data);
							}
							this.setState({
								inputValue: '',
								selection: data.selection,
							});
						},
					}}
					labels={{
						label: label,
						placeholder: `搜索`, //${object.label}
						placeholderReadOnly: placeholderReadOnly,
						multipleOptionsSelected:`已选中${this.state.selection.length}项`
					}}
					multiple = {multiple}
					options={comboboxFilterAndLimit({
						inputValue: this.state.inputValue,
						limit: 10000,
						options: options, //accountsWithIcon
						selection: !optionsHiddenSelected ? [] : this.state.selection,
					})}
					menuItemVisibleLength={10}
					selection={selections || this.state.selection}
					value={this.state.inputValue}
					variant={variant}
				/>
		);
	}
}

export default lookup