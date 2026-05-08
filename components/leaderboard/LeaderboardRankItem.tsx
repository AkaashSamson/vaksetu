import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardRankItem as RankItemType } from '@/lib/db/queries/leaderboard';

interface LeaderboardRankItemProps {
    item: RankItemType;
    rank: number;
}

export function LeaderboardRankItem({ item, rank }: LeaderboardRankItemProps) {
    const isTop3 = rank <= 3;
    let rankColor = 'text-muted-foreground';
    let rankBg = 'bg-transparent';
    let badgeColor = 'bg-muted text-muted-foreground';

    if (rank === 1) {
        rankColor = 'text-amber-800'; // Subtle brownish gold
        rankBg = 'bg-amber-50/60';
        badgeColor = 'bg-amber-200/50 text-amber-800';
    } else if (rank === 2) {
        rankColor = 'text-slate-700'; // Subtle silver
        rankBg = 'bg-slate-50/60';
        badgeColor = 'bg-slate-200/60 text-slate-700';
    } else if (rank === 3) {
        rankColor = 'text-orange-900'; // Subtle bronze/brown
        rankBg = 'bg-orange-50/60';
        badgeColor = 'bg-orange-200/50 text-orange-900';
    }

    return (
        <div className={`flex items-center justify-between p-3 border-b last:border-b-0 ${rankBg} transition-colors`}>
            <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${badgeColor}`}>
                    {rank}
                </div>
                <div>
                    <p className={`font-medium ${isTop3 ? rankColor : 'text-foreground'}`}>
                        {item.fullName || 'Unknown User'}
                    </p>
                </div>
            </div>
            <div className={`flex items-center gap-1 font-bold ${isTop3 ? rankColor : 'text-muted-foreground'}`}>
                <span>{item.totalScore}</span>
                <Trophy className="w-4 h-4 opacity-80" />
            </div>
        </div>
    );
}
