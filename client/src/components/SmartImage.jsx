export default function SmartImage({
    src,
    alt = "",
    className = "",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  }) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        sizes={sizes}
      />
    );
  }
  