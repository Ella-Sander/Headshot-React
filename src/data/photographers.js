// Public package information gathered from each provider's own pricing page.
// Prices and inclusions are a point-in-time summary; link to the provider for current details.
const originalPhotographers = [
  {
    id: 'nyc-headshot-studio', name: 'NYC Headshot Studio', subtitle: 'Professional headshots & portraits', monogram: 'NYC', city: 'New York', neighborhood: 'Upper East Side',
    description: 'Guided sessions with posing and expression coaching, live image review, and a choice of gray or black background.',
    specialties: ['Business headshots', 'Personal branding'], settings: ['Studio'], checked: 'Oct 2026', source: 'https://www.nycheadshotstudio.com/rates', startingPrice: 295,
    featuredPackage: { name: 'Just the Basics', price: 295, editedImages: 1, summary: '15 min · 1 finished image' },
    packages: [
      { name: 'Just the Basics', price: 295, editedImages: 1, looks: 1, kinds: ['Mini session', 'Single look'], summary: 'Up to 15 min; 1 image included; additional images $150 each.' },
      { name: 'Back to Work', price: 545, editedImages: 1, looks: 2, kinds: ['Multi-look'], summary: '$350 session fee plus $195 per image; up to 30 min.' },
      { name: 'Executive Unlimited', price: 890, editedImages: 1, looks: 3, kinds: ['Multi-look'], summary: '$695 session fee plus $195 per image; unlimited looks and time.' },
      { name: 'Branding Session', price: 1195, editedImages: 1, looks: 3, kinds: ['Personal branding', 'Multi-look'], summary: '$1,000 session fee plus $195 per image; lighting and location variety.' },
    ],
  },
  {
    id: 'new-york-headshots', name: 'New York Headshots', subtitle: 'Individual and corporate portraits', monogram: 'NYH', city: 'New York', neighborhood: 'Midtown Manhattan',
    description: 'Flat-rate individual packages in studio or at your NYC office, with color-corrected images and retouched finals.',
    specialties: ['Business headshots', 'Personal branding', 'Team headshots'], settings: ['Studio', 'On-location'], checked: 'Oct 2026', source: 'https://newyorkheadshots.com/corporate-headshot-pricing', startingPrice: 380,
    featuredPackage: { name: 'Professional', price: 380, editedImages: 1, summary: '30 min · 1 look · 1 retouched final' },
    packages: [
      { name: 'Professional', price: 380, editedImages: 1, looks: 1, kinds: ['Mini session', 'Single look'], summary: 'Up to 30 min, 5 color-corrected images, 1 high-end retouched image.' },
      { name: 'Executive', price: 450, editedImages: 2, looks: 2, kinds: ['Multi-look'], summary: 'Up to 1 hour, 2 looks, 10 color-corrected images, 2 retouched images.' },
      { name: 'Brand', price: 1400, editedImages: 7, looks: 4, kinds: ['Personal branding', 'Multi-look'], summary: 'Up to 2 hours, 4 looks, makeup artist, 7 retouched images.' },
      { name: 'Team sessions', price: 2000, editedImages: 0, looks: 1, kinds: ['Team headshots'], summary: 'Team pricing starts at $2,000; quote depends on headcount, hours, and location.' },
    ],
  },
  {
    id: 'jeffrey-hornstein', name: 'Jeffrey Hornstein', subtitle: 'Headshot photographer', monogram: 'JH', city: 'New York', neighborhood: 'Midtown Manhattan',
    description: 'Private studio near Madison Square Garden, guided sessions, wardrobe changes, and a password-protected online gallery.',
    specialties: ['Business headshots', 'Actor headshots', 'Personal branding'], settings: ['Studio'], checked: 'Oct 2026', source: 'https://www.jeffreyhornstein.com/rates', startingPrice: 295,
    featuredPackage: { name: 'Mini Headshot', price: 295, editedImages: 1, summary: '1 look · 1 retouched final' },
    packages: [
      { name: 'Mini Headshot Session', price: 295, editedImages: 1, looks: 1, kinds: ['Mini session', 'Single look'], summary: '1 look and 1 retouched final; online gallery delivered in 1–2 business days.' },
      { name: 'Full Headshot Session', price: 550, editedImages: 2, looks: 3, kinds: ['Multi-look'], summary: 'Up to 3 looks and 2 retouched finals; guided shoot and online gallery.' },
    ],
  },
  {
    id: 'udb-headshots', name: 'UDB Headshots', subtitle: 'Actor headshots for theatre, film & TV', monogram: 'UDB', city: 'New York', neighborhood: 'New York City',
    description: 'Collaborative actor-focused sessions with color-graded gallery downloads and retouched finals for casting.',
    specialties: ['Actor headshots', 'Personal branding'], settings: ['Studio'], checked: 'Oct 2026', source: 'https://www.udbheadshots.com/packages-pricing/', startingPrice: 525,
    featuredPackage: { name: 'Two-Look Session', price: 525, editedImages: 2, summary: '2 looks · 2 retouched finals' },
    packages: [
      { name: 'Two-Look Session', price: 525, editedImages: 2, looks: 2, kinds: ['Multi-look'], summary: 'Up to 2 hours in studio, 2 headshot looks, 2 retouched images, full color-graded gallery.' },
      { name: 'Full Session', price: 695, editedImages: 4, looks: 4, kinds: ['Multi-look'], summary: '3–4 looks, 3 hours in studio, 4 retouched images, full color-graded gallery.' },
    ],
  },
  {
    id: 'nechama-photography', name: 'Nechama Photography', subtitle: 'Business, artist & actor headshots', monogram: 'NP', city: 'Brooklyn', neighborhood: 'Brooklyn',
    description: 'Coached sessions with tailored lighting, wardrobe guidance, and high-end retouched images.',
    specialties: ['Business headshots', 'Actor headshots', 'Personal branding', 'Student headshots', 'Team headshots'], settings: ['Studio'], checked: 'Oct 2026', source: 'https://nechamaphotography.com/rates', startingPrice: 395,
    featuredPackage: { name: 'Mini Business', price: 395, editedImages: 1, summary: '40 min · 1 look · 1 retouched image' },
    packages: [
      { name: 'Mini Business Headshot', price: 395, editedImages: 1, looks: 1, kinds: ['Mini session', 'Single look'], summary: '40 min, 1 look, coaching, 1 high-end retouched image. Student discount by inquiry.' },
      { name: 'Deluxe Business Headshots', price: 795, editedImages: 3, looks: 3, kinds: ['Personal branding', 'Multi-look'], summary: 'Up to 2 hours, 3 looks, up to 3 backgrounds, wardrobe guidance, 3 retouched images.' },
      { name: 'Deluxe Actors Headshot', price: 795, editedImages: 3, looks: 3, kinds: ['Multi-look'], summary: 'Up to 2 hours, 3 looks, up to 3 backgrounds, wardrobe guidance, 3 retouched images.' },
    ],
  },
  {
    id: 'again-again-production', name: 'Anita Lashey', subtitle: 'Again Again Production · actor & creative portraits', monogram: 'AL', city: 'Brooklyn', neighborhood: 'Williamsburg',
    description: 'Natural-light, editorial headshots in Williamsburg. Published packages are all-inclusive and include full retouching.',
    specialties: ['Actor headshots', 'Personal branding'], settings: ['Studio'], checked: 'Oct 2026', source: 'https://www.againagainproduction.com/work/headshots-nyc', startingPrice: 900,
    featuredPackage: { name: 'Mini Session', price: 900, editedImages: 8, summary: '30 min · up to 2 looks · 8–10 retouched images' },
    packages: [
      { name: 'Mini Session', price: 900, editedImages: 8, looks: 2, kinds: ['Mini session', 'Multi-look'], summary: '30 min in studio, up to 2 looks, 8–10 edited and retouched photos.' },
      { name: 'Package One', price: 1200, editedImages: 15, looks: 3, kinds: ['Multi-look'], summary: '45 min in studio, unlimited looks, 15 edited and retouched photos.' },
      { name: 'Package Two', price: 1500, editedImages: 20, looks: 3, kinds: ['Multi-look'], summary: '60 min in studio, unlimited looks, 20 edited and retouched photos.' },
    ],
  },
];

