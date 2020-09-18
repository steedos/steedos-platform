import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore'
import { getRelativeUrl } from '../../utils';

class Bootstrap extends React.Component {

	getChildContext() {
        let iconPath = getRelativeUrl('/assets/icons');
        return {
			iconPath: iconPath,
		};
    }
    
    static defaultProps = {
    };

    static propTypes = {
    };

    componentDidMount() {
        const { loadBootstrap, isBootstrapLoaded, isRequestStarted } = this.props;
        if (!isBootstrapLoaded && !isRequestStarted && loadBootstrap) {
            loadBootstrap(this.props)
        }
    }

    state = {
        isBootstrapLoaded: false
    };

    render() {
        let { isBootstrapLoaded } = this.props;
        if (!isBootstrapLoaded){
            return null;
        }
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

Bootstrap.childContextTypes = {
	iconPath: PropTypes.string,
};

export default Bootstrap;