import { getLearningResources } from "@/lib/api/resources";
import { Card } from "@/components/ui/card";
import { BookOpen, PlaySquare, Youtube, ExternalLink } from "lucide-react";
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

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => {
                            const isPlaylist = resource.type === 'youtube_playlist';
                            const Icon = isPlaylist ? PlaySquare : Youtube;

                            return (
                                <a 
                                    href={resource.contentUrl || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    key={resource.id}
                                    className="group outline-none"
                                >
                                    <Card className="flex flex-col h-full overflow-hidden cursor-pointer transition-all hover:border-green-500/40 hover:shadow-sm">
                                        <div className="relative w-full aspect-video bg-muted/30 flex items-center justify-center overflow-hidden border-b border-muted">
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
                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <Icon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/60 w-fit px-2.5 py-1 rounded-md">
                                                {isPlaylist ? "Playlist" : "Channel"}
                                                <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                                            </div>
                                        </div>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
