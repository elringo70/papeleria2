export default class BaseProductDTO {
	constructor(_id, product, model, brand, category, cost, price, wholesale) {
		this._id = _id;
		this.product = product;
		this.model = model;
		this.brand = brand;
		this.category = category;
		this.cost = cost;
		this.price = price;
		this.wholesale = wholesale;
	}
}
