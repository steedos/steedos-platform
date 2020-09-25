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

class FlowsModal extends React.Component {
    static defaultProps = {
        confirmLabel: "确定",
        size: "medium",
        heading: "选择模板流程",
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
        heading: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        isOpen: PropTypes.bool,
        appElement: PropTypes.string.isRequired,
        id: PropTypes.string,
        treeId: PropTypes.string,
        gridId: PropTypes.string,
        multiple: PropTypes.bool,
        spaceId: PropTypes.string,
        gridProp: PropTypes.any,
        treeProp: PropTypes.any
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
        let { confirmLabel, size, heading, isOpen, id, treeId, gridId, multiple, spaceId, gridProp, treeProp, disabledSelectRows} = this.props
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
                    <Flows searchMode="omitFilters" treeId={treeId} gridId={gridId} multiple={multiple} disabledSelectRows={disabledSelectRows} spaceId={spaceId} gridProp={gridProp} treeProp={treeProp}/>
                </Modal>
            </Counter>
        )
    }
}
export default FlowsModal