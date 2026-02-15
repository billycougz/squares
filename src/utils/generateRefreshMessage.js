
export function generateRefreshMessage(prevData, nextData) {
    if (!nextData) {
        return 'Board refreshed successfully.';
    }

    const { gridData: prevGrid, results: prevResults = [] } = prevData || {};
    const { gridData: nextGrid, results: nextResults = [] } = nextData;

    // Check for new winners
    let newWinner = null;
    for (let i = 0; i < nextResults.length; i++) {
        const next = nextResults[i];
        const prev = prevResults[i] || {};
        // Check if a winner was added or changed in this refresh
        if (next.winner && next.winner !== prev.winner) {
            newWinner = next;
        }
    }

    if (newWinner) {
        const quarterLabel = newWinner.quarter === 'Q4' ? 'the Final' : newWinner.quarter;
        return `Board refreshed. Congratulations ${newWinner.winner} for winning ${quarterLabel}.`;
    }

    // Check if game is over (Final winner already declared)
    const finalResult = nextResults.find((r) => r.quarter === 'Q4');
    const prevFinalResult = prevResults.find((r) => r.quarter === 'Q4');
    if (finalResult?.winner && prevFinalResult?.winner === finalResult.winner) {
        return 'What a game. Thanks for playing Squares!';
    }

    // Check if numbers were just set
    const hasNumbers = (grid) => grid && grid[0] && grid[0][1] != null;
    if (!hasNumbers(prevGrid) && hasNumbers(nextGrid)) {
        return 'Board refreshed. The numbers have been set. Let the games begin!';
    }

    // Check for additional square claims
    const newClaimsMap = {};
    let totalNewClaims = 0;

    if (prevGrid && nextGrid) {
        prevGrid.forEach((row, r) => {
            if (r === 0) return; // Skip header row
            row.forEach((val, c) => {
                if (c === 0) return; // Skip header col
                if (!val && nextGrid[r] && nextGrid[r][c]) {
                    const user = nextGrid[r][c];
                    newClaimsMap[user] = (newClaimsMap[user] || 0) + 1;
                    totalNewClaims += 1;
                }
            });
        });
    }

    const claimers = Object.keys(newClaimsMap);
    if (claimers.length > 1) {
        return `Board refreshed. Multiple users have claimed additional squares. ${totalNewClaims} additional squares claimed.`;
    } else if (claimers.length === 1) {
        const user = claimers[0];
        const count = newClaimsMap[user];
        return `Board refreshed. ${user} claimed ${count} new square${count > 1 ? 's' : ''}.`;
    }

    // Check for no changes
    if (
        JSON.stringify(prevGrid) === JSON.stringify(nextGrid) &&
        JSON.stringify(prevResults) === JSON.stringify(nextResults)
    ) {
        return 'Board refreshed. No changes.';
    }

    if (!prevData) {
        return null;
    }

    return 'Board refreshed successfully.';
}
