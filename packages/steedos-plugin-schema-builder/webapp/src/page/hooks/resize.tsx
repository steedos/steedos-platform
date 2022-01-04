
import { useCallback, useEffect, useState } from 'react'

export const useResizeUpdate = () => {

  const [_, update] = useState(0)

  const onResize = useCallback(() => {
    // alert()
    update(+new Date())
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return (() => {
        window.removeEventListener('resize', onResize)
    })

})
}
