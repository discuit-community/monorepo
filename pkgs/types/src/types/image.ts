export type ImageCopy = {
  name?: string;
  width: number;
  height: number;
  boxWidth: number;
  boxHeight: number;
  objectFit: "cover" | "contain";
  format: "jpeg" | "webp" | "png";
  url: string;
};

export type Image = {
  id: string;
  format: "jpeg" | "webp" | "png";
  mimetype: string;
  width: number;
  height: number;
  size: number;
  averageColor: string;
  url: string;
  copies: ImageCopy[];
  altText?: string;
};

export type ImageUpload = {
  imageId: string;
  caption: string;
};
