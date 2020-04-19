import { useRef } from 'react'

const useInstance = (initialValueOrFunction = {}) => {
  const ref = useRef()
  if (!ref.current) {
    ref.current =
      typeof initialValueOrFunction === 'function'
        ? initialValueOrFunction()
        : initialValueOrFunction
  }
  return ref.current
}

export default useInstance
