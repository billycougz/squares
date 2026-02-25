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
};

/* ─── Public API ────────────────────────────────────────────── */

export function getSportConfig(key: string | undefined): SportConfig {
    if (key && sportConfigs[key]) {
        return sportConfigs[key];
    }
    // Default to NFL for backward compatibility
    return sportConfigs.nfl;
}

export function getDefaultResults(sportKey: string | undefined): { quarter: string }[] {
    const config = getSportConfig(sportKey);
    return config.periods.map((p) => ({ quarter: p.key }));
}

export function getPeriodLabel(periodKey: string, sportKey: string | undefined): string {
    const config = getSportConfig(sportKey);
    if (periodKey === 'Final' || periodKey === 'Q4') return 'Final';
    const period = config.periods.find((p) => p.key === periodKey);
    return period?.label || periodKey;
}

export function getPeriodTypeLabel(sportKey: string | undefined): string {
    const config = getSportConfig(sportKey);
    return config.periodType === 'quarter' ? 'Quarter' : 'Half';
}

export function isFinalPeriod(periodKey: string): boolean {
    return periodKey === 'Final' || periodKey === 'Q4';
}

export const allSports = Object.values(sportConfigs);

export const DEFAULT_SPORT_KEY = 'nfl';
