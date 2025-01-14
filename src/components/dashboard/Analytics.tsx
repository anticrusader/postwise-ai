import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2024-01', posts: 4, engagement: 120 },
  { date: '2024-02', posts: 6, engagement: 200 },
  { date: '2024-03', posts: 8, engagement: 350 },
  { date: '2024-04', posts: 10, engagement: 480 },
];

export const Analytics = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="posts" stroke="#8884d8" name="Posts" />
            <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};