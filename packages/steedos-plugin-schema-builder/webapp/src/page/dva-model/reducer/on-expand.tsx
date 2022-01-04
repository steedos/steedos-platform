import Immer from 'immer'

export const onExpand  =  (ss, { expanded, node }) => {
  const resData = Immer(ss, (s) => {
    // tslint:disable-next-line: prefer-conditional-expression
    if (expanded) {
      s.expandedKeys = [...s.expandedKeys, node.props.eventKey]
    } else {
      s.expandedKeys = s.expandedKeys.filter((a) => a !== node.props.eventKey)
    }
  })
  return resData
}

export const openModel = (ss) => {
  return { ...ss,
           showModel: ss.currentModel,
  }
}

export const modelEdit  = (ss, {
  model,
}) => {
  return { ...ss,
           showModel: model,
  }
}
