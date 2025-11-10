import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateMediaUrlCandidates,
  replaceS3WithBlobUrl,
} from "utils/Utilities";

export default ({
  src,
  placeholderImg,
  alt,
  setLoading,
  className = "",
  ...props
}) => {
  const resolvedPlaceholder =
    replaceS3WithBlobUrl(placeholderImg) ||
    "https://i.ibb.co/y8RhMrL/Untitled-design.png";

  const candidates = useMemo(() => {
    const urls = generateMediaUrlCandidates(src);
    console.log("[ImageShow] Generated candidates for:", src, "=>", urls);
    if (resolvedPlaceholder) {
      urls.push(resolvedPlaceholder);
    }
    return urls.filter(Boolean);
  }, [src, resolvedPlaceholder]);

  const indexRef = useRef(0);
  const [imgSrc, setImgSrc] = useState(
    candidates[0] || resolvedPlaceholder
  );

  useEffect(() => {
    indexRef.current = 0;
    setImgSrc(candidates[0] || resolvedPlaceholder);
  }, [candidates, resolvedPlaceholder]);

  const handleLoad = useCallback(() => {
    setLoading && setLoading(false);
  }, [setLoading]);

  const handleError = useCallback(() => {
    console.error(
      `[ImageShow] Failed to load image (attempt ${indexRef.current + 1}/${
        candidates.length
      }):`,
      imgSrc
    );
    const nextIndex = indexRef.current + 1;
    if (nextIndex < candidates.length) {
      indexRef.current = nextIndex;
      console.log(
        `[ImageShow] Trying fallback candidate ${nextIndex + 1}:`,
        candidates[nextIndex]
      );
      setImgSrc(candidates[nextIndex]);
    } else if (imgSrc !== resolvedPlaceholder) {
      indexRef.current = candidates.length;
      console.log("[ImageShow] Using final placeholder:", resolvedPlaceholder);
      setImgSrc(resolvedPlaceholder);
      setLoading && setLoading(false);
    } else {
      console.log("[ImageShow] All candidates exhausted, placeholder failed");
      setLoading && setLoading(false);
    }
  }, [candidates, imgSrc, resolvedPlaceholder, setLoading]);

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      src={imgSrc}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};
