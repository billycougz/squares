import { nflTeams, ncaabTeams, type Team } from './constants';

/* ─── Types ─────────────────────────────────────────────────── */

export interface SportPeriod {
    key: string;   // 'Q1', 'H1', 'Final', etc.
    label: string; // Display label for UI
}

export interface SportConfig {
    key: string;
    name: string;
    shortName: string;
    periodType: 'quarter' | 'half';
    periods: SportPeriod[];
    defaultPayouts: number[];
    teams: Team[];
}

/* ─── Period definitions ────────────────────────────────────── */

const NFL_PERIODS: SportPeriod[] = [
    { key: 'Q1', label: 'Q1' },
    { key: 'Q2', label: 'Q2' },
    { key: 'Q3', label: 'Q3' },
    { key: 'Final', label: 'Final' },
];

const NCAAB_PERIODS: SportPeriod[] = [
    { key: 'H1', label: 'H1' },
    { key: 'Final', label: 'Final' },
];

/* ─── Sport configs ─────────────────────────────────────────── */

const sportConfigs: Record<string, SportConfig> = {
    nfl: {
        key: 'nfl',
        name: 'NFL',
        shortName: 'NFL',
        periodType: 'quarter',
        periods: NFL_PERIODS,
        defaultPayouts: [25, 50, 75, 100],
        teams: nflTeams,
    },
    ncaab: {
        key: 'ncaab',
        name: 'NCAA Basketball',
        shortName: 'NCAAB',
        periodType: 'half',
        periods: NCAAB_PERIODS,
        defaultPayouts: [50, 100],
        teams: ncaabTeams,
    },
    custom: {
        key: 'custom',
        name: 'Custom Sport',
        shortName: 'Custom',
        periodType: 'quarter', // generic period
        periods: [], // dynamically generated
        defaultPayouts: [], // dynamically generated
        teams: [], // dynamically generated
    }
};

/* ─── Public API ────────────────────────────────────────────── */

export function getSportConfig(key: string | undefined, numPeriods?: number): SportConfig {
    if (key === 'custom') {
        const periods = numPeriods || 4; // default to 4 periods
        const customPeriods: SportPeriod[] = Array.from({ length: periods }).map((_, i) => ({
            key: i === periods - 1 ? 'Final' : `P${i + 1}`,
            label: i === periods - 1 ? 'Final' : `P${i + 1}`,
        }));

        // Generate uniform payouts based on numPeriods (e.g. 4 -> 25, 50, 75, 100)
        const dp = [];
        for (let i = 1; i <= periods; i++) {
            dp.push(Math.round((100 / periods) * i));
        }
        dp[periods - 1] = 100; // ensure last is exactly 100

        return {
            ...sportConfigs.custom,
            periodType: 'quarter', // Can just use quarter to mean "period" for now
            periods: customPeriods,
            defaultPayouts: dp,
        };
    }
    if (key && sportConfigs[key]) {
        return sportConfigs[key];
    }
    // Default to NFL for backward compatibility
    return sportConfigs.nfl;
}

export function getDefaultResults(sportKey: string | undefined, numPeriods?: number): { quarter: string }[] {
    const config = getSportConfig(sportKey, numPeriods);
    return config.periods.map((p) => ({ quarter: p.key }));
}

export function getPeriodLabel(periodKey: string, sportKey: string | undefined): string {
    const config = getSportConfig(sportKey);
    if (periodKey === 'Final' || periodKey === 'Q4') return 'Final';
    const period = config.periods.find((p) => p.key === periodKey);
    if (period) return period.label;
    if (periodKey.startsWith('P')) return `Period ${periodKey.replace('P', '')}`;
    return periodKey;
}

export function getPeriodTypeLabel(sportKey: string | undefined): string {
    const config = getSportConfig(sportKey);
    if (sportKey === 'custom') return 'Period';
    return config.periodType === 'quarter' ? 'Quarter' : 'Half';
}

export function isFinalPeriod(periodKey: string): boolean {
    return periodKey === 'Final' || periodKey === 'Q4';
}

export const allSports = Object.values(sportConfigs);

export const DEFAULT_SPORT_KEY = 'nfl';
