export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <hr className="m-2 mb-0"/>
      <footer id="footer">
        <div className="p-2 text-sm text-center">
          &copy; <a href="https://jackrose.co.nz">Jack Rose</a> 2017 - {currentYear} //
          All content available under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">cc-by 4.0</a>
        </div>
      </footer>
    </>
  );
};
