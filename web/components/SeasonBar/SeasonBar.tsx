import s from './SeasonBar.module.css';

/**
 * Twelve months, the shipping ones filled. Only drawn for products whose season the client
 * stated — an invented calendar would be worse than none.
 */
export default function SeasonBar({
  months,
  initials,
  names,
  title,
  inSeason,
}: {
  months: number[];
  initials: string[];
  names: string[];
  title: string;
  inSeason: string;
}) {
  const on = new Set(months);
  return (
    <figure className={s.wrap}>
      <figcaption className={s.title}>{title}</figcaption>
      <ol className={s.bar}>
        {initials.map((initial, i) => {
          const active = on.has(i + 1);
          return (
            <li key={i} className={active ? s.on : s.off} title={`${names[i]}${active ? ` — ${inSeason}` : ''}`}>
              <span aria-hidden="true">{initial}</span>
              <span className="visually-hidden">
                {names[i]}
                {active ? `: ${inSeason}` : ''}
              </span>
            </li>
          );
        })}
      </ol>
      <p className={s.legend}>
        <span className={s.swatch} aria-hidden="true" /> {inSeason}
      </p>
    </figure>
  );
}
