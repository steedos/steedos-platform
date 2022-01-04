import G6 from '@antv/g6'
import Immer from 'immer'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { register } from './model-node'
import './model.scss'
import Toolbar from './toolbar'
import { useSelector } from '../../hook'
// import intl from './../util/intel'
const MINZOOM = 0.01
const MAXZOOM = 1.1
export const render = (container, data, props, setZoom, lockMinZoom) => {
  let width = props.width
  let height = props.height
  const { styleConfig } = props
  const nodes = data.nodes
  let graph = new G6.Graph({
    // renderer:"svg",
    // groupByTypes: false,
    fitView: true,
    container,
    minZoom: lockMinZoom ? 0.6 : MINZOOM,
    maxZoom: MAXZOOM,
    width,
    height,
    // autoPaint: false,
    // layout: {
    //   type: 'fruchterman',
    //   gravity: 20,              // 可选
    //   speed: 2,                 // 可选
    //   clustering: true,         // 可选
    //   clusterGravity: 30,       // 可选
    //   maxIteration: 2000,       // 可选，迭代次数
    //   workerEnabled: true       // 可选，开启 web-worker  }
    // },
    // layout : {
    //   alphaDecay: 0.2 ,
    //   type: 'force',
    //   // collideStrength: 0.5,
    //   // nodeSpacing: (d) => {
    //   //   if (d.id === 'model-SYS-CENTER-POINT') {
    //   //     return 500;
    //   //   }
    //   //   return -150;
    //   // },

    //   // nodeStrength: d => {
    //   //   if (d.id === 'model-SYS-CENTER-POINT') {
    //   //     return : 500;
    //   //   }
    //   //   return 0;
    //   // },
    //   preventOverlap: true,
    //   onLayoutEnd: () => {
    //     graph.fitView(0)
    //   }

    // },
    animate: true,
    defaultEdge: styleConfig.default.edge,
    edgeStateStyles: {
      default: styleConfig.default.edge,
      active: {
        opacity: 1,
        size: 3,
      }
    },
    modes: {
      default: [
        'drag-canvas', {
          type: 'zoom-canvas',
          // enableOptimize: true,
          minZoom: MINZOOM,
          maxZoom: MAXZOOM,
        },
        {
          type: 'drag-node',
          // enableDelegate: true,
          // delegate: false,
          // delegateStyle: {
          //   strokeOpacity: 0, fillOpacity: 0
          // }
        },
        {
          type: 'edge-tooltip',
          formatText: (model) => {
            return model.tooltip;
          },
          offset: 10
        },
        {
          type: 'activate-relations',
          // resetSelected: true,
          trigger: 'click'
        },
      ],
    },
    plugins: [
      new G6.Minimap({
        type: 'delegate',
        viewportClassName: 'g6-minimap-viewport-erd',
        delegateStyle: {
          fill: 'rgba(0,0,0,0.10)',
        },
      })
    ],
  })
  graph.data({ nodes, edges: data.edges })
  graph.render()
  // alert(nodes.length)
  graph.get('canvas').set('localRefresh', false)
  graph.on('node:dblclick', (ev) => {
    const node = ev.item
    node.toFront()
    graph.paint()

    if (props.nodeDbClick) {
      props.nodeDbClick(ev.item.getModel().id)
    }
  })

  const whZoom = _.throttle(() => {
    const zoom = graph.getZoom()
    setZoom(zoom)
  }, 100)

  graph.on('canvas:dragstart', () => {
    const canvasElement = graph.get('canvas').get('el')
    canvasElement.style.cursor = 'grabbing'
  })

  // graph.on('afterlayout', () => {
  //   // alert()
  //   setTimeout(()=>{
  //     graph.fitView(0)
  //   }, 500)

  // })

  // canvas:dragend
  graph.on('canvas:dragend', () => {
    const canvasElement = graph.get('canvas').get('el')
    canvasElement.style.cursor = 'grab'
  })

  graph.on('wheelzoom', (e) => {
    whZoom()
  })
  graph.on('node:mouseout', (ev) => {
    const {
      item,
    } = ev
    const autoPaint = graph.get('autoPaint')
    graph.setAutoPaint(false)
    item.getContainer().findAll((sharp) => sharp.attr('fieldHover')).forEach((sharp) => {
      if (sharp.attr('fill-old')) {
        sharp.attr('fill', sharp.attr('fill-old'))
        sharp.attr('fill-old', undefined)
      }

      if (sharp.attr('opacity-old')) {
        sharp.attr('opacity', sharp.attr('opacity-old'))
        sharp.attr('opacity-old', undefined)
      }
    })
    graph.paint()
    graph.setAutoPaint(autoPaint)
  })
  graph.on('node:mousemove', (ev) => {
    const {
      target,
      item,
    } = ev // alert(target.attr('text'))

    const autoPaint = graph.get('autoPaint')
    graph.get('canvas').set('localRefresh', false)
    graph.setAutoPaint(false) // if (target.attr('fieldBg')) {
    //   item.setState('fieldHover-' + target.attr('fieldName'), true)
    // }

    const fieldName = target.attr('fieldName')
    item.getContainer().findAll((sharp) => sharp.attr('fieldHover')).forEach((sharp) => {
      if (sharp.attr('fill-old')) {
        sharp.attr('fill', sharp.attr('fill-old'))
        sharp.attr('fill-old', undefined)
      }

      if (sharp.attr('fieldHoverShow')) {
        sharp.attr('opacity', 0) // sharp.attr('opacity-old', undefined)
      }

      if (sharp.attr('fieldName') === fieldName) {
        sharp.attr('fill-old', sharp.attr('fill'))
        sharp.attr('fill', sharp.attr('fieldBg') ? 'rgb(204,204,204)' : 'white')

        if (sharp.attr('fieldHoverShow')) {
          sharp.attr('opacity-old', sharp.attr('opacity')) // alert(sharp.attr('opacity'))

          sharp.attr('opacity', 1)
        }
      }
    }) // item.refresh()

    graph.paint()
    graph.setAutoPaint(autoPaint)
  }) 
  
  // click

  graph.on('node:click', (ev) => {
    const {
      target,
    } = ev

    if (target.attr('click')) {
      props.toolBarCommand && props.toolBarCommand('click', {
        node: ev.item.getModel().id,
        arg: target.attr('arg'),
        click: target.attr('click'),
      })
    } else {
      props.toolBarCommand && props.toolBarCommand('nodeClick', {
        node: ev.item.getModel().id,
      })

      if (props.nodeClick) {
        props.nodeClick(ev.item.getModel().id)
      }
    }
  })
  graph.on('node:dragend', (ev) => {
    const shape = ev.target
    const node = ev.item
    const edges = node.getEdges()
    const x = ev.x
    edges.forEach((edge) => {
      const sourceNode = edge.getSource()
      const targetNode = edge.getTarget()

      if (node === sourceNode) {
        const edgeModel = edge.getModel()
        const isTo = x < targetNode.getModel().x
        const i = edgeModel.fieldIndex
        const l = edgeModel.fieldsLength
        if (sourceNode === targetNode) {
          graph.updateItem(edge, {
            // sourceAnchor: !isTo ? i + 2 : 2 + i + l,
            // targetAnchor: edge.targetAnchor,
          })
        } else {
          graph.updateItem(edge, {
            sourceAnchor: !isTo ? i + 2 : 2 + i + l,
            // targetAnchor: isTo ? 0 : 1,
          })

        }

      } else {
        const edgeModel = edge.getModel()
        const isTo = sourceNode.getModel().x < x
        const i = edgeModel.fieldIndex
        const l = edgeModel.fieldsLength

        if (sourceNode === targetNode) {
          graph.updateItem(edge, {
            // sourceAnchor: !isTo ? i + 2 : 2 + i + l,
            // targetAnchor: undefined,
          })
        } else {
          graph.updateItem(edge, {
            sourceAnchor: !isTo ? i + 2 : 2 + i + l,
            // targetAnchor: isTo ? 0 : 1,
          })
        }
      }
    }) // ----获取所有的边
    // ----获取所有关联模型
    // ----计算位置
    // ----重新设置锚点
    // node.toFront()

    graph.paint() // console.log(shape)
  })
  graph.on('beforepaint', _.throttle(() => {
    // alert()
    const isExporting = graph['isExporting']
    const gWidth = graph.get('width')
    const gHeight = graph.get('height')
    // 获取视窗左上角对应画布的坐标点
    const topLeft = graph.getPointByCanvas(0, 0) // 获取视窗右下角对应画布坐标点

    const bottomRight = graph.getPointByCanvas(gWidth, gHeight)
    graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
      const model = node.getModel()
      if (model.isSys) {
        node.getContainer().hide()
        return
      }
      if (isExporting) return
      const {
        config,
        data: _data,
      } = model
      const h = (config.headerHeight + _data.fields.length * config.fieldHeight + 4) / 2
      const w = config.width / 2 // 如果节点不在视窗中，隐藏该节点，则不绘制
      // note:由于此应用中有minimap，直接隐藏节点会影响缩略图视图，直接隐藏节点具体内容

      if (!model.selected && (model.x + w < topLeft.x - 200 || model.x - w > bottomRight.x || model.y + h < topLeft.y || model.y - h > bottomRight.y)) {
        node.getContainer().hide()
      } else {
        // 节点在视窗中，则展示
        node.getContainer().show()
      }
    })
    const edges = graph.getEdges()
    edges.forEach((edge) => {
      let sourceNode = edge.get('sourceNode')
      let targetNode = edge.get('targetNode')
      const targetModel = targetNode.getModel()
      if (!edge.getModel().self) {
        const isTo = targetModel.x > sourceNode.getModel().x
        const targetAnchor = (isTo ? 0 : 1)
        if (targetModel.targetAnchor !== targetAnchor)
          // edge.set('targetAnchor', targetAnchor)
          graph.updateItem(edge, { targetAnchor })
      }

      if (targetModel.isSys) {
        edge.hide()
        return
      }
      if (isExporting) return

      if (!sourceNode.getContainer().get('visible') && !targetNode.getContainer().get('visible')) {
        edge.hide()
      } else {
        edge.show()
      }
    })
  }, 300)) // graph.on('node:dblclick', (ev) => {
  // })

  return graph
}

