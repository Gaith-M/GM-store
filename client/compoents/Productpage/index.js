const ProductPage = () => (
  <div>
    <h1>Amazing wool scarf</h1>
  </div>
);

export default ProductPage;

// The page will have the following sections:
// Preview, contents and details, social media, similiar items, reviews, nav, and footer
// each of these is its own section. everyone of them is meant to be only for product page except for nav and footer

// Product Page will recieve a prop containing the data
// Prop Shape:
/*
product = {
    name: str
    brand: str,
    price: int,
    discount: null/int,
    catagory:str,
    for: str,
    description: str,
    photos: [str],
    colors: [str],
    sizes: [str],
    ratings: ???,
    reviews: [obj]
}
*/
