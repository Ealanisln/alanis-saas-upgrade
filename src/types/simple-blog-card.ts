interface Author {
  _id: string;
  name: string;
}

interface ImageAsset {
  _ref: string;
  _type: 'reference';
}

interface MainImage {
  alt: string;
  asset: ImageAsset;
  _type: string;
}

export interface SimpleBlogCard {
  smallDescription?: string;
  author: Author;
  _id: string;
  _updatedAt: string;
  title: string;
  slug?: {
    current: string;
    _type: string;
  };
  mainImage?: MainImage;
  publishedAt?: string;
}

export interface FullPost {
  currentSlug: string;
  title: string;
  body: Block[];
  mainImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  publishedAt?: string;
  author?: string;
  authorImage?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  smallDescription?: string;
  _updatedAt?: string;
}

interface MarkDef {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

interface Block {
  markDefs: MarkDef[];
  children: Child[];
  _type: 'block';
  style: 'normal';
  _key: string;
}

interface Child {
  _type: 'span';
  text: string;
  marks: string[];
  _key: string;
}
