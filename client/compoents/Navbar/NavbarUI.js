import Link from "next/link";

export default function NavbarUI() {
  return (
    <nav>
      <Link href="/men">
        <a>Men</a>
      </Link>
      <Link href="/women">
        <a>Men</a>
      </Link>
      <Link href="/jewelry">
        <a>jewelry</a>
      </Link>
    </nav>
  );
}
