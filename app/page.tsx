import Link from "next/link";
import "./assets/css/style.css";

export default function Home() {
  return (
    <main>
      <h1>ima three.js master!</h1>
      <Link href="/pages//box">moving box!</Link>
    </main>
  );
}
