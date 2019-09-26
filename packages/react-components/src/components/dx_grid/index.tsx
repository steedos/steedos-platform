import { connect } from 'react-redux';
import SteedosDXGrid from './dx_grid';
import { createGridAction, loadEntitiesData } from '../../actions/views/dx_grid'
import { getEntityState } from '../../states/entitys'
import _ from 'underscore'
// const mapStateToProps = (state: any) => state;

function mapStateToProps() {
  return (state: any, ownProps: any) => {
    let objectName = ownProps.objectName
    let entityState = getEntityState(state, objectName) || {}
    let columns = entityState.columns;
    if(ownProps.columns){
      columns = ownProps.columns
    }

    let pageSize = entityState.pageSize;
    if(!pageSize){
      pageSize = ownProps.pageSize || 10
    }

    let $select = _.pluck(columns, 'name')
    return Object.assign(entityState, {...entityState, objectName, $select, ...ownProps, pageSize});
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  onSortingChange: (sorting: any) => dispatch(createGridAction('sorting', sorting, ownProps.objectName)),
  onSelectionChange: (selection: any) => dispatch(createGridAction('selection', selection, ownProps.objectName)),
  onExpandedRowIdsChange: (expandedRowIds: any) => dispatch(createGridAction('expandedRowIds', expandedRowIds, ownProps.objectName)),
  onGroupingChange: (grouping: any) => dispatch(createGridAction('grouping', grouping, ownProps.objectName)),
  onExpandedGroupsChange: (expandedGroups: any) => dispatch(createGridAction('expandedGroups', expandedGroups, ownProps.objectName)),
  onFiltersChange: (filters: any) => dispatch(createGridAction('filters', filters, ownProps.objectName)),
  onCurrentPageChange: (currentPage: any) => dispatch(createGridAction('currentPage', currentPage, ownProps.objectName)),
  onPageSizeChange: (pageSize: any) => dispatch(createGridAction('pageSize', pageSize, ownProps.objectName)),
  onColumnOrderChange: (order: any) => dispatch(createGridAction('columnOrder', order, ownProps.objectName)),
  onColumnWidthsChange: (widths: any) => dispatch(createGridAction('columnWidths', widths, ownProps.objectName)),
  onSearchValueChange: (widths: any) => dispatch(createGridAction('searchValue', widths, ownProps.objectName)),
  init: (options: any) => dispatch(loadEntitiesData(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(SteedosDXGrid);
