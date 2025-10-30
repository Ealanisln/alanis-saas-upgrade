import Image from "next/image";
import { Brand } from "@/types/brand";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="pt-16">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp bg-gray-light dark:bg-gray-dark flex flex-wrap items-center justify-center rounded-sm px-8 py-12 sm:px-10 md:px-[50px] md:py-[50px] xl:p-[60px] 2xl:px-[70px] 2xl:py-[80px]"
              data-wow-delay=".1s"
            >
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, name } = brand;

  return (
    <div className="mx-4 flex w-full max-w-[180px] items-center justify-center py-[20px] sm:mx-6 lg:max-w-[160px] xl:mx-8 xl:max-w-[180px] 2xl:mx-10 2xl:max-w-[200px]">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative h-32 w-full opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 dark:opacity-60 dark:hover:opacity-100"
      >
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain dark:invert dark:brightness-[1.8] dark:hue-rotate-180" 
        />
      </a>
    </div>
  );
};
