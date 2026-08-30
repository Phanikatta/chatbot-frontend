import { useState, useEffect, useRef, useCallback } from 'react'

// ── Speech-to-Text ──────────────────────────────────────────
export function useSpeechToText({ onResult, onError }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    setSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      onResult?.(final || interim, !!final)
    }

    recognition.onerror = (event) => {
      setListening(false)
      if (event.error !== 'no-speech') {
        onError?.(event.error)
      }
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening) return
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (e) {
      console.error('STT start error:', e)
    }
  }, [listening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }, [listening, startListening, stopListening])

  return { listening, supported, toggleListening, startListening, stopListening }
}

// ── Text-to-Speech ──────────────────────────────────────────
export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [supported] = useState(() => 'speechSynthesis' in window)
  const utteranceRef = useRef(null)

  const speak = useCallback((text) => {
    if (!supported) return
    window.speechSynthesis.cancel()

    // Clean markdown before speaking
    const clean = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\|/g, '')
      .replace(/[-_~]/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    const utterance = new SpeechSynthesisUtterance(clean)

    // Pick the best available voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Google') ||
      v.name.includes('Samantha') ||
      v.name.includes('Daniel')
    )
    if (preferred) utterance.voice = preferred

    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [supported])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const toggle = useCallback((text) => {
    if (speaking) {
      stop()
    } else {
      speak(text)
    }
  }, [speaking, speak, stop])

  return { speaking, supported, speak, stop, toggle }
}