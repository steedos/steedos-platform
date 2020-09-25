import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'underscore';
import moment from 'moment';
import { GlobalHeaderNotifications, Popover, Button, Icon } from '@steedos/design-system-react';
import { getAbsoluteUrl, getRelativeUrl, getUserId, getAuthToken, getSpaceId } from '../../utils';

const Container = styled.div`
    &.loading{
        .slds-button_icon-container{
            display: none;
        }
    }
    .slds-popover__body{
        max-height: 420px;
        overflow-y: auto;
    }
    .slds-popover{
        .slds-popover__body{
            padding: 0;
            width: 100%;
        }
    }
    @media (max-width: 767px) {
        .slds-notification-badge{
            top: 6px;
            right: 6px;
        }
        .slds-global-actions__notifications{
            width: 2.75rem!important;
            height: 2.75rem!important;
        }
    }
`;

const LoadingContainer = styled.div`
    text-align: center;
`;

const EmptyContainer = styled.div`
    text-align: center;
    padding: .5rem .75rem;
`;

const ContentContainer = styled.div`
    .slds-avatar img{
        width: 100%;
        height: 100%;
    }
`;

const LoadingIcon = (props) => (
    <Icon
        containerStyle={{ backgroundColor: 'transparent' }}
        style={{ fill: '#000' }}
        category="standard"
        colorVariant="base"
        name="generic_loading"
    /> 
);

const HeaderNotificationsCustomHeading = (props) => (
    <div>
        <span>{props.title}</span>
        {
            props.isUnreadEmpty ? 
            null :
            <Button
                label={props.assistiveText.markAllAsRead}
                onClick={props.onMarkReadAll}
                variant="link"
                style={{
                    float: "right",
                    fontSize: "0.9rem",
                    marginTop: "0.12rem",
                    outline: "none"
                }}
                iconCategory="standard"
                iconName={props.isMethodLoading ? "generic_loading": ""}
                iconSize="large"
            />
        }
    </div>
)

HeaderNotificationsCustomHeading.displayName = 'HeaderNotificationsCustomHeading';

const getItemUrl = (item)=>{
    if(window.Meteor && window.Steedos.isMobile()){
        return 'javascript:void(0);';
    }else{
        return getRelativeUrl(`/api/v4/notifications/${item._id}/read`);
    }
}

const itemOnClick = (item)=>{
    if(window.Meteor && window.Steedos.isMobile()){
        window.$.ajax({
            url : getAbsoluteUrl(`/api/v4/notifications/${item._id}/read?async`),
            type : "get",
            data : {},
            async : false,
            beforeSend: function(request){
                request.setRequestHeader('X-User-Id', getUserId())
                request.setRequestHeader('X-Auth-Token', getAuthToken())
                request.setRequestHeader('X-Space-Id', getSpaceId())
            },
            success : function(result) {
                if(result && result.redirect){
                    //此处连续调用2次click用于解决IOS设备上，点击通知记录后，popover不关闭问题。
                    window.$(".slds-button_icon", window.$('#header-notifications-popover-id-popover')).trigger('click');
                    window.$(".slds-button_icon", window.$('#header-notifications-popover-id-popover')).trigger('click');
                    var url = result.redirect;
                    var ROOT_URL_PATH_PREFIX = window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX
                    if(ROOT_URL_PATH_PREFIX && url.startsWith(ROOT_URL_PATH_PREFIX)){
                        url = url.replace(ROOT_URL_PATH_PREFIX, '');
                    }
                    window.FlowRouter.go(url);
                }
            }
        }); 
    }
}

const getItemAvatarUrl = (item)=>{
    if(item.from){
        return getAbsoluteUrl(`/avatar/${item.from}`);
    }
    else{
        return getRelativeUrl(`/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png`);
    }
}

