import { useState, useEffect } from 'react'

export default function useLocalStorage<T>(key: string, initialState: T) {
    const stateHook = useState<T>(() => {
        const storedValue = localStorage.getItem(key)
        try {
            const parsedValue = JSON.parse(storedValue as string)
            return parsedValue || initialState
        } catch (err) {
            return initialState
        }
    })

    const [state] = stateHook

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [state])

    return stateHook
}
