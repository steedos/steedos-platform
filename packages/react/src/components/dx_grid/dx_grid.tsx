import * as React from 'react';
import {Paper} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
    SortingState, SelectionState, PagingState, RowDetailState,SearchState,IntegratedFiltering,
    IntegratedSorting, IntegratedSelection, CustomPaging
} from '@devexpress/dx-react-grid';
import {
    Grid, Table, TableHeaderRow,
    TableSelection,SearchPanel,
    PagingPanel, DragDropProvider, TableColumnReordering, TableColumnResizing, Toolbar,
} from '@devexpress/dx-react-grid-material-ui';


class SteedosDXGrid extends React.Component {
    // constructor(props: any) {
    //     super(props)
    // }
    static defaultProps = {
        rows: [],
        sorting: [],
        grouping: [],
        expandedGroups: [],
        selection: [],
        expandedRowIds: [1],
        currentPage: 0,
        pageSize: 10,
        pageSizes: [5, 10, 15],
        totalCount: 0,
    };

    static propTypes = {
        objectName: PropTypes.string.isRequired,
        columns: PropTypes.array.isRequired,
        getRowId: PropTypes.func.isRequired,
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        pageSizes: PropTypes.array
    }

    componentDidMount() {
        const { init } = this.props as any
        init(this.props)
    }

    render() {
        const {
            rows,
            sorting,
            selection,
            expandedRowIds,
            currentPage,
            pageSize,
            pageSizes,
            columnOrder,
            columnWidths,
            totalCount,
            columns,
            getRowId,
            searchValue,
            onSortingChange,
            onSelectionChange,
            onExpandedRowIdsChange,
            onCurrentPageChange,
            onPageSizeChange,
            onColumnOrderChange,
            onColumnWidthsChange,
            onSearchValueChange
        } = this.props as any
        return (
            <Paper>
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <SearchState value={searchValue} onValueChange={onSearchValueChange}/>
                    <SortingState
                        sorting={sorting}
                        onSortingChange={onSortingChange}
                    />
                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={onCurrentPageChange}
                        pageSize={pageSize}
                        onPageSizeChange={onPageSizeChange}
                    />
                    <CustomPaging
                        totalCount={totalCount}
                    />
                    <RowDetailState
                        expandedRowIds={expandedRowIds}
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                    />
                    <SelectionState
                        selection={selection}
                        onSelectionChange={onSelectionChange}
                    />
                    <IntegratedFiltering />
                    <IntegratedSorting />
                    <IntegratedSelection />

                    <DragDropProvider />

                    <Table />

                    <TableColumnResizing
                        columnWidths={columnWidths}
                        onColumnWidthsChange={onColumnWidthsChange}
                    />
                    <TableHeaderRow showSortingControls />
                    <TableColumnReordering
                        order={columnOrder}
                        onOrderChange={onColumnOrderChange}
                    />
                    <TableSelection showSelectAll />
                    <Toolbar />
                    <SearchPanel />
                    <PagingPanel
                        pageSizes={pageSizes}
                    />
                </Grid>
            </Paper>
        );
    }
}

export default SteedosDXGrid