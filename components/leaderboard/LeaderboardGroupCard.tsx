import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { GroupLeaderboardPreview } from '@/lib/db/queries/leaderboard';
import { LeaderboardRankItem } from './LeaderboardRankItem';

interface LeaderboardGroupCardProps {
    group: GroupLeaderboardPreview;
}

export function LeaderboardGroupCard({ group }: LeaderboardGroupCardProps) {
    return (
        <Card className="w-full flex-shrink-0 snap-center border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-green-50 border-b border-green-100 rounded-t-xl pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            {group.groupName}
                        </CardTitle>
                        {group.description && (
                            <CardDescription className="text-green-700 mt-1 line-clamp-1">
                                {group.description}
                            </CardDescription>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-1 mb-4">
                    {group.topMembers.length > 0 ? (
                        group.topMembers.map((member, idx) => (
                            <LeaderboardRankItem key={member.userId} item={member} rank={idx + 1} />
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">
                            No active participants in this group yet.
                        </div>
                    )}
                </div>
                
                <Link href={`/explore/leaderboard/${group.groupId}`} className="block w-full">
                    <Button variant="outline" className="w-full text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800">
                        View Full Leaderboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
