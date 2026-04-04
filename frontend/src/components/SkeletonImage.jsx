import { useEffect, useState } from 'react'

function SkeletonImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  fallbackSrc,
  loading = 'lazy',
  referrerPolicy,
}) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setIsLoaded(false)
  }, [src])

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!isLoaded ? <div className="absolute inset-0 animate-pulse bg-white/25" aria-hidden="true" /> : null}
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        referrerPolicy={referrerPolicy}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
            return
          }
          setIsLoaded(true)
        }}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  )
}

export default SkeletonImage
