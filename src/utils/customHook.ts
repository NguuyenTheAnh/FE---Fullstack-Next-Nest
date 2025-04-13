import { useState, useEffect } from 'react';

// this hook is used to avoid hydration error in Nextjs
export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}
