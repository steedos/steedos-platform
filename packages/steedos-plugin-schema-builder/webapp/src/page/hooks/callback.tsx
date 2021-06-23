import { useCallback, useEffect, useRef } from 'react'
import Stats from 'stats.js'
export const useLoadData = ({
  dispatch,
  namespace,
  getModels,
  getModules,
  primaryColor,
}) => {
  const loadData = useCallback(() => {
    if (getModels && getModules) {
      const fun = async () => {
        const data = await getModels({})
        const modules = await getModules({})
        dispatch({
          type: `${namespace}/init`,
          modules: modules.res,
          models: data.res,
          primaryColor,
        })
      }

      fun()
    }
  }, [dispatch, getModels, getModules])
  return {
    loadData,
  }
}
export const useFpsHook = () => {
  const fpsRef = useRef(null)
  useEffect(() => {
    if (fpsRef.current && window.SYS_backEndConfig && window.SYS_backEndConfig.ERD_FPS) {
      const stats = new Stats() // alert(stats.dom)

      stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom

      fpsRef.current.appendChild(stats.dom)
      stats.dom.style.position = 'relative'

      function animate() {
        stats.begin() // monitored code goes here

        stats.end()
        requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    }
  }, [])
  return {
    fpsRef,
  }
}
