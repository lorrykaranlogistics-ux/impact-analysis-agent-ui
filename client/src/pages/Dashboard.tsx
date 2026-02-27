import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useAnalysis } from '@/hooks/use-analysis';
import { GitPullRequest, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { AnalysisForm } from '@/components/AnalysisForm';
import { AnalysisResults } from '@/components/AnalysisResults';

// Skeleton Loader for premium feel during async operations
function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 bg-slate-200 rounded-xl w-full"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-slate-200 rounded-xl"></div>
        <div className="h-[400px] bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { analyze, isAnalyzing, result } = useAnalysis();

  // Protect Route
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null; // Avoid flashing content before redirect

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md shadow-sm no-print">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <GitPullRequest className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Nexus</h1>
            <div className="hidden sm:flex items-center ml-6 pl-6 border-l border-border space-x-1 text-sm text-muted-foreground font-medium">
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Overview
            </div>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="sticky top-24">
            <AnalysisForm onSubmit={analyze} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Right Column: Results Area */}
        <div className="lg:col-span-8 xl:col-span-9 min-h-[500px]">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnalysisSkeleton />
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <AnalysisResults data={result} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 no-print"
              >
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <GitPullRequest className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold font-display text-slate-900 mb-2">No Analysis Data</h3>
                <p className="text-slate-500 max-w-md">
                  Enter a repository URL and PR number in the panel to generate a comprehensive risk report.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
