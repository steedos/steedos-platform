import React from 'react';
import Bootstrap from '../components/bootstrap'
import { Provider } from 'react-redux';
import store from '../stores/configureStore'
import styled from 'styled-components'

import Pullable from '../components/pullable'

export default {
	title: 'Pullable',
};


let ListContainer = styled.div`
	.pullable-container{
		background-color: #efeff4;
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			text-align: center;
	
			li {
				background-color: #fff;
				border-bottom: 1px solid #ccc;
				p {
					margin: 0;
					line-height: 3em;
				}
			}
		}
	}
`
class ExampleComponent extends React.Component {

	componentDidMount() {
		this.setState({
			loading: true,
			initializing: 1
		});
		setTimeout(() => {
			this.setState({
				listLen: 9,
				hasMore: 1,
				initializing: 2, // initialized
				loading: false
			});
		}, 2e3);
	}

	state = {
		canRefreshResolve: 1,
		listLen: 0,
		hasMore: 0,
		initializing: 1,
		refreshedAt: Date.now(),
		loading: true
	};

	refresh = (resolve, reject) => {
		this.setState({
			loading: true,
			initializing: 1
		});
		setTimeout(() => {
			const { canRefreshResolve } = this.state;
			if (!canRefreshResolve) reject();
			else {
				this.setState({
					listLen: 9,
					hasMore: 1,
					refreshedAt: Date.now(),
					loading: false
				});

				resolve();
			}
		}, 2e3);
	}

	loadMore = (resolve) => {
		this.setState({
			loading: true
		});
		setTimeout(() => {
			const { listLen } = this.state;
			const l = listLen + 9;

			this.setState({
				listLen: l,
				hasMore: l > 0 && l < 50,
				loading: false
			});

			resolve();
		}, 2e3);
	}


	toggleCanRefresh = () => {
		const { canRefreshResolve } = this.state;
		this.setState({ canRefreshResolve: !canRefreshResolve });
	}

	render() {
		const {
			listLen, hasMore, initializing, loading, refreshedAt, canRefreshResolve,
		} = this.state;
		const list = [];

		if (listLen) {
			for (let i = 0; i < listLen; i++) {
				list.push((
					<li key={i}>
						<p>{i}</p>
					</li>
				));
			}
		}
		return (
			<div>
				{(
					<Pullable
						onRefresh={this.refresh}
						onLoadMore={this.loadMore}
						hasMore={hasMore}
						initializing={initializing}
						loading={loading}
					>
						<ul>{list}</ul>
					</Pullable>
				)}
			</div>
		);
	}
}

export const base = () => (
	<ListContainer>
		<ExampleComponent />
	</ListContainer>
)
