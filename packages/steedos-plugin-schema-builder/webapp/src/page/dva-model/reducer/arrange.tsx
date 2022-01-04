const getLayerRootModel = (models, rootKey, roots = []) => {
  const rootModel = models.find((a) => a.key === rootKey)
  const rootsRes = rootModel ? [...roots, rootKey] : roots
  const isRoot = (rootModel.aggregateModelKey && rootModel.aggregateModelKey !== rootKey)
  const rootsResList = isRoot ? getLayerRootModel(models, rootModel.aggregateModelKey, rootsRes) : rootsRes
  return rootsResList
 }

export const arrangeShow = (ss, {model}) => {
  // alert(model)
  const roots = getLayerRootModel(ss.models, model, [])
  // alert(JSON.stringify(roots))
  const list = ss.models.filter((a) => (a.key === model ||  roots.indexOf(a.aggregateModelKey) >= 0)).map((a) => 'model-' + a.key)
  return {...ss , checkedKeys: list, currentModel: model, isArrangeLayout: true}

}
