export interface FeaturedEvent {
    title: string;
    sport: string;
    teams: {
        horizontal: string; // The team code, e.g., 'KC'
        vertical: string;   // The team code, e.g., 'SF'
    };
}

export const featuredEvents: FeaturedEvent[] = [
    {
        title: 'Super Bowl LVIII',
        sport: 'nfl',
        teams: {
            horizontal: 'KC',
            vertical: 'SF',
        },
    },
    {
        title: 'NCAAB Final Four',
        sport: 'ncaab',
        teams: {
            horizontal: 'DUKE',
            vertical: 'UNC',
        },
    },
];
