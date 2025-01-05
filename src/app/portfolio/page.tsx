import SectionTitle from "@/components/Common/SectionTitle";
import { PortfolioProjects } from "@/components/Portfolio/Projects";

const Blog = () => {
  return (
    <>
      <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28 px-10">
        <div className="container">
          <SectionTitle
            title="Mis proyectos recientes:"
            paragraph="Descubre el poder de NextJS con mis últimos proyectos, donde la tecnología de vanguardia y las sorprendentes experiencias de usuario se fusionan a la perfección."
            center
          />
          <div className="justify-center">
            <PortfolioProjects />
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
