
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ApiUsageData, ApiRegistration } from '../types';

interface ApiAnalyticsProps {
  usageData: ApiUsageData[];
  apis: ApiRegistration[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ApiAnalytics: React.FC<ApiAnalyticsProps> = ({ usageData, apis }) => {
    const totalCalls = usageData.reduce((sum, day) => sum + day.calls, 0);
    const totalErrors = usageData.reduce((sum, day) => sum + day.errors, 0);
    const errorRate = totalCalls > 0 ? ((totalErrors / totalCalls) * 100).toFixed(2) : 0;
    
    const apiStatusData = apis.reduce((acc, api) => {
        const status = api.status;
        const existing = acc.find(item => item.name === status);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, [] as {name: string, value: number}[]);


  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold">API Analytics</h1>
      <p className="text-muted-foreground mt-1">Monitor performance and usage patterns for your APIs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-secondary p-6 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total API Calls (Last 30 Days)</h3>
            <p className="text-3xl font-bold mt-2">{totalCalls.toLocaleString()}</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Errors (Last 30 Days)</h3>
            <p className="text-3xl font-bold mt-2">{totalErrors.toLocaleString()}</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Overall Error Rate</h3>
            <p className="text-3xl font-bold mt-2">{errorRate}%</p>
        </div>
      </div>

      <div className="mt-10 bg-secondary rounded-lg p-6 h-[400px]">
        <h2 className="font-semibold mb-4 text-foreground">API Calls Over Time</h2>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={usageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
            <Legend />
            <Line type="monotone" dataKey="calls" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div className="bg-secondary rounded-lg p-6 h-[300px]">
                <h2 className="font-semibold mb-4 text-foreground">Error Rate by Day</h2>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={usageData.map(d => ({...d, rate: d.calls > 0 ? (d.errors / d.calls) * 100 : 0}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                        <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => `${value.toFixed(2)}%`}/>
                        <Bar dataKey="rate" fill="hsl(var(--destructive))" name="Error Rate"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-secondary rounded-lg p-6 h-[300px]">
                <h2 className="font-semibold mb-4 text-foreground">API Status Distribution</h2>
                 <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie data={apiStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {apiStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend />
                    </PieChart>
                 </ResponsiveContainer>
            </div>
       </div>
    </div>
  );
};