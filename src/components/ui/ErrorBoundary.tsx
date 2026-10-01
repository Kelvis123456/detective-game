import { Component, type ReactNode } from 'react'

/**
 * Sin esto, cualquier error al renderizar dejaba la pantalla en negro sin salida.
 * Bilingüe a propósito: si falló el render, no se puede confiar en el contexto de idioma.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-100">
        <p className="text-5xl emoji-tone" aria-hidden="true">🗂️</p>
        <h1 className="text-2xl text-amber-400">Expediente dañado · Case file corrupted</h1>
        <p className="max-w-sm text-sm text-zinc-400">
          Algo falló al abrir esta pantalla. / Something went wrong opening this screen.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded border border-amber-600 px-5 py-2 text-sm tracking-widest text-amber-400 transition-colors hover:bg-amber-950"
        >
          VOLVER AL MENÚ · BACK TO MENU
        </button>
      </div>
    )
  }
}
