import Link from "next/link";

const mainPages = [
  { href: "/about", label: "/about" },
  { href: "/cv", label: "/cv" },
  { href: "/posts", label: "/posts" },
];

export const Header = () => {
  return (
    <div id="header">
      <h2 className="p-4 pb-0 text-3xl text-center site-title">
        <Link href="/">Jack Rose</Link>
      </h2>

      <nav>
        <div className="px-4 mx-auto max-w-7xl">
          <ul className="flex flex-row justify-center">
            {mainPages.map(({ href, label }) => (
              <li key={href} className="p-2">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <hr className="m-2" />
    </div>
  );
};
