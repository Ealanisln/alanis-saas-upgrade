import SingleBlog from "@/components/Portfolio/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { GetStaticPropsContext } from "next";
import SectionTitle from "@/components/Common/SectionTitle";

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Welcome to my portfolio:"
        description="Explore the gallery of my projects that combine creativity and technical expertise.
"
      />
      <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="My latest projects:"
            paragraph="Discover the power of NextJS with my latest projects, where cutting-edge technology and stunning user experiences merge seamlessly."
            center
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            <SingleBlog />
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
