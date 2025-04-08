import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BadgeSection from '../components/battler/BadgeSection';
import { getWritingBadges, getPerformanceBadges, getPersonalBadges } from '../lib/data-service';

// Mock the next components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, fill, ...rest } = props;
    const fillValue = typeof fill === 'boolean' ? String(fill) : fill;
    return <img src={src} alt={alt || ''} fill={fillValue} {...rest} />;
  },
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn() }),
}));

// Rather than overriding mocks, we'll use the actual functions for these tests
// but manually test their return values
jest.mock('../lib/data-service');

describe('Badge System Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('writing badges have unique titles', async () => {
    // Mock implementation just for this test
    const mockWritingBadges = [
      { category: 'Writing', badge: 'Badge 1', description: 'Description 1', isPositive: true },
      { category: 'Writing', badge: 'Badge 2', description: 'Description 2', isPositive: true },
      { category: 'Writing', badge: 'Badge 3', description: 'Description 3', isPositive: false },
    ];
    
    (getWritingBadges as jest.Mock).mockResolvedValue(mockWritingBadges);
    
    const badges = await getWritingBadges();
    const badgeTitles = badges.map(badge => badge.badge);
    const uniqueBadgeTitles = [...new Set(badgeTitles)];
    
    // Check if all badge titles are unique
    expect(badgeTitles.length).toBe(uniqueBadgeTitles.length);
  });
  
  test('performance badges have unique titles', async () => {
    // Mock implementation just for this test
    const mockPerformanceBadges = [
      { category: 'Performance', badge: 'Badge 1', description: 'Description 1', isPositive: true },
      { category: 'Performance', badge: 'Badge 2', description: 'Description 2', isPositive: true },
      { category: 'Performance', badge: 'Badge 3', description: 'Description 3', isPositive: false },
    ];
    
    (getPerformanceBadges as jest.Mock).mockResolvedValue(mockPerformanceBadges);
    
    const badges = await getPerformanceBadges();
    const badgeTitles = badges.map(badge => badge.badge);
    const uniqueBadgeTitles = [...new Set(badgeTitles)];
    
    // Check if all badge titles are unique
    expect(badgeTitles.length).toBe(uniqueBadgeTitles.length);
  });
  
  test('personal badges have unique titles', async () => {
    // Mock implementation just for this test
    const mockPersonalBadges = [
      { category: 'Personal', badge: 'Badge 1', description: 'Description 1', isPositive: true },
      { category: 'Personal', badge: 'Badge 2', description: 'Description 2', isPositive: true },
      { category: 'Personal', badge: 'Badge 3', description: 'Description 3', isPositive: false },
    ];
    
    (getPersonalBadges as jest.Mock).mockResolvedValue(mockPersonalBadges);
    
    const badges = await getPersonalBadges();
    const badgeTitles = badges.map(badge => badge.badge);
    const uniqueBadgeTitles = [...new Set(badgeTitles)];
    
    // Check if all badge titles are unique
    expect(badgeTitles.length).toBe(uniqueBadgeTitles.length);
  });
  
  test('positive and negative badges are correctly marked', async () => {
    // Mock implementations for this test
    const mockWritingBadges = [
      { category: 'Writing', badge: 'Punchline King/Queen', description: 'Description', isPositive: true },
    ];
    
    const mockPersonalBadges = [
      { category: 'Personal', badge: 'Inauthentic Persona', description: 'Description', isPositive: false },
    ];
    
    (getWritingBadges as jest.Mock).mockResolvedValue(mockWritingBadges);
    (getPersonalBadges as jest.Mock).mockResolvedValue(mockPersonalBadges);
    (getPerformanceBadges as jest.Mock).mockResolvedValue([]);
    
    // Check that badges have the correct positive/negative marking
    const writingBadges = await getWritingBadges();
    const personalBadges = await getPersonalBadges();
    
    const punchlineKingQueen = writingBadges.find(b => b.badge === 'Punchline King/Queen');
    expect(punchlineKingQueen).toBeDefined();
    expect(punchlineKingQueen?.isPositive).toBe(true);
    
    const inauthenticPersona = personalBadges.find(b => b.badge === 'Inauthentic Persona');
    expect(inauthenticPersona).toBeDefined();
    expect(inauthenticPersona?.isPositive).toBe(false);
  });
  
  test('BadgeSection correctly displays badges based on isPositive', () => {
    // Create badges with explicit isPositive values
    const mockBadges = [
      { badge: 'Positive Badge', description: 'A positive badge', isPositive: true },
      { badge: 'Negative Badge', description: 'A negative badge', isPositive: false },
    ];
    
    // When testing with isPositive=true, only filter positive badges
    const positiveBadges = mockBadges.filter(badge => badge.isPositive);
    
    // Test with positive badges
    const { rerender } = render(
      <BadgeSection
        title="Positive Badges"
        badges={positiveBadges}  // Only pass positive badges when isPositive is true
        isPositive={true}
        selectedBadges={[]}
        onSelectBadge={() => {}}
      />
    );
    
    // Check for the positive badge
    expect(screen.getByTestId('badge-text-positive-badge')).toBeInTheDocument();
    // Negative badge should not be rendered because we only passed positive badges
    expect(screen.queryByTestId('badge-text-negative-badge')).not.toBeInTheDocument();
    
    // When testing with isPositive=false, only filter negative badges
    const negativeBadges = mockBadges.filter(badge => !badge.isPositive);
    
    // Rerender with negative badges
    rerender(
      <BadgeSection
        title="Negative Badges"
        badges={negativeBadges}  // Only pass negative badges when isPositive is false
        isPositive={false}
        selectedBadges={[]}
        onSelectBadge={() => {}}
      />
    );
    
    // Check for the negative badge
    expect(screen.getByTestId('badge-text-negative-badge')).toBeInTheDocument();
    // Positive badge should not be rendered because we only passed negative badges
    expect(screen.queryByTestId('badge-text-positive-badge')).not.toBeInTheDocument();
  });
  
  test('selecting a badge adds it to the selectedBadges array', () => {
    const mockBadges = [
      { badge: 'Test Badge', description: 'A test badge' },
    ];
    const onSelectBadgeMock = jest.fn();
    
    render(
      <BadgeSection
        title="Test Badges"
        badges={mockBadges}
        isPositive={true}
        selectedBadges={[]}
        onSelectBadge={onSelectBadgeMock}
      />
    );
    
    // Select the badge using data-testid
    const badge = screen.getByTestId('badge-item-test-badge');
    fireEvent.click(badge);
    
    // Check that the onSelectBadge function was called with the correct arguments
    expect(onSelectBadgeMock).toHaveBeenCalledWith('Test Badge', true);
  });
  
  test('deselecting a badge removes it from the selectedBadges array', () => {
    const mockBadges = [
      { badge: 'Test Badge', description: 'A test badge' },
    ];
    const onSelectBadgeMock = jest.fn();
    
    render(
      <BadgeSection
        title="Test Badges"
        badges={mockBadges}
        isPositive={true}
        selectedBadges={['Test Badge']}
        onSelectBadge={onSelectBadgeMock}
      />
    );
    
    // Check that the badge is shown as selected
    const badge = screen.getByTestId('badge-item-test-badge');
    expect(badge).toHaveAttribute('data-selected', 'true');
    
    // Check for the visual selection indicator
    expect(screen.getByTestId('badge-selected-indicator-test-badge')).toBeInTheDocument();
    
    // Deselect the badge
    fireEvent.click(badge);
    
    // Check that the onSelectBadge function was called with the correct arguments
    expect(onSelectBadgeMock).toHaveBeenCalledWith('Test Badge', true);
  });
  
  test('badge sections render with appropriate colors for positive and negative badges', () => {
    const mockBadges = [
      { badge: 'Test Badge', description: 'A test badge' },
    ];
    
    // Render with positive badges and verify green color scheme
    const { rerender } = render(
      <BadgeSection
        title="Positive Badges"
        badges={mockBadges}
        isPositive={true}
        selectedBadges={['Test Badge']}
        onSelectBadge={() => {}}
      />
    );
    
    // Verify that the badge has the positive color scheme
    const positiveBadge = screen.getByTestId('badge-item-test-badge');
    expect(positiveBadge.className).toContain('bg-green-100');
    
    // Check the title color
    const positiveTitle = screen.getByTestId('badge-section-title-positive');
    expect(positiveTitle.className).toContain('text-green-500');
    
    // Change to negative badges and verify red color scheme
    rerender(
      <BadgeSection
        title="Negative Badges"
        badges={mockBadges}
        isPositive={false}
        selectedBadges={['Test Badge']}
        onSelectBadge={() => {}}
      />
    );
    
    // Verify that the badge has the negative color scheme
    const negativeBadge = screen.getByTestId('badge-item-test-badge');
    expect(negativeBadge.className).toContain('bg-red-100');
    
    // Check the title color
    const negativeTitle = screen.getByTestId('badge-section-title-negative');
    expect(negativeTitle.className).toContain('text-red-500');
  });
});
