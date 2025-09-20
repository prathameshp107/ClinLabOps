# Animal Management Component

This component provides a comprehensive interface for managing laboratory animals with the following features:

## Features

### 1. Animal Overview
- Grid view of all animals with key information
- Filtering by species, status, and age range
- Search functionality
- Statistics cards for quick insights

### 2. Detailed Animal Information
- Comprehensive animal profile with all relevant data
- Experiment associations
- Physical characteristics
- Location information

### 3. Breeding Management
- Breeding pair tracking
- Expected delivery dates
- Pair status management

### 4. Data Visualization
- Species distribution charts
- Progress indicators for metrics

## Components

- `AnimalManagement`: Main component that orchestrates all functionality
- `AnimalForm`: Form for creating and editing animals
- `AnimalDetails`: Detailed view of animal information
- `AnimalFilters`: Filtering controls
- `DeleteConfirmDialog`: Confirmation dialog for deletions
- `AnimalStatsChart`: Data visualization components

## Data Structure

Animals are represented with the following properties:
- `id`: Unique identifier
- `name`: Animal name/ID
- `species`: Species type
- `strain`: Genetic strain
- `age`: Age in weeks
- `weight`: Weight in grams
- `gender`: Male or female
- `status`: Active, inactive, quarantine, or deceased
- `location`: Current housing location
- `dateOfBirth`: Birth date
- `experiments`: Array of associated experiment IDs
- `notes`: Additional notes

## Future Enhancements

Planned improvements include:
- Integration with backend API for real data
- Export/import functionality for animal data
- Advanced reporting capabilities
- Breeding pair analytics

# Animal Management System

A comprehensive animal management system for laboratory environments with full CRUD operations and advanced filtering capabilities.

## Features

### 🐾 Species Support
- **Rat** 🐀
- **Mice** 🐭  
- **Rabbit** 🐰
- **Guinea Pig** 🐹
- **Hamster** 🐹
- **Custom Species** 🔧 (User-defined)

### ✨ Core Functionality
- **Create**: Add new animals with detailed information
- **Read**: View animal details and comprehensive information
- **Update**: Edit animal information and status
- **Delete**: Remove animal records with confirmation

### 🔍 Advanced Features
- **Search**: Real-time search across name, species, and strain
- **Filtering**: Filter by species, status, and age range
- **Statistics**: Dashboard with key metrics and counts
- **Experiments**: Track associated experiments per animal
- **Status Management**: Active, Inactive, Quarantine, Deceased
- **Timeline**: View animal history and status changes

## Components

### AnimalManagement.jsx
Main container component that orchestrates all animal management functionality.

**Features:**
- Grid layout for animal cards
- Real-time search and filtering
- Statistics dashboard
- Modal management for forms and details

### AnimalForm.jsx
Comprehensive form for creating and editing animals.

**Fields:**
- Basic Information (Name, Species, Strain)
- Physical Characteristics (Age, Weight, Date of Birth)
- Location and Housing
- Gender Selection
- Status Management
- Associated Experiments
- Notes

**Validation:**
- Uses Zod schema validation
- Real-time error feedback
- Required field validation

### AnimalDetails.jsx
Detailed view modal showing comprehensive animal information.

**Sections:**
- Basic Information with species icons
- Physical Characteristics with visual metrics
- Location & Housing information
- Associated Experiments list
- Notes and additional information
- Timeline of animal history

### AnimalFilters.jsx
Advanced filtering component with multiple filter options.

**Filter Types:**
- Species filter with icons
- Status filter with color indicators
- Age range filter
- Active filter badges with clear options

### DeleteConfirmDialog.jsx
Confirmation dialog for safe animal record deletion.

## Usage

```jsx
import { AnimalManagement } from '@/components/animal-management';

export default function AnimalsPage() {
  return (
    <div className="container mx-auto p-6">
      <AnimalManagement />
    </div>
  );
}
```

## API Integration

The system is designed to work with the `animalService` for backend integration:

```javascript
import { animalService } from '@/services/animalService';

// Get all animals
const animals = await animalService.getAnimals();

// Create new animal
const newAnimal = await animalService.createAnimal(animalData);

// Update animal
const updatedAnimal = await animalService.updateAnimal(id, animalData);

// Delete animal
await animalService.deleteAnimal(id);
```

## Data Structure

```javascript
const animal = {
  id: 1,
  name: 'Specimen-001',
  species: 'rat',
  strain: 'Wistar',
  age: 12, // weeks
  weight: 250, // grams
  gender: 'male', // 'male' | 'female'
  status: 'active', // 'active' | 'inactive' | 'quarantine' | 'deceased'
  location: 'Cage A-101',
  dateOfBirth: '2024-01-15',
  notes: 'Additional notes...',
  experiments: ['EXP-001', 'EXP-003']
};
```

## Styling

The components use Tailwind CSS with shadcn/ui components for consistent styling:
- Responsive design for mobile and desktop
- Dark mode support
- Consistent color scheme with status indicators
- Smooth animations and transitions

## Navigation

The animal management system is integrated into the main navigation under the "Laboratory" section:

```
Laboratory
├── Protocols
├── Equipments  
├── Inventory
└── Animals 🐾
```

## Future Enhancements

- **Batch Operations**: Select multiple animals for bulk actions
- **Export/Import**: CSV/Excel export and import functionality
- **Photo Upload**: Animal photo management
- **Breeding Records**: Genealogy and breeding information
- **Notifications**: Alerts for feeding schedules
- **Reports**: Generate detailed reports and analytics
- **Barcode/QR**: Generate and scan animal identification codes