import { getLearningResources } from "@/lib/api/resources";
import { Card } from "@/components/ui/card";
import { BookOpen, PlaySquare, Youtube } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function ResourcesPage() {
    const resources = await getLearningResources();

    return (
        <>
            <PageHeader title="Learning Resources" icon={BookOpen} />
            <div className="flex flex-1 flex-col p-4 pt-6">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Available Resources</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Explore curated sign language courses, dictionaries, and tutorials.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => {
                            const isPlaylist = resource.type === 'youtube_playlist';
                            const Icon = isPlaylist ? PlaySquare : Youtube;

                            return (
                            <div key={resource.id} className="group relative h-80 sm:h-88 md:h-86">
                                {/* Fixed green shadow layer behind the tile */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 z-0 rounded-2xl translate-x-[-12px] translate-y-[12px] bg-[rgba(22,163,74,0.55)]"
                                />

                                {/* Clickable card wrapper */}
                                <a
                                    href={resource.contentUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative z-10 block rounded-2xl focus:outline-none h-full"
                                >
                                    <Card
                                        className={[
                                            "relative z-10 flex flex-col h-full overflow-hidden cursor-pointer transition-transform duration-200 ease-out",
                                            "border-4 border-black",
                                            "hover:-translate-x-3 hover:translate-y-3",
                                            "bg-white text-black p-0",
                                        ].join(" ")}
                                    >
                                        {/* Thumbnail area: fixed fraction of the card */}
                                        <div className="relative w-full h-48 bg-muted/30 flex items-center justify-center overflow-hidden border-b border-muted">
                                            {resource.thumbnailUrl ? (
                                                <img
                                                    src={resource.thumbnailUrl}
                                                    alt={resource.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <Youtube className="w-16 h-16 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110" />
                                            )}
                                        </div>

                                        {/* Content area: fills remaining space, keeps text truncated */}
                                        {/* Content area: tightened vertical spacing, description has no extra bottom gap */}
                                        <div className="flex flex-col px-5 py-2 flex-1">
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <h3 className="font-semibold text-lg line-clamp-2 leading-tight transition-colors text-black group-hover:text-green-600">
                                                    {resource.title}
                                                </h3>
                                                <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {resource.description}
                                            </p>
                                        </div>

                                    </Card>
                                </a>
                            </div>

                        );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
