import * as React from 'react';
import { Modal, Button, Settings } from '@steedos/design-system-react';
import { Flows } from '../';
import styled from 'styled-components'
import PropTypes from 'prop-types';

let Counter = styled.div`
    &>.slds-modal__content{
        overflow: hidden;
    }
`

class SteedosModal extends React.Component {
    static defaultProps = {
        confirmLabel: "确定",
        size: "medium",
        isOpen: false
	};

    constructor(props) {
        super(props);
        let { appElement } = props
        Settings.setAppElement(appElement);
    }

    static propTypes = {
        onConfirm: PropTypes.func,
        confirmLabel: PropTypes.string,
        heading: PropTypes.any.isRequired,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        align: PropTypes.oneOf(['top', 'center']),
        isOpen: PropTypes.bool,
        appElement: PropTypes.string.isRequired,
        id: PropTypes.string
    }

    toggleOpen = () => {
        let { id, closeModal } = this.props
        closeModal(id);
    };

    confirmClick = ()=>{
        let { onConfirm } = this.props
        if(onConfirm){
            onConfirm();
        }
        this.toggleOpen();
    }
    
    render() {
        let { confirmLabel, size, heading, isOpen, id, align, footer, header, tagline} = this.props
        let _footer = [
            <Button label={confirmLabel} variant="brand" onClick={this.confirmClick} key="confirm"/>,
            <Button label="取消" onClick={this.toggleOpen} key="cancel"/>,
        ]

        if(footer === undefined){
            footer = _footer
        }

        return (
            <Counter>
                <Modal isOpen={isOpen} onRequestClose={this.toggleOpen} contentStyle={{overflow: 'hidden',userSelect: "none"}}
                footer={footer}
                heading={heading}
                size={size}
                id = {id}
                align={align}
                headerClassName={id}
                header={header}
                tagline={tagline}
                >
                    {this.props.children}
                </Modal>
            </Counter>
        )
    }
}
export default SteedosModal