// This file contains functions for handling sales-related API calls, including uploading sales data.

const API_URL = 'http://localhost:4000/api/sales';

export const getSales = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const uploadSales = async (salesData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salesData),
        });
        if (!response.ok) {
            throw new Error('Failed to upload sales data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error uploading sales:', error);
        throw error;
    }
};