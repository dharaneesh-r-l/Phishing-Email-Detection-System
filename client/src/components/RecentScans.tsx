import { format } from "date-fns";
import { History, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Scan } from "@shared/schema";

interface RecentScansProps {
  scans: Scan[];
  isLoading: boolean;
  onSelectScan?: (scan: Scan) => void;
}

export function RecentScans({ scans, isLoading, onSelectScan }: RecentScansProps) {
  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="w-24 h-6 bg-muted animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-muted/50 animate-pulse rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (scans.length === 0) {
    return (
      <Card className="bg-muted/30 border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <History className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No history yet</h3>
          <p className="text-muted-foreground text-sm">Your recent scans will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-display font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Recent Scans
        </h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
          {scans.length} Total
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {scans.map((scan) => {
            const isPhishing = scan.prediction === "Phishing";
            const date = new Date(scan.createdAt || Date.now());

            return (
              <button
                key={scan.id}
                onClick={() => onSelectScan?.(scan)}
                className="w-full group text-left transition-all duration-200"
              >
                <div className="relative bg-card hover:bg-accent/5 border border-border/50 hover:border-primary/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isPhishing ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                        {isPhishing ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {scan.subject ? (
                            <span className="truncate max-w-[150px]">{scan.subject}</span>
                          ) : (
                            isPhishing ? "Phishing Attempt" : "Safe Email"
                          )}
                          <span className={`text-xs px-1.5 py-0.5 rounded-full border ${isPhishing ? "border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" : "border-green-200 text-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"}`}>
                            {Math.round(scan.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-2">
                          {scan.emailId && <span className="opacity-70">#{scan.emailId}</span>}
                          <span>{format(date, "MMM d, h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground line-clamp-1 font-mono text-xs bg-muted/50 p-1.5 rounded">
                      {scan.content.substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
