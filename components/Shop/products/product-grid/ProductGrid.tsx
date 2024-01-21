import { Product } from "@/types/store.interface";
import ProductGridItem from "./ProductGridItem";

interface Props {
  products: Product[];
}
const ProductGrid = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
