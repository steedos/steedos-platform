
export  const initStyle = ({primaryColor}) => {
   const colors = {
    // blue : '#495D9E',

    // get blue() {
    //   const res = (window.SYS_backEndConfig && window.SYS_backEndConfig.STYLE_PRIMARY_COLOR)  || '#495D9E'
    //   if (_styleConfigLazy) {
    //   _styleConfigLazy.selected.node.stroke = res
    //   _styleConfigLazy.default.edge.stroke = res
    //  }
    //   return res
    // // #0083EE
    // },
    // blue : window.SYS_backEndConfig && window.SYS_backEndConfig.PRESET_CSS_URL  ? '#0083EE' : '#495D9E',
    // #0083EE
    blue: primaryColor,
    white: '#FFFFFF',
    head: 'rgba(7,10,26,0.06)',
    black: 'black',
  }

   const style = {
    naviWidth: 370,
    default: {
      node: {
        fill: '#FFFFFF',
        // shadowColor: 'rgba(0,0,0,0.06)',
        shadowBlur: 15,
        shadowOffsetX: 8,
        shadowOffsetY: 8,
        radius: 10,
        // stroke: undefined,
        lineWidth: 4 ,
        opacity: 0.8,
        stroke: 'black',
      },
      edge: {
        lineWidth: 2,
        size: 2,
        lineAppendWidth: 4,
        endArrow: {
          path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
          d: 4,
        },
        opacity: 0.2,
        radius: 5,
        labelCfg: {
          autoRotate: true,   // 使文本随边旋转
          style: {
            fontSize: 34,
          },
        },
        stroke: 'rgba(11,108,149)',
      },
    },
    inactive: {
      edge: {
        stroke: 'red',
      }
    },
    selected: {
      node: {
        stroke: 'rgba(11,108,149)',
      },
    },
    active: {
      edge: {
        stroke: 'red',
      }
    },
    noSelected: {
      node: {
        stroke: 'red',
      },
    },
    isNoModule : {
      node: {
        opacity: 0.2,
      },
    },
  }

   return {
    colors,
    style,
  }
}
