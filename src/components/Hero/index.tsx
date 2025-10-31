"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home.hero');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] animate-blob rounded-full bg-gradient-to-r from-primary/30 to-blue-400/30 mix-blend-multiply blur-3xl filter dark:mix-blend-lighten"></div>
          <div className="animation-delay-2000 absolute right-[10%] top-[10%] h-[500px] w-[500px] animate-blob rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 mix-blend-multiply blur-3xl filter dark:mix-blend-lighten"></div>
          <div className="animation-delay-4000 absolute bottom-[20%] left-[20%] h-[500px] w-[500px] animate-blob rounded-full bg-gradient-to-r from-blue-400/30 to-primary/30 mix-blend-multiply blur-3xl filter dark:mix-blend-lighten"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100dvh-5rem)] items-center">
          <div className="w-full py-12">
            <motion.div
              className="grid items-center gap-16 lg:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Content */}
              <div className="text-center lg:text-left">
                <motion.h1
                  className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl"
                  variants={itemVariants}
                >
                  {t('title')}
                </motion.h1>

                <motion.p
                  className="mt-4 text-xl text-body-color dark:text-body-color-dark sm:text-2xl"
                  variants={itemVariants}
                >
                  {t('subtitle')}
                </motion.p>

                <motion.p
                  className="mt-6 text-lg text-body-color dark:text-body-color-dark"
                  variants={itemVariants}
                >
                  {t('description')}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
                  variants={itemVariants}
                >
                  <Link href="/portfolio">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="h-14 rounded-xl bg-primary px-8 text-base font-medium text-white shadow-lg shadow-primary/25 duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 dark:shadow-primary/20">
                        {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-2 border-primary/20 bg-white/60 px-8 text-base font-medium text-primary backdrop-blur-md duration-300 hover:border-primary/40 hover:bg-white/80 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10"
                      >
                        {t('contact')}
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Image with Glassmorphism */}
              <motion.div
                className="flex justify-center lg:justify-end"
                variants={imageVariants}
              >
                <div className="group relative">
                  {/* Glassmorphism Card */}
                  <motion.div
                    className="relative z-10 rounded-3xl border border-white/20 bg-white/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 dark:border-white/10 dark:bg-white/5"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      rotate: 2,
                    }}
                  >
                    <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
                      <Image
                        src="/images/hero/hero-light.svg"
                        alt="Hero illustration"
                        fill
                        className="dark:hidden"
                        priority
                      />
                      <Image
                        src="/images/hero/hero-dark.svg"
                        alt="Hero illustration"
                        fill
                        className="hidden dark:block"
                        priority
                      />
                    </div>
                  </motion.div>

                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl transition-all duration-500 group-hover:scale-125"></div>
                  <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl transition-all duration-500 group-hover:scale-125"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 10px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
