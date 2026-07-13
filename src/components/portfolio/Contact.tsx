import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";
import { Eyebrow, SECTION_CONTAINER, SectionTitle } from "./Eyebrow";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const CONTACT_LINKS = [
  {
    label: "emmanuel@alanis.dev",
    href: "mailto:emmanuel@alanis.dev",
    Icon: MailIcon,
    external: false,
  },
  {
    label: "linkedin.com/in/ealanis",
    href: "https://www.linkedin.com/in/ealanis/",
    Icon: LinkedInIcon,
    external: true,
  },
  {
    label: "github.com/Ealanisln",
    href: "https://github.com/Ealanisln",
    Icon: GitHubIcon,
    external: true,
  },
];

const Contact = async () => {
  const t = await getTranslations("portfolio.contact");

  return (
    <section id="contact" className={SECTION_CONTAINER}>
      <div className="md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:items-start md:gap-[clamp(32px,5vw,64px)]">
        <div className="md:flex md:flex-col md:gap-5">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
          </div>
          <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.7] [text-wrap:pretty] text-ink-2 md:mt-0 md:text-[16.5px]">
            <strong className="text-ink">{t("lead")}</strong> {t("body")}
          </p>
          <div className="mt-[22px] flex flex-col gap-3 md:mt-0">
            {CONTACT_LINKS.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-ink transition-colors hover:text-accent md:min-h-0"
              >
                <Icon className="size-[17px]" />
                {label}
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
