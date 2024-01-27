import axios from 'axios';
import * as MOCK from './__mocks__/api';

const DO_MOCK = false;

const BASE_URL =
	window.location.hostname === 'localhost' && window.location.hostname === '192.168.254.27'
		? 'http://192.168.254.27:8080'
		: 'https://16ivlqrume.execute-api.us-east-1.amazonaws.com/default/squares-function';

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
		return { error: 'Error' };
	}
};

export const subscribeNumberToBoard = async (params) => {
	try {
		const body = { data: params, operation: 'subscribe' };
		const { data } = await axios.post(BASE_URL, body);
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};
