import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { PRODUCTS, productImage, productName } from '@/data/catalog';
import { CONTACT } from '@/data/nav';
import { href } from '@/data/routes';
import PageHeader from '@/components/PageHeader/PageHeader';
import QuoteForm from '@/components/Quote/QuoteForm';

export default function QuoteView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const crumbs = [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.quote.title }];

  return (
    <>
      <PageHeader title={t.quote.title} lead={t.quote.intro} crumbs={crumbs} crumbLabel={t.a11y.breadcrumb} />
      <section className="section">
        <div className="page">
          <QuoteForm
            locale={locale}
            catalogue={PRODUCTS.map((p) => ({ slug: p.id, name: productName(p, locale), image: productImage(p) }))}
            productsHref={href(locale, 'fresh')}
            privacyHref={href(locale, 'privacy')}
            email={CONTACT.email}
            whatsapp={CONTACT.whatsapp}
            labels={{ ...t.quote, orWhatsapp: t.contact.orWhatsapp, consent: t.contact.consent }}
          />
        </div>
      </section>
    </>
  );
}