const useUpdateItem = ({ currentModel, graph, showNameOrLabel }) => {
  useEffect(() => {

    if (graph) {
      const gnodes = graph.getNodes()
      if (!gnodes.length) return
      // alert(nodes.length)
      const zoomNum = graph.getZoom()
      // alert(JSON.stringify(nodes))
      gnodes.forEach((node) => {
        if (node.isSys) return
        const nodeModel = node.getModel()
        const nodeId = nodeModel.id
        const data = nodeModel ? nodeModel.data : undefined
        const isNoModule = (currentModel || '').indexOf('module-') >= 0 && ((data && data.moduleKey) !== currentModel)
        const isKeySharp = zoomNum <= 0.20 * 2
        const isCardSharp = zoomNum <= 0.05 * 2
        // alert(isKeySharp)
        graph.updateItem(node, {
          selected: nodeId === currentModel,
          noSelected: node !== currentModel,
          isNoModule,
          isKeySharp,
          isCardSharp,
          showNameOrLabel
        })
      })

      //  const edges = graph.getEdges()
      //  if(edges.length && currentModel){
      //     edges.forEach(edge => {
      //       if (edge.isSys) return
      //       graph.setItemState(edge, 'active', true )
      //       // edge.attr('stroke','red')
      //     })
      //  }

      // graph.paint()
    }

  }, [currentModel, graph && graph.getZoom(), graph?.getNodes(), showNameOrLabel])
}

