import React from 'react'

type Props = { children: React.ReactNode; fallback?: React.ReactNode }
type State = { hasError: boolean; error?: any }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="card border border-danger-200 dark:border-danger-800">
          <div className="text-danger-600 font-semibold mb-2">Something went wrong</div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Try again or refresh the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}
