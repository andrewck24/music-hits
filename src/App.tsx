import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ErrorBoundary } from '@/components/error-boundary';

/**
 * Main Application Component
 *
 * Purpose: Root component with Redux Provider and Error Boundary
 *
 * Features:
 * - Redux Toolkit state management
 * - Error Boundary for graceful error handling
 * - React Router (to be added in Phase 3)
 *
 * Usage:
 *   Imported by main.tsx and wrapped with React.StrictMode
 */

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <div className="min-h-screen bg-background text-foreground">
          <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Spotify YouTube Hits
            </h1>
            <p className="text-muted-foreground">
              Application is initializing...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Phase 2 (Foundational) completed. Ready for Phase 3 development.
            </p>
          </div>
        </div>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
