import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface UptimeData {
  time: string;
  uptime: number;
}

const MAX_VISIBLE_DATA = 60;

const MonitoringChart: React.FC = () => {
  const [data, setData] = useState<UptimeData[]>([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const generateData = () => {
      const newUptimeData: UptimeData = {
        time: new Date().toLocaleTimeString(),
        // TODO: Replace with real uptime data
        uptime: Math.floor(Math.random() * 1000),
      };

      setData((prevData) => [...prevData, newUptimeData]);
    };

    const interval = setInterval(generateData, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.length > MAX_VISIBLE_DATA) {
      setOffset((prevOffset) => prevOffset + 1);
    }
  }, [data]);

  const visibleData = data.slice(offset, offset + MAX_VISIBLE_DATA);

  const xDomain = visibleData.map((point) => point.time);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={visibleData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" domain={xDomain} interval="preserveStartEnd" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          isAnimationActive={false}
          type="monotoneX"
          dataKey="uptime"
          fill="#66bb6a"
          opacity={0.7}
          stroke="#66bb6a"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonitoringChart;
