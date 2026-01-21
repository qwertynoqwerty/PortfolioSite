import { useEffect } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import SectionDivider from "./components/SectionDivider";
import OrbitalOrbsBackground from "./components/OrbitalOrbsBackground";
import Footer from "./components/Footer";
import ProjectsShowcase from "./components/ProjectsShowcase";
import CatalogCarousel from "./components/CatalogCarousel.jsx";

export default function App() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    return (
        <div className="relative bg-[#0D0D0F] text-[#EAEAEA]">
            <OrbitalOrbsBackground />

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
