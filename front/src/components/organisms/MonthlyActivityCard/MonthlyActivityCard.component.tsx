import { Card } from "@/components/molecules/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./MonthlyActivityCard.css";

export interface MonthlyActivityDataPoint {
  period: string;
  count: number;
}

export interface MonthlyActivityCardProps {
  title?: string;
  subtitle?: string;
  value?: string;
  /** Chart data: period label and count (e.g. by week or month). Uses default sample if not provided. */
  chartData?: MonthlyActivityDataPoint[];
}

const DEFAULT_CHART_DATA: MonthlyActivityDataPoint[] = [
  { period: "Sem 1", count: 18 },
  { period: "Sem 2", count: 22 },
  { period: "Sem 3", count: 15 },
  { period: "Sem 4", count: 29 },
];

const CHART_COLOR = "#284483";

/**
 * MonthlyActivityCard - Organism
 *
 * Single card: monthly activity, last 30 days, chart and records created.
 * Uses Recharts (MIT) for the summary bar chart.
 */
export const MonthlyActivityCard = ({
  title = "Actividad mensual",
  subtitle = "Últimos 30 días",
  value = "Expedientes creados +84",
  chartData = DEFAULT_CHART_DATA,
}: MonthlyActivityCardProps) => (
  <Card variant="elevated" className="monthly-activity-card">
    <h4 className="monthly-activity-card__title">{title}</h4>
    <p className="monthly-activity-card__subtitle">{subtitle}</p>
    <div className="monthly-activity-card__chart">
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, "auto"]} />
          <Tooltip
            cursor={{ fill: "rgba(39, 68, 131, 0.08)" }}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
            formatter={(value: number | undefined) =>
              value == null ? ["—", "Expedientes"] : [String(value), "Expedientes"]
            }
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="count" fill={CHART_COLOR} radius={[4, 4, 0, 0]} isAnimationActive />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <span className="monthly-activity-card__value">{value}</span>
  </Card>
);
