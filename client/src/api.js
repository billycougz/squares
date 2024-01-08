import axios from 'axios';

const BASE_URL =
	window.location.hostname === 'localhost' && window.location.hostname === '192.168.254.27'
		? 'http://192.168.254.27:8080'
		: 'https://16ivlqrume.execute-api.us-east-1.amazonaws.com/default/squares-function';

export const createBoard = async ({ boardName, teams, phoneNumber }) => {
	try {
		const body = { data: { boardName, teams, phoneNumber }, operation: 'create' };
		const { data } = await axios.post(BASE_URL, body);
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};

export const updateBoard = async (updateData) => {
	try {
		const { data } = await axios.put(BASE_URL, updateData);
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};

export const loadBoard = async ({ id, adminCode }) => {
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
