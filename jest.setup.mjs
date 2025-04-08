// Mock next/navigation
global.jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next/image
global.jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }) => {
    // Convert boolean props to string
    const fillValue = typeof fill === 'boolean' ? String(fill) : fill;
    return (
      <img 
        src={src} 
        alt={alt || ''} 
        fill={fillValue}
        {...props}
      />
    );
  },
}));
