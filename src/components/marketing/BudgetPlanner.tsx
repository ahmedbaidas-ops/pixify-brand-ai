import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgetData } from "@/data/marketing";
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const BudgetPlanner = () => {
  const remaining = budgetData.total - budgetData.allocated;
  const utilizationPercent = (budgetData.allocated / budgetData.total) * 100;

  const pieData = budgetData.byChannel.map(ch => ({
    name: ch.channel,
    value: ch.allocated
  }));

  const COLORS = ["#5C0A3A", "#CBB59C", "#0F1020", "#A2A2A2", "#8B7355"];

  const spentData = budgetData.byChannel.map(ch => ({
    name: ch.channel,
    allocated: ch.allocated,
    spent: ch.spent,
    remaining: ch.allocated - ch.spent
  }));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Budget & Resource Planner</h2>
        <p className="text-muted-foreground">Track spending and optimize marketing investment</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">${(budgetData.total / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Total Annual Budget</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <span className="text-xs font-medium text-blue-500">{utilizationPercent.toFixed(0)}%</span>
              </div>
              <div className="text-3xl font-bold mb-1">${(budgetData.allocated / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Allocated to Campaigns</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-500" />
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">${(remaining / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Remaining Budget</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget by Channel - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Channel</CardTitle>
            <CardDescription>Distribution across marketing channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value as number / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spending vs Allocated - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending vs Allocated</CardTitle>
            <CardDescription>Real-time budget utilization tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => `$${(value as number / 1000).toFixed(0)}K`} />
                <Legend />
                <Bar dataKey="allocated" fill="#5C0A3A" name="Allocated" />
                <Bar dataKey="spent" fill="#CBB59C" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Budget Tracking</CardTitle>
          <CardDescription>Individual campaign spending and remaining budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgetData.campaigns.map((campaign, index) => {
            const spentPercent = (campaign.spent / campaign.budget) * 100;
            const isOverBudget = spentPercent > 90;

            return (
              <motion.div
                key={campaign.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{campaign.name}</span>
                      <span className="text-xs text-muted-foreground">• {campaign.channel}</span>
                      {isOverBudget && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${(campaign.spent / 1000).toFixed(1)}K / ${(campaign.budget / 1000).toFixed(0)}K 
                      <span className="ml-2">(${((campaign.budget - campaign.spent) / 1000).toFixed(1)}K remaining)</span>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ml-4 ${isOverBudget ? 'text-orange-500' : 'text-foreground'}`}>
                    {spentPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={spentPercent} className="h-2" />
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* AI Optimization Suggestions */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Budget Optimization
          </CardTitle>
          <CardDescription>Intelligent recommendations to maximize ROI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Shift 10% from Traditional to Social</div>
                <div className="text-xs text-muted-foreground">
                  Projected +12% reach increase based on current engagement rates
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Increase Email Marketing Investment</div>
                <div className="text-xs text-muted-foreground">
                  Email shows 3.2x ROI vs other channels - consider reallocating $20K
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Ramadan Campaign Approaching Budget Limit</div>
                <div className="text-xs text-muted-foreground">
                  79% spent with 15 days remaining - consider extending or reallocating
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanner;
