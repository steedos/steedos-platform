
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export const usefullScreen = (useAppContext) => {
  const { shellContext, tabsRouteContext } = useAppContext()
  const [layouted, setLayouted] = useState(false)
  const [change, setChange] = useState(false)
  useEffect(() => {
    shellContext.setState({
      fullScreen: true,
    })
    setLayouted(true)
  }, [])
  useEffect(() => {
    shellContext.setState({
      fullScreen: tabsRouteContext.current === '/model-map',
    })
    return () => {
      shellContext.setState({
        fullScreen: false,
      })
    }
  }, [tabsRouteContext.current === '/model-map'])
  return {
    layouted,
    change,
  }
}
