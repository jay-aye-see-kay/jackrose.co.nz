const fs = require("fs");
const sizeOf = require("image-size");
const glob = require("glob");

const IMAGE_SIZES_FILE = "./imageSizes.json";
const BLOG_IMAGES_DIR = "./public/blog-images";

const blogImagePaths = glob.sync(
  `${BLOG_IMAGES_DIR}/**/*.{jpg,jpeg,png,svg,gif}`
);

const dimensions = blogImagePaths.reduce((acc, path) => {
  const filename = path.replace(/^\.\/public/, "");
  acc[filename] = sizeOf(path);
  return acc;
}, {});

fs.writeFileSync(IMAGE_SIZES_FILE, JSON.stringify(dimensions, null, 2));
