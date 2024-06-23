import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alanis Developer | Acerca de mí.",
  description: "Esta página es acerca de mi perfil como desarrollador web.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Acerca de mí"
        description="👋 ¡Hola! Soy Emmanuel, un desarrollador web 🇲🇽 mexicano. Tengo una pasión por desarrollar aplicaciones web modernas 🌎 y estoy constantemente aprendiendo algo nuevo. Además, disfruto ayudar a otros a crecer y desarrollarse junto a mí. 👨🏽‍💻"
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
