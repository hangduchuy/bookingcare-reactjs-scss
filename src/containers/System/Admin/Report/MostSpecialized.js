import PropTypes from 'prop-types'
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material'

export const MostSpecialized = (props) => {
    const { sx, value } = props

    return (
        <Card sx={sx} style={{ width: '50%' }}>
            <CardContent>
                <Stack alignItems='flex-start' direction='row' justifyContent='space-between' spacing={3}>
                    <Stack spacing={1}>
                        <Typography color='text.secondary' variant='overline'>
                            Chuyên khoa khám nhiều nhất trong tuần
                        </Typography>
                        <Typography variant='h4'>{value}</Typography>
                    </Stack>
                    <Avatar
                        sx={{
                            backgroundColor: 'primary.light',
                            height: 56,
                            width: 56
                        }}
                    >
                        <i class='fas fa-user-md'></i>
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    )
}

MostSpecialized.propTypes = {
    difference: PropTypes.number,
    positive: PropTypes.bool,
    value: PropTypes.string.isRequired,
    sx: PropTypes.object
}
