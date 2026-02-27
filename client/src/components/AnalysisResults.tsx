import { type AnalysisResponse } from '@shared/schema';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, FileText, Activity, Layers, Tag,
  GitBranch, Code2, ShieldAlert, TerminalSquare, Copy, Printer, Check
} from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  data: AnalysisResponse;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'LOW': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getRiskProgressColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast({ title: "Copied", description: "JSON payload copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Header Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border/50 shadow-sm print-shadow-none">
        <div>
          <h2 className="text-2xl font-bold flex items-center font-display">
            <GitBranch className="w-6 h-6 mr-2 text-primary" />
            PR #{data.prNumber} Analysis
          </h2>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className={`px-2.5 py-0.5 font-semibold ${getRiskColor(data.riskLevel)}`}>
              {data.riskLevel} RISK
            </Badge>
            {data.changeClassification && (
              <Badge variant="secondary" className="px-2.5 py-0.5 font-medium border border-border">
                {data.changeClassification.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 no-print">
          <Button variant="outline" onClick={handleCopyJson} className="bg-white hover:bg-slate-50">
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy JSON
          </Button>
          <Button variant="default" onClick={handlePrint} className="shadow-md">
            <Printer className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* Primary Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="print-break-inside-avoid print-shadow-none shadow-md shadow-black/5 hover:shadow-lg transition-shadow border-t-4 border-t-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-medium">Risk Score</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold font-display">{data.riskScore}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress 
              value={data.riskScore} 
              className="h-2 mt-4" 
              indicatorClassName={getRiskProgressColor(data.riskLevel)}
            />
          </CardContent>
        </Card>

        <Card className="print-break-inside-avoid print-shadow-none shadow-md shadow-black/5 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-medium">Confidence</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold font-display">{(data.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={data.confidence * 100} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="print-break-inside-avoid print-shadow-none shadow-md shadow-black/5 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-medium">Dependency Depth</span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold font-display">{data.dependencyDepth}</span>
              <span className="text-sm text-muted-foreground">levels</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-1 border-t">Impact reach across graph</p>
          </CardContent>
        </Card>

        <Card className="print-break-inside-avoid print-shadow-none shadow-md shadow-black/5 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="text-sm font-medium">Services Impacted</span>
              <Tag className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold font-display">{data.impactedServices.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-1 border-t">Total affected boundaries</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tables & Lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Changed Files */}
          <motion.div variants={itemVariants}>
            <Card className="print-break-inside-avoid print-shadow-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b py-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-slate-500" />
                  Changed Files
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="font-semibold">Filename</TableHead>
                      <TableHead className="font-semibold w-[100px]">Status</TableHead>
                      <TableHead className="font-semibold w-[100px] text-right">Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.changedFiles.map((file, i) => (
                      <TableRow key={i} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-xs">{file.filename}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs text-slate-500">{file.status || 'modified'}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs whitespace-nowrap">
                          <span className="text-emerald-600">+{file.additions || 0}</span> / <span className="text-red-600">-{file.deletions || 0}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>

          {/* Regression Areas & Tests */}
          <motion.div variants={itemVariants}>
            <Card className="print-break-inside-avoid print-shadow-none shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b py-4">
                <CardTitle className="text-lg flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-slate-500" />
                  Regression Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border">
                  <div className="p-6">
                    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Vulnerable Areas</h4>
                    <ul className="space-y-4">
                      {data.regressionAreas.map((area, i) => (
                        <li key={i} className="flex items-start">
                          <AlertTriangle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${area.risk === 'HIGH' ? 'text-orange-500' : 'text-amber-500'}`} />
                          <div>
                            <span className="font-medium text-sm block">{area.area}</span>
                            {area.description && <span className="text-xs text-muted-foreground mt-1 block">{area.description}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Suggested Tests</h4>
                    <ul className="space-y-4">
                      {data.suggestedTests.map((test, i) => (
                        <li key={i} className="flex items-start">
                          <Code2 className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-blue-500" />
                          <div>
                            <span className="font-medium text-sm block">{test.testName} <span className="text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1">{test.type}</span></span>
                            <span className="text-xs text-muted-foreground mt-1 block">{test.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Right Column: Services & Execution Results */}
        <div className="space-y-6">
          
          {/* Impacted Services */}
          <motion.div variants={itemVariants}>
            <Card className="print-break-inside-avoid print-shadow-none shadow-sm">
              <CardHeader className="py-4 border-b bg-slate-50/50">
                <CardTitle className="text-base flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-slate-500" />
                  Impacted Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {data.impactedServices.map((service, i) => (
                    <div key={i} className="border border-border rounded-lg p-3 w-full bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{service.serviceName}</span>
                        {service.reason && <p className="text-xs text-muted-foreground mt-1">{service.reason}</p>}
                      </div>
                      <Badge variant="secondary" className={
                        service.impactLevel === 'HIGH' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 
                        service.impactLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''
                      }>
                        {service.impactLevel}
                      </Badge>
                    </div>
                  ))}
                  {data.impactedServices.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No specific services identified.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sanity Checks */}
          {data.sanityCheckResults && data.sanityCheckResults.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="print-break-inside-avoid print-shadow-none shadow-sm">
                <CardHeader className="py-4 border-b bg-slate-50/50">
                  <CardTitle className="text-base flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-slate-500" />
                    Sanity Checks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    {data.sanityCheckResults.map((check, i) => (
                      <li key={i} className="p-4 flex items-start">
                        {check.status === 'PASSED' ? <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> :
                         check.status === 'FAILED' ? <AlertTriangle className="w-5 h-5 text-red-500 mr-3 shrink-0" /> :
                         <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0" />}
                        <div>
                          <p className="text-sm font-medium">{check.checkName}</p>
                          {check.message && <p className="text-xs text-muted-foreground mt-1">{check.message}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Test Execution Results */}
          {data.regressionTestResults && (
            <motion.div variants={itemVariants} className="print-break-inside-avoid">
              <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-border shadow-sm print-shadow-none">
                <AccordionItem value="results" className="border-none">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center">
                      <TerminalSquare className="w-5 h-5 mr-2 text-slate-500" />
                      <span className="font-semibold">Test Execution Results</span>
                      <Badge variant="outline" className={`ml-3 ${
                        data.regressionTestResults.status === 'PASSED' ? 'border-emerald-500 text-emerald-600' : 'border-red-500 text-red-600'
                      }`}>
                        {data.regressionTestResults.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration: {data.regressionTestResults.durationSeconds}s</span>
                        <div className="flex space-x-3">
                          <span className="text-emerald-600 font-medium">{data.regressionTestResults.summary.passed} passed</span>
                          <span className="text-red-600 font-medium">{data.regressionTestResults.summary.failed} failed</span>
                        </div>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <p className="text-slate-400 text-xs font-mono mb-2">$ {data.regressionTestResults.command}</p>
                        <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
                          {data.regressionTestResults.outputSnippet}
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
