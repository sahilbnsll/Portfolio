import Socials from "./Socials";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 py-8 text-center sm:flex-row-reverse sm:justify-between sm:px-6 sm:py-10 sm:text-left md:px-8 lg:px-10">
        <Socials />
        <section>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <a className="link font-medium" href="/">
              Sahil Bansal
            </a>
            <span className="mx-2 text-border">|</span>
            <a className="link font-medium" href="/privacy">
              privacy?
            </a>
          </p>
        </section>
      </div>
    </footer>
  );
}
