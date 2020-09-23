import React from 'react';
import styled from 'styled-components';
import { GlobalHeaderProfile, Popover, MediaObject, Icon, Avatar } from '@steedos/design-system-react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const ProfileContainer = styled.div`
    .slds-popover__body, .slds-popover__footer{
        padding: 0px;
    }

    .slds-avatar{
        img{
            height: 100%;
        }
    }

    .user-profile-content{
        .slds-avatar{
            width: 2.4rem;
            height: 2.4rem;
            .slds-icon{
                width: 2.4rem;
                height: 2.4rem;
            }
        }
    }

    .slds-popover__header{
        display: none;
    }
`;

class profile extends React.Component {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
		footers: [],
        assistiveText: PropTypes.shape({
            settings: "账户设置",
            logout: "注销"
        })
	};

    static propTypes = {
        settingsAccountClick: PropTypes.func.isRequired,
        logoutAccountClick: PropTypes.func.isRequired,
        avatarURL: PropTypes.string.isRequired,
        footers: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string.isRequired,
			onClick: PropTypes.func.isRequired
		})),
        assistiveText: PropTypes.shape({
            settings: PropTypes.string,
            logout: PropTypes.string
        })
    }

    settingsAccount = (e)=>{
        e.preventDefault();
        const { settingsAccountClick } = this.props
        if(settingsAccountClick && _.isFunction(settingsAccountClick)){
            settingsAccountClick();
        }
    }

    logoutAccount = (e)=>{
        e.preventDefault();
        const { logoutAccountClick } = this.props
        if(logoutAccountClick && _.isFunction(logoutAccountClick)){
            logoutAccountClick();
        }
    }


    render() {

        const { profile, avatarURL, footers, assistiveText } = this.props

        return (
            <ProfileContainer>
                <GlobalHeaderProfile
                    popover={
                        <Popover
                            hasNoCloseButton={true}
                            body={
                                <MediaObject
                                    className="user-profile-content slds-var-p-around_medium"
                                    body={
                                        <div id={`profile-${profile.userId}`} className="slds-m-left_x-small">
                                            <span className="slds-listbox__option-text slds-listbox__option-text_entity slds-m-bottom_x-small">{profile.name}</span>
                                            <span className="slds-listbox__option-meta slds-text-body--small slds-listbox__option-meta_entity slds-m-bottom_x-small">{window.location.hostname}</span>
                                            <span>
                                                <a className="slds-p-right--medium" href="javacript:void(0);" onClick={(e)=>{this.settingsAccount(e);}}>{assistiveText.settings}</a>
                                                <a href="javacript:void(0);" onClick={(e)=>{this.logoutAccount(e);}}>{assistiveText.logout}</a>
                                            </span>
                                        </div>
                                    }
                                    figure={<Avatar
                                        imgSrc={avatarURL}
                                        imgAlt={profile.name}
                                        title={profile.name}
                                    />}
                                />
                            }
                            id="header-profile-popover-id"
                            ariaLabelledby=""
                            footer={
                            <div className="profile-footer slds-var-p-around_medium"> 
                                    {footers.map((item, _index)=>{
                                        return (
                                            <div key={`profile-footer-${item.id || _index}`} className="slds-media slds-media--center slds-p-left--none">
                                                <a className="footerAction slds-grow" href="javacript:void(0);" onClick={(e)=>{e.preventDefault();item.onClick(e);}}>
                                                    <div className="slds-media slds-media--center slds-p-bottom_x-small">
                                                        <div className="slds-media__body slds-m-left--none">{item.label}</div>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        />
                    }
                    userName={profile.name}
                    avatar={<Avatar
                        imgSrc={avatarURL}
                        imgAlt={profile.name}
                        title={profile.name}
                    />}
                />
            </ProfileContainer>
        );
    }
}

export default profile