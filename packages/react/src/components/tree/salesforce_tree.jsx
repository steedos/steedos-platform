import React from 'react';
// import IconSettings from '@steedos/design-system-react/components/icon-settings';
import {Tree, Search} from '@steedos/design-system-react';
// import Search from '@steedos/design-system-react/lib/components/forms/input/search.js';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import _ from 'underscore';
let Counter = styled.div`
	width: 100%;
`

const log = console.log

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
		getNodes: PropTypes.func,
		id: PropTypes.string,
		onClick: PropTypes.func,
		init: PropTypes.func,
		spaceId: PropTypes.string,
		keep: PropTypes.bool
    }

	componentDidMount() {
		if(this.props.init){
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
		rootNodes: this.props.rootNodes,
		nodes: this.props.nodes
	};

	// getNodes = (node) => {
	// 	return node.nodes ? node.nodes.map((id) => this.state.nodes[id]) : [];
	// }
	getNodes = (node)=>{
		if(!node.nodes){
			return []
		}
		let { nodes:stateNodes = {}} = this.props
		let nodes = [];
		let childrenNode;
		node.nodes.forEach((element) => {
			childrenNode = stateNodes[element];
			if(childrenNode){
				nodes.push(childrenNode)
			}
		});
		return nodes
	}
		

	// By default Tree can have multiple selected nodes and folders/branches can be selected. To disable either of these, you can use the following logic. However, `props` are immutable. The node passed in shouldn't be modified. Object and arrays are reference variables.
	handleExpandClick = (event, data) => {
		// log({
		// 	action: this.props.action,
		// 	customLog: this.props.log,
		// 	event,
		// 	eventName: 'Expand Branch',
		// 	data,
		// });
		const selected = data.select ? true : data.node.selected;
		let {nodes} = this.props
		Object.assign(nodes, {[data.node.id]: {
			...data.node,
			expanded: data.expand,
			selected,
		}})
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
		// log({
		// 	action: this.props.action,
		// 	customLog: this.props.log,
		// 	event,
		// 	eventName: 'Node Selected',
		// 	data,
		// });
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
			let {nodes} = this.props
			Object.assign(nodes, {[data.node.id]: { ...data.node, selected: data.select }})
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
		// log({
		// 	action: this.props.action,
		// 	event,
		// 	eventName: 'Tree scrolled',
		// 	data,
		// });
	};
	
	setTimeoutId= null

	searchString = (str, searchTermStr)=>{
		let logic = '&';
		if(searchTermStr.startsWith("| ")){
			logic = "|"
			searchTermStr = searchTermStr.replace("| ", "")
		};
		const strLowerCase = str.toLocaleLowerCase();
		let searchTermArray = _.compact(searchTermStr.split(' '));
		_.map(searchTermArray, function(searchTerm){
			return searchTerm.toLocaleLowerCase();
		})
		if(logic === '&'){
			return _.every(searchTermArray, function(searchTerm){
				return strLowerCase.indexOf(searchTerm) > -1
			})
		}else{
			return _.some(searchTermArray, function(searchTerm){
				return strLowerCase.indexOf(searchTerm) > -1
			})
		}
	}

	searchFunction = (searchTerm)=>{
		let { nodes:stateNodes = {}, changeNodes, id:treeId } = this.props
		let childrenNode;
		let changeNodesData = [];
		_.each(stateNodes, (node)=>{
			if(node.type != 'item' && node.nodes){
				let childrenNodes = node._cnodes || node.nodes
				let _nodes = node.nodes
				let childrenNodeData = null;
				childrenNodes.forEach((element) => {
					childrenNode = stateNodes[element];
					if(childrenNode){
						if(searchTerm && childrenNode.type === 'item'){
							let _cnodes = node._cnodes || node.nodes
							// console.log('node.label', childrenNode, childrenNode.label);
							if(childrenNode.label && _.isString(childrenNode.label) && this.searchString(childrenNode.label, searchTerm)){
								_nodes = _.union(_nodes, [childrenNode.id]);;
							}else if(childrenNode.assistiveText && _.isString(childrenNode.assistiveText) && this.searchString(childrenNode.assistiveText, searchTerm)){
								_nodes = _.union(_nodes, [childrenNode.id]);;
							}else{
								// console.log('node.nodes', node.nodes);
								_nodes = _.difference(_nodes, [childrenNode.id]);
							}
							// console.log('_nodes', _nodes);
							let expanded = node.expanded;
							if(_nodes.length > 0){
								expanded = true;
							}else{
								expanded = false;
							}
							childrenNodeData = {id: node.id, nodes: _nodes, _cnodes: _cnodes, label: node.label, expanded: expanded}
						}
					}
				});
				if(childrenNodeData){
					changeNodesData.push(childrenNodeData);
				}
			}

			if(!searchTerm){
				// console.log('unsearchTerm node._cnodes', node);
				if(node._cnodes){
					changeNodesData.push({id: node.id, nodes: node._cnodes, _cnodes: node._cnodes, label: node.label})
				}
			}
		});

		changeNodes({nodes: changeNodesData}, {id: treeId})
	}

	handleSearchChange = (event) => {
		this.setState({ searchTerm: event.target.value });
		let searchTerm = event.target.value || "";
		searchTerm = searchTerm.trim();
		// console.log('searchTerm', searchTerm);

		if(this.setTimeoutId != null){
			clearTimeout(this.setTimeoutId);
			this.setTimeoutId = null;
		}

		this.setTimeoutId = setTimeout(()=>{
			this.searchFunction(searchTerm)
		}, 300)
	};

	render() {
		const {assistiveText, searchable, className, getNodes, noHeading, id, listStyle, listClassName, rootNodes, searchTerm, onExpandClick, onClick, onScroll} = this.props;
		return (
			<Counter>
				{searchable ? (
				<div>
					<Search
						assistiveText={{ label: 'Search Tree' }}
						id="example-search"
						value={searchTerm}
						onChange={this.handleSearchChange}
					/>
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
					nodes={rootNodes}
					onExpandClick={onExpandClick || this.handleExpandClick}
					onClick={onClick || this.handleClick}
					onScroll={onScroll || this.handleScroll}
					// searchTerm={searchTerm || this.state.searchTerm}
				/>
			</Counter>
		);
	}
}

export default SFTree