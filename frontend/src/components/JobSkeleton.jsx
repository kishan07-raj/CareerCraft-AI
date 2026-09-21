

const JobSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
    <div className="flex items-center mb-2">
      <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mr-4"></div>
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="flex flex-wrap gap-4 mb-3">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-8 w-32 bg-blue-200 rounded-lg mt-4 animate-pulse"></div>
  </div>
);

export default JobSkeleton;

