import { useDispatch, useSelector } from '../../hook'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
// import { modelConfig } from '../config'
import { createLinks, getNodes, layOutNodesByG6  } from '../util'
import { usefullScreen } from './fullscreen'

export const useLocalHooks = ({namespace, useAppContext}) => {
  const graphRef = useRef(null)
  // const { shellContext  } = useAppContext()
  // const { loadData } =  useLoadData({dispatch , getTrantorMetaAllModels, getTrantorMetaModules})

  const { layouted, change } = usefullScreen(useAppContext)
  const {
    models,
    modules,
    checkedKeys,
    showModel,
    currentModel,
    showInsertModel,
    search,
    layouting,
    isArrangeLayout,
    fieldMap,
    config: { topHeight, style, colors },
  } = useSelector((s) => s[namespace])
  const newModels = useMemo(() => models.map(fieldMap).map((a) => ({...a, isShow: (!search || a.name.indexOf(search) >= 0)})), [
    models, search, checkedKeys,
  ])

  const [height] = useState(
    document.documentElement.clientHeight ||
      document.body.clientHeight - topHeight,
  )
  const [nodeState, setNodeState] = useState([])
  const [edgeState, setEdgeState] = useState([])
  const nodes = getNodes(newModels, checkedKeys, style)

  const edgesRes = createLinks(
      newModels,
      nodes,
      checkedKeys,
      style,
    )

  const edges =
  nodes.length >= 0 ? edgesRes.concat(nodes.filter((a) => !a.isSys).map((a) => ({
      key:
                  // 'model-' +
                  a.id +
                  '~' +
                  +'~' +
                  'model-SYS-CENTER-POINT',

      source : a.id,
      visible: false,
      isSys : true,
      style: {
        visible: false,
      },
      target: 'model-SYS-CENTER-POINT',
      type: 'console-line',

    }))) :
    edgesRes
  const dispatch = useDispatch()
  const setLayouting =  useCallback((layoutingSet) => {
    dispatch({
      type: `${namespace}/layouting`,
      layouting: layoutingSet,
    })
  }, [])
  useEffect(() => {
      // alert(1)
      setLayouting(true)
      setImmediate(() => {
        // layOutNodesByG6(nodes, edges, modules, setNodeState, setEdgeState, setLayouting, isArrangeLayout)
        setEdgeState(edges)
        setNodeState(nodes)
       
        setLayouting(false)
       }, 10)
  }, [newModels, checkedKeys, isArrangeLayout, search])

  const graph = useMemo(() =>  ({
    edges : edgeState,
    nodes : nodeState,
  }), [nodeState])

  return {
    height,
    graph,
    models: newModels,
    checkedKeys,
    graphRef,
    showModel,
    currentModel,
    layouted,
    change,
    showInsertModel,
    search,
    modules,
    layouting,
    style,
    colors,
  }
}

// const createGroups = (modules) => {
//   return modules.map((m) => {
//     return {
//       id: `module-${m.key}`,
//       title: {
//       text: m.name,
//       fontSize: 35,
//       stroke: '#444',
//       offsetX: 0,
//       offsetY: 0,
//       },
//     }
//   })
// }
