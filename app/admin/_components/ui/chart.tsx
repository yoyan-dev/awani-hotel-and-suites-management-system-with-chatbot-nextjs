// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// export const PieChartComponent = ({
//   data,
//   colors,
// }: {
//   data: any[];
//   colors: string[];
// }) => (
//   <ResponsiveContainer width="100%" height={250}>
//     <PieChart>
//       <Pie
//         data={data}
//         dataKey="value"
//         nameKey="name"
//         outerRadius={80}
//         fill="#8884d8"
//       >
//         {data.map((entry, index) => (
//           <Cell key={index} fill={colors[index % colors.length]} />
//         ))}
//       </Pie>
//       <Tooltip />
//     </PieChart>
//   </ResponsiveContainer>
// );

// export const LineChartComponent = ({ data }: { data: any[] }) => (
//   <ResponsiveContainer width="100%" height={250}>
//     <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="date" />
//       <YAxis />
//       <Tooltip />
//       <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
//       <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
//     </LineChart>
//   </ResponsiveContainer>
// );
