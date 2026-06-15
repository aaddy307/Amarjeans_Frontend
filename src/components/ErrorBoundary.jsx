import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-slate-950">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 text-center">
            <AlertTriangle size={48} className="text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">An unexpected error occurred.</h2>
            <div className="p-4 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-auto mb-6 text-left">
              <pre className="text-sm text-slate-400 whitespace-break-spaces">
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-colors"
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
