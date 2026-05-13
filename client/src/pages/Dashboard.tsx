import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useScans, useAnalyzeEmail } from "@/hooks/use-scans";
import { ScanResultCard } from "@/components/ScanResultCard";
import { RecentScans } from "@/components/RecentScans";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Scan } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  emailId: z.string().optional(),
  subject: z.string().optional(),
  content: z.string().min(10, "Email content must be at least 10 characters long"),
});

export default function Dashboard() {
  const [lastScan, setLastScan] = useState<Scan | null>(null);
  const { toast } = useToast();
  
  const { data: scans = [], isLoading: isLoadingScans } = useScans();
  const analyzeMutation = useAnalyzeEmail();
  
  const stats = {
    total: scans.length,
    phishing: scans.filter(s => s.prediction === "Phishing").length,
    legitimate: scans.filter(s => s.prediction === "Legitimate").length,
    avgConfidence: scans.length ? scans.reduce((acc, s) => acc + s.confidence, 0) / scans.length : 0
  };

  const chartData = [
    { name: "Phishing", value: stats.phishing, color: "#ef4444" },
    { name: "Safe", value: stats.legitimate, color: "#22c55e" }
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailId: "",
      subject: "",
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const result = await analyzeMutation.mutateAsync(data);
      setLastScan(result);
      form.reset();
      toast({
        title: "Analysis Complete",
        description: `Email detected as ${result.prediction}`,
        variant: result.prediction === "Phishing" ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  }

  const handleSelectRecent = (scan: Scan) => {
    setLastScan(scan);
    // Smooth scroll to top to see result
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Phish<span className="text-primary">Guard</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Online</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Scans</p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">{stats.phishing}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Threats Blocked</p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.legitimate}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Safe Emails</p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{Math.round(stats.avgConfidence * 100)}%</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg Confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Intro Section - only show if no scan result yet */}
        <AnimatePresence>
          {!lastScan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center py-8"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Detect Phishing with AI
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste suspicious email content below. Our LSTM-powered neural network analyzes patterns to keep you safe.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Input Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Result Card Area */}
            <AnimatePresence mode="wait">
              {lastScan && (
                <div className="mb-8">
                  <ScanResultCard scan={lastScan} />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => setLastScan(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear Result
                    </Button>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary w-full" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Analyze Email Content
                  </CardTitle>
                  <CardDescription>
                    Paste the body of the email you want to verify. We never store your emails permanently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emailId"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Email ID (Optional)</Label>
                              <FormControl>
                                <Input placeholder="e.g. MSG-12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Subject (Optional)</Label>
                              <FormControl>
                                <Input placeholder="e.g. Urgent: Account Verification" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Email Content</Label>
                            <FormControl>
                              <Textarea
                                placeholder="Paste the body of the email here..."
                                className="min-h-[200px] resize-y font-mono text-sm bg-muted/30 focus:bg-background transition-colors custom-scrollbar"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                        disabled={analyzeMutation.isPending}
                      >
                        {analyzeMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing Patterns...
                          </>
                        ) : (
                          "Scan for Threats"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar / History Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <RecentScans 
                scans={scans} 
                isLoading={isLoadingScans} 
                onSelectScan={handleSelectRecent}
              />
              
              {/* Analytics Summary */}
              {scans.length > 0 && (
                <Card className="mt-8 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Threat Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Phishing
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" /> Safe
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Optional footer info */}
              <div className="mt-8 p-4 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">How it works</p>
                <p>
                  This application uses a TensorFlow Keras model with LSTM layers trained on over 50,000 email samples.
                  It tokenizes input text and looks for semantic patterns indicative of social engineering.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