// Additional NYC-area providers. The directory pages below are used for discovery;
// providers with unpublished rates are marked as quote-only rather than assigned estimates.
const discoveredProviders = [
  ['hancock-headshots','Hancock Headshots','Lisa Hancock · actor headshots','Flatbush','Brooklyn',['Actor headshots','Personal branding'],'https://www.hancockheadshots.com/faq',450,'Actor session',1,'Studio','Actor sessions start at $450; makeup is an add-on.','actor'],
  ['david-beyda','David Beyda Studio','Actor & performer headshots','Manhattan','New York',['Actor headshots','Personal branding'],'https://www.davidbeyda.com/actor-headshots/',500,'Signature actor session',2,'Studio','40-minute session, two looks, two retouched images.','actor'],
  ['cinepaul','cinepaul','Actor headshots','New York City','New York',['Actor headshots'],'https://cinepaul.com/rates/',450,'Essential',3,'Studio','60 minutes, two looks, three retouched images; student rate published.','actor'],
  ['headshots-nyc-deutsch','Headshots NYC','Brett Deutsch · headshot & brand portraits','Chelsea','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.headshotsnyc.com/information/rates-and-packages/',450,'Executive 30',1,'Studio','30-minute studio session; one retouched image.','business'],
  ['joyce-anderson','Joyce Anderson Photography','Professional headshots & acting portraits','Upper East Side','New York',['Business headshots','Actor headshots'],'https://www.modelingportfoliosnyc.com/rates/',249,'Professional headshot',1,'Studio','One retouched digital image; on-location and employee services by quote.','business'],
  ['mike-petrie-jr','Mike Petrie Jr.','Headshots & portraits','New York City','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.mikepetriejr.com/Info/Rates',575,'The Headshot',2,'Studio','Published headshot rate; student rate is also listed.','actor'],
  ['headshot-specialist','Headshot Specialist','Ray Singh · LinkedIn, corporate & teams','Midtown Manhattan','New York',['Business headshots','Personal branding','Team headshots'],'https://www.headshotspecialist.com/',299,'LinkedIn headshot',1,'Studio','Published options include a $299 LinkedIn session and $389 VIP session.','business'],
  ['ceoportrait','CEOportrait','Corporate, actor & personal branding studio','Midtown Manhattan','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.ceoportrait.com/',499,'CEO Package 1',1,'Studio','Published packages start at $499; package details on provider site.','business'],
  ['city-headshots','City Headshots','Professional headshots for individuals & teams','Midtown Manhattan','New York',['Business headshots','Actor headshots','Team headshots'],'https://www.cityheadshots.com/all-headshot-pricing.html',299,'Classic Headshot',2,'Studio','20–40 minutes, up to two outfits, two retouched photos.','business'],
  ['jw-headshots','JW Headshots','Headshots for actors & corporate professionals','SoHo','New York',['Business headshots','Actor headshots'],'https://www.jwheadshots.com/',495,'Pro Package',1,'Studio','30-minute studio session, one outfit, one retouched image.','business'],
  ['natural-studio-nyc','Natural Studio NYC','Natural-light headshots & portraits','Sunset Park','Brooklyn',['Business headshots','Actor headshots','Personal branding','Team headshots'],'https://www.naturalstudionyc.com/',375,'Mini session',2,'Studio + on-location','30 minutes, one outfit, two retouched images; location options.','branding'],
  ['david-noles','David Noles Photography','Portraits, headshots & makeup services','Sunset Park','Brooklyn',['Business headshots','Actor headshots','Personal branding'],'https://www.davidnoles.com/',null,'Ask about packages',0,'Studio','Headshot packages are available by inquiry.','actor'],
  ['curtis-cort','Curtis & Cort Photography','Actor headshots for adults and young performers','Long Island City','Queens',['Actor headshots'],'https://www.curtisandcort.com/',525,'Quick-fix',0,'Studio','Two looks; session downloads; quick turnaround is advertised.','actor'],
  ['nyh-headshots','NYH Headshots','Actor, graduation, model & ERAS portraits','Theatre District','New York',['Actor headshots','Student headshots','Medical headshots'],'https://nyheadshots.com/actor-headshots-nyc/',null,'Ask about packages',0,'Studio + on-location','Actor, model, graduation and medical-residency headshots; request current pricing.','actor'],
  ['j-demetrie','J Demetrie Photography','Headshots & portraits','Theatre District','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.jdemetriephotography.com/',499,'Quickie',0,'Studio','One-hour session, one or two looks, private gallery and high-resolution downloads.','branding'],
  ['ari-scott','Ari Scott Photography','Actor, corporate & professional headshots','New York City','New York',['Business headshots','Actor headshots','Personal branding','Team headshots'],'https://www.ariscottphotography.com/rates',290,'Corporate headshot',1,'Studio + on-location','One look, one retouched image, wardrobe consultation and test shots.','business'],
  ['gornphoto','GORNPHOTO','Lev Gorn · actor, model & corporate portraits','Midtown Manhattan','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.gornphotoheadshots.com/linkedin-headshots',425,'LinkedIn headshot',1,'Studio','One outfit, one retouched image; same-day option described by studio.','business'],
  ['portrait-madame','Portrait Madame','Alice Prenat · personal portraits & headshots','Brooklyn Heights','Brooklyn',['Business headshots','Personal branding'],'https://www.portraitmadame.com/',990,'Portrait session',20,'Studio','Directory-reported package: consultation, portrait session and selection of 20 portraits; confirm on site.','branding'],
  ['chris-macke','Chris Macke Photography','Headshots for actors & professionals','New York City','New York',['Business headshots','Actor headshots'],'https://www.mackephotography.com/',595,'Headshot session',2,'On-location','Directory-reported package includes two retouched images; student and veteran discounts noted.','actor'],
  ['david-genik','David Genik Photography','Editorial, actor & business headshots','SoHo','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.davidgenik.com/',200,'Session fee',0,'Studio + on-location','One-hour session fee; edited images are listed separately at $50 each.','actor'],
  ['rory-lewis','Rory Lewis Studio','Portraits & professional headshots','Garment District','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.rorylewis.studio/',425,'Headshot session',1,'Studio','Directory-reported 30-minute session, two looks, gallery and one retouched image; confirm rate.','business'],
  ['all-about-headshots','All About Headshots','Alissa Randall · individual, team & brand headshots','Garment District','New York',['Business headshots','Personal branding','Team headshots'],'https://www.allaboutheadshots.com/',null,'Ask about packages',0,'Studio + on-location','Individual, corporate and branding sessions; pricing by inquiry.','business'],
  ['face-and-image','Face & Image Headshots NYC','Igor Lit · corporate, branding & actor headshots','Astoria','Queens',['Business headshots','Actor headshots','Personal branding'],'https://www.faceandimage.com/',null,'Ask about packages',0,'Studio + on-location','Astoria studio; same-day session and express options are described by directory.','business'],
  ['picme-headshots','PicMe! Headshots','Asia & Lana · business and personal branding','Downtown Brooklyn','Brooklyn',['Business headshots','Personal branding','Team headshots'],'https://www.picmeheadshots.com/',null,'Ask about packages',0,'Studio + on-location','Studio and office sessions; team packages are custom quoted.','branding'],
  ['david-j-martin','David J. Martin Headshot Photography','Professional & LinkedIn portraits','Midtown Manhattan','New York',['Business headshots','Personal branding'],'https://davidjmartin.com/',null,'Ask about packages',0,'Studio','Current package pricing is available by inquiry.','business'],
  ['joe-loper','Joe Loper Photography','Headshots & professional portraits','Flatbush','Brooklyn',['Business headshots','Personal branding'],'https://joeloper.com/',null,'Ask about packages',0,'Studio + on-location','Current package pricing is available by inquiry.','portrait'],
  ['nmss','NMSS · Nick Manassi Studio','Headshots & brand photography','Upper East Side','New York',['Business headshots','Personal branding'],'https://www.nmanassi.com/',null,'Ask about packages',0,'Studio + on-location','Headshots and brand photography; current rates by inquiry.','branding'],
  ['astoria-headshots','Astoria Headshots','Business, actor & model headshots','Long Island City','Queens',['Business headshots','Actor headshots'],'https://www.astoriaheadshots.com/',null,'Ask about packages',0,'Studio','Business, actor and model sessions are listed; ask for current package prices.','actor'],
  ['sylvia-hoke','Sylvia Hoke Photography','Actor, model & business portraits','Brooklyn Heights','Brooklyn',['Business headshots','Actor headshots','Personal branding'],'https://www.sylviahokephotography.com/',null,'Ask about packages',0,'Studio + on-location','Headshots, business portraits and branding photography; pricing by inquiry.','branding'],
  ['corporate-headshots-nyc','Corporate-Headshots','Corporate, executive & team portraits','Chelsea','New York',['Business headshots','Personal branding','Team headshots'],'https://corporate-headshots.com/',null,'Ask about packages',0,'Studio + on-location','Individual, team and on-location sessions; request a quote.','team'],
  ['shine-by-o','Shine by O Portraits','Olya · expressive professional portraits','Bushwick','Brooklyn',['Business headshots','Personal branding'],'https://www.shinebyoportraits.com/',null,'Ask about packages',0,'Studio','Personalized posing and professional portrait sessions; pricing by inquiry.','portrait'],
  ['scott-rosenthal','Scott Rosenthal Photography','Professional & LinkedIn headshots','Upper East Side','New York',['Business headshots','Personal branding'],'https://scottrosenthalphotography.com/',null,'Ask about packages',0,'Studio','Professional and LinkedIn headshots; request current pricing.','business'],
  ['camera-1','Camera 1','Executive, corporate & LinkedIn headshots','Times Square','New York',['Business headshots','Team headshots'],'https://nycphoto.com/',null,'Ask about packages',0,'Studio + on-location','Times Square studio; corporate office sessions are available.','business'],
  ['david-pexton','David Pexton Photography','Actor, executive & corporate portraits','New York City','New York',['Business headshots','Actor headshots','Personal branding','Team headshots'],'https://www.davidpexton.com/actor-headshots-nyc',null,'Ask about packages',0,'Studio + on-location','Actor and corporate portrait work; package pricing by inquiry.','actor'],
  ['rod-goodman','Rod Goodman Photography','Actor, corporate & personal branding headshots','Chelsea','New York',['Business headshots','Actor headshots','Personal branding','Team headshots'],'https://www.rodgoodmanphoto.com/',null,'Ask about packages',0,'Studio + on-location','Headshots for actors, professionals and corporate teams; request current rates.','business'],
  ['turi-productions','Turi Productions','Corporate, actor & team headshots','New York City','New York',['Business headshots','Actor headshots','Team headshots'],'https://turiproductions.com/',null,'Ask about packages',0,'Studio + on-location','Corporate team and actor work; contact for session details and pricing.','team'],
  ['andrew-steinman','Andrew Steinman · Headshots and More NY','Actor, corporate & branding photography','New York City','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.headshotsandmoreny.com/',null,'Ask about packages',0,'Studio + on-location','Actor headshots, corporate portraits and branding; rates by inquiry.','actor'],
  ['lena-di','Lena Di Photography','Corporate teams & executive headshots','Financial District','New York',['Business headshots','Personal branding','Team headshots'],'https://lenadi.com/pages/nyc-corporate-headshot-photographer',200,'Team headshot · 21+ people',1,'Studio + on-location','$375/person for first four; published group rates decrease to $200/person for groups of 21 or more.','team'],
  ['joe-jenkins','Joe Jenkins Photography','Actor, corporate & LinkedIn headshots','Williamsburg','Brooklyn',['Business headshots','Actor headshots','Personal branding'],'https://www.joejenkinsphoto.com/actor-headshots-pricing',195,'LinkedIn session',1,'Studio','A short LinkedIn session is listed at $195; actor packages start at $495.','actor'],
  ['match-production','Match Production','Actor headshots · film, TV & theatre','Midtown Manhattan','New York',['Actor headshots'],'https://www.match-production.com/actor-headshots-nyc',379,'Individual Mini',2,'Studio','Current actor promo lists 30 minutes, one outfit, one backdrop and two retouched images.','actor'],
  ['melissa-hamburg','Melissa Hamburg Photography','Actor, corporate & LinkedIn headshots','New York City','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.melissahamburg.com/affordable-headshot-photographer-actors',null,'Ask about packages',0,'Studio + on-location','Actor, corporate, LinkedIn and real-estate headshots; current rate by inquiry.','business'],
  ['headshots-new-york','Headshots New York','Actor, business & outdoor headshots','New York City','New York',['Business headshots','Actor headshots'],'https://www.headshots-new-york.com/prices.htm',null,'Ask about packages',0,'Studio + on-location','Session and outdoor NYC rates are listed on the provider pricing page.','business'],
  ['steven-rosen','Steven Rosen Photography','On-location headshots & portraits','New York City','New York',['Business headshots','Personal branding'],'https://www.stevenrosenphotography.com/pricing2',null,'Ask about packages',0,'On-location','Headshot sessions are photographed on location across NYC and Brooklyn.','portrait'],
  ['alex-kaplan','Alex Kaplan Headshots','Professional, executive & team portraits','New York City','New York',['Business headshots','Personal branding','Team headshots'],'https://www.alexkaplanphoto.com/',null,'Ask about packages',0,'Studio + on-location','Directory profile describes professional, executive and team headshots; request a quote.','business'],
  ['peter-hurley','Peter Hurley Headshot Photography','Executive & actor headshots','New York City','New York',['Business headshots','Actor headshots','Personal branding'],'https://www.peterhurley.com/',null,'Ask about packages',0,'Studio','New York headshot photographer; confirm package rates and availability directly.','business'],
  ['dorothy-shi','Dorothy Shi Photography','Corporate, actor & model headshots','Upper West Side','New York',['Business headshots','Actor headshots','Personal branding','Team headshots'],'https://www.dorothyshiphotography.com/publicsite?page=Pricing&pid=dorothyshi',null,'Ask about packages',0,'Studio + on-location','Headshot pricing page covers actors, models, business professionals and corporate teams.','business'],
  ['nyc-photographers-actors','NYC Photographers','Actor headshots & casting portraits','Garment District','New York',['Actor headshots'],'https://www.nycphotographers.com/actor-headshots-nyc',799,'Actor package 1',1,'Studio','Published actor sessions start at $799; package includes makeup and one retouched image.','actor'],
  ['james-hollywood','James Hollywood Photography','Actor headshots & personal branding','New York City','New York',['Actor headshots','Personal branding'],'https://www.jameshollywood.com/pricing',null,'Ask about packages',0,'Studio + on-location','Actor packages and lifestyle branding sessions; see provider page for current package costs.','actor'],
  ['clinton-b-photography','ClintonBPhotography','Cinematic actor headshots','New York City','New York',['Actor headshots'],'https://www.clintonbphotography.com/headshot-rates',null,'Ask about packages',0,'Studio','Actor-specific headshot sessions; contact for current pricing.','actor'],
  ['rzf-images','RZF Images','Corporate and professional headshots','New York City','New York',['Business headshots','Team headshots'],'https://www.rzfimages.com/',null,'Ask about packages',0,'Studio + on-location','Headshot and corporate listing in New York; request a current quote.','business'],
];

