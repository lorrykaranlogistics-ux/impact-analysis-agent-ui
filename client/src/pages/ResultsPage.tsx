import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileText, Printer } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useAnalysis } from '@/hooks/use-analysis';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function EmptyResultsState() {
  return (
    <Card className="max-w-2xl mx-auto border-dashed">
      <CardHeader>
        <CardTitle>No Result Available</CardTitle>
        <CardDescription>
          Run a PR analysis first from the dashboard to populate this results page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This page displays the most recent successful analysis stored in the app.
        </p>
      </CardContent>
    </Card>
  );
}

function ResultsHeader({
  title,
  description,
  onBack,
  onPrint,
}: {
  title: string;
  description: string;
  onBack: () => void;
  onPrint?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 backdrop-blur">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-display font-bold truncate">{title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{description}</p>
          </div>
        </div>
        {onPrint && (
          <Button size="sm" onClick={onPrint} className="no-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        )}
      </div>
    </header>
  );
}

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { result } = useAnalysis();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/70">
      <ResultsHeader
        title="Analysis Results"
        description="Dedicated view for the latest PR impact report"
        onBack={() => setLocation('/')}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {result ? <AnalysisResults data={result} /> : <EmptyResultsState />}
      </main>
    </div>
  );
}

export function PrintableResultsPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { result } = useAnalysis();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <ResultsHeader
        title="Printable Analysis Report"
        description="Print-friendly layout for sharing or exporting"
        onBack={() => setLocation('/results')}
        onPrint={() => window.print()}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {result ? (
          <AnalysisResults data={result} />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                No report to print
              </CardTitle>
              <CardDescription>Run an analysis first and come back to this page.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
}
