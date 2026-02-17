import axios from 'axios';
import * as MOCK from './__mocks__/api';

const DO_MOCK = process.env.NEXT_PUBLIC_DO_MOCK === 'true';

const API_BASE = '/api/boards';

export const createBoard = async (formData) => {
	if (DO_MOCK) {
		return MOCK.createBoard(formData);
	}
	try {
		// New API expects just the data, not wrapped in { data, operation }
		const { data } = await axios.post(API_BASE, formData);
		return data;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};

/**
 * @param {Object} updateData
 * @param {string} updateData.id
 * @param {string} updateData.operation
 * @param {Object} updateData.value
 * @param {number} [updateData.row]
 * @param {number} [updateData.col]
 * @param {Object} [updateData.scores]
 */
export const updateBoard = async (updateData) => {
	if (DO_MOCK) {
		return MOCK.updateBoard(updateData);
	}

	const { id, operation, value, row, col, scores } = updateData;
	let url = `${API_BASE}/${id}`;

	try {
		let response;
		switch (operation) {
			case 'select':
				response = await axios.post(`${url}/squares`, { row, col, value });
				break;
			case 'remove':
				// utilizing DELETE with body
				response = await axios.delete(`${url}/squares`, { data: { row, col } });
				break;
			case 'result':
				response = await axios.post(`${url}/results`, { value, scores, row, col });
				break;
			case 'numbers':
				response = await axios.post(`${url}/numbers`, {});
				break;
			case 'finances':
			case 'update':
				response = await axios.put(url, value);
				break;
			default:
				console.error(`Unknown operation: ${operation}`);
				return { error: 'Unknown operation' };
		}

		const { data } = response;
		// Legacy frontend expects { Item: ... } or { error ... } or sometimes just the object
		// The new API returns { Item: ... } or just the object depending on the route.
		// Let's standardise the return here if possible, or pass through.
		// check if data has Item, if so return that? 
		// Original updateBoard returned `data`, which was usually { Item: ... }
		return data;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};

export const loadBoard = async ({ id, adminCode }) => {
	if (DO_MOCK) {
		return MOCK.loadBoard({ id, adminCode });
	}
	try {
		let url = `${API_BASE}/${id}`;
		if (adminCode) {
			url += `?adminCode=${adminCode}`;
		}
		const { data } = await axios.get(url);
		// data should be the board object directly now from GET /boards/[id]
		// But wait, my getBoard implementation returned `board`. 
		// Original `loadBoard` returned `data.Item` if valid.
		// Current GET /boards/[id] returns `board` (the Item itself).
		return data;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};

export const subscribeNumberToBoard = async (params) => {
	if (DO_MOCK) {
		return MOCK.subscribeNumberToBoard(params);
	}
	const { id, phoneNumber } = params;
	try {
		const { data } = await axios.post(`${API_BASE}/${id}/subscribe`, { phoneNumber });
		return data;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};
