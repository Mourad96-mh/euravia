import type { Locale } from '@/i18n/config';
import type { ProductId } from './catalog';

/**
 * The blog. The client's brief only said "add agricultural photos", so these three starter
 * articles are written by us from facts the client stated elsewhere (early season,
 * IQF, Souss-Massa greenhouses). They are listed in docs/CONTENT-TO-VALIDATE.md.
 *
 * A body is a list of blocks: a string is a paragraph, `{ h: … }` a sub-heading.
 */
export type Block = string | { h: string };

export interface ArticleCopy {
  title: string;
  excerpt: string;
  body: Block[];
}

export interface Article {
  id: string;
  slugs: Record<Locale, string>;
  /** ISO date. */
  date: string;
  image: string;
  related: ProductId[];
  copy: Record<Locale, ArticleCopy>;
}

export const ARTICLES: Article[] = [
  {
    id: 'early-season',
    slugs: {
      en: 'morocco-early-season-advantage',
      fr: 'avantage-precocite-maroc',
      nl: 'vroege-seizoen-marokko',
    },
    date: '2026-10-01',
    image: '/media/blog/early-season.webp',
    related: ['strawberries', 'eggplant', 'tomatoes'],
    copy: {
      en: {
        title: "Why Morocco's early season matters to European buyers",
        excerpt:
          'Mild winters and long sunshine hours put Moroccan produce on European shelves when local harvests are still months away.',
        body: [
          'For a European buyer, the hardest weeks of the year are the ones when local fields are empty. Morocco fills exactly that gap. Its mild winters, long sunshine hours and Atlantic influence let growers harvest weeks or months before northern Europe.',
          { h: 'A calendar that complements Europe' },
          'Strawberries are a good example: the main Moroccan harvest starts early in the season, when European production is still low. Eggplants ship from November through June. Tomatoes, peppers and berries follow the same logic: supply when your own region cannot.',
          { h: 'Close enough to stay fresh' },
          'Distance matters as much as climate. Morocco sits a short sea or road crossing from Spain, so produce reaches European distribution centres quickly and in good condition. Shorter transit means firmer fruit on arrival and more days of shelf life for the retailer.',
          { h: 'What it means for your programme' },
          'An early-season Moroccan programme lets you keep a product on the shelf all year, and plan volumes ahead instead of buying on the spot market. At Euravia we connect you with growers in Souss-Massa and the coastal regions and organise the cold chain to your door.',
        ],
      },
      fr: {
        title: "Pourquoi la précocité marocaine compte pour les acheteurs européens",
        excerpt:
          "Des hivers doux et un fort ensoleillement placent les produits marocains en rayon quand les récoltes européennes sont encore loin.",
        body: [
          "Pour un acheteur européen, les semaines les plus difficiles de l'année sont celles où les champs locaux sont vides. Le Maroc comble précisément ce creux. Ses hivers doux, son fort ensoleillement et l'influence atlantique permettent de récolter des semaines, voire des mois, avant l'Europe du Nord.",
          { h: "Un calendrier complémentaire de l'Europe" },
          "La fraise en est un bon exemple : la pleine récolte marocaine commence tôt dans la saison, quand la production européenne est encore faible. L'aubergine s'exporte de novembre à juin. Tomates, poivrons et petits fruits suivent la même logique : fournir quand votre propre région ne le peut pas.",
          { h: 'Assez proche pour rester frais' },
          "La distance compte autant que le climat. Le Maroc n'est qu'à une courte traversée de l'Espagne : les produits atteignent rapidement les centres de distribution européens, en bon état. Un transit plus court, c'est un fruit plus ferme à l'arrivée et plus de jours de conservation pour le distributeur.",
          { h: 'Ce que cela change pour votre programme' },
          "Un programme marocain de début de saison vous permet de garder un produit en rayon toute l'année et de planifier vos volumes au lieu d'acheter au jour le jour. Chez Euravia, nous vous mettons en relation avec des producteurs du Souss-Massa et du littoral et organisons la chaîne du froid jusqu'à vous.",
        ],
      },
      nl: {
        title: 'Waarom het vroege seizoen van Marokko telt voor Europese inkopers',
        excerpt:
          'Zachte winters en veel zonuren brengen Marokkaanse groente en fruit in het schap wanneer de Europese oogst nog maanden weg is.',
        body: [
          'Voor een Europese inkoper zijn de lastigste weken van het jaar die waarin de lokale velden leeg zijn. Marokko vult precies dat gat. Zachte winters, veel zonuren en de Atlantische invloed laten telers weken of zelfs maanden eerder oogsten dan in Noord-Europa.',
          { h: 'Een kalender die Europa aanvult' },
          'Aardbeien zijn een goed voorbeeld: de Marokkaanse hoofdoogst begint vroeg in het seizoen, wanneer de Europese productie nog laag is. Aubergines worden van november tot juni geëxporteerd. Tomaten, paprika en bessen volgen dezelfde logica: leveren wanneer uw eigen regio dat niet kan.',
          { h: 'Dichtbij genoeg om vers te blijven' },
          'Afstand telt net zo zwaar als klimaat. Marokko ligt op een korte overtocht van Spanje, zodat producten snel en in goede staat Europese distributiecentra bereiken. Kortere transit betekent stevigere vruchten bij aankomst en meer houdbaarheidsdagen voor de retailer.',
          { h: 'Wat het betekent voor uw programma' },
          'Met een vroeg Marokkaans programma houdt u een product het hele jaar in het schap en plant u volumes vooruit in plaats van op de spotmarkt te kopen. Euravia brengt u in contact met telers in Souss-Massa en de kustregio’s en regelt de koelketen tot aan uw deur.',
        ],
      },
    },
  },
  {
    id: 'iqf-explained',
    slugs: {
      en: 'iqf-frozen-fruit-explained',
      fr: 'surgelation-iqf-expliquee',
      nl: 'iqf-diepvriesfruit-uitgelegd',
    },
    date: '2026-09-18',
    image: '/media/blog/iqf.webp',
    related: ['iqf-strawberries', 'iqf-raspberries', 'iqf-blueberries'],
    copy: {
      en: {
        title: 'IQF explained: how frozen berries keep their fresh-picked quality',
        excerpt:
          'Individually Quick Frozen fruit is frozen piece by piece within hours of harvest. Here is why that matters for colour, flavour and handling.',
        body: [
          'IQF stands for Individually Quick Frozen. Instead of freezing fruit in a block, each berry is frozen separately, very fast, at very low temperature. The result is free-flowing fruit you can portion by the gram.',
          { h: 'Speed is quality' },
          'The faster fruit freezes, the smaller the ice crystals that form inside it. Small crystals do less damage to the cell walls, so the berry keeps its shape, colour and flavour when it thaws. That is why we freeze right after harvest: the fruit is locked at its peak instead of losing quality in storage.',
          { h: 'Why Moroccan berries' },
          'Morocco is one of the world’s top five exporters of frozen strawberries. Its climate also produces plump, deeply coloured blackberries, fragrant ruby-red raspberries and blueberries with a sweet-tart balance. Freezing them at origin turns a seasonal crop into a year-round supply.',
          { h: 'Built to your specification' },
          'At Euravia we oversee field selection, harvesting, processing and the cold chain at −18 °C, so the fruit you receive matches your B2B specification, whether you make jams, smoothies, dairy products or bakery fillings.',
        ],
      },
      fr: {
        title: 'La surgélation IQF expliquée : comment les fruits rouges gardent leur qualité',
        excerpt:
          "Un fruit IQF est surgelé pièce par pièce quelques heures après la récolte. Voici pourquoi cela compte pour la couleur, la saveur et l'utilisation.",
        body: [
          "IQF signifie Individually Quick Frozen, surgelé individuellement. Au lieu de congeler les fruits en bloc, chaque baie est surgelée séparément, très vite et à très basse température. On obtient des fruits qui restent libres et se dosent au gramme près.",
          { h: 'La vitesse fait la qualité' },
          "Plus la surgélation est rapide, plus les cristaux de glace qui se forment dans le fruit sont petits. De petits cristaux abîment moins les parois cellulaires : la baie garde sa forme, sa couleur et sa saveur à la décongélation. C'est pourquoi nous surgelons juste après la récolte : le fruit est figé à son meilleur au lieu de perdre en qualité pendant le stockage.",
          { h: 'Pourquoi des fruits rouges du Maroc' },
          "Le Maroc fait partie des cinq premiers exportateurs mondiaux de fraises surgelées. Son climat donne aussi des mûres charnues et colorées, des framboises parfumées rouge rubis et des myrtilles à l'équilibre sucré-acidulé. Les surgeler à l'origine transforme une récolte saisonnière en approvisionnement toute l'année.",
          { h: 'Conforme à votre cahier des charges' },
          "Chez Euravia, nous supervisons la sélection des parcelles, la récolte, la transformation et la chaîne du froid à −18 °C, pour que les fruits reçus correspondent à votre cahier des charges, que vous fabriquiez des confitures, des smoothies, des produits laitiers ou des garnitures de pâtisserie.",
        ],
      },
      nl: {
        title: 'IQF uitgelegd: hoe diepvriesbessen hun vers geplukte kwaliteit houden',
        excerpt:
          'IQF-fruit wordt binnen enkele uren na de oogst stuk voor stuk ingevroren. Daarom maakt het verschil voor kleur, smaak en verwerking.',
        body: [
          'IQF staat voor Individually Quick Frozen. In plaats van fruit in een blok in te vriezen, wordt elke bes afzonderlijk, heel snel en op zeer lage temperatuur bevroren. Het resultaat is los fruit dat u per gram kunt doseren.',
          { h: 'Snelheid is kwaliteit' },
          'Hoe sneller fruit bevriest, hoe kleiner de ijskristallen die zich erin vormen. Kleine kristallen beschadigen de celwanden minder, zodat de bes na het ontdooien haar vorm, kleur en smaak behoudt. Daarom vriezen wij direct na de oogst in: het fruit wordt op zijn best vastgelegd in plaats van kwaliteit te verliezen in de opslag.',
          { h: 'Waarom Marokkaanse bessen' },
          'Marokko behoort tot de vijf grootste exporteurs van diepvriesaardbeien ter wereld. Het klimaat levert ook volle, diepgekleurde bramen, geurige robijnrode frambozen en blauwe bessen met een zoetzure balans. Door ze aan de bron in te vriezen wordt een seizoensoogst een aanvoer voor het hele jaar.',
          { h: 'Volgens uw specificatie' },
          'Euravia ziet toe op perceelkeuze, oogst, verwerking en de koelketen op −18 °C, zodat het fruit dat u ontvangt aan uw B2B-specificatie voldoet, of u nu jam, smoothies, zuivel of bakkerijvullingen maakt.',
        ],
      },
    },
  },
  {
    id: 'souss-massa',
    slugs: {
      en: 'souss-massa-greenhouse-heartland',
      fr: 'souss-massa-coeur-des-serres-marocaines',
      nl: 'souss-massa-kassengebied-marokko',
    },
    date: '2026-09-04',
    image: '/media/blog/souss-massa.webp',
    related: ['cherry-tomatoes', 'california-pepper', 'eggplant'],
    copy: {
      en: {
        title: "Souss-Massa: inside Morocco's greenhouse heartland",
        excerpt:
          'Around Agadir, the Souss-Massa plain grows a large share of Morocco’s export vegetables under modern greenhouses.',
        body: [
          'South of the Atlas, around Agadir, the Souss-Massa plain is where much of Morocco’s export horticulture happens. Sunshine almost all year, mild coastal temperatures and decades of investment in greenhouses have made it one of the most productive growing areas facing Europe.',
          { h: 'Greenhouses built for consistency' },
          'Modern greenhouse facilities give growers control over climate and irrigation. For buyers that means what matters most on a retail shelf: consistent sizing, uniform colour and a reliable flavour profile, from cherry tomatoes with high Brix to glossy eggplants and blocky California peppers.',
          { h: 'Quality you can trace' },
          'Export programmes from the region are built around international standards: traceability from the plot to the pallet, GlobalG.A.P. certification and controlled temperatures through to delivery.',
          { h: 'Working with Euravia' },
          'Euravia sources from selected growers in Souss-Massa and other Moroccan regions, then handles packing, documentation and transport to Europe from our offices in Casablanca and Utrecht. Ask us which products are in season now.',
        ],
      },
      fr: {
        title: 'Souss-Massa : au cœur des serres marocaines',
        excerpt:
          "Autour d'Agadir, la plaine du Souss-Massa produit sous serres modernes une grande partie des légumes marocains destinés à l'export.",
        body: [
          "Au sud de l'Atlas, autour d'Agadir, la plaine du Souss-Massa concentre une grande partie de l'horticulture marocaine d'export. Un soleil presque permanent, des températures côtières douces et des décennies d'investissement dans les serres en ont fait l'une des zones de production les plus performantes face à l'Europe.",
          { h: 'Des serres pensées pour la régularité' },
          "Les serres modernes donnent aux producteurs la maîtrise du climat et de l'irrigation. Pour l'acheteur, cela signifie ce qui compte le plus en rayon : un calibre régulier, une couleur uniforme et un profil de goût fiable, des tomates cerises à Brix élevé aux aubergines brillantes et aux poivrons California bien carrés.",
          { h: 'Une qualité traçable' },
          "Les programmes d'export de la région reposent sur les standards internationaux : traçabilité de la parcelle à la palette, certification GlobalG.A.P. et températures maîtrisées jusqu'à la livraison.",
          { h: 'Travailler avec Euravia' },
          "Euravia s'approvisionne auprès de producteurs sélectionnés du Souss-Massa et d'autres régions du Maroc, puis gère le conditionnement, les documents et le transport vers l'Europe depuis nos bureaux de Casablanca et d'Utrecht. Demandez-nous quels produits sont de saison.",
        ],
      },
      nl: {
        title: 'Souss-Massa: het kassenhart van Marokko',
        excerpt:
          'Rond Agadir teelt de Souss-Massa-vlakte in moderne kassen een groot deel van de Marokkaanse exportgroenten.',
        body: [
          'Ten zuiden van de Atlas, rond Agadir, ligt de Souss-Massa-vlakte, het centrum van de Marokkaanse exporttuinbouw. Bijna het hele jaar zon, milde kusttemperaturen en tientallen jaren investeringen in kassen maken het tot een van de productiefste teeltgebieden tegenover Europa.',
          { h: 'Kassen gebouwd op constantheid' },
          'Moderne kassen geven telers grip op klimaat en irrigatie. Voor inkopers betekent dat wat in het schap het zwaarst weegt: een constante maat, een egale kleur en een betrouwbaar smaakprofiel, van cherrytomaten met hoge Brix tot glanzende aubergines en blokpaprika’s.',
          { h: 'Traceerbare kwaliteit' },
          'Exportprogramma’s uit de regio zijn gebouwd op internationale normen: traceerbaarheid van perceel tot pallet, GlobalG.A.P.-certificering en beheerste temperaturen tot aan de levering.',
          { h: 'Werken met Euravia' },
          'Euravia koopt in bij geselecteerde telers in Souss-Massa en andere Marokkaanse regio’s en regelt vervolgens verpakking, documenten en transport naar Europa vanuit onze kantoren in Casablanca en Utrecht. Vraag ons welke producten nu in het seizoen zijn.',
        ],
      },
    },
  },
];

export const getArticle = (id: string) => ARTICLES.find((a) => a.id === id);
