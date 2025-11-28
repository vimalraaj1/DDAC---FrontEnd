import React from "react";
import '../../../index.css';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

function usePalette() {
    const root = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
    const primary = root?.getPropertyValue("--primary")?.trim() || "#0A3D62";
    const accentSky = root?.getPropertyValue("--accent-sky")?.trim() || "#5DADE2";
    const accentTeal = root?.getPropertyValue("--accent-teal")?.trim() || "#45AAB8";
    const accentSuccess = root?.getPropertyValue("--accent-success")?.trim() || "#2ECC71";
    const accentWarn = root?.getPropertyValue("--accent-warning")?.trim() || "#F39C12";
    const accentDanger = root?.getPropertyValue("--accent-danger")?.trim() || "#E74C3C";

    // return an array of colors to map sectors
    return [primary, accentSky, accentTeal, accentSuccess, accentWarn, accentDanger];
}

export default function DepartmentPieChart({ data }) {
    const colors = usePalette();
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    fill={colors[0]}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
    );
}
