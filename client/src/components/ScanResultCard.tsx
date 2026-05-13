import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle, Shield, Link as LinkIcon, Hash, Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Scan } from "@shared/schema";

interface ScanResultCardProps {
  scan: Scan;
}

export function ScanResultCard({ scan }: ScanResultCardProps) {
  const isPhishing = scan.prediction === "Phishing";
  const probabilityPercent = Math.round(scan.probability * 100);
  
  // Risk Level Logic
  let riskLevel = "Low";
  let riskColor = "text-green-500";
  let riskBg = "bg-green-500/10 border-green-500/20";
  
  if (probabilityPercent > 70) {
    riskLevel = "Critical";
    riskColor = "text-red-500";
    riskBg = "bg-red-500/10 border-red-500/20";
  } else if (probabilityPercent > 40) {
    riskLevel = "Moderate";
    riskColor = "text-orange-500";
    riskBg = "bg-orange-500/10 border-orange-500/20";
  }

  // Data for Donut Chart
  const pieData = [
    { name: "Phishing Probability", value: probabilityPercent },
    { name: "Safe", value: 100 - probabilityPercent },
  ];
  const COLORS = [isPhishing ? "#ef4444" : "#22c55e", "#e2e8f0"];

  // Data for Bar Chart (Stats)
  const stats = scan.stats as Record<string, number>;
  const barData = [
    { name: "Words", value: stats.wordCount || 0, icon: Type },
    { name: "URLs", value: stats.urlCount || 0, icon: LinkIcon },
    { name: "Special", value: stats.specialCharCount || 0, icon: Hash },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`overflow-hidden border-2 ${isPhishing ? "border-red-500/50 shadow-red-500/10" : "border-green-500/50 shadow-green-500/10"} shadow-xl`}>
        <div className={`h-2 w-full ${isPhishing ? "bg-red-500" : "bg-green-500"}`} />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${riskBg} ${riskColor} px-3 py-1 text-sm font-semibold uppercase tracking-wider`}>
              {riskLevel} Risk
            </Badge>
            <span className="text-sm text-muted-foreground font-medium">Confidence: {(scan.confidence * 100).toFixed(1)}%</span>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            {isPhishing ? (
              <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="w-8 h-8" />
              </div>
            )}
            <div>
              <CardTitle className="text-3xl font-display font-bold">
                {isPhishing ? "Phishing Detected" : "Legitimate Email"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isPhishing 
                  ? "This email contains patterns commonly associated with phishing attacks." 
                  : "This email appears safe based on our analysis."}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 md:grid-cols-2 pt-6">
          {/* Probability Chart */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Threat Probability</h4>
            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-4xl font-bold ${isPhishing ? "text-red-500" : "text-green-500"}`}>
                  {probabilityPercent}%
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase">Phishing</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Content Analysis</h4>
            <div className="space-y-4">
              {barData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                  <div className="p-2 bg-background rounded-lg shadow-sm text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm font-bold text-primary">{item.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/80 rounded-full" 
                        style={{ width: `${Math.min(item.value, 100)}%` }} // Simple scaling for visual
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-2 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                AI-Powered Analysis
              </span>
              <span>Model: LSTM-v1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
