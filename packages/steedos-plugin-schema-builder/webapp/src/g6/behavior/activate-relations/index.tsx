
export default {
  getDefaultCfg() {
    return {
      trigger: 'mouseenter',
      // 可选 mouseenter || click
      activeState: 'active',
      inactiveState: 'inactive',

      shouldUpdate() {
        return true
      },

    }
  },

  getEvents() {
    if (this.get('trigger') === 'mouseenter') {
      return {
        'node:mouseenter': 'setAllItemStates',
        'node:mouseleave': 'clearAllItemStates',
      }
    }

    return {
      'node:click': 'setAllItemStates',
      'canvas:click': 'clearAllItemStates',
    }
  },

  setAllItemStates(e) {
    // return
    const graph = this.get('graph')
    const item = e.item
    this.item = item

    if (!this.shouldUpdate(e.item, {
      event: e,
      action: 'activate',
    })) {
      return
    }

    const activeState = this.get('activeState')
    const inactiveState = this.get('inactiveState')
    const autoPaint = graph.get('autoPaint')
    graph.setAutoPaint(false)
    graph.getNodes().filter((a) => !a.isSys).forEach((node) => {
      // graph.setItemState(node, activeState, false)
      // inactiveState && graph.setItemState(node, inactiveState, true)
      graph.updateItem(node, {
        active: false,
        inactive: true,
      })
    })
    graph.getEdges().filter((a) => !a.isSys).forEach((edge) => {
      graph.setItemState(edge, 'init', false)
      // graph.updateItem(edge, { active: false, into : false })
      graph.setItemState(edge, inactiveState, true)
      graph.setItemState(edge, activeState, false) // inactiveState && graph.setItemState(edge, inactiveState, true)
    }) // inactiveState && graph.setItemState(item, inactiveState, false)
    // graph.setItemState(item, activeState, true)

    graph.updateItem(item, {
      active: true,
    }) // const { target } = e
    // // alert(target.attr('text'))
    // if (target.attr('text')) {
    //    target.attr('fill_old', target.attr('fill'))
    //    target.attr('fill', 'red')
    // }

    graph.getEdges().forEach((edge) => {
      if (edge.getSource() === item) {
        // inactiveState && graph.setItemState(edge.getTarget(), inactiveState, false)
        // graph.updateItem(edge.getTarget(), { active: true })
        graph.setItemState(edge.getTarget(), activeState, true)
        graph.setItemState(edge, activeState, true)
        graph.setItemState(edge, inactiveState, false) // graph.updateItem(edge, { active: true, into : true })

        graph.updateItem(edge.getTarget(), {
          out: false,
          into: true,
        })
        edge.toFront()
      } else if (edge.getTarget() === item) {
        graph.updateItem(edge.getSource(), {
          into: false,
          out: true,
        })
        // inactiveState && graph.setItemState(edge.getSource(), inactiveState, false)

        graph.setItemState(edge.getSource(), activeState, true)
        graph.setItemState(edge, activeState, true)
        graph.setItemState(edge, inactiveState, true) // graph.updateItem(edge, { active: true, out : true })

        edge.toFront()
      }
    })
    graph.paint()
    graph.setAutoPaint(autoPaint)
    graph.emit('afteractivaterelations', {
      item: e.item,
      action: 'activate',
    })
  },

  clearAllItemStates(e) {
    // return
    // const { target } = e
    // // alert(target.attr('text'))
    // if (target.attr('text')) {
    //   //  target.attr('fill_old', target.attr('fill'))
    //   if (target.attr('fill_old'))
    //    target.attr('fill', target.attr('fill_old'))
    // }
    const graph = this.get('graph')

    if (!this.shouldUpdate(e.item, {
      event: e,
      action: 'deactivate',
    })) {
      return
    }

    const autoPaint = graph.get('autoPaint')
    graph.setAutoPaint(false)
    const activeState = this.get('activeState')
    const inactiveState = this.get('inactiveState')
    graph.getNodes().filter((a) => !a.isSys).forEach((n) => {
      // graph.clearItemStates(node, [activeState , inactiveState ])
      // graph.setItemState(n, activeState, false)
      // graph.setItemState(n, inactiveState, false)
      graph.updateItem(n, {
        active: false,
        into: false,
        out: false,
        inactive: false,
      })

    })
    // alert(graph.getEdges().length)
    graph.getEdges().forEach((n) => {
      // graph.updateItem(n, { active: false, into : false , out : false })
      // graph.clearItemStates(edge, [activeState , inactiveState ])
      graph.clearItemStates(n, [activeState, inactiveState])
      graph.setItemState(n, 'init', true)
      // graph.setItemState(n, activeState, false)
      // graph.setItemState(n, inactiveState, false)
    })
    graph.paint()
    graph.setAutoPaint(autoPaint) // alert(activeState)

    graph.emit('afteractivaterelations', {
      item: e.item || this.item,
      action: 'deactivate',
    })
  },

}
