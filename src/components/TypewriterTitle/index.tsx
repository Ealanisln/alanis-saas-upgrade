"use client";

import React from 'react'
import TypewriterComponent from "typewriter-effect";

const TitleTypewriter = () => {
  return (
    <div className="text-neutral-950 font-bold py-10 text-center space-y-5 mb-2">
    <div className="text-black dark:text-white text-4xl sm:text-4xl md:text-5xl lg:text-6xl space-y-5 font-extrabold">
      <h1>Obtén tú sitio web moderno</h1>
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        <div className="py-2">
      <TypewriterComponent
            options={{
              strings: [
                "Para empresas modernas.",
                "Utilizando las mejores tecnologías como Next JS.",
                "Obtén más visitas.",
                "Resultados inmediatos."
              ],
              autoStart: true,
              loop: true,
            }}
          />
          </div>
      </div>
    </div>
  </div>


  )
}

export default TitleTypewriter
