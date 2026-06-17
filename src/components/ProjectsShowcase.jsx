import { useMemo } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";
import SmartImage from "./SmartImage";
import SectionTitle from "./SectionTitle";
import ProjectActions from "./ProjectActions";
import TechTags from "./TechTags";
import TiltCard from "./TiltCard";
import { formatMonthYear } from "../utils/projectHelpers";
import useProjectMediaModals from "../utils/useProjectMediaModals";
import { HEADER_IN, PROJECT_IN, SECTION_IN, SLIDE_IN_LEFT, SLIDE_IN_RIGHT } from "../utils/motionPresets";

export default function ProjectsShowcase() {
    const list = useMemo(() => projects.filter((project) => project.featured), []);
    const { openImages, openVideo, openRepo, imageModalProps, videoModalProps } = useProjectMediaModals();

    return (
        <motion.section
            id="projects"
            className="mx-auto max-w-[100rem] overflow-x-clip px-4 md:px-8 pt-16 pb-28"
            initial={SECTION_IN.hidden}
            whileInView={SECTION_IN.show}
            viewport={{ once: true, amount: 0.22 }}
        >
            <motion.div
                className="mb-20"
                initial={HEADER_IN.hidden}
                whileInView={HEADER_IN.show}
                viewport={{ once: true, amount: 0.65 }}
            >
                <SectionTitle title="Проекты" eyebrow="избранное" />
            </motion.div>

            <div className="flex flex-col gap-32">
                {list.map((project, index) => {
                    const imageLeft = index % 2 === 0;
                    const imageMotion = imageLeft ? SLIDE_IN_LEFT : SLIDE_IN_RIGHT;
                    const textMotion = imageLeft ? SLIDE_IN_RIGHT : SLIDE_IN_LEFT;
                    const number = String(index + 1).padStart(2, "0");

                    return (
                        <motion.div
                            key={project.id}
                            className="grid items-center md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 xl:gap-32"
                            initial={PROJECT_IN.hidden}
                            whileInView={PROJECT_IN.show}
                            viewport={{ once: true, amount: 0.35 }}
                        >
                            <motion.div
                                initial={imageMotion.hidden}
                                whileInView={imageMotion.show}
                                viewport={{ once: true, amount: 0.4 }}
                                className={imageLeft ? "" : "md:order-2"}
                            >
                                <TiltCard className="group rounded-2xl border border-white/10 bg-white/5 p-1">
                                    <div className="overflow-hidden rounded-xl">
                                        {project.cover ? (
                                            <div className="w-full aspect-[16/9] bg-black">
                                                <SmartImage
                                                    src={project.cover}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover bg-black grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                                                    width={1600}
                                                    height={900}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full aspect-[16/9] bg-white/5" />
                                        )}
                                    </div>

                                    <ProjectActions
                                        project={project}
                                        onOpenImages={openImages}
                                        onOpenVideo={openVideo}
                                        onOpenRepo={openRepo}
                                        className="flex flex-wrap justify-center gap-2 px-3 py-3"
                                    />
                                </TiltCard>
                            </motion.div>

                            <motion.div
                                initial={textMotion.hidden}
                                whileInView={textMotion.show}
                                viewport={{ once: true, amount: 0.4 }}
                                className={imageLeft ? "" : "md:order-1"}
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="font-mono-num text-sm text-white/35 leading-none">{number}</span>
                                    <span className="h-px flex-1 bg-white/10" />
                                    <span className="font-mono text-xs text-white/50">{formatMonthYear(project.date, project.year)}</span>
                                </div>

                                <h3 className="mt-4 text-2xl md:text-3xl font-semibold">{project.title}</h3>

                                <TechTags tags={project.tags} className="mt-4" />

                                {project.summary && (
                                    <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed text-white/80">
                                        {project.summary}
                                    </p>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <ShowcaseImageModal {...imageModalProps} />
            <ShowcaseVideoModal {...videoModalProps} />
        </motion.section>
    );
}
