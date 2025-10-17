"use client";

import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const ReportCharts = ({ summary }) => {
    // Bar chart data for status distribution
    const statusData = {
        labels: Object.keys(summary.byStatus || {}),
        datasets: [
            {
                label: 'Items by Status',
                data: Object.values(summary.byStatus || {}),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Pie chart data for category/priority distribution
    const categoryData = {
        labels: Object.keys(summary.byCategory || summary.byPriority || {}),
        datasets: [
            {
                label: 'Distribution',
                data: Object.values(summary.byCategory || summary.byPriority || {}),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
                <Bar
                    data={statusData}
                    options={{
                        ...options,
                        plugins: {
                            ...options.plugins,
                            title: {
                                ...options.plugins.title,
                                text: 'Items by Status'
                            }
                        }
                    }}
                />
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
                <Pie
                    data={categoryData}
                    options={{
                        ...options,
                        plugins: {
                            ...options.plugins,
                            title: {
                                ...options.plugins.title,
                                text: 'Category Distribution'
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ReportCharts;