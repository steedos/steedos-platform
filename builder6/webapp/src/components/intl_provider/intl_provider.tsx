// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {IntlProvider as BaseIntlProvider} from 'react-intl';
import axios from 'axios'; // Ensure axios is installed
import * as I18n from '../../i18n/i18n';

// Define interfaces/types for your props
interface IntlProviderProps {
    children: React.ReactNode; // Typing children
    locale: string;
    settings?: object;
    translations?: { [key: string]: string }; // Assuming translations is an object with string keys and values
    actions: {
        loadTranslations: (locale: string, url: string) => void;
    };
}

// Define the state interface
interface IntlProviderState {
    loading: boolean;
    settings?: object;
    error?: string;
}

export default class IntlProvider extends React.PureComponent<IntlProviderProps, IntlProviderState>  {
   
    constructor(props: IntlProviderProps) {
        super(props);
        this.state = {
            loading: true, // Initialize loading to true
            settings: undefined,
            error: undefined,
        };
    }

    componentDidMount() {
        // Initialize browser's i18n data
        I18n.doAddLocaleData();

        // Fetch settings data
        this.fetchSettings();

        // Handle locale change
        this.handleLocaleChange(this.props.locale);
    }

    componentDidUpdate(prevProps: IntlProviderProps) {
        if (prevProps.locale !== this.props.locale) {
            this.handleLocaleChange(this.props.locale);
        }
    }

    fetchSettings = async () => {
        try {
            const response = await axios.get('/api/public/settings');
            const settingsData = response.data;
            
            // If settings are needed to load translations or other actions, you can dispatch them here
            // For example:
            // this.props.actions.loadSettings(settingsData);
            const _window: any = window;
            const Builder = (window as any).Builder;
            Builder.settings.appId = '-';
            Builder.settings.context = {
            rootUrl: '',
            _rootUrl: settingsData.rootUrl,
            userId: localStorage.getItem('steedos:userId'),
            tenantId: localStorage.getItem('steedos:spaceId'),
            authToken: localStorage.getItem('steedos:token'),
            user: {},
            };
            Builder.settings.unpkgUrl = settingsData.unpkgUrl;
            Builder.settings.assetUrls = settingsData.assetUrls;


            Builder.settings.env = {
            requestAdaptor: (config: any)=>{
                // 请求中转到 rootUrl
                if (config.url.startsWith('/')) {
                config.url = Builder.settings.context.rootUrl + config.url;
                }
                // if(config.allowCredentials != true){
                //   config.withCredentials = false;
                //   delete config.allowCredentials
                // }
                return config;
            }
            }
            const self = this;
            _window.loadJs('/steedos-init.js', ()=>{
                _window.loadJs(`${Builder.settings.context.rootUrl}/client_scripts.js`, ()=>{
                    self.setState({ settings: settingsData, loading: false });
                });
            });
        } catch (error: any) {
            console.error('Error fetching settings:', error);
            this.setState({ error: 'Failed to load settings.', loading: false });
        }
    }

    handleLocaleChange = (locale: string) => {
        this.loadTranslationsIfNecessary(locale);
    }

    loadTranslationsIfNecessary = (locale: string) => {
        if (this.props.translations) {
            // Already loaded
            return;
        }

        const localeInfo = I18n.getLanguageInfo(locale);

        if (locale === 'en' || !localeInfo) {
            // English is loaded by default and invalid locales fall back to English, so we should never hit this
            return;
        }

        this.props.actions.loadTranslations(locale, localeInfo.url);
    }

    render() {
        const { loading, error } = this.state;

        if (loading) {
            // You can replace this with any loading indicator you prefer
            return <div></div>;
        }

        if (error) {
            // Handle error state as needed
            return <div>{error}</div>;
        }

        return (
            // @ts-ignore: Suppress TS2769 error
            <BaseIntlProvider
                key={this.props.locale}
                locale={this.props.locale}
                messages={this.props.translations}
            >
                {this.props.children}
            </BaseIntlProvider>
        );
    }
}