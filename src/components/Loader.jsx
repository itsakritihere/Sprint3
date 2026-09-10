import "./Loader.css";

function SkeletonLoader() {
  return (
    <div className="skeleton-list">
      {[1, 2, 3, 4, 5].map((item) => (
        <div className="skeleton-card" key={item}>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;