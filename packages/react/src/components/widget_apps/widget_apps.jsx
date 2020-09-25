import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'underscore';
import { Card, AppLauncherExpandableSection, Icon} from '@steedos/design-system-react';
import { getCookie, getRelativeUrl } from '../../utils';
import {AppLauncherTile} from '../slds_app_launcher';
import classNames from 'classnames';

let AppLauncherDesktopInternal = styled.div`
    padding: 0px 1rem;
    .slds-section.slds-is-open{
        .slds-section__content{
            padding-top: 0px;
        }
    }
    .slds-section__title{
        display: none;
    }
    &.slds-app-launcher__show-all-items{
        .slds-section__title{
            display: block;
        }
    }
    .slds-link{
        color: #006dcc;
        text-decoration: none;
        transition: color .1s linear;
        background-color: transparent;
        cursor: pointer;
        &:hover, &:focus{
            text-decoration: underline;
            color: #005fb2;
        }
    }
    &.slds-app-launcher__mobile{
        .slds-medium-size--1-of-3, .slds-medium-size_1-of-3{
            width: 100%;
        }
    }
    &.slds-app-launcher__mini{
        .slds-app-launcher__tile{
            flex-direction: column;
            .slds-app-launcher__tile-figure{
                justify-content: center;
                padding-bottom: 0;
                flex-direction: row;
            }
            .slds-app-launcher__tile-body{
                text-align: center;
                background: #fff;
                &> div {
                    display: none;
                }
                .slds-link{
                    &>span{
                        overflow: hidden;
                        width: 100%;
                        display: inline-block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        .slds-medium-size--1-of-3, .slds-medium-size_1-of-3 {
            width: 16%;
            @media (max-width: 1280px) {
                width: 20%;
            }
            @media (max-width: 1024px) {
                width: 20%;
            }
            @media (max-width: 767px) {
                width: 25%;
            }
        }
        &.slds-app-launcher__mobile{
            .slds-medium-size--1-of-3, .slds-medium-size_1-of-3 {
                width: 25%;
                @media (max-width: 1680px) {
                    width: 33.33%;
                }
                @media (max-width: 1280px) {
                    width: 50%;
                }
                @media (max-width: 960px) {
                    width: 100%;
                }
                @media (max-width: 767px) {
                    width: 33.3333%;
                }
            }
        }
    }
`;

class WidgetApps extends React.Component {
    constructor(props) {
        super(props);
    };

    static defaultProps = {
        mobile: false,
        mini: false,
        showAllItems: false,
        assistiveText:{
            label: "应用",
            tilesSectionLabel: "所有应用",
            linksSectionLabel: "所有对象"
        }
    };

    static propTypes = {
        label: PropTypes.string,
        apps: PropTypes.array,
        mobile: PropTypes.bool,
        mini: PropTypes.bool,
        showAllItems: PropTypes.bool,
        ignoreApps: PropTypes.array,
        onTileClick: PropTypes.func,
        assistiveText: PropTypes.shape({
            label: PropTypes.string,
            tilesSectionLabel: PropTypes.string,
            linksSectionLabel: PropTypes.string
        })
    };

    componentDidMount() {
        const { init } = this.props;
        if (init) {
            init(this.props)
        }
    }

    state = {
        apps: []
    };

    getAppUrl(app, token){
        let url = `/app/${app._id}`;
        if (app.url) {
            url = app.url;
        }

        url = getRelativeUrl(url);

        if (url.indexOf("?") > -1) {
            url += `&token=${token}`
        }
        else {
            url += `?token=${token}`
        }
        return url;
    }

    onTileClick(event, app, tile, index){
        if(app && window.Creator && window.Creator.openApp){
            window.Creator.openApp(app._id, event);
        }
        const { onTileClick } = this.props;
        if(onTileClick){
            onTileClick.call(this, event, app, tile, index);
        }
    }

    getAppCells(apps){
        if (apps) {
            const onTileClick = this.onTileClick;
            //TODO 标准参数不应该直接从cookies中获取，因为手机版暂时获取不到cookie
            let token = getCookie("X-Access-Token");
            const self = this;
            return _.map(apps, (app, key) => {
                if (app && app.label) {
                    let url = this.getAppUrl(app, token);
                    let target = app.is_new_window ? "_blank" : null;
                    return (
                        <AppLauncherTile
                            assistiveText={{ dragIconText: app.label }}
                            key={key}
                            description={app.description}
                            iconNode={
                                <Icon
                                    assistiveText={{ label: app.label }}
                                    category="standard"
                                    name={app.icon_slds}
                                />
                            }
                            title={app.label}
                            href={url}
                            target={target}
                            onClick={(e)=>{
                                onTileClick.call(self, e, app, {...this}, key);
                            }}
                            isDraggable={false}
                        />
                    )
                }
            })
        }
        else{
            return null;
        }
    }

    render() {
        let { label, apps, mobile, showAllItems, ignoreApps, assistiveText, mini } = this.props;
        if(ignoreApps && ignoreApps.length){
            apps = _.reject(apps, function(o) { return ignoreApps.indexOf(o._id) > -1 });
        }
        if(!label){
            label = assistiveText.label
        }
        if(!assistiveText.tilesSectionLabel){
            // tilesSectionLabel必填，所以要避免报错
            assistiveText.tilesSectionLabel = WidgetApps.defaultProps.assistiveText.tilesSectionLabel;
        }
        if(!assistiveText.linksSectionLabel){
            assistiveText.linksSectionLabel = WidgetApps.defaultProps.assistiveText.linksSectionLabel;
        }
        let appCells = this.getAppCells(apps);
        let appLauncherDesktopInternal;
        if (mobile){
            appLauncherDesktopInternal = (
                <AppLauncherDesktopInternal
                    className={classNames(
                        {
                            'slds-app-launcher__mini': mini === true,
                        },
                        "slds-app-launcher__content slds-app-launcher__mobile"
                    )}
                >
                    <AppLauncherExpandableSection title={assistiveText.tilesSectionLabel}>
                        {appCells}
                    </AppLauncherExpandableSection>
                </AppLauncherDesktopInternal>
            );
        }
        else {
            appLauncherDesktopInternal = (
                <AppLauncherDesktopInternal
                    className={classNames(
                        {
                            'slds-app-launcher__show-all-items': showAllItems === true,
                            'slds-app-launcher__mini': mini === true,
                        },
                        "slds-app-launcher__content"
                    )}
                >
                    <AppLauncherExpandableSection title={assistiveText.tilesSectionLabel}>
                        {appCells}
                    </AppLauncherExpandableSection>
                </AppLauncherDesktopInternal>
            );
        }
        return (
            <Card
                heading={label}
            >
                {appLauncherDesktopInternal}
            </Card>
        );
    }
}

export default WidgetApps;