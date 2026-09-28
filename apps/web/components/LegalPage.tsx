import { PageHeader, Section } from "@/components/Section";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({
                            eyebrow,
                            title,
                            updated,
                            intro,
                            sections,
                          }: LegalPageProps) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={intro}
      />

      <Section className="max-w-4xl">
        <div className="mx-auto w-full">
          {/* Last updated */}
          <div className="mb-6 inline-flex border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-shadow sm:mb-8 sm:text-sm">
            Last updated {updated}
          </div>

          {/* Legal sections */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {sections.map((section) => (
              <section
                key={section.heading}
                className="border-2 border-border bg-background p-5 shadow-shadow sm:p-6 lg:p-8"
              >
                <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
                  {section.heading}
                </h2>

                <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={`${section.heading}-${index}`}
                      className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}