import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function TeamSelectionMenu({ formData, setFormData, nflTeams }) {
    return (
        <Box sx={{ width: '100%' }}>
            {['horizontal', 'vertical'].map((teamSide) => (
                <FormControl key={teamSide} variant='filled' fullWidth sx={{ mb: 1, mt: 1 }} size='small'>
                    <InputLabel sx={{ color: 'white !important', textTransform: 'capitalize' }}>{teamSide} Team</InputLabel>
                    <Select
                        value={formData.teams[teamSide].name}
                        label={`${teamSide} Team`}
                        sx={{ backgroundColor: `${formData.teams[teamSide].color} !important`, color: 'white' }}
                    >
                        {nflTeams.map(({ code, location, name, color }) => (
                            <MenuItem
                                sx={{ backgroundColor: color, color: 'white', '&:hover': { color } }}
                                key={name}
                                value={name}
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        teams: { ...formData.teams, [teamSide]: { code, location, name, color } },
                                    })
                                }
                            >
                                {`${location} ${name}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}
        </Box>
    );
}
