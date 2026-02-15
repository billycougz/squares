import axios from 'axios';
import * as MOCK from './__mocks__/api';

const DO_MOCK = process.env.NEXT_PUBLIC_DO_MOCK === 'true';

const BASE_URL = '/api/squares';

export const createBoard = async (formData) => {
	if (DO_MOCK) {
		return MOCK.createBoard(formData);
	}
	// { boardName, teams, phoneNumber, test } = formData;
	try {
		const body = { data: formData, operation: 'create' };
		const { data } = await axios.post(BASE_URL, body);
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
 */
export const updateBoard = async (updateData) => {
	if (DO_MOCK) {
		return MOCK.updateBoard(updateData);
	}
	try {
		const { data } = await axios.put(BASE_URL, updateData);
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
		let url = `${BASE_URL}?id=${id}`;
		if (adminCode) {
			url += `&adminCode=${adminCode}`;
		}
		const { data } = await axios.get(url);
		return data.error ? data : data.Item;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};

export const subscribeNumberToBoard = async (params) => {
	if (DO_MOCK) {
		return MOCK.subscribeNumberToBoard(params);
	}
	try {
		const body = { data: params, operation: 'subscribe' };
		const { data } = await axios.post(BASE_URL, body);
		return data;
	} catch (e) {
		console.error(e);
		return { error: 'Error' };
	}
};
