import SingleBlog from "@/components/Portfolio/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { GetStaticPropsContext } from "next";
import SectionTitle from "@/components/Common/SectionTitle";
import Gallery from "@/components/Portfolio/Gallery";

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Welcome to my portfolio:"
        description="Explore the gallery of my projects that combine creativity and technical expertise.
"
      />
      <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28 px-10">
        <div className="container">
          <SectionTitle
            title="My latest projects:"
            paragraph="Discover the power of NextJS with my latest projects, where cutting-edge technology and stunning user experiences merge seamlessly."
            center
          />
          <div className="justify-center">
            <Gallery />
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
