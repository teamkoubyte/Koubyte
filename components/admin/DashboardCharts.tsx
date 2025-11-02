'use client'

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ChartData {
  name: string
  value: number
  revenue?: number
  appointments?: number
  orders?: number
}

interface DashboardChartsProps {
  revenueData: ChartData[]
  appointmentsData: ChartData[]
  ordersData: ChartData[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function DashboardCharts({ revenueData, appointmentsData, ordersData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Trend (Laatste 7 Dagen)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
              formatter={(value: any) => [`€${value.toFixed(2)}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={2}
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Appointments Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Afspraken (Laatste 7 Dagen)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={appointmentsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Bar 
              dataKey="appointments" 
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Bestellingen (Laatste 7 Dagen)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Status Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Bestellingen Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Bar 
              dataKey="orders" 
              fill="#8B5CF6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

