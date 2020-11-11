import Link from "next/link";

const mainPages = [
  { href: "/about", label: "/about" },
  { href: "/blog", label: "/blog" },
];

export const Header = () => {
  return (
    <header
      id="header"
      className="mx-auto mt-4 mb-8 text-black1 bg-white1"
      style={{ boxShadow: "0.5rem 1rem black" }}
    >
      <div className="px-10 py-3 mx-1 my-2 border-2 border-black1">
        <h2 className="mb-1 text-3xl font-semibold text-center text-black">
          <Link href="/">Jack Rose</Link>
        </h2>

        <nav>
          <div className="px-4 mx-auto max-w-7xl">
            <ul className="flex flex-row justify-center">
              {mainPages.map(({ href, label }) => (
                <li key={href} className="p-2 underline">
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
