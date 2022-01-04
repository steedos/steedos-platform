
export const toCenter = (item, graph) => {
  if (!item) return

  graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
    node.getContainer().show()
  })

  graph.zoomTo(1)
  graph.focusItem(item)
  // 聚焦当前点击的节点（把节点放到视口中心）
  let matrix = item.get('group').getMatrix()
  let point = {
    x: matrix[6],
    y: matrix[7],
  }
  let width = graph.get('width')
  let height = graph.get('height') // 找到视口中心
  // const itemHeight = item.getKeyShape().height
  // // if(height <  itemHeight) {

  // // }
  // let viewCenter = {
  //   x: width / 2,
  //   y: height / 2,
  // }
  // let modelCenter = graph.getPointByCanvas(viewCenter.x, viewCenter.y)
  // let viewportMatrix = graph.get('group').getMatrix() // 画布平移的目标位置，最终目标是graph.translate(dx, dy);
  // // const pointY = height <  itemHeight ? (point.y - (height - itemHeight) / 2) : point.y
  // // const pointY = (point.y - (itemHeight - height) / 2)
  // const pointY =  point.y
  // let dx = (modelCenter.x - point.x) * viewportMatrix[0]
  // let dy = (modelCenter.y - pointY) * viewportMatrix[4]
  // // let lastX = 0
  // // let lastY = 0
  // // let newX = void 0
  // // let newY = void 0 // 动画每次平移一点，直到目标位置
  // // graph.get('canvas').animate({
  // //   onFrame: function onFrame(ratio) {
  // //     newX = dx * ratio
  // //     newY = dy * ratio
  // //     graph.translate(newX - lastX, newY - lastY)
  // //     lastX = newX
  // //     lastY = newY
  // //   },
  // // }, 300, 'easeCubic')
  const itemHight = item.getKeyShape().attr('height')
  // alert(itemHight)
  const graphHeight = height / 2

  graph.translate(0, (- graphHeight + itemHight / 2 + 120))

  // graph.translate(0, (- height / 2) +  (item.getKeyShape().height / 2))

  // graph.paint()

  // graph.paint()
  // // graph.layout()
  // setTimeout(() => { graph.zoomTo(1) ; graph.paint() }, 2000)
}
