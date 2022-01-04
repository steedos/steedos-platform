import React, { useReducer, useMemo } from 'react'
import ReactDom from 'react-dom'
import { createContainer } from "unstated-next"
import  DvaModel  from '../page/dva-model'


const dvaModel = DvaModel({namespace: 'erd'})

const reduce = (state, action) => {
    const actiontype = action.type.substring(action.type.indexOf('/') + 1, action.type.length)
    const reduce = dvaModel.reducers[actiontype]
    if(reduce) {
        return  { erd : reduce(state.erd, action ) }
    }
    return state
}

const dvaState = { 'erd' :  dvaModel.state }

const usePageModel = () => {

    const [state, dispath] = useReducer(reduce, dvaState)
    return {
        state , dispath
    }

}

export const PageModel = createContainer(usePageModel)

export const useDispatch = () => {
     const { dispath } = PageModel.useContainer()
     return dispath 
}

export const useSelector = (selector) => {
    const { state } = PageModel.useContainer()
    const resultState = useMemo(()=>  (selector ? selector(state) : state) , [selector , state])
    return resultState
}


//useDispatch, useSelector




