import { render, screen } from '@testing-library/react'
import { getProjectCategory, categorizeProjects } from './categorized-projects'

// Mock project data
const mockProjects = [
    {
        id: '1',
        name: 'Drug Discovery Research',
        description: 'Advanced computational platform for drug discovery',
        tags: ['drug-discovery', 'ai', 'research']
    },
    {
        id: '2',
        name: 'FDA Compliance Study',
        description: 'Regulatory compliance for medical devices',
        tags: ['fda', 'regulatory', 'compliance']
    },
    {
        id: '3',
        name: 'Client Pilot Project',
        description: 'Pilot study for new client',
        tags: ['pilot', 'client']
    }
]

describe('Project Categorization', () => {
    test('correctly identifies project categories', () => {
        expect(getProjectCategory(mockProjects[0])).toBe('research')
        expect(getProjectCategory(mockProjects[1])).toBe('regulatory')
        expect(getProjectCategory(mockProjects[2])).toBe('miscellaneous')
    })

    test('correctly categorizes projects', () => {
        const categorized = categorizeProjects(mockProjects)

        expect(categorized.research).toHaveLength(1)
        expect(categorized.regulatory).toHaveLength(1)
        expect(categorized.miscellaneous).toHaveLength(1)

        expect(categorized.research[0].id).toBe('1')
        expect(categorized.regulatory[0].id).toBe('2')
        expect(categorized.miscellaneous[0].id).toBe('3')
    })
})