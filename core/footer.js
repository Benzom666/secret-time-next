import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="d-flex justify-content-between w-100">
          <ul className="d-flex mb-0">
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="#">Mobile</Link>
            </li>
            <li>
              <Link href="#">Terms</Link>
            </li>
            <li>
              <Link href="#">Privacy</Link>
            </li>
            <li>
              <Link href="#">Help</Link>
            </li>
            <li>
              <Link href="#">Press</Link>
            </li>
          </ul>
          <p className="mb-0">2023 Le Society</p>
        </div>
      </div>
    </footer>
  );
}
