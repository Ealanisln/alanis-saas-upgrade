interface SeedProduct {
  description: string;
  images: string[];
  price: number;
  slug: string;
  tags: string[];
  type: ValidTypes;
  webtype: "static" | "ecommerce";
  title: string;
}

type ValidTypes = 'front' | 'back'


interface SeedData {
  categories: string[];
  products: SeedProduct[];
}

export const initialData: SeedData = {
  categories: ["front", "back"],
  products: [
    {
      description: "Suitable for small businesses or individuals on a budget.",
      images: ["first-image.png", "second-image.png"],
      price: 299,
      slug: "static-website-1-10-pages",
      tags: ["static", "responsive"],
      type: 'front',
      webtype: "static",
      title: "Static Website 1-10 pages",
    },
    {
      description:
        "Designed for those who need a little more functionality but still want to keep costs down.",
      images: ["first-image.png", "second-image.png"],
      price: 299,
      slug: "static-website-11-50-pages",
      tags: ["static", "responsive"],
      type: 'front',
      webtype: "static",
      title: "Static Website 11-50 pages",
    },
    {
      description:
        "The highest level of service and capabilities, designed for power users.",
      images: ["first-image.png", "second-image.png"],
      price: 299,
      slug: "static-website-51-99-pages",
      tags: ["static", "responsive"],
      type: 'front',
      webtype: "static",
      title: "Static Website 51-99 pages",
    },
  ],
};
