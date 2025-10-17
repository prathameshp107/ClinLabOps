"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { getReports, createReport, deleteReport, generateReport } from "@/services/reportService";

const ReportsContext = createContext();

const reportsReducer = (state, action) => {
    switch (action.type) {
        case "SET_REPORTS":
            return { ...state, reports: action.payload, loading: false };
        case "ADD_REPORT":
            return { ...state, reports: [action.payload, ...state.reports] };
        case "UPDATE_REPORT":
            return {
                ...state,
                reports: state.reports.map(report =>
                    report.id === action.payload.id ? action.payload : report
                )
            };
        case "DELETE_REPORT":
            return {
                ...state,
                reports: state.reports.filter(report => report.id !== action.payload)
            };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export const ReportsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reportsReducer, {
        reports: [],
        loading: true,
        error: null
    });

    const validateReport = (report) => {
        // Ensure all reports have required properties with valid defaults
        const validatedReport = {
            ...report,
            format: report.format || 'pdf', // Default to pdf if format is missing
            status: report.status || 'pending', // Default to pending if status is missing
            created: report.created || new Date().toISOString() // Default to now if created date is missing
        };

        // Validate date format
        if (validatedReport.created) {
            const date = new Date(validatedReport.created);
            if (isNaN(date.getTime())) {
                // If date is invalid, set to current date
                validatedReport.created = new Date().toISOString();
            }
        }

        // Map old report types to new ones if needed
        if (validatedReport.type) {
            // Convert backend types to frontend display types
            if (validatedReport.type === "compliance") validatedReport.type = "regulatory";
            if (validatedReport.type === "experiments") validatedReport.type = "research";
            if (validatedReport.type === "projects" && !["regulatory", "research", "miscellaneous"].includes(validatedReport.type)) {
                validatedReport.type = "miscellaneous";
            }
        }

        return validatedReport;
    };

    const fetchReports = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const data = await getReports();
            // Ensure all reports have required properties
            const validatedReports = data.map(report => validateReport(report));
            dispatch({ type: "SET_REPORTS", payload: validatedReports });
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            toast.error("Failed to fetch reports: " + error.message);
        }
    };

    const addReport = async (reportData) => {
        try {
            // Ensure required fields are present
            const validatedReportData = {
                ...reportData,
                format: reportData.format || 'pdf',
                status: reportData.status || 'pending',
                created: reportData.created || new Date().toISOString()
            };

            // If this is a mock upload (not from backend), we don't call the API
            let newReport;
            if (validatedReportData.status === 'uploaded') {
                // Mock uploaded report
                newReport = validatedReportData;
            } else {
                // Actually create a report via API
                newReport = await createReport(validatedReportData);
            }

            // Ensure the new report has all required properties
            const validatedNewReport = validateReport(newReport);

            dispatch({ type: "ADD_REPORT", payload: validatedNewReport });

            if (validatedReportData.status === 'uploaded') {
                toast.success("Report uploaded successfully");
            } else {
                toast.success("Report created successfully");
            }

            return validatedNewReport;
        } catch (error) {
            toast.error("Failed to add report: " + error.message);
            throw error;
        }
    };

    const removeReport = async (id) => {
        try {
            await deleteReport(id);
            dispatch({ type: "DELETE_REPORT", payload: id });
            toast.success("Report deleted successfully");
        } catch (error) {
            toast.error("Failed to delete report: " + error.message);
            throw error;
        }
    };

    const generateReportById = async (id) => {
        try {
            // Find the report to get its type
            const report = state.reports.find(r => r.id === id);
            if (!report) {
                throw new Error("Report not found");
            }

            // Update UI to show generating state
            dispatch({
                type: "UPDATE_REPORT",
                payload: { ...report, status: "generating" }
            });

            // Generate the report (map frontend type to backend endpoint)
            let backendType = report.type;
            if (report.type === "regulatory") backendType = "compliance";
            if (report.type === "research") backendType = "experiments";
            if (report.type === "miscellaneous") backendType = "projects";

            await generateReport(backendType);

            // Update UI to show generated state
            const updatedReport = {
                ...report,
                status: "generated",
                created: new Date().toISOString()
            };

            dispatch({
                type: "UPDATE_REPORT",
                payload: updatedReport
            });

            toast.success("Report generated successfully");
            return updatedReport;
        } catch (error) {
            // Reset the status if generation failed
            const report = state.reports.find(r => r.id === id);
            if (report) {
                dispatch({
                    type: "UPDATE_REPORT",
                    payload: { ...report, status: "failed" }
                });
            }
            toast.error("Failed to generate report: " + error.message);
            throw error;
        }
    };

    // Load reports on initial render
    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <ReportsContext.Provider
            value={{
                ...state,
                fetchReports,
                addReport,
                removeReport,
                generateReportById
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};

export const useReports = () => {
    const context = useContext(ReportsContext);
    if (!context) {
        throw new Error("useReports must be used within a ReportsProvider");
    }
    return context;
};