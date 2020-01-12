import { useState, useCallback } from "react"

interface IFetchData {
    loading: boolean,
    request: any,
    error: string|null,
    clearError: () => void
};


export const useHttp = (): IFetchData => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const request = useCallback(async (url: string, method: string = 'GET', body: any = null, headers: any = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const init: RequestInit = {method, body, headers};
            const response = await fetch(url, init);

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false)
            setError(error.message);
        }
    }, []);

    const clearError = useCallback(() => setError(''), []);

    return { loading, request, error, clearError };
}