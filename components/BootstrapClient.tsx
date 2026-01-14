'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
    useEffect(() => {
        // Import bootstrap JS only on the client
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return null;
}
