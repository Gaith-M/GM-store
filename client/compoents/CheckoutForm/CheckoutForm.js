import axios from "axios";

const CheckoutForm = () => {
  const pay = async () => {
    const res = await axios.get("http://localhost:3333/api/charge/secret");
    console.log(res);
  };

  return (
    <div>
      <button onClick={pay}>Pay</button>
    </div>
  );
};

export default CheckoutForm;
