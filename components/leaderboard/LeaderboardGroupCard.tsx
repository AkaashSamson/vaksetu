import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { GroupLeaderboardPreview } from '@/lib/db/queries/leaderboard';
import { LeaderboardRankItem } from './LeaderboardRankItem';

interface LeaderboardGroupCardProps {
    group: GroupLeaderboardPreview;
}

export function LeaderboardGroupCard({ group }: LeaderboardGroupCardProps) {
    return (
        <Card className="flex flex-col p-5 transition-all hover:border-brand-500/40 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-lg line-clamp-2 leading-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    {group.groupName}
                </h3>
            </div>
            {group.description && (
                <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">
                    {group.description}
                </p>
            )}
            
            <div className="mb-4 mt-2 border rounded-xl overflow-hidden bg-background">
                {group.topMembers.length > 0 ? (
                    group.topMembers.map((member, idx) => (
                        <LeaderboardRankItem key={member.userId} item={member} rank={idx + 1} />
                    ))
                ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm bg-muted/30">
                        No active participants in this group yet.
                    </div>
                )}
            </div>
            
            <Link href={`/explore/leaderboard/${group.groupId}`} className="block w-full mt-auto">
                <Button variant="outline" className="w-full">
                    View Full Leaderboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </Card>
    );
}
