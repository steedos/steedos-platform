import { connect } from 'react-redux';
import SteedosDXGrid from './dx_grid';
import { createDXGridAction, loadDXGridEntitiesData } from '../../actions'
import { entityStateSelector } from '../../selectors';
// const mapStateToProps = (state: any) => state;

function mapStateToProps() {
  return (state: any, ownProps: any) => {
    let objectName = ownProps.objectName
    let entityState = entityStateSelector(state, objectName) || {}
    let pageSize = entityState.pageSize;
    if(!pageSize){
      pageSize = ownProps.pageSize || 10
    }
    return Object.assign(entityState, {...entityState, objectName, ...ownProps, pageSize});
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  onSortingChange: (sorting: any) => dispatch(createDXGridAction('sorting', sorting, ownProps.objectName)),
  onSelectionChange: (selection: any) => dispatch(createDXGridAction('selection', selection, ownProps.objectName)),
  onExpandedRowIdsChange: (expandedRowIds: any) => dispatch(createDXGridAction('expandedRowIds', expandedRowIds, ownProps.objectName)),
  onGroupingChange: (grouping: any) => dispatch(createDXGridAction('grouping', grouping, ownProps.objectName)),
  onExpandedGroupsChange: (expandedGroups: any) => dispatch(createDXGridAction('expandedGroups', expandedGroups, ownProps.objectName)),
  onFiltersChange: (filters: any) => dispatch(createDXGridAction('filters', filters, ownProps.objectName)),
  onCurrentPageChange: (currentPage: any) => dispatch(createDXGridAction('currentPage', currentPage, ownProps.objectName)),
  onPageSizeChange: (pageSize: any) => dispatch(createDXGridAction('pageSize', pageSize, ownProps.objectName)),
  onColumnOrderChange: (order: any) => dispatch(createDXGridAction('columnOrder', order, ownProps.objectName)),
  onColumnWidthsChange: (widths: any) => dispatch(createDXGridAction('columnWidths', widths, ownProps.objectName)),
  onSearchValueChange: (widths: any) => dispatch(createDXGridAction('searchValue', widths, ownProps.objectName)),
  init: (options: any) => dispatch(loadDXGridEntitiesData(options))
});

export default connect(mapStateToProps, mapDispatchToProps)<any>(SteedosDXGrid);
