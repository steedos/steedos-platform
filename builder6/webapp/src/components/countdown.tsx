import React, { useEffect, useCallback, useState, useMemo } from 'react'

type Options = {
  total?: number
  lifecycle?: 'always' | 'session'
}

const useCountDown = (
  timerKey: string,
  options: Options
) => {
  const [addData, getData] = useMemo(() => {
    const total = options.total || 60
    const lifecycle = options.lifecycle || 'session'
    const saveKey = `__${timerKey}`
    const getSaveData = () => '' + (Date.now() + total * 1000)
    let getter, setter
    switch (lifecycle) {
      case 'always':
        setter = () => localStorage.setItem(saveKey, getSaveData())
        getter = () => localStorage.getItem(saveKey)
        break
      case 'session':
        setter = () => sessionStorage.setItem(saveKey, getSaveData())
        getter = () => sessionStorage.getItem(saveKey)
        break
    }
    return [setter, getter] as [() => undefined, () => string | null | number]
  }, [options, timerKey])

  const resetCountDown = useCallback(() => {
    addData()
  }, [addData])

  const getRestTime = useCallback(() => {
    let expiredTime: string | null | number = getData()
    if (!expiredTime) {
      return 0
    } else {
      expiredTime = +expiredTime
      if (isNaN(expiredTime)) {
        return 0
      } else {
        const restTime = Math.floor(((expiredTime - Date.now()) / 1000))
        return restTime < 0 ? 0 : restTime
      }
    }
  }, [getData])

  const [restTime, setRestTime] = useState(getRestTime())

  useEffect(() => {
    const timer = setInterval(() => {
      const newRestTime = getRestTime()
      if (restTime !== newRestTime) {
        setRestTime(newRestTime)
      }
    }, 500)
    return () => {
      clearInterval(timer)
    }
  }, [getRestTime, restTime])

  return [
    restTime,
    resetCountDown
  ] as [number, () => undefined]
}

const CountDownProvider = ({ id, children, options }: {
  id: string,
  options: Options,
  children: (restTime: number, resetCountDown: () => undefined) => any
}) => {
  const [restTime, resetCountDown] = useCountDown(id, options)
  return children(restTime, resetCountDown)
}

export { useCountDown, CountDownProvider }