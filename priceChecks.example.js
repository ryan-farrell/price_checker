
/* FIRST RENAME this file 'priceChecks.js'
- Replace [PRODUCT_CODE] with a product code of your choice from the amazon.co.uk URI of the product

- Replace [PRICE] with INTEGER with a value of your choice. This is the amount the price will be 
checked for an if equal to or lower you would be informed by email.

You can have as many objects in 'pricesToBeChecked' as you would like so copy as many objects and insert
into the array all products and your price.

*/

const pricesToBeChecked = [
    { uri: 'https://www.amazon.co.uk/gp/product/[PRODUCT_CODE]',
    price: '[PRICE]'},
    { uri: 'https://www.amazon.co.uk/gp/product/[PRODUCT_CODE]',
    price: '[PRICE]'},

]


module.exports = { pricesToBeChecked }