import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4">
        <h1 className="title">let&apos;s talk infrastructure.</h1>
        <p className="text-muted-foreground">
          Whether you have questions about DevOps, need help with infrastructure design, or want to discuss how I can contribute to your team, I&apos;m all ears. Drop a message below and I&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <ContactForm />
    </article>
  );
}
