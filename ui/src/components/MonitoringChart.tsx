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
import { Result } from "../types";

interface UptimeData {
  time: string;
  uptime: number;
}

type MonitoringChartProps = {
  results: Result[];
};

const MAX_VISIBLE_DATA = 60;

const MonitoringChart: React.FC<MonitoringChartProps> = ({ results }) => {
  const [data, setData] = useState<UptimeData[]>([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const data = results.map((result) => {
      let time = result.timestamp.substring(0, 19);
      time = time.substring(time.length - 8);
      return {
        time,
        uptime: result.data.response_time,
      };
    });
    setData(data);
  }, [results]);

  useEffect(() => {
    if (data.length > MAX_VISIBLE_DATA) {
      setOffset((prevOffset) => prevOffset + 1);
    }
  }, [data]);

  const visibleData = data.slice(offset, offset + MAX_VISIBLE_DATA);

  const xDomain = visibleData.map((point) => point.time);
  const yMaxValue = Math.max(...visibleData.map((point) => point.uptime));
  const yDomain = [0, yMaxValue * 3];

  return (
    <ResponsiveContainer width="100%" height={350}>
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
        <XAxis dataKey="time" domain={xDomain} />
        <YAxis domain={yDomain} tickCount={100} />
        <Tooltip
          formatter={(value, name, props) => {
            const time = props.payload.time;
            const uptime = props.payload.uptime;
            return [
              <div>
                <div key="time">{`Time: ${time}`}</div>
                <div key="uptime">{`Uptime: ${uptime} ms`}</div>
              </div>,
            ];
          }}
        />
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
