import React from 'react';
import { GlobalHeaderFavorites, Popover, MediaObject, Icon} from '@steedos/design-system-react';
import PropTypes from 'prop-types';
import { getObject } from '../../selectors'
import { store } from '../../stores'

const getRecordIcon = (record) => {
    let icon = null;
    if(record.object_name){
        const object = getObject(store.getState(),record.object_name)
        if(object){
            const objectIcon = object.icon;
            let category = 'standard'
            let name = objectIcon;
            let title = record.name || ''

            let foo = name != null ? name.split(".") : void 0;
            if (foo && foo.length > 1) {
                category = foo[0];
                name = foo[1];
            }

            icon = (
                <Icon
                    category={category}
                    name={name}
                    title={title}
                    className='slds-icon--small'
                />
            );
        }
    }
	return icon;
};

const getRecordBody = (record) => {
    let body = null 
    if(record.object_name){
        const object = getObject(store.getState(), record.object_name)
        if(object){
            body = (<div id={record._id}>
                <span className="slds-listbox__option-text slds-listbox__option-text_entity">{record.name}</span>
                <span className="slds-listbox__option-meta slds-text-body--small slds-listbox__option-meta_entity">{object.label}</span>
            </div>)
        }
    }
    return body;
}

const onClick = (record, recordOnClick)=>{
    if(recordOnClick){
        //此处连续调用2次click用于解决IOS设备上，点击关注记录后，popover不关闭问题。
        window.$(".slds-button_icon", window.$('#header-favorites-popover-id-popover')).trigger('click');
        window.$(".slds-button_icon", window.$('#header-favorites-popover-id-popover')).trigger('click');
        recordOnClick(record);
    }
}

const getBody = (records, recordOnClick)=>{
    if(records){
        return (<div id='favoritesContent' className='slds-listbox_vertical'>
                    {records.map((record, index) => (
                        <div className='slds-listbox__option' onClick={()=>{onClick(record, recordOnClick)}} key={record._id}>
                            <MediaObject className='slds-listbox__option_entity'
                            body={getRecordBody(record)}
                            figure={getRecordIcon(record)}
                            verticalCenter
                            />
                        </div>
                        
                    ))}
                </div>)
     }else{
         return ''
     }
}

class favorites extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            favoritesActionSelected: false
		};
    }

    static defaultProps = {
        title: "我的收藏夹",
        assistiveText: {
            editFavorites: "编辑收藏夹"
        }
    };

    static propTypes = {
        title: PropTypes.string,
        objectName: PropTypes.string.isRequired,
        recordOnClick: PropTypes.func.isRequired,
        editOnClick: PropTypes.func.isRequired,
        onToggleActionSelected: PropTypes.func.isRequired,
        assistiveText: PropTypes.shape({
            editFavorites: PropTypes.string
        })
    }
    
    componentDidMount() {
		if (this.props.init) {
			this.props.init(this.props)
		}
	}

	render() {
        const { title, records, onToggleActionSelected, actionSelected, actionDisabled, recordOnClick, assistiveText, editOnClick} = this.props
		return (
            <GlobalHeaderFavorites
            actionSelected={actionSelected}
            actionDisabled={actionDisabled}
            assistiveText={assistiveText}
            onToggleActionSelected={onToggleActionSelected}
            popover={
                <Popover
                    ariaLabelledby="favorites-heading"
                    body={getBody(records, recordOnClick)}
                    classNameBody='slds-p-around_none'
                    align='bottom right'
                    footer={
                        <div className="slds-media slds-media--center slds-p-left--none">
                            <a className="footerAction slds-grow" href="javacript:void(0);" onClick={()=>{editOnClick()}}>
                                <div className="slds-media slds-media--center slds-p-left--medium">
                                    <div className="slds-icon--x-small slds-icon_container slds-media__figure">
                                    <Icon
                                        category="utility"
                                        name="edit"
                                        size="x-small"
                                        style={{fill:'currentColor'}}
                                    />
                        </div><div className="slds-media__body slds-m-left--none">{assistiveText.editFavorites}</div></div></a></div>
                    }
                    heading={title}
                    id="header-favorites-popover-id"
                />
            }
            />
		);
	}
}

export default favorites