import { useMemo } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";
import SmartImage from "./SmartImage";
import SectionTitle from "./SectionTitle";
import ProjectActions from "./ProjectActions";
import { formatMonthYear } from "../utils/projectHelpers";
import useProjectMediaModals from "../utils/useProjectMediaModals";
import { HEADER_IN, PROJECT_IN, SECTION_IN, SLIDE_IN_LEFT, SLIDE_IN_RIGHT } from "../utils/motionPresets";

export default function ProjectsShowcase() {
    const list = useMemo(() => projects.filter((project) => project.featured), []);
    const { openImages, openVideo, openRepo, imageModalProps, videoModalProps } = useProjectMediaModals();

    return (
        <motion.section
            id="projects"
            className="mx-auto max-w-[100rem] px-4 md:px-8 pt-16 pb-28"
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
                <SectionTitle title="Проекты" />
            </motion.div>

            <div className="flex flex-col gap-32">
                {list.map((project, index) => {
                    const imageLeft = index % 2 === 0;
                    const imageMotion = imageLeft ? SLIDE_IN_LEFT : SLIDE_IN_RIGHT;
                    const textMotion = imageLeft ? SLIDE_IN_RIGHT : SLIDE_IN_LEFT;

                    return (
                        <motion.div
                            key={project.id}
                            className="grid items-start md:grid-cols-2 gap-14 md:gap-28 lg:gap-44 xl:gap-56"
                            initial={PROJECT_IN.hidden}
                            whileInView={PROJECT_IN.show}
                            viewport={{ once: true, amount: 0.35 }}
                        >
                            <motion.div
                                initial={imageMotion.hidden}
                                whileInView={imageMotion.show}
                                viewport={{ once: true, amount: 0.4 }}
                                className={`rounded-2xl border border-white/10 bg-white/5 p-1 ${imageLeft ? "" : "md:order-2"}`}
                            >
                                <div className="overflow-hidden rounded-xl">
                                    {project.cover ? (
                                        <div className="w-full aspect-[16/9] bg-black">
                                            <SmartImage
                                                src={project.cover}
                                                alt={project.title}
                                                className="w-full h-full object-cover bg-black"
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
                                    className="flex justify-center gap-3 px-4 py-3"
                                />
                            </motion.div>

                            <motion.div
                                initial={textMotion.hidden}
                                whileInView={textMotion.show}
                                viewport={{ once: true, amount: 0.4 }}
                                className={imageLeft ? "" : "md:order-1"}
                            >
                                <div className="flex items-baseline justify-between gap-8">
                                    <h3 className="text-2xl md:text-3xl font-semibold">{project.title}</h3>
                                    <span className="text-sm text-white/60">{formatMonthYear(project.date, project.year)}</span>
                                </div>

                                {project.summary && (
                                    <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/80">
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
