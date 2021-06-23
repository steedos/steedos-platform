import G6 from '@antv/g6'
import dagre from 'dagre'

const setNodeXY = (nodesDict, node) => {
  const { id } = node

  if (nodesDict[id]) {
    node.x = nodesDict[id].x
    node.y = nodesDict[id].y
    return true
  } 
  return false
}

const getLength  = (length) => {
  return length >= 20 ? length : 20
 }

export const layOutNodesByG6 = (nodes: any[], edges: any[], groups: any[], setNodeState, setEdgeState, setLayouting, isArrangeLayout) => {
  // layOutNodesByG6Force(nodes , edges, [])
  if (isArrangeLayout) {
     layOutNodesByG6Force(nodes, edges.filter((a) => a.arrangeLink) , [])
     if (setNodeState) {
      setEdgeState(edges.filter((a) => !a.isSys))
      setNodeState([...nodes])
      if (setLayouting) setLayouting(false)
    }
  } else {
  const subgraphLayout = new G6.Layout.force({
    // center: [500, 450],
    // nodeSize: 700,
    // nodeStrength: -30,
    // linkDistance:200,
    nodeSpacing: -180 ,
    preventOverlap: true,
    onLayoutEnd: () => {
      alert('onLayoutEnd')
      if (setNodeState) {
        setEdgeState(edges)
        setNodeState([...nodes])
        if (setLayouting) setLayouting(false)
      }

       },
    // workerEnabled: false,
    workerEnabled: true,
  })

  // 初始化布局，灌入子图数据
  subgraphLayout.init({
    nodes,
    edges,
  })

  // 执行布局
  subgraphLayout.execute()
  console.log([nodes, edges])

  // const graphString = sessionStorage.getItem('console-erd-graph')
  // // alert('force layout')
  // const nodesDict = graphString && JSON.parse(graphString)
  // nodes.forEach((node) => {
  //   if (nodesDict) {
  //      setNodeXY(nodesDict, node)
  //   }
  // })

  // 图实例根据数据更新节点位置
  // graph.positionsAnimate()
  return [nodes, edges]
}
 }

export const layOutNodesByG6Force  = (nodes: any[], edges: any[], groups: any[]) => {
  const subgraphLayout = new G6.Layout.dagre({
    // center: [500, 450],
    workerEnabled: true,
  })

  // 初始化布局，灌入子图数据
  subgraphLayout.init({
    nodes,
    edges,
  })

  // 执行布局
  subgraphLayout.execute()

  const graphString = sessionStorage.getItem('console-erd-graph')
  alert(graphString)
  const nodesDict = graphString && JSON.parse(graphString)
  nodes.forEach((node) => {
    if (nodesDict) {
       setNodeXY(nodesDict, node)
    }
  })

  // 图实例根据数据更新节点位置
  // graph.positionsAnimate()
  return [nodes, edges]
 }

export const layOutNodes = (nodes: any[], edges: any[], groups: any[]) => {
  // alert(nodes.length)
  let g = new dagre.graphlib.Graph()
  g.setGraph({
    // ranker: 'network-simplex',
    // acyclicer: undefined,
    // rankdir: 'LR',
    // align: 'UL',
    // ranksep: 500,
  })
  g.setDefaultEdgeLabel((v, w) => ({
    label: v + '~' + w,
  }))
  nodes.filter((a) => !a.isSys).forEach((node) => {
    const { config, data } = node
    g.setNode(node.id, {
      label: node.id,
      width: (config.width / 6) * 6,
      height:
        ((config.headerHeight +  getLength(data.fields.length) * config.fieldHeight) / 6) *
        6,
    })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  // groups.forEach((group) => {

  //   const gNodes = nodes.filter((a) => a.moduleKey === group.key)
  //   if (gNodes.length > 1) {
  //     gNodes.forEach((n, i) => {
  //       if (i < (gNodes.length - 1)) {
  //       // g.setEdge(gNodes[i].id, gNodes[i + 1].id)
  //       g.setEdge(gNodes[0].id, n.id)
  //       }
  //     })
  //   }

  // })
  dagre.layout(g)
  const graphString = sessionStorage.getItem('console-erd-graph')
  const nodesDict = graphString && JSON.parse(graphString)
  nodes.forEach((node) => {
    if (nodesDict) {
      
      const isStorage = setNodeXY(nodesDict, node)
      if (isStorage) return
    }

    node.x = g.node(node.id).x
    node.y = g.node(node.id).y
  }) 
  
  
  // -------

  // edges.forEach((edge) => {
  //   const { source, target, fieldIndex, fieldsLength } = edge
  //   const i = fieldIndex
  //   const l = fieldsLength
  //   const sourceModel = nodes.find((a) => a.id === source)
  //   const targetModel = nodes.find((a) => a.id === target)
  //   const isTo = sourceModel && targetModel && targetModel.x > sourceModel.x //  const l = sourceModel.data.fields.length
  //   if (sourceModel !== targetModel) {
  //      edge.sourceAnchor = !isTo ? (i + 2) : (2 + i + l)
  //      // edge.targetAnchor = isTo ? 0 : 1
  //      edge.targetAnchor  = undefined
  //   }
  //   // const { points } = g.edge({v: sourceModel.id , w: targetModel.id })
  //   // edge.controlPoints = points
  //   // edge.controlPoints = g.edge(edge)
  // })

//   g.edges().forEach((e) => {
//     console.log('Edge ' + e.v + ' -> ' + e.w + ': ' + JSON.stringify(g.edge(e)))
// })

  return {
    nodes: nodes.reduce((pre, item) => ({ ...pre, [item.id]: item }), {}),
    edges,
  }
}
