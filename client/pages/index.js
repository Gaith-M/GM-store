import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const Home = () => {
  const [firstName, set_firstName] = useState("");
  const [lastName, set_lastName] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [show_password, set_show_password] = useState("password");

  const handle_show_password = () =>
    show_password === "password"
      ? set_show_password("text")
      : set_show_password("password");

  const handle_change = ({ target }) => {
    const { name, value } = target;

    switch (name) {
      case "firstName":
        set_firstName(value);
        break;
      case "lastName":
        set_lastName(value);
        break;
      case "email":
        set_email(value);
        break;
      case "password":
        set_password(value);
        break;
      default:
        return value;
    }
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    console.log("called");

    try {
      const res = await axios.post(
        "http://localhost:3333/api/auth/register",
        { firstName, lastName, email, password },
        { headers: { "Content-type": "application/json" } }
      );
      console.log("res is: ", res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form>
        <label>
          First Name:
          <br />
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={handle_change}
            required
          />
        </label>

        <br />

        <label>
          Last Name:
          <br />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={handle_change}
            required
          />
        </label>

        <br />

        <label>
          Email:
          <br />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handle_change}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <br />
          <input
            type={show_password}
            name="password"
            value={password}
            onChange={handle_change}
            required
          />{" "}
          <button type="button" onClick={handle_show_password}>
            {show_password === "password" ? "show" : "hide"} password
          </button>
        </label>

        <br />

        <button type="submit" onClick={handle_submit}>
          Submit
        </button>
      </form>
      <hr />
      <Link href="http://localhost:3333/api/auth/facebook">
        <a>Continue with Facebook</a>
      </Link>{" "}
      <Link href="http://localhost:3333/api/auth/google">
        <a>Continue with Google</a>
      </Link>
    </>
  );
};

export default Home;
