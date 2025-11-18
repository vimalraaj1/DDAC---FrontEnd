import React, { useMemo } from "react";
import '../../../themes/manager.css';
import '../../../index.css';
import {
    ResponsiveContainer,
    LineChart,
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

function useThemeColors() {
    // read CSS variables from :root so chart colors follow the active theme
    const root = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
    return {
        primary: root?.getPropertyValue("--primary")?.trim() || "#0A3D62",
        accent: root?.getPropertyValue("--accent-sky")?.trim() || "#5DADE2",
        grid: root?.getPropertyValue("--border-color")?.trim() || "#E2E8F0",
        text: root?.getPropertyValue("--text-body")?.trim() || "#3D3D3D"
    };
}

export default function AppointmentsLineChart({ data }) {
    const colors = useThemeColors();
    const formatted = useMemo(() => {
        return data.map(d => ({ ...d }));
    }, [data]);

    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={formatted} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.primary} stopOpacity={0.25}/>
                        <stop offset="100%" stopColor={colors.primary} stopOpacity={0.03}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: colors.text, fontSize: 12 }} />
                <YAxis tick={{ fill: colors.text, fontSize: 12 }} />
                <Tooltip />
                {/*<Legend />*/}
                <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke={colors.primary}
                    strokeWidth={3}
                    fill={"url(#areaGradient)"}
                    dot={{ r: 4, stroke: colors.accent, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
