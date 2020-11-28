import Image from "next/image";

import sizes from "../imageSizes.json";

type ImagePath = keyof typeof sizes;

const MAX_WIDTH = 600;

const getImageSize = (path: string) => {
  const img = sizes[path as ImagePath];

  if (!img) {
    throw new Error(`Image size info not found for ${path}`);
  }

  const ratio = img.width / img.height;

  return {
    ...img,
    ratio,
  };
};

type Props = { src: string; alt?: string; title?: string };

export const BlogPostImage = (props: Props) => {
  const { width, height } = getImageSize(props.src);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Image
        src={props.src}
        alt={props.alt}
        title={props.title}
        width={width}
        height={height}
      />
    </div>
  );
};