const HeaderNotificationsCustomContent = (props) => {
    if(props.isEmpty){
        return (<EmptyContainer>{props.assistiveText.emptyNotifications}</EmptyContainer>);
    }
    else if(props.isLoading){
        return (
            <LoadingContainer>
                <LoadingIcon />  
            </LoadingContainer>
        );
    }
    else{
        return (
            <ContentContainer>
                <ul id="header-notifications-custom-popover-content">
                    {props.items.map((item) => (
                        <li
                            className={`slds-global-header__notification ${
                                item.is_read ? '' : 'slds-global-header__notification_unread'
                            }`}
                            key={`notification-item-${item._id}`}
                        >
                            <div className="slds-media slds-has-flexi-truncate slds-p-around_x-small">
                                <div className="slds-media__figure">
                                    <span className="slds-avatar slds-avatar_small">
                                        <img
                                            alt={item.name}
                                            src={getItemAvatarUrl(item)}
                                            title={`${item.name}"`}
                                        />
                                    </span>
                                </div>
                                <div className="slds-media__body">
                                    <div className="slds-grid slds-grid_align-spread">
                                        <a
                                            href={getItemUrl(item)}
                                            target="_blank"
                                            className="slds-text-link_reset slds-has-flexi-truncate"
                                            onClick={()=>{itemOnClick(item)}}
                                        >
                                            <h3
                                                className="slds-truncate"
                                                title={`${item.name}`}
                                            >
                                                <strong>{`${item.name}`}</strong>
                                            </h3>
                                            <p className="slds-truncate" title={item.body}>
                                                {item.body}
                                            </p>
                                            <p className="slds-m-top_x-small slds-text-color_weak">
                                                {moment(item.created).startOf().fromNow()}{' '}
                                                {item.is_read ?  null : (
                                                    <abbr
                                                        className="slds-text-link slds-m-horizontal_xxx-small"
                                                        title="unread"
                                                    >
                                                        ●
                                                    </abbr>
                                                )}
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </ContentContainer>
        );
    }
}

HeaderNotificationsCustomContent.displayName = 'HeaderNotificationsCustomContent';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
    };

    static defaultProps = {
        title: "通知",
        rows: [],
        top: 10,
        loadDataAfterRender: true,
        assistiveText: {
            newNotificationsAfter: "条新通知",
            newNotificationsBefore: "收到",
            noNotifications: "无新通知",
            markAllAsRead: "全部标记为已读",
            emptyNotifications: "您现在没有任何通知。"
        }
    };

    static propTypes = {
        title: PropTypes.string,
        rows: PropTypes.array,
        interval: PropTypes.number, //定时多少秒抓取一次数据
        filters: PropTypes.array, //过滤条件，默认过滤当前用户收到的工作区范围所有通知
        top: PropTypes.number, //抓取多少条数据
        sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),// 未配置时为"created desc, name"
        markReadAllApiUrl: PropTypes.string, //全部标记为已读的url可配置，默认不需要配置，未配置时为：/api/v4/notifications/all/markReadAll
        loadDataAfterRender: PropTypes.bool, //组件加载后是否默认请求一次数据
        assistiveText: PropTypes.shape({
            newNotificationsAfter: PropTypes.string,
            newNotificationsBefore: PropTypes.string,
            noNotifications: PropTypes.string,
            markAllAsRead: PropTypes.string,
            emptyNotifications: PropTypes.string
        })
    };

    componentDidMount() {
        const { init } = this.props;
        if (init) {
            let options = Object.assign({}, this.props, {
                pageSize: this.props.top
            });
            init(options);
        }
    }

    componentWillUnmount() {
        const { exist } = this.props;
        if (exist) {
            exist(this.props);
        }
    }

    state = {
    };

    getPopover(){
        const { rows: items, loading: isLoading, methodLoading: isMethodLoading, itemsLoaded: isItemsLoaded, title, onMarkReadAll, unreadCount, assistiveText } = this.props;
        const isEmpty = isLoading ? false : items.length === 0;
        const isUnreadEmpty = !!!unreadCount;
        return (
            <Popover
                ariaLabelledby="header-notifications-custom-popover-content"
                body={
                    <HeaderNotificationsCustomContent
                        isLoading={ isItemsLoaded ? false : isLoading}
                        isEmpty={isEmpty}
                        items={items}
                        assistiveText={assistiveText}
                    />
                }
                heading={
                    <HeaderNotificationsCustomHeading
                        isUnreadEmpty={isUnreadEmpty}
                        title={title}
                        onMarkReadAll={onMarkReadAll}
                        isMethodLoading={isMethodLoading}
                        assistiveText={assistiveText}
                    />
                }
                id="header-notifications-popover-id"
            />
        )
    }

    render() {
        const { unreadCount, countLoading, assistiveText } = this.props;
        const popover = this.getPopover();

        return (
            <Container className={countLoading ? "loading" : ""}>
                <GlobalHeaderNotifications
                    assistiveText={{
                        newNotificationsAfter: assistiveText.newNotificationsAfter,
                        newNotificationsBefore: assistiveText.newNotificationsBefore,
                        noNotifications: assistiveText.noNotifications
                    }}
                    notificationCount={countLoading ? 0 : unreadCount}
                    popover={popover}
                />
                { countLoading ? <LoadingIcon /> : ""}
            </Container>

        );
    }
}

export default Notifications;