// client/src/components/ErrorBoundary.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Optional: send to your logging service
    // console.error('ErrorBoundary caught:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const dev = import.meta.env.DEV
    const msg = this.state.error?.message || 'Something went wrong'

    return (
      <div className="min-h-[70vh] container-max flex items-center justify-center">
        <div className="card p-8 max-w-xl text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Unexpected error</h1>
          <p className="text-slate-600 dark:text-slate-300">
            {msg}
          </p>

          {dev && (
            <details className="text-left text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-lg p-3">
              <summary className="cursor-pointer">Stack trace (dev only)</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.error?.stack || '(no stack)'}
              </pre>
            </details>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <button onClick={this.handleReload} className="btn btn-primary">Reload</button>
            <Link to="/" className="btn">Go Home</Link>
          </div>
        </div>
      </div>
    )
  }
}
