import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { PatientList } from './pages/PatientList';
import NotFound from './pages/NotFound';

// Lazy load Patient Details page for code splitting
const PatientDetails = lazy(() =>
    import('./pages/PatientDetails').then(module => ({ default: module.PatientDetails }))
);

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
    </div>
);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PatientList />} />
                    <Route
                        path="/patient/:id"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <PatientDetails />
                            </Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
