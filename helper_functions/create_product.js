const select_model = require('./model_select');

module.exports = (type, product_info) => {

    // select the right model based on the provided type
    const model = select_model(type);

    if(!model) return null;

    //Create an empty product object
    const product = new model({});

    // Fill the empty product object with the provided data. this ensure flexiblity regardless of the model and data being used.
    for (let prop in product_info) {
        if (product_info[prop] !== "type") {
            product[prop] = product_info[prop];
        }
    }

    return product;

}