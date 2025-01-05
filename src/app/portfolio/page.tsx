import SingleBlog from "@/components/Portfolio/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { GetStaticPropsContext } from "next";
import SectionTitle from "@/components/Common/SectionTitle";
import Gallery from "@/components/Portfolio/Gallery";

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Mi portafolio"
        description="Explora la galería de mis proyectos que combinan creatividad y experiencia técnica."
      />
      <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28 px-10">
        <div className="container">
          <SectionTitle
            title="Mis proyectos recientes:"
            paragraph="Descubre el poder de NextJS con mis últimos proyectos, donde la tecnología de vanguardia y las sorprendentes experiencias de usuario se fusionan a la perfección."
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
