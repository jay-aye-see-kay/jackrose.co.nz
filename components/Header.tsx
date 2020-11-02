import Link from "next/link";

const mainPages = [
  { href: "/about", label: "/about" },
  { href: "/cv", label: "/cv" },
  { href: "/posts", label: "/posts" },
];

export const Header = () => {
  return (
    <div id="header">
      <h1 className="p-4 pb-0 text-3xl text-center">
        <Link href="/">Jack Rose</Link>
      </h1>

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

      <hr className="my-2"/>
    </div>
  );
};
