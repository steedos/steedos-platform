import * as React from 'react';

export default (propsProxyFunction) => (WrappedComponent) => (
    class extends React.Component {
        render(){
            let props = propsProxyFunction(this.props);
            return <WrappedComponent {...props} />
        }
    }
)