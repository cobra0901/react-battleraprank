export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-800 rounded mb-8"></div>
      
      {/* Search and filter placeholder */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="h-10 bg-gray-800 rounded flex-1"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-16 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Filter bar placeholder */}
      <div className="h-12 bg-gray-800 rounded mb-6"></div>
      
      {/* Grid placeholder */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array(12).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-square"></div>
            <div className="p-3">
              <div className="h-5 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded mb-2"></div>
              <div className="flex gap-1 mt-2">
                <div className="h-4 w-12 bg-gray-700 rounded"></div>
                <div className="h-4 w-12 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
