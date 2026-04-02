import Link from "next/link";
import Socials from "./Socials";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-8 py-10 sm:flex-row-reverse sm:justify-between">
        <Socials />
        <section className="text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link className="link font-medium" href="/">
              Sahil Bansal
            </Link>
            <span className="mx-2 text-border">|</span>
            <Link className="link font-medium" href="/privacy">
              privacy?
            </Link>
          </p>
        </section>
      </div>
    </footer>
  );
}
