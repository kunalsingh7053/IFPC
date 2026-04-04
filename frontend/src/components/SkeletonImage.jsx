import { useEffect, useRef, useState } from 'react'

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
  const imgRef = useRef(null)

  useEffect(() => {
    setCurrentSrc(src)
    setIsLoaded(false)
  }, [src])

  useEffect(() => {
    const imageElement = imgRef.current
    if (!imageElement) return

    // If the browser already has this image cached, load event might not re-fire.
    if (imageElement.complete && imageElement.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [currentSrc])

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!isLoaded ? <div className="absolute inset-0 animate-pulse bg-white/25" aria-hidden="true" /> : null}
      <img
        ref={imgRef}
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
        className={`${className} opacity-100`}
      />
    </div>
  )
}

export default SkeletonImage
