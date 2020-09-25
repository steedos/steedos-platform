import * as React from 'react';
import Grid from '../grid'
import PropTypes from 'prop-types';
import _ from 'underscore'
import { Card } from '@steedos/design-system-react';
import { getSpaceId, getRelativeUrl, isMobile } from '../../utils';
import styled from 'styled-components';

let WidgetObjectContent = styled.div`
    .slds-table{
        thead{
            th{
                &:first-child{
                    .slds-p-horizontal_x-small{
                        padding-left: 1rem;
                    }
                }
            }
        }
        tbody{
            td{
                &:first-child{
                    padding-left: 1rem;
                }
            }
        }
    }
`

class WidgetObject extends React.Component {

    constructor(props) {
        super(props)
    };

    static defaultProps = {
        maxRows: 5,
        assistiveText:{
            label: "对象名称", 
            allLinkLabel: "查看全部",
            illustrationMessageBody: "没有可显示的项目"
        }
    };

    static propTypes = {
        label: PropTypes.string,
        objectName: PropTypes.string,
        filters: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
        columns: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            width: PropTypes.string,
            // wrap: PropTypes.bool,
            hidden: PropTypes.bool,
            onClick: PropTypes.func,
            format: PropTypes.func,
            href: PropTypes.bool
        })),
        illustration: PropTypes.shape({
            heading: PropTypes.string,
            messageBody: PropTypes.string,
            name: PropTypes.string,
            path: PropTypes.string
        }),
        showAllLink: PropTypes.bool,
        hrefTarget: PropTypes.string,
        footer: PropTypes.func,
        noHeader: PropTypes.bool,
        unborderedRow: PropTypes.bool,
        sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        rowIcon: PropTypes.shape({
            width: PropTypes.string,
            category: PropTypes.string,
            name: PropTypes.string,
            size: PropTypes.string
        }),
        maxRows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        assistiveText: PropTypes.shape({
            label: PropTypes.string,
            allLinkLabel: PropTypes.string
        })
    };

    convertObjectProps(){
        let { label, objectName, filters, columns, illustration, showAllLink, hrefTarget, noHeader, assistiveText, ...others } = this.props;
        if(!label){
            label = assistiveText.label
        }
        if(isMobile()){
            // 手机上强制把noHeader设置为true，且只显示href为true的字段
            noHeader = true;
            columns = columns.filter(function(item){
                return item.href;
            });
        }
        return {
            label: label,
            objectName: objectName,
            cellListColumns: columns ? columns.map((column)=>{
                if (column.href && typeof column.format !== "function"){
                    column.format = (children, data, options)=>{
                        const spaceId = getSpaceId();
                        let url = `/app/-/${objectName}/view/${data.id}`;
                        if (objectName === "instances"){
                            url = `/workflow/space/${spaceId}/inbox/${data.id}`;
                        }
                        url = getRelativeUrl(url);
                        return (
                            <a target={hrefTarget} href={url} title={children}>
                                {children}
                            </a>
                        )
                    }
                }
                return column;
            }) : [],
            filters,
            illustration,
            showAllLink,
            hrefTarget,
            noHeader,
            ...others
        };
    }

    componentDidMount() {
        const { init } = this.props;
        if (init) {
            init(this.props)
        }
    }

    state = {
    };

    getObjectUrl(objectName){
        let url = `/app/-/${objectName}`;
        url = getRelativeUrl(url);
        return url;
    }

    render() {
        let convertedObjectProps = this.convertObjectProps();
        let { assistiveText } = this.props;
        let { label, objectName, selectionLabel, cellListColumns, filters, illustration, showAllLink, hrefTarget, 
            footer, noHeader, unborderedRow, sort, rowIcon, maxRows } = convertedObjectProps;
        let cardFooter;
        if (_.isFunction(footer)) {
            cardFooter = footer(convertedObjectProps)
        }
        else if (showAllLink){
            cardFooter = (
                <a href={this.getObjectUrl(objectName)} target={hrefTarget}>
                    {assistiveText.allLinkLabel}
                    </a>
            )
        }
        return (
            <Card
                heading={label}
                footer={cardFooter}
            >
                <WidgetObjectContent>
                    <Grid searchMode="omitFilters"
                        pageSize={maxRows === "all" ? null : maxRows}
                        objectName={objectName}
                        columns={cellListColumns}
                        selectionLabel={selectionLabel}
                        filters={filters}
                        illustration={illustration}
                        noHeader={noHeader}
                        unborderedRow={unborderedRow}
                        sort={sort}
                        rowIcon={rowIcon}
                    />
                </WidgetObjectContent>
            </Card>
        );
    }
}

export default WidgetObject;