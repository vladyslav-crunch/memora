"use client";
import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {useProgressionHistory} from "@/hooks/useProgressionHistory";
import {fillLastWeek} from "@/lib/utility/fillLastWeek";
import styles from './report.module.css'

function Report() {
    const {data, isLoading} = useProgressionHistory();

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No history available</p>;

    const filled = fillLastWeek(data);

    const chartData = filled.map((d) => ({
        date: new Date(d.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
        }),
        high: d.highIndicationCount,
        mid: d.midIndicationCount,
        low: d.lowIndicationCount,
        veryLow: d.veryLowIndicationCount,
    }));
    const last = chartData.at(-1)
    return (
        <div className={styles.reportContainer}>
            <h3 className={"text-2xl font-semibold mb-4"}>Weekly report</h3>
            <div className={styles.reportChartContainer}>
                <ResponsiveContainer className={styles.reportChart} width="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid stroke="#f7cebf" strokeDasharray="5 5"/>
                        <XAxis dataKey="date"/>
                        <YAxis allowDecimals={false}/>
                        <Tooltip/>

                        <Line type="monotone" dataKey="high" stroke="#4ade80" strokeWidth={2} name="High"/>
                        <Line type="monotone" dataKey="mid" stroke="#60a5fa" strokeWidth={2} name="Mid"/>
                        <Line type="monotone" dataKey="low" stroke="#fbbf24" strokeWidth={2} name="Low"/>
                        <Line type="monotone" dataKey="veryLow" stroke="#f87171" strokeWidth={2} name="Very Low"/>
                    </LineChart>
                </ResponsiveContainer>
                <div className={styles.reportChartLegend}>
                    {last && (
                        <>
                          <span>
                            <span className={`${styles.dot} ${styles.dotVeryLow}`}/>
                            Very low – {last.veryLow}
                          </span>
                            <span>
                            <span className={`${styles.dot} ${styles.dotLow}`}/>
                            Low – {last.low}
                          </span>
                            <span>
                            <span className={`${styles.dot} ${styles.dotMid}`}/>
                            Mid – {last.mid}
                          </span>
                            <span>
                            <span className={`${styles.dot} ${styles.dotHigh}`}/>
                            High – {last.high}
                          </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Report;
