const API_URL = 'http://localhost:4000/api/machines';

export const fetchMachines = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching machines:', error);
        throw error;
    }
};

export const uploadMasterSlots = async (machineId, slotsData) => {
    try {
        const response = await fetch(`${API_URL}/${machineId}/slots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slotsData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error uploading master slots:', error);
        throw error;
    }
};