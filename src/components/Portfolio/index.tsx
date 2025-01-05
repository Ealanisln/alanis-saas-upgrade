import SectionTitle from "../Common/SectionTitle";
import { PortfolioProjects } from "./Projects";

const Portfolio = () => {

  return (
    <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Our latest jobs"
          paragraph="Discover the power of NextJS with our latest projects, where cutting-edge technology and stunning user experiences merge seamlessly."
          center
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          <PortfolioProjects />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
