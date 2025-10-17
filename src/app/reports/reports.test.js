import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportsPage from './page';
import { useReports } from '@/contexts/ReportsContext';

// Mock the ReportsContext
jest.mock('@/contexts/ReportsContext', () => ({
    useReports: jest.fn()
}));

// Mock router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn()
    }),
    usePathname: () => '/reports'
}));

describe('ReportsPage', () => {
    const mockReports = [
        {
            id: '1',
            title: 'Project Status Report',
            type: 'projects',
            format: 'pdf',
            created: new Date().toISOString(),
            status: 'generated'
        },
        {
            id: '2',
            title: 'Task Completion Report',
            type: 'tasks',
            format: 'xlsx',
            created: new Date().toISOString(),
            status: 'pending'
        }
    ];

    const mockContextValue = {
        reports: mockReports,
        loading: false,
        fetchReports: jest.fn(),
        addReport: jest.fn(),
        removeReport: jest.fn(),
        generateReportById: jest.fn()
    };

    beforeEach(() => {
        useReports.mockReturnValue(mockContextValue);
    });

    it('renders reports page with correct title', () => {
        render(<ReportsPage />);
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Generate, view, and manage your reports')).toBeInTheDocument();
    });

    it('displays reports in table', () => {
        render(<ReportsPage />);
        expect(screen.getByText('Project Status Report')).toBeInTheDocument();
        expect(screen.getByText('Task Completion Report')).toBeInTheDocument();
    });

    it('shows create report dialog when button is clicked', () => {
        render(<ReportsPage />);
        const createButton = screen.getByText('Create Report');
        fireEvent.click(createButton);

        expect(screen.getByText('Create New Report')).toBeInTheDocument();
        expect(screen.getByText('Configure your report settings. Click create when you\'re done.')).toBeInTheDocument();
    });

    it('filters reports by type', () => {
        render(<ReportsPage />);

        // Initially shows all reports
        expect(screen.getByText('Project Status Report')).toBeInTheDocument();
        expect(screen.getByText('Task Completion Report')).toBeInTheDocument();

        // Filter by projects
        const projectsTab = screen.getByText('Projects');
        fireEvent.click(projectsTab);

        expect(screen.getByText('Project Status Report')).toBeInTheDocument();
        // Task report should not be visible
        expect(screen.queryByText('Task Completion Report')).not.toBeInTheDocument();
    });
});