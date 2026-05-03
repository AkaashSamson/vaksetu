import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { LeaderboardRankItem as RankItemType } from '@/lib/db/queries/leaderboard';

interface LeaderboardRankItemProps {
    item: RankItemType;
    rank: number;
}

export function LeaderboardRankItem({ item, rank }: LeaderboardRankItemProps) {
    const isTop3 = rank <= 3;
    let rankColor = 'text-gray-500';
    let rankBg = 'bg-gray-100';

    if (rank === 1) {
        rankColor = 'text-yellow-600';
        rankBg = 'bg-yellow-100 border-yellow-300';
    } else if (rank === 2) {
        rankColor = 'text-gray-500';
        rankBg = 'bg-gray-200 border-gray-300';
    } else if (rank === 3) {
        rankColor = 'text-amber-700';
        rankBg = 'bg-amber-100 border-amber-300';
    }

    return (
        <div className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${isTop3 ? rankBg : 'bg-white border-green-100 hover:bg-green-50'} transition-colors`}>
            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${rankColor} ${isTop3 ? 'bg-white/60' : 'bg-green-100 text-green-700'}`}>
                    {rank}
                </div>
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={item.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`} />
                    <AvatarFallback className="bg-green-100 text-green-800">{item.fullName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-gray-800">{item.fullName || 'Unknown User'}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 font-bold text-green-700">
                <span>{item.totalScore}</span>
                <Trophy className="w-4 h-4 text-green-600" />
            </div>
        </div>
    );
}
