import * as React from 'react';
import { Organizations, Grid } from '../../components'
import PropTypes from 'prop-types';
import { createGridAction } from '../../actions';
import styled from 'styled-components'
import { makeNewID } from '../index';

let Counter = styled.div`
    display: flex;
`
let OrgsCounter = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    width: 24rem;
    overflow: hidden;
    overflow-y: auto;
`

let UsersCounter = styled.div`
    margin-left: 24rem;
    &>.slds-grid{
        position: absolute;
        width: calc(100% - 24rem);
    }
`
let userObject = {
    name: 'space_users',
    label: '用户',
    enable_search: true,
    fields: {
        name:{
            label: '姓名'
        },
        email: {
            label: '邮箱'
        },
        mobile: {
            label: '手机号'
        },
        user: {
            label: 'userId',
            hidden: true
        }
    }
}

let gridObjectName = "space_users";
let gridColumns = [
    {
        field: 'name',
        label: '姓名'
    },
    {
        field: 'email',
        label: '邮箱'
    },
    {
        field: 'mobile',
        label: '手机号'
    },
    {
        field: 'user',
        label: 'userId',
        hidden: true
    }
]

class SelectUsers extends React.Component {

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
    }

    static propTypes = {
        rootNodes: PropTypes.array,
        multiple: PropTypes.bool,
        valueField: PropTypes.string, //指定控件返回的值来自记录的那个属性，比如：user 字段，或者 email字段
        selectionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        searchMode: PropTypes.oneOf(['omitFilters']),
        pageSize: PropTypes.number,
        treeId: PropTypes.string,
        gridId: PropTypes.string
    }

    render() {
        // let getRowId = (row: any) => row[(this.props as any).valueField]
        let { rootNodes, selectionLabel, searchMode, multiple, pageSize, treeId, gridId } = this.props as any

        let onClick = function(event: any, data: any){
            return (dispatch: any, getState: any)=>{
                dispatch(createGridAction("filters", [["organizations", "=", data.node.id]], {id: gridId, objectName: gridObjectName, columns: gridColumns, searchMode, pageSize, baseFilters: [["user_accepted", "=", true]]}))
                dispatch({
                    type: 'TREE_STATE_CHANGE',
                    payload: {
                        partialStateName: 'click',
                        partialStateValue: data,
                        objectName: 'organizations',
                        id: treeId
                    }
                })
            }
        }
        //Tree props
        let selectRows = 'radio';
        if(multiple){
            selectRows = 'checkbox';
        }

        return (
            <Counter className="select-users">
                <OrgsCounter className="organizations"><Organizations id={treeId} rootNodes={rootNodes} onClick={onClick}/></OrgsCounter>
                <UsersCounter className="users"><Grid baseFilters={["user_accepted", "=", true]} id={gridId} objectName={gridObjectName} enableSearch={true} columns={gridColumns} searchMode={searchMode} pageSize={pageSize} selectionLabel={selectionLabel} selectRows={selectRows}/></UsersCounter>
            </Counter>
        )
    }
}
export default SelectUsers