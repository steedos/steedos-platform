import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Lookup from '../lookup'
import { DropdownTrigger, Button, Dropdown } from '@steedos/design-system-react';
import { createGridAction } from '../../actions';
const FiltersContainer = styled.div`
    // padding: 1rem;
    .slds-dropdown-trigger{
        float: left;
        .slds-dropdown_medium{
            padding: 0;
        }
    }
    // .slds-form-element{
    //     width: 200px;
    //     display: inline-block;
    //     margin-right: 1rem
    // }
`;

const selectionLabel = 'name';

const _columns = [{
    field: 'name',
    label: '分类'
}]

const variant = 'readonly';

class filters extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        // action: PropTypes.func.isRequired,
        objectName: PropTypes.string.isRequired,
        columns:  PropTypes.arrayOf(PropTypes.shape({
			field: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			width: PropTypes.string,
			hidden: PropTypes.bool,
			onClick: PropTypes.func,
			format: PropTypes.func
		})).isRequired,
    }

    getGridFilters = (data, column)=>{
        const filters = [];
        _.each(data, (item)=>{
            if(filters.length > 0){
                filters.push('or');
            }
            filters.push([column.field, "=", item.id])
        })
        return filters;
    }

    onSelect = (event, data, column)=>{
        // console.log('this', this);
        // console.log('onSelect', event, data, column);
        const { onSelect, gridProps } = this.props
        const filters = this.getGridFilters(data, column);
        if(onSelect){
            return onSelect("filters", filters, gridProps);
        }
        
    }

    onRequestRemoveSelectedOption = (event, data) => {
        // console.log(data);
        const filters = this.getGridFilters(data.selection, data.column);
        const { gridProps } = this.props
        return createGridAction("filters", filters, gridProps);
    }

    action = (name)=>{
        if(name === 'onSelect'){
            return this.onSelect;
        }
    }

    render() {

        const { objectName, columns } = this.props

        const getFilters = (columns)=>{
            let filters = [];
            _.each(columns, (column)=>{
                if(column.enableFilter){
                    if(column.reference_to || column.rows){
                        filters.push(
                            // <Dropdown>
                            //     <DropdownTrigger>
                            //         <Button
                            //             iconCategory="utility"
                            //             iconName="down"
                            //             iconPosition="right"
                            //             label={column.label}
                            //         />
                            //     </DropdownTrigger>
                            //     <Lookup className="filter-item" id={`${objectName}_filter_${column.field}`} variant="readonly" objectName={column.reference_to} selectionLabel={selectionLabel} columns={_columns} isOpen={true} action={action}></Lookup>
                            // </Dropdown>
                            <Lookup className="filter-item" id={`${objectName}_filter_${column.field}`}
                                key={`${objectName}_filter_${column.field}`}
                                variant={variant} 
                                objectName={column.reference_to} 
                                placeholderReadOnly={`${column.label}`} 
                                selectionLabel={selectionLabel}
                                columns={_columns}
                                column = {column}
                                action={this.action} 
                                multiple={true}
                                autoload={_.has(column, 'reference_to')}
                                />
                       )
                    }
                }
            })
            return filters;
        }

        return (
            <FiltersContainer className="slds-p-vertical_x-small slds-p-horizontal_x-small">
                {getFilters(columns)}
            </FiltersContainer>
        );
    }
}

export default filters