// ErrorBoundary.jsx
import { Component } from "react";
export class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError:false, err:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, err }; }
  componentDidCatch(err, info){ console.error("🟥 ErrorBoundary caught:", err, info); }
  render(){
    if(this.state.hasError){
      return <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
        <div className="font-semibold">Component crashed:</div>
        <pre className="text-xs whitespace-pre-wrap">{String(this.state.err)}</pre>
      </div>;
    }
    return this.props.children;
  }
}
