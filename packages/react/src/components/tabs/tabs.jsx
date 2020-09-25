import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import _ from 'underscore';
import { Tabs as SFTabs} from '@steedos/design-system-react';

let Container = styled.div`
    .slds-vertical-tabs{
        &.slds-tabs_default, &.slds-tabs_scoped{
            background: unset;
            .slds-tabs_default__nav, .slds-tabs_scoped__nav{
                width: 12rem;
                border-right: 1px solid #dddbda;
                background: #f3f2f2;
                display: block;
                border-left: none;
                border-bottom: none;
                border-top: none;
                border-radius: 0;
                .slds-tabs_default__item, .slds-tabs_scoped__item{
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    border-bottom: 1px solid #dddbda;
                    color: #3e3e3c;
                    &.slds-active{
                        margin-right: -1px;
                        border-right: 0;
                        background: #fff;
                        color: #006dcc;
                    }
                    .slds-tabs_default__link, .slds-tabs_scoped__link{
                        display: flex;
                        flex: 1 1 0%;
                        align-items: center;
                        min-width: 0;
                        padding: .75rem;
                        // color: currentColor;
                        width: 100%;
                    }
                    &:focus{
                        outline: none;
                    }
                }
            }
            .slds-tabs_default__content, .slds-tabs_scoped__content{
                flex: 1;
                padding: 1rem;
                background: #fff;
                border: none;
            }
        }
        &.slds-tabs_default{
            border: none;
            .slds-tabs_default__nav{
                border: 1px solid #dddbda;
                border-radius: .25rem;
                padding: .25rem;
                background: #fff;
                width: 8rem;
                .slds-tabs_default__item{
                    border: none;
                    &.slds-active{
                        margin-right: 0;
                        color: #080707;
                        &:after{
                            content: "";
                            width: 3px;
                            height: 1rem;
                            position: absolute;
                            right: 0.25rem;
                            left: auto;
                            top: 50%;
                            margin-top: -0.5rem;
                        }
                    }
                    &:hover{
                        &:after{
                            content: "";
                            width: 3px;
                            height: 1rem;
                            position: absolute;
                            right: 0.25rem;
                            left: auto;
                            top: 50%;
                            margin-top: -0.5rem;
                        }
                    }
                    .slds-tabs_default__link{
                        justify-content: center;
                    }
                }
            }
            .slds-tabs_default__content{
                border: 1px solid #dddbda;
                border-radius: .25rem;
                margin-left: 1rem;
            }
        }
        &.slds-tabs_scoped{
            .slds-tabs_scoped__content{
                border-radius: 0;
            }
        }
    }
`;

class Tabs extends React.Component {
    constructor(props) {
        super(props);
    };

    static defaultProps = _.extend({}, SFTabs.defaultProps, { 
        vertical: false, 
        triggerByHover: false 
    })

    static propTypes = _.extend({}, SFTabs.propTypes, { 
        vertical: PropTypes.bool,
        triggerByHover: PropTypes.bool 
    })

    handleMove = (e)=> {
        let item = e.target.closest(".slds-tabs_default__item, .slds-tabs_scoped__item");
        if(item){
            this.refs.tabs.handleClick(e);
        }
    };

    render() {
        let { vertical, triggerByHover, className, ...props } = this.props;
        let containerProps = {};
        if(triggerByHover){
            containerProps.onMouseMove = this.handleMove;
        }
        return (
            <Container className="steedos-tabs-container"
                {...containerProps}>
                <SFTabs {...props} 
                    className={classNames(
                        {
                            'slds-vertical-tabs': vertical === true,
                        },
                        className
                    )}
                    ref="tabs"
                />
            </Container>
        );
    }
}

export default Tabs;