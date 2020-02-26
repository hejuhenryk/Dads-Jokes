import { useEffect, useState, useCallback} from 'react'

type UsePersistentStateHook<T> = [ T, (value: T) => void]

export const usePersistentState = <T>(localStorageKey: string, initialValue: T ): UsePersistentStateHook<T> => {

  const getInitialValue = ():T => {
    try {
      const item = localStorage.getItem(localStorageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error)
      return initialValue;
    }
  }
  
  const [state, setRawState] = useState(initialValue)

  useEffect(() => {
    const v = getInitialValue()
    setState(v)
  }, [state])

  const setState = (value: T ) => {
    setRawState(value)
    localStorage.setItem(localStorageKey, JSON.stringify(value))
  }

  return [ state, useCallback((x: T) => setState(x), []) ]
}