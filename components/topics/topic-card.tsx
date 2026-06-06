import Link from "next/link"

type TopicCardProps = {
    title: string
    description: string
    imageUrl: string
    href?: string
}

export function TopicCard({ title, imageUrl, href }: TopicCardProps) {
    const CardInner = (
        <div className="group relative">
            {/* Fixed shadow layer */}
            <div
                className="
                    absolute inset-0
                    -translate-x-3 translate-y-3
                    rounded-2xl
                    bg-green-600/55
                    transition-all duration-300
                "
            />

            {/* Card */}
            <article
                className="
                    relative z-10
                    overflow-hidden
                    rounded-2xl
                    border-[4px]
                    border-black
                    bg-card
                    transition-all
                    duration-300
                    ease-out
                    group-hover:-translate-x-3
                    group-hover:translate-y-3
                "
            >
                {/* Bottom-left corner glow */}
                <div className="pointer-events-none absolute -left-8 -bottom-8 z-10 h-32 w-32 rounded-full bg-green-500/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Square tile */}
                <div className="relative aspect-square w-full">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:brightness-95"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />

                    {/* Title pinned to bottom-center */}
                    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-5 pb-4 text-center">
                        <h3 className="text-3xl font-semibold leading-tight text-green-600 drop-shadow-sm">
                            {title}
                        </h3>
                    </div>
                </div>
            </article>
        </div>
    )

    if (href) {
        return (
            <Link
                href={href}
                className="block rounded-2xl focus:outline-none"
                aria-label={title}
            >
                {CardInner}
            </Link>
        )
    }

    return CardInner
}