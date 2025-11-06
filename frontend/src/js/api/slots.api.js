const API_URL = 'http://localhost:4000/api/slots';

export const getSlotsByMachineId = async (machineId) => {
    try {
        const response = await fetch(`${API_URL}/machine/${machineId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching slots:', error);
        throw error;
    }
};

export const createSlot = async (slotData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slotData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating slot:', error);
        throw error;
    }
};

export const updateSlot = async (slotId, slotData) => {
    try {
        const response = await fetch(`${API_URL}/${slotId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slotData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating slot:', error);
        throw error;
    }
};

export const deleteSlot = async (slotId) => {
    try {
        const response = await fetch(`${API_URL}/${slotId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting slot:', error);
        throw error;
    }
};