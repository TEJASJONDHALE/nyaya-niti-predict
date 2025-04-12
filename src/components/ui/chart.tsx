import * as React from "react"
import * as RechartsPrimitive from "recharts"

const ChartConfig = {
  colors: {
    blue: "hsl(var(--chart-blue))",
    green: "hsl(var(--chart-green))",
    yellow: "hsl(var(--chart-yellow))",
    sky: "hsl(var(--chart-sky))",
    violet: "hsl(var(--chart-violet))",
    amber: "hsl(var(--chart-amber))",
  },
}

type ChartContainerProps = {
  children: React.ReactNode
}

const ChartContainer = ({ children }: ChartContainerProps) => {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      {children}
    </div>
  )
}
ChartContainer.displayName = "ChartContainer"

type ChartTooltipProps = {
  children: React.ReactNode
}

const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return (
    <div className="px-4 py-3 text-sm font-medium">{children}</div>
  )
}
ChartTooltip.displayName = "ChartTooltip"

type ChartHeaderProps = {
  title: string
  description?: string
}

const ChartHeader = ({ title, description }: ChartHeaderProps) => {
  return (
    <div className="flex flex-col space-y-1.5 p-6">
      <h4 className="text-sm font-semibold">{title}</h4>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </div>
  )
}
ChartHeader.displayName = "ChartHeader"

type ChartLegendProps = {
  children: React.ReactNode
}

const ChartLegend = ({ children }: ChartLegendProps) => {
  return <div className="flex items-center space-x-2 px-6">{children}</div>
}
ChartLegend.displayName = "ChartLegend"

type ChartLegendContentProps = {
  color: keyof (typeof ChartConfig)["colors"]
  title: string
}

const ChartLegendContent = ({ color, title }: ChartLegendContentProps) => {
  return (
    <div className="flex items-center space-x-1.5">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ChartConfig.colors[color] }} />
      <p className="text-xs font-medium">{title}</p>
    </div>
  )
}
ChartLegendContent.displayName = "ChartLegendContent"

const ChartStyle = () => {
  return (
    <style>
      {`
        .recharts-label {
          font-size: 0.8rem;
          font-weight: 500;
          fill: var(--foreground);
        }
      `}
    </style>
  )
}
ChartStyle.displayName = "ChartStyle"

// Now let's export the necessary components that are being used in the Dashboard
const PieChart = ({
  data,
  valueFormatter,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.PieChart> & {
  data: any[];
  valueFormatter?: (value: number) => string;
  children?: React.ReactNode;
}) => {
  return (
    <RechartsPrimitive.PieChart data={data} {...props}>
      <RechartsPrimitive.Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      />
      <RechartsPrimitive.Tooltip />
      {children}
    </RechartsPrimitive.PieChart>
  );
};

const PieArcSeries = () => {
  return null; // This is a placeholder. In a real implementation, it would render arc segments
};

const BarChart = ({
  data,
  valueFormatter,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.BarChart> & {
  data: any[];
  valueFormatter?: (value: number) => string;
}) => {
  return (
    <RechartsPrimitive.BarChart data={data} {...props}>
      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
      <RechartsPrimitive.XAxis dataKey="name" />
      <RechartsPrimitive.YAxis />
      <RechartsPrimitive.Tooltip />
      <RechartsPrimitive.Bar dataKey="value" fill="#8884d8" />
    </RechartsPrimitive.BarChart>
  );
};

const AreaChart = ({
  data,
  valueFormatter,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.AreaChart> & {
  data: any[];
  valueFormatter?: (value: number) => string;
}) => {
  return (
    <RechartsPrimitive.AreaChart data={data} {...props}>
      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
      <RechartsPrimitive.XAxis dataKey="name" />
      <RechartsPrimitive.YAxis />
      <RechartsPrimitive.Tooltip />
      <RechartsPrimitive.Area type="monotone" dataKey="value" fill="#8884d8" />
    </RechartsPrimitive.AreaChart>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartHeader,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  // Add the missing exports
  PieChart,
  BarChart,
  AreaChart,
  PieArcSeries
}
