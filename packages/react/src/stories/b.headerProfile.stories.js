import React from 'react';
import styled from 'styled-components'
import { Provider } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { HeaderProfile } from '../components';

export default {
    title: 'HeaderProfile',
};
const Container = styled.div`
  float: right;
  margin: 2rem;
  margin-right: 200px;
  clear: both;
`;

const avatarURL = "http://192.168.3.2:5000/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png";
const logoutAccountClick = ()=>{
    console.log('logoutAccount click...');
}
const settingsAccountClick= ()=>{
    console.log('settingsAccount click...');
}

const footerClick = (url)=>{
    if(window.Steedos){
        window.Steedos.openWindow(url);
    }else{
        const target = "_blank";
        const options = 'scrollbars=yes,EnableViewPortScale=yes,toolbarposition=top,transitionstyle=fliphorizontal,menubar=yes,closebuttoncaption=  x  '
        window.open(url, target, options);
    }
}

const footers = [
    {label: "帮助文档", onClick: function(){return footerClick("https://www.steedos.com/help")}},
    {label: "下载客户端", onClick: function(){return footerClick("https://www.steedos.com/help/download")}},
    {label: "关于", onClick: function(){footerClick("https://www.steedos.com")}},
    {label: "test", onClick: function(){footerClick("https://baidu.com")}},
]

export const MyHeaderProfile = () => (
    <Provider store={store}>
        <Bootstrap>
            <Container>
                <HeaderProfile avatarURL={avatarURL} logoutAccountClick={logoutAccountClick} settingsAccountClick={settingsAccountClick} footers={footers}/>
            </Container>
        </Bootstrap>
    </Provider>
);