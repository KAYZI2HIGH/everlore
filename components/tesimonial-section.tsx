"use client";
import { TestimonialsColumn } from "./testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Everlore transformed my skills and helped me generate sustainable income. The practical approach made all the difference.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=BrianaPatton",
    name: "Briana Patton",
    role: "Digital Marketer",
  },
  {
    text: "The courses are incredibly practical. I learned real-world strategies and started my own digital services within weeks.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalAhmed",
    name: "Bilal Ahmed",
    role: "Freelancer",
  },
  {
    text: "Everlore's community and resources are exceptional. I've grown my skills and my income significantly.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SamanMalik",
    name: "Saman Malik",
    role: "Content Creator",
  },
  {
    text: "The academy's structured learning helped me transition into digital innovation. Highly recommended for career growth.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=OmarRaza",
    name: "Omar Raza",
    role: "Tech Professional",
  },
  {
    text: "Everlore provides tools, knowledge, and support to build a sustainable digital career. Best investment ever.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainabHussain",
    name: "Zainab Hussain",
    role: "Online Entrepreneur",
  },
  {
    text: "The practical insights and resources helped me understand the digital economy and create multiple income streams.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlizaKhan",
    name: "Aliza Khan",
    role: "Business Owner",
  },
  {
    text: "Everlore's approach to digital education is refreshing. Real skills, real applications, real results.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=FarhanSiddiqui",
    name: "Farhan Siddiqui",
    role: "Digital Strategist",
  },
  {
    text: "I went from zero digital skills to launching my own service business thanks to Everlore.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SanaSeikh",
    name: "Sana Sheikh",
    role: "Service Provider",
  },
  {
    text: "Everlore empowers you to take control of your digital future. The community support is incredible.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli",
    name: "Hassan Ali",
    role: "Digital Creator",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg text-sm">
              Testimonials
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tighter mt-5">
            What our learners say
          </h2>
          <p className="text-center mt-5 opacity-75">
            Hear from those who've transformed their skills and income with
            Everlore.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={15}
          />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
