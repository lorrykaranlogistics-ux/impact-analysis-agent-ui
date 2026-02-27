import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzePrRequestSchema, type AnalyzePrRequest } from '@shared/schema';
import { Search, Github, Link as LinkIcon, Settings2, PlayCircle, Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface AnalysisFormProps {
  onSubmit: (data: AnalyzePrRequest) => void;
  isAnalyzing: boolean;
}

export function AnalysisForm({ onSubmit, isAnalyzing }: AnalysisFormProps) {
  const form = useForm<AnalyzePrRequest>({
    resolver: zodResolver(analyzePrRequestSchema),
    defaultValues: {
      repo_url: '',
      pr_number: undefined,
      github_token: '',
      use_llm: true,
      run_regression_tests: false,
    },
  });

  return (
    <Card className="border-border/60 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-xl no-print">
      <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-display">New Analysis</CardTitle>
        </div>
        <CardDescription className="pt-1">
          Target a pull request to generate a comprehensive risk and impact report.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-5">
            {/* Core Inputs */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="repo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="https://github.com/owner/repo" 
                          className="pl-9 h-10 transition-shadow focus-visible:ring-primary/20" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pr_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PR Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 123" 
                          className="h-10 transition-shadow focus-visible:ring-primary/20" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Token <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="ghp_..." 
                            className="pl-9 h-10 transition-shadow focus-visible:ring-primary/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4 opacity-50" />

            {/* Analysis Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-1 text-sm font-medium text-foreground">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <span>Engine Options</span>
              </div>
              
              <FormField
                control={form.control}
                name="use_llm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-3 shadow-sm bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-semibold">Enable LLM Engine</FormLabel>
                      <FormDescription className="text-xs">
                        Deep context understanding and abstract risk analysis.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="run_regression_tests"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-3 shadow-sm bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-semibold">Run Regression Tests</FormLabel>
                      <FormDescription className="text-xs">
                        Execute test suite against PR branch (takes longer).
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/40 pt-4 pb-4">
            <Button 
              type="submit" 
              className="w-full h-11 font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing PR...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Analysis
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
