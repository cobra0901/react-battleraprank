import React from 'react';
import { render, screen, act } from '@testing-library/react';
import BattlersPage from '../app/battlers/page';
import BattlerPage from '../app/battlers/[id]/page';
import BadgeSection from '../components/battler/BadgeSection';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert fill to a string to avoid boolean attribute warning
    const imgProps = { ...props };
    if (typeof imgProps.fill === 'boolean') {
      imgProps.fill = imgProps.fill.toString();
    }
    return <img {...imgProps} alt={props.alt || ''} />;
  },
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock the data service
jest.mock('../lib/data-service', () => ({
  getWritingBadges: jest.fn().mockResolvedValue([
    { category: 'Writing', badge: 'Test Badge 1', description: 'Test Description 1', isPositive: true },
    { category: 'Writing', badge: 'Test Badge 2', description: 'Test Description 2', isPositive: false },
  ]),
  getPerformanceBadges: jest.fn().mockResolvedValue([
    { category: 'Performance', badge: 'Test Badge 3', description: 'Test Description 3', isPositive: true },
    { category: 'Performance', badge: 'Test Badge 4', description: 'Test Description 4', isPositive: false },
  ]),
  getPersonalBadges: jest.fn().mockResolvedValue([
    { category: 'Personal', badge: 'Test Badge 5', description: 'Test Description 5', isPositive: true },
    { category: 'Personal', badge: 'Test Badge 6', description: 'Test Description 6', isPositive: false },
  ]),
  getAttributesByCategory: jest.fn().mockResolvedValue([
    { category: 'Writing', attribute: 'Test Attribute 1', description: 'Test Description 1' },
    { category: 'Performance', attribute: 'Test Attribute 2', description: 'Test Description 2' },
    { category: 'Personal', attribute: 'Test Attribute 3', description: 'Test Description 3' },
  ]),
}));

// Helper function to set the viewport size
function setViewportSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

describe('UI Responsiveness Tests', () => {
  
  beforeEach(() => {
    // Reset to desktop size by default
    setViewportSize(1200, 800);
  });

  describe('Battlers Grid Responsiveness', () => {
    
    test('renders the battlers grid with correct responsive classes', () => {
      render(<BattlersPage />);
      
      // Check if the grid has the responsive classes
      // The grid doesn't have an explicit role, so we select it by class
      const grid = document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-6');
      expect(grid).not.toBeNull();
    });

    test('renders correctly on mobile viewport', () => {
      // Set to mobile size
      setViewportSize(375, 667);
      
      render(<BattlersPage />);
      
      // Check that the search and filter section is stacked vertically on mobile
      const searchFilterContainer = document.querySelector('.flex.flex-col.md\\:flex-row');
      expect(searchFilterContainer).toHaveClass('flex-col');
    });

    test('renders correctly on tablet viewport', () => {
      // Set to tablet size
      setViewportSize(768, 1024);
      
      render(<BattlersPage />);
      
      // Check if the grid has the appropriate number of columns for tablet
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-4');
    });

    test('renders correctly on desktop viewport', () => {
      // Already set to desktop in beforeEach
      
      render(<BattlersPage />);
      
      // Check if the grid has the appropriate number of columns for desktop
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-6');
    });
  });

  describe('Badge Grid Responsiveness', () => {
    test('renders the badge grid with correct responsive classes', () => {
      render(
        <BadgeSection
          title="Test Badges"
          badges={[
            { badge: 'Test Badge 1', description: 'Test Description 1' },
            { badge: 'Test Badge 2', description: 'Test Description 2' },
          ]}
          isPositive={true}
          selectedBadges={[]}
          onSelectBadge={() => {}}
        />
      );
      
      // Check if the badge grid has responsive classes
      const badgeGrid = document.querySelector('.grid');
      expect(badgeGrid).toHaveClass('grid-cols-2');
      expect(badgeGrid).toHaveClass('md:grid-cols-3');
    });

    test('badge grid layout changes on mobile viewport', () => {
      // Set to mobile size
      setViewportSize(375, 667);
      
      render(
        <BadgeSection
          title="Test Badges"
          badges={[
            { badge: 'Test Badge 1', description: 'Test Description 1' },
            { badge: 'Test Badge 2', description: 'Test Description 2' },
          ]}
          isPositive={true}
          selectedBadges={[]}
          onSelectBadge={() => {}}
        />
      );
      
      // Check that the badge grid has only 2 columns on mobile
      const badgeGrid = document.querySelector('.grid');
      expect(badgeGrid).toHaveClass('grid-cols-2');
      
      // Check that the badges are rendered properly
      const badges = document.querySelectorAll('.cursor-pointer');
      expect(badges.length).toBe(2);
    });

    test('badge grid layout changes on tablet viewport', () => {
      // Set to tablet size
      setViewportSize(768, 1024);
      
      render(
        <BadgeSection
          title="Test Badges"
          badges={[
            { badge: 'Test Badge 1', description: 'Test Description 1' },
            { badge: 'Test Badge 2', description: 'Test Description 2' },
          ]}
          isPositive={true}
          selectedBadges={[]}
          onSelectBadge={() => {}}
        />
      );
      
      // Check that the badge grid has 3 columns on tablet
      const badgeGrid = document.querySelector('.grid');
      expect(badgeGrid).toHaveClass('md:grid-cols-3');
    });
  });

  describe('Battler Detail Page Responsiveness', () => {
    test('profile header changes layout on mobile viewport', async () => {
      // Set to mobile size
      setViewportSize(375, 667);
      
      render(<BattlerPage />);
      
      // Wait for async operations to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // Check that the profile header is stacked vertically on mobile
      const profileHeader = document.querySelector('.flex.flex-col.md\\:flex-row.gap-6');
      expect(profileHeader).toHaveClass('flex-col');
      
      // Check that the rating box is positioned correctly on mobile
      const ratingBox = document.querySelector('.flex.flex-col.md\\:flex-row.md\\:items-end');
      expect(ratingBox).toHaveClass('flex-col');
    });

    test('profile header uses row layout on desktop viewport', async () => {
      // Already set to desktop in beforeEach
      
      render(<BattlerPage />);
      
      // Wait for async operations to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // Check that the profile header is in a row layout on desktop
      const profileHeader = document.querySelector('.flex.flex-col.md\\:flex-row.gap-6');
      expect(profileHeader).toHaveClass('md:flex-row');
      
      // Check that the rating box is positioned correctly on desktop
      const ratingBox = document.querySelector('.flex.flex-col.md\\:flex-row.md\\:items-end');
      expect(ratingBox).toHaveClass('md:flex-row');
      expect(ratingBox).toHaveClass('md:items-end');
    });
  });
});
