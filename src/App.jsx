import Hero from "./components/Hero";
import About from "./components/About";
import SectionDivider from "./components/SectionDivider";
import OrbitalOrbsBackground from "./components/OrbitalOrbsBackground";
import Footer from "./components/Footer";
import ProjectsShowcase from "./components/ProjectsShowcase";
import CatalogCarousel from "./components/CatalogCarousel.jsx";

export default function App() {
    return (
        // УБРАЛ overflow-hidden — он ломал естественную прокрутку/позицию при модалках
        <div className="relative bg-[#0D0D0F] text-[#EAEAEA]">
            <OrbitalOrbsBackground />

            {/* УБРАЛ scroll-smooth — чтобы window.scrollTo в локе позиции не «анимировал» вверх */}
            <main>
                <section className="h-screen flex items-center justify-center">
                    <Hero />
                </section>

                <SectionDivider />

                <section className="h-screen flex items-center justify-center">
                    <About />
                </section>

                <SectionDivider />

                <section>
                    <ProjectsShowcase />
                </section>

                <SectionDivider />
                <section>
                    <CatalogCarousel />
                </section>

                <Footer />
            </main>
        </div>
    );
}
