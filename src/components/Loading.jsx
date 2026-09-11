export const Spinner = ({ size = 24 }) => (
  <div
    className="animate-spin rounded-full border-4 border-primary-200 border-t-primary-500"
    style={{ width: size, height: size }}
  />
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-3">
        <div className="skeleton h-40 w-full mb-3" />
        <div className="skeleton h-4 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    ))}
  </div>
);

export const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size={40} />
  </div>
);
