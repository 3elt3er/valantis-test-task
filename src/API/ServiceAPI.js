import axios from 'axios';
import md5 from "md5";


export default class ServiceAPI {
	static apiUrl = 'http://api.valantis.store:40000/';
	static password = 'Valantis';

	static generateXAuth() {
		const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		return md5(`${this.password}_${timestamp}`);
	}

	static async callApi(action, params = {}) {
		const xAuth = this.generateXAuth();
		try {
			const response = await axios.post(this.apiUrl, {
				action,
				params,
			}, {
				headers: {
					'X-Auth': xAuth,
				},
			});
			return response.data.result;
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
			throw error;
		}
	}

	static async getIds(offset = 0, limit = 47) {
		try {
			return await this.callApi('get_ids', { offset, limit });
		} catch (error) {
			console.error('Ошибка при получении идентификаторов товаров:', error);
			throw error;
		}
	}

	static async getItems(ids) {
		try {
			return await this.callApi('get_items', { ids });
		} catch (error) {
			console.error('Ошибка при получении информации о товарах:', error);
			throw error;
		}
	}
	static async filterProducts(field, value) {
		try {
			return await this.callApi('filter', { [field]: value });
		} catch (error) {
			console.error('Ошибка при фильтрации товаров:', error);
			throw error;
		}
	}
}