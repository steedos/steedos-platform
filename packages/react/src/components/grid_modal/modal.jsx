import * as React from 'react';
import { Modal, Button, Settings } from '@steedos/design-system-react';
import { Grid } from '../';
import styled from 'styled-components'
import PropTypes from 'prop-types';

let Counter = styled.div`
    &>.slds-modal__content{
        overflow: hidden;
    }
`

class GridModal extends React.Component {
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
        heading: PropTypes.string.isRequired,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        isOpen: PropTypes.bool,
        appElement: PropTypes.string.isRequired,
        id: PropTypes.string,
        gridProp: PropTypes.any
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
        let { confirmLabel, size, heading, isOpen, id, gridProp } = this.props
        return (
            <Counter>
                <Modal isOpen={isOpen} onRequestClose={this.toggleOpen} contentStyle={{overflow: 'hidden'}}
                footer={[
                    <Button label={confirmLabel} variant="brand" onClick={this.confirmClick} key="confirm"/>,
                    <Button label="取消" onClick={this.toggleOpen} key="cancel"/>,
                ]}
                heading={heading}
                size={size}
                id = {id}
                >
                    <Grid {...gridProp}/>
                </Modal>
            </Counter>
        )
    }
}
export default GridModal