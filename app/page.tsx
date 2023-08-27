import Link from "next/link";
import "./assets/css/style.css";

export default function Home() {
  return (
    <main>
      <h1>ima three.js master!</h1>
      <ul>
        <li>
          <Link href="/pages/box">moving box!</Link>
        </li>
        <li>
          <Link href="/pages/text">fonts loader!</Link>
        </li>
        <li>
          <Link href="/pages/scroll">scroll animation!</Link>
        </li>
        <li>
          <Link href="/pages/points">points animation!</Link>
        </li>
      </ul>
    </main>
  );
}
