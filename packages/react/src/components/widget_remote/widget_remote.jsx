import * as React from 'react';
import PropTypes from 'prop-types';
import * as states from '../../selectors';
import store from "../../stores/configureStore";

class WidgetRemote extends React.Component {
    constructor(props) {
        super(props);
        const url = this.props.url;
        this.remoteComponentFetched = this.remoteComponentFetched.bind(this);
        this.remoteComponentFetchFaild = this.remoteComponentFetchFaild.bind(this);
        this.fetchRemoteComponent(url).then(this.remoteComponentFetched).catch(this.remoteComponentFetchFaild);
    };

    static propTypes = {
        url: PropTypes.string,
        renderFun: PropTypes.func
    };

    componentDidMount() {
    }

    static displayName = 'RemoteWidget';

    state = {
        renderFun: this.props.renderFun,
        errorMsg: this.props.string
    };

    async fetchRemoteComponent(url) {
        const response = await fetch(url);
        if (response.ok) return await response.text();
        throw new Error(response.statusText);
    }

    remoteComponentFetched(res) {
        this.setState({
            renderFun: eval(res)
        });
    }

    remoteComponentFetchFaild(res) {
        this.setState({
            errorMsg: res.message
        });
    }

    render() {
        let { renderFun, errorMsg } = this.state;
        if (!renderFun) {
            if (errorMsg) {
                return <div>加载远程组件失败：{errorMsg}</div>;
            }
            else {
                return <div>...</div>;
            }
        }
        return (
            <div>{renderFun(React, this.props, store.getState, states)}</div>
        );
    }
}

export default WidgetRemote;