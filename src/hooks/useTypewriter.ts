import { useState, useEffect, useRef, useCallback } from 'react'

export function useTypewriter(
  text: string,
  speed = 28
): { displayed: string; done: boolean; skip: () => void } {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const textRef = useRef(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0
    textRef.current = text

    intervalRef.current = setInterval(() => {
      if (indexRef.current < textRef.current.length) {
        setDisplayed(textRef.current.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        setDone(true)
        clearInterval(intervalRef.current!)
      }
    }, speed)

    return () => clearInterval(intervalRef.current!)
  }, [text, speed])

  const skip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplayed(textRef.current)
    setDone(true)
  }, [])

  return { displayed, done, skip }
}
