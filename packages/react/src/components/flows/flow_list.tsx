import * as React from 'react';
import { Grid } from '../../components'
import PropTypes from 'prop-types';
import { createGridAction } from '../../actions';
import styled from 'styled-components'
import { makeNewID } from '../index';
import { loadTreeEntitiesData } from '../../actions'
import SteedosTree from '../../components/tree'
import { loadCategoriesEntitiesData } from '../../actions'
import _ from 'underscore'

let gridObjectName = "flows";
let gridColumns = [
    {
        field: 'name',
        label: '流程名'
    },{
        field: 'description',
        type: 'markdown',
        label: '描述'
    }
]
let Counter = styled.div`
    display: flex;
`
let CategoriesCounter = styled.div`
    position: fixed;
    display: flex;
    width: 14rem;
    overflow: hidden;
    overflow-y: auto;
`

let FlowsCounter = styled.div`
    margin-left: 14rem;
    width: calc(100%);
    height: 500px;
    border-left: 1px solid #d5d5da;
`
class Flows extends React.Component {

    static defaultProps = {
        valueField: '_id',
        selectionLabel: 'name',
        rootNodes: [],
        pageSize: 200,
        treeId: makeNewID({}),
        gridId: makeNewID({})
    }

    constructor(props) {
        super(props);
        if(_.isEmpty(props.rootNodes)){
            let { spaceId } = this.props as any
            props.dispatch(loadCategoriesEntitiesData({ id: props.treeId, spaceId: spaceId, objectName: "categories", filters: [], columns: [{field: 'name'}]}))
        }
    }
    render() {
        let { searchMode, multiple, pageSize, rootNodes, treeId, gridId, spaceId, gridProp, treeProp, disabledSelectRows } = this.props as any

        let init = (options: any)=>{
            const newOptions = Object.assign({}, options, {id: treeId, spaceId})
            newOptions.columns = [{field: 'name'}]
            return loadTreeEntitiesData(newOptions)
        }

        let onClick = function(event: any, data: any){
            return (dispatch: any, getState: any)=>{
                dispatch(createGridAction("filters", [["category", "=", data.node.id]], {id: gridId, spaceId, objectName: gridObjectName, columns: gridColumns, searchMode, pageSize, baseFilters: [["state", "=", "enabled"]]}))
                dispatch({
                    type: 'TREE_STATE_CHANGE',
                    payload: {
                        partialStateName: 'click',
                        partialStateValue: data,
                        objectName: 'categories',
                        id: treeId
                    }
                })
            }
        }

        let selectRows: any = 'radio';
        if(multiple){
            selectRows = 'checkbox';
        }
        if(disabledSelectRows){
            selectRows = null;
        }

        return (
            <Counter className="flows-list">
               <CategoriesCounter className="categories"><SteedosTree objectName="categories" rootNodes={rootNodes} onClick={onClick} init={init} id={treeId} {...treeProp} spaceId={spaceId}/></CategoriesCounter>
               <FlowsCounter className="flows"><Grid id={gridId} objectName={gridObjectName} enableSearch={true} columns={gridColumns} selectRows={selectRows} baseFilters={[["state", "=", "enabled"]]} searchMode={searchMode} {...gridProp} spaceId={spaceId}/></FlowsCounter>
            </Counter>
        )
    }
}
export default Flows