export const ErdPage = (props) => {
  // const [data , setData ] = useState(props.graph)
  const { lockMinZoom, showNameOrLabel } = useSelector((s) => s[props.namespace])
  const containerRef = useRef({})
  const [graph, setGraph] = useState<any>(null)
  const {
    zoom,
    setZoom,
  } = useLocal()


  useEffect(() => {
    if (graph && props.width > 0 && props.height > 0) {
      // alert(props.width)
      graph.changeSize(props.width, props.height)
      graph.fitView(0) //  alert(props.width)

    }
  }, [props.width, props.height])

  const setNodeXY = (nodesDict, node) => {
    const { id } = node

    if (nodesDict[id]) {
      node.x = nodesDict[id].x
      node.y = nodesDict[id].y
      return true
    }
    return false
  }

  useEffect(() => {
    if (graph && graph.getNodes().length) {
      // graph.updateLayout({
      //   alphaDecay : 1 - graph.getNodes().length / 20
      //  })
      // if(graph.getNodes().length <= 5)
      // {
      //   // alert()
      //      graph.updateLayout({
      //        alphaDecay :1
      //  })
      // }
      graph.fitView(0)
      // alert(111) 
    }

  }, [graph?.getNodes().length >= 1])

  useEffect(() => {
    // alert(lockMinZoom)
    if (graph) {
      //  minZoom: lockMinZoom ? 0.6 : MINZOOM,
      if (graph.getZoom() < 0.6) {
        graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
          node.getContainer().show()
          graph.updateItem(node, {
            isKeySharp: false,
            isCardSharp: false,
          })
        })
        const gwidth = graph.get('width')
        const gheight = graph.get('height')
        const point = graph.getCanvasByPoint(gwidth / 2, gheight / 2)
        // graph.moveTo({x: point.x , y : point.y})
        graph.zoomTo(0.6, { x: point.x, y: point.y })
      }
      graph.setMinZoom(lockMinZoom ? 0.6 : MINZOOM)
    }
  }, [lockMinZoom])


  useUpdateItem({ currentModel: props.currentModel, graph, showNameOrLabel })

  useEffect(() => {
    register({ colors: props.colors })
    const g = render(containerRef.current, props.graph, props, setZoom, lockMinZoom)
    setGraph(g) // tslint:disable-next-line: no-unused-expression

    props.setGraph && props.setGraph(g)
    return () => {
      // alert(0)
      if (graph) {
        graph.destroy()
      }
    }
  }, [])
  useEffect(() => {
    // setGraph(render(containerRef.current, data, props))
    if (graph) {
      // })
      const data = props.graph // alert(JSON.stringify(data))

      if (data.nodes.length >= 1) {

        // graph.refresh()
        // alert()
        // graph.updateLayout({
        //   alphaDecay: 1 ,
        //   type: data.nodes.length <= 5 ? 'random' : 'force',
        //   nodeSpacing: -150 ,
        //   preventOverlap: true,
        //   onLayoutEnd: () => {
        //       graph.fitView(0)
        //    }
        // })
        // graph.layout()
        // const graphString = sessionStorage.getItem('console-erd-graph')
        // // alert(graphString)
        // const nodesDict = graphString && JSON.parse(graphString)
        // data.nodes.forEach((node) => {
        //   if (nodesDict) {
        //     setNodeXY(nodesDict, node)
        //   }
        // })
        console.log(data)
        graph.changeData(data)
        graph.updateLayout({
          type: data.nodes.length > 3 ? 'force' : 'circular',
          condense: true,
          cols: 3,
          workerEnabled: true,
          linkDistance: 0 ,
          alphaDecay: 0.2 ,
          // begin: [ 0, 0 ], 
          preventOverlap: true,
          collideStrength: 0.5,
          nodeSpacing: -180,

          // nodeStrength: d => {
          //   if (d.id === 'model-SYS-CENTER-POINT') {
          //     return 500;
          //   }
          //   return 0;
          // },
          onLayoutEnd: () => {
            graph.fitView(0)
            const zoom = graph.getZoom()
            graph.findAll('node', (node) => true).map((node) => {
              // const isKeySharp = zoomNum  <= 0.20 * 2
              // const isCardSharp =  zoomNum <= 0.05 * 2
              graph.updateItem(node, {
                isKeySharp: zoom < 0.4,
                isCardSharp: zoom <= 0.1,
              })
            })
            setZoom(zoom)
          }
        })
       
        // data.nodes.length > 3 || setTimeout(() => {
        //   graph.fitView(0)
        //   const zoom = graph.getZoom()
        //   graph.findAll('node', (node) => true).map((node) => {
        //     // const isKeySharp = zoomNum  <= 0.20 * 2
        //     // const isCardSharp =  zoomNum <= 0.05 * 2
        //     graph.updateItem(node, {
        //       isKeySharp: zoom < 0.4,
        //       isCardSharp: zoom <= 0.1,
        //     })
        //   })
        //   // alert(zoom)
        //   setZoom(zoom)
        // }, 500)

      } else {
        graph.clear() // graph.fitView(0)
        graph.refresh()
        graph.paint()
      }
    }
  }, [props.graph])

  return (
    <div className='model-page'>
      <Toolbar setUpdateId={props.setUpdateId} namespace={props.namespace} zoom={zoom} {...props} graph={graph} currentModel={props.currentModel} toolBarCommands={props.toolBarCommands} />
      <div id='graph' ref={(ref) => containerRef.current = ref} className='graph' /></div>)
}

const useLocal = () => {
  const [zoom, setZoom] = useState(0)
  return {
    zoom,
    setZoom,
  }
}