const packageFor = (price, name, imageCount, summary, tags) => ({
  name,
  price,
  editedImages: imageCount,
  looks: 1,
  kinds: [...new Set([
    ...(tags.includes('Personal branding') && /brand|personal/i.test(`${name} ${summary}`) ? ['Personal branding'] : []),
    ...(tags.includes('Team headshots') && /team|group/i.test(`${name} ${summary}`) ? ['Team headshots'] : []),
    ...(/mini|quickie|quick-fix|just the basics|linkedin/i.test(name) ? ['Mini session'] : []),
    ...(/one look|one outfit|single look/i.test(summary) ? ['Single look'] : []),
    ...(/two looks|three looks|four looks|five looks|unlimited looks|multiple looks|\d+ looks/i.test(summary) ? ['Multi-look'] : []),
  ])],
  summary,
});

const mappedProviders = discoveredProviders.map(([id, name, subtitle, neighborhood, city, specialties, source, price, packageName, editedImages, setting, description, visual]) => {
  const pkg = packageFor(price, packageName, editedImages, description, specialties);
  return {
    id, name, subtitle, neighborhood, city, specialties, source, checked: 'Oct 2026', description, visual,
    settings: setting.split(' + '), startingPrice: price, featuredPackage: pkg, packages: [pkg],
  };
});

export const photographers = [...originalPhotographers, ...mappedProviders];
