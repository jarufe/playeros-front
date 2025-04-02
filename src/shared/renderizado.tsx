import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { 
    IconButton,
} from "@mui/material"

export const CheckedIcon = () => {
    return (
        <IconButton color="success" sx={{ p: 0 }}>
        <CircleIcon sx={{ fontSize: 14 }} />
        </IconButton>
    );
};

export const UnCheckedIcon = () => {
    return (
        <IconButton color="error" sx={{ p: 0 }}>
        <CircleIcon sx={{ fontSize: 14 }} />
        </IconButton>
    );
};
