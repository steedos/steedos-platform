import React from 'react';
import PropTypes from 'prop-types';
import { Illustration as SLDSIllustration } from '@steedos/design-system-react';
import classNames from 'classnames';
// import { ReactComponent as WalkthroughNotAvailable } from './walkthrough-not-available.svg';

class Illustration extends React.Component {
	static displayName = SLDSIllustration.displayName;

	render() {
		let {name, style, size, illustrationSvgName, heading, messageBody, className, illustrationSvg} = this.props;
		if(!name){
			name = illustrationSvgName;
		}
		const kababCaseName = name ? name.replace(/_| /g, '-').toLowerCase() : '';
		const styles = { ...style };
		let IllustrationSvg = null;
		if(illustrationSvg){
			IllustrationSvg = illustrationSvg;
			illustrationSvg = ( <IllustrationSvg name={kababCaseName} style={styles}/> );
		}
		else{
			// switch(illustrationSvgName){
			// 	case "walkthrough-not-available":
			// 		illustrationSvg = ( <WalkthroughNotAvailable name={kababCaseName} style={styles}/> );
			// 		break;
			// }
		}
		if(illustrationSvg){
			return (
				<div
					className={classNames(className, 'slds-illustration', {
						'slds-illustration_small': size === 'small',
						'slds-illustration_large': size === 'large',
					})}
				>
					{illustrationSvg}
					<div className="slds-text-longform">
						{heading ? (
							<h3 className="slds-text-heading_medium">{heading}</h3>
						) : null}
						{messageBody ? (
							<p className="slds-text-body_regular">{messageBody}</p>
						) : null}
					</div>
				</div>
			);
		}
		else{
			return <SLDSIllustration {...this.props} />;
		}
	}
}

Illustration.defaultProps = SLDSIllustration.defaultProps;
Illustration.propTypes = { ...SLDSIllustration.propTypes, illustrationSvgName: PropTypes.string, illustrationSvg: PropTypes.object };

export default Illustration;
