
import { Empty, Spin  } from 'antd'
import { useDispatch } from '../hook'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
// import Pdm from '../../test/g6-test/pdm'
import { toCenter } from './../g6/util/graph'
// import { modelConfig , styleConfigLazy } from './config'
import { useFpsHook } from './hooks/callback'
import { useLocalHooks } from './hooks/pagehooks'
import { useResizeUpdate } from './hooks/resize'
import ModelNavi from './model-navi'
// import { updateLayout } from './util'

import intl  from './../g6/util/intel'

export default (
  {
    namespace = 'erd' , primaryColor, toolBarCommands,
    saveFun, delFun, modelEditFun, fieldEditFun, changeData,
    modelInsertFun, useAppContext, getModels,
    getModules, ModelEdit, ModelInsert,
    ErdPage, isFullScreen, ...props}) => {
  const {
    graph,
    models,
    checkedKeys,
    graphRef,
    showModel,
    currentModel,
    layouted,
    showInsertModel,
    search,
    layouting,
    style,
    colors,
  } = useLocalHooks({ namespace, useAppContext, ...props})
  const dispatch = useDispatch()

  useResizeUpdate()

  const onCancle = () => {
    dispatch({
      type: `${namespace}/closeModel`,
    })
  }

  const onInsertCancle = () => {
    dispatch({
      type: `${namespace}/closeInsertModel`,
    })
  }

  const [width, setWidth] = useState(0)

  const G6GraphDomRef = useRef({
    offsetWidth: 0,
    offsetHeight: 0,
  })
  const isKeySharp = useRef(true)
  const [once, setOnce] = useState(true)
  const [updateId, setUpdateId] = useState(0)
  const { tabsRouteContext } = useAppContext()

  useEffect(() => {
     if (isFullScreen) {
      setWidth(G6GraphDomRef.current.offsetWidth)
      setOnce(false)
    } else if (
      G6GraphDomRef.current.offsetWidth &&
      tabsRouteContext.current === '/'
    ) {
      if (layouted) {
        setImmediate(() => {
          G6GraphDomRef.current && setWidth(G6GraphDomRef.current.offsetWidth)
          setOnce(false)
        }, 100)
      } else {
        setWidth(G6GraphDomRef.current.offsetWidth)
      }
    }
  }, [G6GraphDomRef.current.offsetWidth])

  const styleConfig = style

  const erdLoading = models.length > 0 && !!width && !once
  const toolBarCommand = useCallback(
    (name, action) => {
      const _graph = graphRef.current

      if (name === 'keySharp') {
        const { isKeysharp = !isKeySharp.current, isCardSharp } = action
        isKeySharp.current = isKeysharp

        _graph
            .findAll('node', (node) => true)
            .map((node) => {
              _graph.updateItem(node, {
                isKeySharp: isKeySharp.current,
                isCardSharp,
              })
            })

        _graph.paint()
        }
      // }

      if(name === 'export-image') {
        const newZoom = 100
        _graph.isExporting = true
        _graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
          node.getContainer().show()
             _graph.updateItem(node, {
                isKeySharp: false,
                isCardSharp: false ,
              })
        })
        const gwidth = _graph.get('width')
        const gheight = _graph.get('height')
        const point = _graph.getCanvasByPoint(gwidth / 2, gheight / 2)
        // graph.moveTo({x: point.x , y : point.y})
        _graph.zoomTo(newZoom / 100, {x: point.x , y : point.y})
        _graph.paint()
        _graph.downloadFullImage('模型图', undefined, {
          backgroundColor: 'rgb(245, 247, 255)',
        })
        _graph.isExporting = undefined
      }

      if (name === 'min-zoom') {
        const gwidth = _graph.get('width')
        const gheight = _graph.get('height')
        const point = _graph.getCanvasByPoint(gwidth / 2, gheight / 2)

        const zoom = _graph.getZoom()
        if (zoom > 0.2) {
          _graph.zoomTo(zoom - 0.2, point)
        } else {
          _graph.zoomTo(zoom - 0.02, point)
        }
        _graph.paint()
        setUpdateId(+new Date())
      }

      if (name === 'nodeClick') {
        dispatch({
          type: `${namespace}/currentModel`,
          model: action.node,
        })

        const currentNode = _graph
          .getNodes().filter((a) => !a.isSys)
          .find((node) => node.getModel().id === action.node)

        if (currentNode) {
          _graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
            _graph.updateItem(node, {
              selected: node === currentNode,
              noSelected: node === currentNode,
            })
          })

          _graph.paint()
        }
      }

      if (name === 'click') {

        if (action.click === 'modelEdit') {
          const [_, ...actions] = action.node.split('-')
          const actionStrings = actions.join('-')
          if (modelEditFun)
            modelEditFun({
              model: actionStrings,
            })
        }

        if (action.click === 'arrangeShow') {
          dispatch({
            type: `${namespace}/` + action.click,
            model: action.arg,
          })
        }

        if (action.click === 'delModel') {
          dispatch({
            type: `${namespace}/` + action.click,
            model: action.node,
          })
        }

        if (action.click === 'delModule') {
          dispatch({
            type: `${namespace}/` + action.click,
            model: action.node,
          })
        }

        if (action.click === 'fieldSelect') {
          //
          if(action.arg.relationModelKey){
          dispatch({
            type: `${namespace}/currentModel`,
            model: 'model-' + action.arg.relationModelKey,
          })

          const item = _graph.findById('model-' + action.arg.relationModelKey)

          toCenter(item, _graph)
        }

        }

        if (action.click === 'fieldEdit') {
          const [_, ...actions] = action.node.split('-')
          const actionStrings = actions.join('-')
          if (fieldEditFun)
            fieldEditFun({
              model: actionStrings,
              field: action.arg,
            })
        }
      }

      if (name === 'upload') {
        const data = _graph.save()

        const nodes = data.nodes.reduce((pre, { x, y, id }) => {
          return {
            ...pre,
            [id]: {
              x,
              y,
            },
          }
        }, {})
        sessionStorage.setItem('console-erd-graph', JSON.stringify(nodes))
        alert(JSON.stringify(nodes))
      }

      if (name === 'max-zoom') {

        if (_graph.getZoom() >= 2.1) return

        const gwidth = _graph.get('width')
        const gheight = _graph.get('height')
        const point = _graph.getCanvasByPoint(gwidth / 2, gheight / 2)
        const zoom = _graph.getZoom()
        console.log(zoom / 2)
        if (zoom > 0.2) {
          _graph.zoomTo(zoom + 0.2, point)
        } else {
          _graph.zoomTo(zoom + 0.02, point)
        }
        setUpdateId(+new Date())
      }

      if (name === 'editModel') {
        dispatch({
          type: `${namespace}/openModel`,
        })
        const [_, ...actions] = currentModel.split('-')
        const actionStrings = actions.join('-')
        if (modelEditFun)
          modelEditFun({
            model: actionStrings,
          })
      }

      if (name === 'insertModel') {
        dispatch({
          type: `${namespace}/openInsertModel`,
        })
        if (modelInsertFun) modelInsertFun()
      }

      if (name === 'resetLayout') {
        _graph.refresh()
      }

      if (name === 'centerModel') {
        if (action && action.node) {
          dispatch({
            type: `${namespace}/currentModel`,
            model: action.node,
          })

          _graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
            const current = node.getModel().id === action.node
            //  current &&  toCenter(node, _graph)

            _graph.updateItem(node, {
              selected: current,
              isKeySharp: false,
            })
          })
        }

        const item = _graph.findById((action && action.node) || currentModel)

        toCenter(item, _graph)
      }

      if (name === 'save') {
        if (saveFun) saveFun()
      }

      if (name === 'delModel') {
        alert()
        dispatch({
          type: `${namespace}/delModel`,
        })
        delFun && delFun()
      }
    },
    [graphRef.current, currentModel],
  )
  const { fpsRef } = useFpsHook()
  const Pdm = props.Pdm
  return (
    <div
      className='console-g6-page'
    >
    {/* {Pdm && erdLoading && <Pdm />} */}
      <div
        className='console-erd-fps'
        ref={(ref) => {
          fpsRef.current = ref
        }}
      />
      <div
        className='g6-modelnavi'
      >
        <ModelNavi
          namespace={namespace}
          Tree={props.Tree}
          bottomHeight={props.bottomHeight || 78}
          Input={props.Input}
          Pdm={Pdm}
          toolBarCommand={toolBarCommand}
          clickModelNode={(key) => {
            toolBarCommand('nodeClick', {
              node: key,
            })
          }}
          primaryColor={primaryColor}
          getModels={getModels}
          getModules={getModules}
        />
      </div>
      <div className='g6-graph' ref={(ref) => { G6GraphDomRef.current = ref }}>
        {' '}
        <Spin tip='layout...' spinning={erdLoading && layouting}>
        {erdLoading ? (
          <ErdPage
            toolBarCommands={toolBarCommands}
            saveFun={saveFun}
            styleConfig={styleConfig}
            toolBarCommand={toolBarCommand}
            currentModel={currentModel}
            width={width}
            config={styleConfig}
            setGraph={(g) => (graphRef.current = g)}
            changeNodes={checkedKeys}
            checkedKeys={checkedKeys}
            height={G6GraphDomRef.current.offsetHeight - 54}
            graph={graph}
            update={updateId}
            colors={colors}
            setUpdateId={setUpdateId}
            namespace={namespace}
          />
        ) : (
          search ? <Empty
          description='no found model'
        /> :
          <div>
             {
             Pdm ? <Empty style={{textAlign: 'center'}} description={<Pdm />} /> :  <Spin >
               <Empty style={{textAlign: 'center'}} description={intl.get('正在绘制模型图...').d('正在绘制模型图...')}
            /></Spin>
            }
          </div>
        )}
         </Spin>
      </div>
    </div>
  )
      }
