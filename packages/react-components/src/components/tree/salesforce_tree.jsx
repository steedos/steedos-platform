import React from 'react';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import Tree from '@salesforce/design-system-react/lib/components/tree/index.js';
import log from '@salesforce/design-system-react/lib/utilities/log.js';
import Search from '@salesforce/design-system-react/lib/components/forms/input/search.js';
import PropTypes from 'prop-types';

class SFTree extends React.Component {

	constructor(props) {
		super(props)
		if(!this.props.id){
			this.id = `${this.props.objectName}-tree`
		}
    }

	static defaultProps = {
		heading: 'Tree',
		noHeading: true,
		nodes: [],
		selectedNode: []
	};

	static propTypes = {
		objectName: PropTypes.string.isRequired,
		rootNodes: PropTypes.array.isRequired,
		$select: PropTypes.array.isRequired,
		getNodes: PropTypes.func.isRequired,
		id: PropTypes.string,
		onClickFunc: PropTypes.func.isRequired
    }

	componentDidMount() {
		if(this.props.init){
			this.props.init(this.props)
		}
    }

	state = {
		rootNodes: this.props.rootNodes,
		nodes: this.props.nodes,
		searchTerm: this.props.searchable ? 'fruit' : undefined,
	};

	getNodes = (node) => {
		return node.nodes ? node.nodes.map((id) => this.state.nodes[id]) : [];
	}
		

	// By default Tree can have multiple selected nodes and folders/branches can be selected. To disable either of these, you can use the following logic. However, `props` are immutable. The node passed in shouldn't be modified. Object and arrays are reference variables.
	handleExpandClick = (event, data) => {
		log({
			action: this.props.action,
			customLog: this.props.log,
			event,
			eventName: 'Expand Branch',
			data,
		});
		const selected = data.select ? true : data.node.selected;
		this.setState((prevState) => ({
			...prevState,
			nodes: {
				...prevState.nodes,
				...{
					[data.node.id]: {
						...data.node,
						expanded: data.expand,
						selected,
					},
				},
			},
		}));
	};

	handleClick = (event, data) => {
		log({
			action: this.props.action,
			customLog: this.props.log,
			event,
			eventName: 'Node Selected',
			data,
		});
		if (this.props.multipleSelection) {
			if (
				!this.props.noBranchSelection ||
				(this.props.noBranchSelection && data.node.type !== 'branch')
			) {
				// Take the previous state, expand it, overwrite the `nodes` key with the previous state's `nodes` key expanded with the id of the node just clicked selected
				this.setState((prevState) => ({
					...prevState,
					nodes: {
						...prevState.nodes,
						...{
							[data.node.id]: { ...data.node, selected: data.select },
						},
					},
				}));
			}
		} else if (this.props.noBranchSelection && data.node.type === 'branch') {
			// OPEN BRANCH/FOLDER WHEN CLICKED
			// Although not codified in SLDS, this takes the click callback and turns it into the expand callback, and should be used for item only selection.
			this.setState((prevState) => ({
				...prevState,
				nodes: {
					...prevState.nodes,
					...{
						[data.node.id]: { ...data.node, expanded: !data.node.expanded },
					},
				},
			}));
		} else {
			// SINGLE SELECTION
			// Take the previous state, expand it, overwrite the `nodes` key with the previous state's `nodes` key expanded with the id of the node just clicked selected and the previously selected node unselected.
			this.setState((prevState) => {
				// Gaurd against no selection with the following. `selectedNode`
				// is the previously selected "current state" that is about to
				// be updated
				const selectedNode = prevState.selectedNode
					? {
							[prevState.selectedNode.id]: {
								...prevState.nodes[prevState.selectedNode.id],
								selected: false,
							},
						}
					: {};
				return {
					...prevState,
					nodes: {
						...prevState.nodes,
						...{
							[data.node.id]: { ...data.node, selected: data.select },
							...selectedNode,
						},
					},
					selectedNode: data.node,
				};
			});
		}
	};

	handleScroll = (event, data) => {
		log({
			action: this.props.action,
			event,
			eventName: 'Tree scrolled',
			data,
		});
	};

	handleSearchChange = (event) => {
		this.setState({ searchTerm: event.target.value });
	};

	render() {
		const {assistiveText, className, getNodes, noHeading, id, listStyle, listClassName, rootNodes, searchTerm, onExpandClick, onClick, onScroll} = this.props;
		return (
			<IconSettings iconPath="/icons">
				<div style={{width: 400}}>
					{this.props.searchable ? (
						<div>
							<Search
								assistiveText={{ label: 'Search Tree' }}
								id="example-search"
								value={this.state.searchTerm}
								onChange={this.handleSearchChange}
							/>
							<br />
						</div>
					) : null}
					<Tree
						assistiveText={assistiveText}
						className={className}
						getNodes={getNodes || this.getNodes}
						heading={!noHeading && this.props.heading}
						id={id || this.id}
						listStyle={listStyle}
						listClassName={listClassName}
						// nodes={this.state.nodes["0"].nodes}
						nodes={rootNodes}
						onExpandClick={onExpandClick || this.handleExpandClick}
						onClick={onClick || this.handleClick}
						onScroll={onScroll || this.handleScroll}
						searchTerm={searchTerm || this.state.searchTerm}
					/>
				</div>
			</IconSettings>
		);
	}
}

export default SFTree