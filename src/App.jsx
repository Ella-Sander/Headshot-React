import { useEffect, useMemo, useRef, useState } from 'react';
import { photographers } from './data/photographers.js';

const Icon = ({ name, size = 18 }) => {
  const paths = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    tune: <><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="8" cy="7" r="1.5"/><circle cx="15" cy="12" r="1.5"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};


const unique = values => [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b));
const neighborhoodOptions = unique(photographers.map(p => p.neighborhood));
const specialtyOptions = unique(photographers.flatMap(p => p.specialties));
const normalizeSetting = value => /^on-location$/i.test(value) ? 'On-location' : value;
const settingsOf = p => p.settings.map(normalizeSetting);
const settingOptions = unique(photographers.flatMap(settingsOf));
const packageOptions = unique(photographers.flatMap(p => p.packages.flatMap(pkg => pkg.kinds)));
const matchesSelected = (selected, available) => !selected.length || selected.some(value => available.includes(value));
const toggleValue = (values, value) => values.includes(value) ? values.filter(item => item !== value) : [...values, value];
const dollars = value => `$${Number(value).toLocaleString()}`;

function FilterChecks({ title, values, selected, onChange, name }) {
  return <details className="filter-group filter-details">
    <summary className="filter-label">{title}<span className="filter-selected-count">{selected.length || 'All'}</span></summary>
    <fieldset className="filter-check-list"><legend className="sr-only">{title}</legend>{values.map(value => <label className="check-option" key={`${name}-${value}`}><input type="checkbox" checked={selected.includes(value)} onChange={() => onChange(toggleValue(selected, value))}/><span>{value}</span></label>)}</fieldset>
  </details>;
}

function PhotographerBrand({ photographer }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = Boolean(photographer.logoUrl) && !logoFailed;
  const monogram = photographer.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return <div className={`card-image ${hasLogo ? 'official-brand-card' : 'neutral-profile'}`}>
    {hasLogo ? <><div className={`official-logo-container ${photographer.logoKind === 'favicon' ? 'favicon-logo-container' : ''}`}><img className="official-logo" data-logo-kind={photographer.logoKind} src={photographer.logoUrl} alt={`${photographer.name} official website ${photographer.logoKind === 'favicon' ? 'icon' : 'branding'}`} loading="lazy" referrerPolicy="no-referrer" onError={() => setLogoFailed(true)}/></div><span className="brand-source-label">{photographer.logoKind === 'favicon' ? 'OFFICIAL SITE ICON' : 'OFFICIAL SITE BRANDING'}</span></> : <><span className="neutral-edition">PORTRAIT / NYC</span><span className="neutral-monogram" aria-hidden="true">{monogram}</span><div className="neutral-copy"><span>{photographer.specialties[0] || 'Headshot photography'}</span><strong>Official logo<br/>unavailable</strong></div></>}
    <div className="image-caption"><Icon name="pin" size={12}/>{photographer.neighborhood}, {photographer.city}</div>
  </div>;
}

function App() {
  const [location, setLocation] = useState('New York, NY');
  const [searchText, setSearchText] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [minimumPrice, setMinimumPrice] = useState('');
  const [maximumPrice, setMaximumPrice] = useState('');
  const [minimumImages, setMinimumImages] = useState(0);
  const [sort, setSort] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [comparison, setComparison] = useState([]);
  const [submissionReady, setSubmissionReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const comparisonDialog = useRef(null);
  const submissionDialog = useRef(null);

  const priceIsFiltered = minimumPrice !== '' || maximumPrice !== '';
  const filtersCount = selectedAreas.length + selectedSpecialties.length + selectedSettings.length + selectedPackages.length + (priceIsFiltered ? 1 : 0) + (minimumImages ? 1 : 0) + (savedOnly ? 1 : 0);

  const results = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    let list = photographers.filter(p => {
      const searchable = [p.name, p.subtitle, p.city, p.neighborhood, p.description, ...p.specialties, ...p.settings, ...p.packages.flatMap(pkg => [pkg.name, pkg.summary, ...pkg.kinds])].join(' ').toLowerCase();
      const matchesText = !normalizedSearch || searchable.includes(normalizedSearch);
      const matchesArea = matchesSelected(selectedAreas, [p.neighborhood, p.city]);
      const matchesSpecialty = matchesSelected(selectedSpecialties, p.specialties);
      const matchesSetting = matchesSelected(selectedSettings, settingsOf(p));
      const eligiblePackages = p.packages.filter(pkg => {
        const matchesPackage = matchesSelected(selectedPackages, pkg.kinds);
        const hasUnknownPrice = pkg.price === null || pkg.price === undefined;
        const matchesPrice = hasUnknownPrice ? !priceIsFiltered : (minimumPrice === '' || pkg.price >= Number(minimumPrice)) && (maximumPrice === '' || pkg.price <= Number(maximumPrice));
        return matchesPackage && matchesPrice && pkg.editedImages >= minimumImages;
      });
      return matchesText && matchesArea && matchesSpecialty && matchesSetting && eligiblePackages.length > 0 && (!savedOnly || favorites.includes(p.id));
    });
    if (sort === 'Price: low to high') list = [...list].sort((a, b) => (a.startingPrice ?? Infinity) - (b.startingPrice ?? Infinity));
    if (sort === 'Price: high to low') list = [...list].sort((a, b) => (b.startingPrice ?? -Infinity) - (a.startingPrice ?? -Infinity));
    if (sort === 'Alphabetical') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Most edited images') list = [...list].sort((a, b) => Math.max(...b.packages.map(pkg => pkg.editedImages)) - Math.max(...a.packages.map(pkg => pkg.editedImages)));
    if (sort === 'Most package options') list = [...list].sort((a, b) => b.packages.length - a.packages.length);
    return list;
  }, [searchText, selectedAreas, selectedSpecialties, selectedSettings, selectedPackages, minimumPrice, maximumPrice, minimumImages, sort, savedOnly, favorites, priceIsFiltered]);

  const pageSize = 21;
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const activePage = Math.min(currentPage, pageCount);
  const pageResults = results.slice((activePage - 1) * pageSize, activePage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchText, selectedAreas, selectedSpecialties, selectedSettings, selectedPackages, minimumPrice, maximumPrice, minimumImages, sort, savedOnly, favorites]);
  useEffect(() => { if (currentPage > pageCount) setCurrentPage(pageCount); }, [currentPage, pageCount]);

  useEffect(() => {
    const canonical = document.querySelector('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }));
    canonical.href = `${window.location.origin}${window.location.pathname}`;
    const itemList = {
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'NYC Headshot Photographers', numberOfItems: photographers.length,
      itemListElement: photographers.map((p, index) => ({ '@type': 'ListItem', position: index + 1, name: p.name, url: p.source })),
    };
    let schema = document.getElementById('portrait-directory-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'portrait-directory-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify(itemList);
  }, []);

  const resetFilters = () => {
    setSearchText(''); setSelectedAreas([]); setSelectedSpecialties([]); setSelectedSettings([]); setSelectedPackages([]);
    setMinimumPrice(''); setMaximumPrice(''); setMinimumImages(0); setSavedOnly(false);
  };
  const toggleCompare = id => setComparison(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current, id] : current);
  const compareProfiles = comparison.map(id => photographers.find(p => p.id === id)).filter(Boolean);
  const submitDirectoryProfile = event => { event.preventDefault(); setSubmissionReady(true); };

  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return <main className="directory-not-found"><a className="brand" href="/"><span className="brand-mark">p<span>.</span></span><span className="brand-word">portrait</span></a><p className="section-kicker">404 · PAGE NOT FOUND</p><h1>This page isn’t in the directory.</h1><p>Search the NYC-area headshot directory or return to all photographers.</p><label className="directory-search"><Icon name="search" size={17}/><input aria-label="Search photographers" value={searchText} onChange={event => setSearchText(event.target.value)} placeholder="Search by photographer, location, or specialty"/></label>{searchText.trim() && <ul>{results.slice(0, 8).map(provider => <li key={provider.id}><a href={provider.source} target="_blank" rel="noopener noreferrer">{provider.name}</a> · {provider.neighborhood}, {provider.city}</li>)}</ul>}<a className="join-button" href="/new-york/headshot-photographers/">Browse all photographers <Icon name="arrow" size={15}/></a></main>;

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#home" aria-label="Portrait home"><span className="brand-mark">p<span>.</span></span><span className="brand-word">portrait</span></a>
      <nav className={`top-nav ${mobileMenuOpen ? 'top-nav-open' : ''}`} aria-label="Main navigation"><a href="#directory" onClick={() => setMobileMenuOpen(false)}>Browse photographers</a><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a><a href="#for-photographers" onClick={() => { setMobileMenuOpen(false); submissionDialog.current?.showModal(); }}>For photographers</a></nav>
      <div className="top-actions"><button className="saved-nav" onClick={() => { setSavedOnly(value => !value); document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' }); }} aria-pressed={savedOnly}><Icon name="heart" size={17}/><span>{savedOnly ? 'Saved only' : 'Saved'}</span>{favorites.length > 0 && <b>{favorites.length}</b>}</button><button className="join-button" onClick={() => submissionDialog.current?.showModal()}>Submit a profile <Icon name="arrow" size={16}/></button><button className="mobile-menu" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(value => !value)}>{mobileMenuOpen ? <Icon name="close"/> : '☰'}</button></div>
    </header>

    <main id="home">
      <section className="hero editorial-hero"><div className="hero-content"><div className="eyebrow"><span className="eyebrow-dot"/> A NEW YORK CITY HEADSHOT DIRECTORY</div><h1>Find your next<br/><em>headshot photographer.</em></h1><p className="hero-copy">A straightforward way for actors and professionals to compare NYC photographers, packages, specialties, and published rates.</p>
        <form className="search-box" onSubmit={event => { event.preventDefault(); setSearchText(location.trim() === 'New York, NY' ? searchText : location); document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' }); }}><label className="search-field location-field"><Icon name="pin"/><span className="field-wrap"><span className="field-label">CITY OR NEIGHBORHOOD</span><input aria-label="City or neighborhood" value={location} onChange={event => setLocation(event.target.value)} placeholder="New York, Brooklyn, Astoria"/></span></label><button className="search-submit" type="submit"><Icon name="search" size={19}/><span>Browse photographers</span></button></form>
        <div className="hero-note"><span><Icon name="check" size={14}/> {photographers.length} NYC-area listings</span><i/><span>Published prices where available</span><i/><span>Direct links to photographer sites</span></div>
      </div><aside className="hero-editorial-note"><span className="hero-note-index">01 / THE DIRECTORY</span><p>Find a photographer whose work, process, and price fit the headshot you need.</p><a href="#directory">Browse the directory <Icon name="arrow" size={15}/></a><div className="hero-note-rule"/><span className="hero-note-foot">NEW YORK CITY · ACTOR & PROFESSIONAL HEADSHOTS</span></aside>
        <div className="hero-bottom"><div><strong>Compare the details before you book.</strong><span>Specialty · neighborhood · session · published price</span></div><div className="hero-stat"><strong>{photographers.length}</strong><span>photographers<br/>and studios</span></div><div className="hero-stat"><strong>{photographers.filter(p => p.startingPrice !== null).length}</strong><span>with a listed<br/>starting price</span></div></div>
      </section>

      <section className="directory-section" id="directory"><div className="directory-heading"><div><div className="section-kicker">BROWSE NYC HEADSHOT PHOTOGRAPHERS</div><h2>The right fit, <em>in focus.</em></h2><p>Filter the full directory by neighborhood, specialty, session setting, packages, and price.</p></div><div className="directory-total"><strong>{photographers.length}</strong><span>listed providers</span></div></div>
        <div className="results-layout"><aside className={`filters ${filtersOpen ? 'filters-open' : ''}`} aria-label="Photographer filters"><div className="filter-heading"><strong><Icon name="tune" size={17}/> Refine results {filtersCount > 0 && <span className="filter-count-badge">{filtersCount}</span>}</strong><button type="button" onClick={resetFilters}>Clear all</button></div>
          <div className="filter-group filter-price"><span className="filter-label">PRICE PER SESSION / PACKAGE</span><div className="price-inputs"><label>Min <span className="sr-only">minimum price</span><input inputMode="numeric" type="number" min="0" step="25" value={minimumPrice} onChange={event => setMinimumPrice(event.target.value)} placeholder="$ —"/></label><span aria-hidden="true">–</span><label>Max <span className="sr-only">maximum price</span><input inputMode="numeric" type="number" min="0" step="25" value={maximumPrice} onChange={event => setMaximumPrice(event.target.value)} placeholder="No cap"/></label></div><small>Quote-only profiles remain visible until you set a price.</small></div>
          <FilterChecks title="NEIGHBORHOOD / AREA" name="area" values={neighborhoodOptions} selected={selectedAreas} onChange={setSelectedAreas}/>
          <FilterChecks title="SPECIALTY" name="specialty" values={specialtyOptions} selected={selectedSpecialties} onChange={setSelectedSpecialties}/>
          <FilterChecks title="SESSION SETTING" name="setting" values={settingOptions} selected={selectedSettings} onChange={setSelectedSettings}/>
          <FilterChecks title="PACKAGE TYPE" name="package" values={packageOptions} selected={selectedPackages} onChange={setSelectedPackages}/>
          <label className="filter-group"><span className="filter-label">RETOUCHED IMAGES INCLUDED</span><select className="filter-select" value={minimumImages} onChange={event => setMinimumImages(Number(event.target.value))}><option value={0}>Any quantity</option><option value={1}>At least 1</option><option value={2}>At least 2</option><option value={3}>At least 3</option><option value={5}>At least 5</option><option value={8}>At least 8</option></select><small>Only packages with a listed image count match.</small></label>
          <div className="filter-help"><span>i</span><div><strong>Check the source before booking.</strong><p>Rates and package details can change. Ask the photographer to confirm current terms.</p></div></div>
        </aside>

        <div className="results"><div className="results-toolbar"><div className="result-count" aria-live="polite" aria-atomic="true"><strong>{results.length ? `${results.length} photographer${results.length === 1 ? '' : 's'} to compare` : 'No matching photographers'}</strong><span>NYC-area headshot services · details linked to original sources</span></div><div className="toolbar-actions"><button className="mobile-filter-button" onClick={() => setFiltersOpen(value => !value)} aria-expanded={filtersOpen}><Icon name="tune" size={16}/> Filters{filtersCount > 0 ? ` (${filtersCount})` : ''}</button><div className="view-toggle" role="group" aria-label="Results view"><button type="button" className={viewMode === 'grid' ? 'active' : ''} aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}><span className="grid-view-icon" aria-hidden="true">▦</span></button><button type="button" className={viewMode === 'list' ? 'active' : ''} aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}><span className="list-view-icon" aria-hidden="true">☰</span></button></div><label className="sort-control"><span>Sort</span><select aria-label="Sort results" value={sort} onChange={event => setSort(event.target.value)}><option>Recommended</option><option>Price: low to high</option><option>Price: high to low</option><option>Alphabetical</option><option>Most edited images</option><option>Most package options</option></select></label></div></div>
          <label className="directory-search"><Icon name="search" size={17}/><span className="sr-only">Search name, neighborhood, specialty, or package</span><input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder="Search name, neighborhood, specialty, or package"/><span>⌘ K</span></label>
          {results.length ? <div className={`cards-grid ${viewMode === 'list' ? 'list-view' : ''}`}>{pageResults.map(p => {
            const matching = p.packages.filter(pkg => {
              const unknown = pkg.price === null || pkg.price === undefined;
              const budgetMatches = unknown ? !priceIsFiltered : (minimumPrice === '' || pkg.price >= Number(minimumPrice)) && (maximumPrice === '' || pkg.price <= Number(maximumPrice));
              return budgetMatches && pkg.editedImages >= minimumImages && matchesSelected(selectedPackages, pkg.kinds);
            }).sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
            const shown = matching[0] || p.featuredPackage;
            const compareSelected = comparison.includes(p.id);
            return <article className="photographer-card editorial-card" key={p.id}>
              <PhotographerBrand photographer={p}/>
              <div className="card-body"><div className="card-title-row"><div><h3>{p.name}</h3><span className="studio-name">{p.subtitle}</span></div><button type="button" className={`favorite-button inline-favorite ${favorites.includes(p.id) ? 'favorited' : ''}`} aria-label={`${favorites.includes(p.id) ? 'Remove' : 'Save'} ${p.name}`} aria-pressed={favorites.includes(p.id)} onClick={() => setFavorites(current => toggleValue(current, p.id))}><Icon name="heart" size={18}/></button></div>
                <div className="card-tags">{p.specialties.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
                {p.instagramUrl && <a className="instagram-link" href={p.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}'s Instagram profile`}><Icon name="instagram" size={14}/><span>Instagram</span><span aria-hidden="true">↗</span></a>}
                <div className="package-preview"><div><span className="package-name">{shown.name}</span><span className="package-detail">{shown.summary}</span></div><strong>{shown.price == null ? 'Quote' : dollars(shown.price)}</strong></div>
                <div className="card-meta"><span>{settingsOf(p).join(' · ')}</span><span>{shown.editedImages ? `${shown.editedImages} retouched listed` : 'Image count not listed'}</span></div>
                <div className="card-footer"><div className="price"><strong>{p.startingPrice == null ? 'Not listed' : dollars(p.startingPrice)}</strong><span>{p.startingPrice == null ? 'price' : 'starting price'}</span></div><a className="view-button" href={p.source} target="_blank" rel="noopener noreferrer">View photographer <Icon name="arrow" size={15}/></a></div>
                <div className="card-actions-row"><label className={`compare-option ${comparison.length >= 3 && !compareSelected ? 'limit-reached' : ''}`}><input type="checkbox" checked={compareSelected} disabled={comparison.length >= 3 && !compareSelected} onChange={() => toggleCompare(p.id)}/><span>Compare</span></label><span className="listing-date">Listing checked {p.checked}</span></div>
              </div>
            </article>;
          })}</div> : <div className="empty-state"><span>0</span><h3>No profiles match those filters.</h3><p>Clear a filter or broaden your search to explore the full New York City directory.</p><button type="button" onClick={resetFilters}>Clear filters <Icon name="arrow" size={15}/></button></div>}
          {results.length > 0 && <nav className="pagination" aria-label="Photographer results pages"><span className="pagination-summary">Showing {(activePage - 1) * pageSize + 1}–{Math.min(activePage * pageSize, results.length)} of {results.length}</span><div className="pagination-controls"><button type="button" className="page-button page-direction" onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={activePage === 1} aria-label="Previous page">‹ <span>Previous</span></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map(page => <button type="button" key={page} className={`page-button ${activePage === page ? 'current' : ''}`} aria-label={`Page ${page}`} aria-current={activePage === page ? 'page' : undefined} onClick={() => setCurrentPage(page)}>{page}</button>)}<button type="button" className="page-button page-direction" onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))} disabled={activePage === pageCount} aria-label="Next page"><span>Next</span> ›</button></div></nav>}
          <div className="results-footnote">Portrait is a discovery and comparison directory. Photographer information is summarized from public pages and directories; confirm current details directly.</div>
        </div></div>
      </section>

      <section className="how-section" id="how-it-works"><div className="how-intro"><div className="section-kicker">HOW THE DIRECTORY WORKS</div><h2>A clearer way<br/>to <em>find your fit.</em></h2><p>Portrait helps you compare the publicly available details before you visit a photographer’s own site.</p></div><div className="how-steps"><div className="step"><span className="step-number">01</span><div><h3>Start with your specialty and area</h3><p>Search actors, business portraits, branding, team sessions, or a NYC neighborhood.</p></div><span className="step-icon">01</span></div><div className="step"><span className="step-number">02</span><div><h3>Compare packages and prices</h3><p>Filter by listed rates and deliverables. Quote-only listings remain visible when you have not set a budget.</p></div><span className="step-icon">02</span></div><div className="step"><span className="step-number">03</span><div><h3>Visit the photographer’s website</h3><p>Confirm the latest pricing, image usage, scheduling, and package details with the provider.</p></div><span className="step-icon">03</span></div></div></section>

      <section className="cta-section" id="for-photographers"><div><span className="section-kicker">FOR NYC HEADSHOT PHOTOGRAPHERS</span><h2>Put your work<br/><em>in the right frame.</em></h2><p>Suggest a profile for the directory. Submissions need review before publication.</p></div><button type="button" className="cta-button" onClick={() => submissionDialog.current?.showModal()}>Suggest your profile <Icon name="arrow" size={16}/></button><span className="cta-stamp">PORTRAIT<br/>NEW YORK <b>✳</b></span></section>
    </main>

    {comparison.length > 0 && <div className="compare-dock" role="region" aria-label="Photographer comparison"><span><strong>{comparison.length} of 3</strong> selected to compare</span><div><button type="button" onClick={() => setComparison([])}>Clear</button><button type="button" className="compare-open-button" disabled={comparison.length < 2} onClick={() => comparisonDialog.current?.showModal()}>Compare profiles <Icon name="arrow" size={15}/></button></div></div>}

    <dialog ref={comparisonDialog} className="product-dialog compare-dialog" aria-labelledby="compare-heading"><div className="dialog-head"><div><span className="section-kicker">SIDE BY SIDE</span><h2 id="compare-heading">Compare photographers</h2></div><button className="dialog-close" aria-label="Close comparison" onClick={() => comparisonDialog.current?.close()}><Icon name="close"/></button></div>{compareProfiles.length < 2 ? <p>Select at least two profiles to compare.</p> : <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th scope="col">Details</th>{compareProfiles.map(p => <th scope="col" key={p.id}>{p.name}</th>)}</tr></thead><tbody><tr><th scope="row">Area</th>{compareProfiles.map(p => <td key={p.id}>{p.neighborhood}, {p.city}</td>)}</tr><tr><th scope="row">Specialty</th>{compareProfiles.map(p => <td key={p.id}>{p.specialties.join(', ')}</td>)}</tr><tr><th scope="row">Starting price</th>{compareProfiles.map(p => <td key={p.id}>{p.startingPrice == null ? 'Not listed' : dollars(p.startingPrice)}</td>)}</tr><tr><th scope="row">Session setting</th>{compareProfiles.map(p => <td key={p.id}>{p.settings.join(', ')}</td>)}</tr><tr><th scope="row">Packages</th>{compareProfiles.map(p => <td key={p.id}>{p.packages.map(pkg => `${pkg.name}: ${pkg.price == null ? 'quote' : dollars(pkg.price)} · ${pkg.summary}`).join('\n\n')}</td>)}</tr><tr><th scope="row">Website</th>{compareProfiles.map(p => <td key={p.id}><a href={p.source} target="_blank" rel="noopener noreferrer">Visit photographer site ↗</a></td>)}</tr></tbody></table></div>}<div className="dialog-footer"><button type="button" className="join-button" onClick={() => comparisonDialog.current?.close()}>Done</button></div></dialog>

    <dialog ref={submissionDialog} className="product-dialog submission-dialog" aria-labelledby="submission-heading" onClose={() => setSubmissionReady(false)}><div className="dialog-head"><div><span className="section-kicker">PHOTOGRAPHER SUBMISSION</span><h2 id="submission-heading">Suggest a profile</h2></div><button className="dialog-close" aria-label="Close submission form" onClick={() => submissionDialog.current?.close()}><Icon name="close"/></button></div>{submissionReady ? <div className="submission-status"><strong>Preview complete; nothing was sent.</strong><p>This directory currently has no submission backend. Your details have not been stored or transmitted.</p><button className="join-button" type="button" onClick={() => submissionDialog.current?.close()}>Close</button></div> : <form className="submission-form" onSubmit={submitDirectoryProfile}><p>Share public listing details for an NYC headshot photography service. Submissions need review before they can appear in the directory.</p><label>Photographer or studio name<input name="name" required autoComplete="organization"/></label><label>Website URL<input name="website" type="url" placeholder="https://" required/></label><label>Contact email<input name="email" type="email" required autoComplete="email"/></label><div className="submission-form-row"><label>Neighborhood<input name="area" placeholder="e.g. Astoria" required/></label><label>Starting price (optional)<input name="price" type="number" min="0" step="25" placeholder="Not listed"/></label></div><label>Specialty<textarea name="specialty" rows="2" placeholder="Actor, corporate, LinkedIn, team headshots…" required/></label><p className="submission-notice">This form is a local preview. It does not send, save, or publish your information.</p><button className="join-button" type="submit">Review submission <Icon name="arrow" size={15}/></button></form>}</dialog>

    <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">p<span>.</span></span><span className="brand-word">portrait</span></a><span>NYC headshot photographer directory.</span><div><a href="#directory">Browse photographers</a><a href="/new-york/headshot-photographers/">Directory pages</a><a href="#for-photographers" onClick={event => { event.preventDefault(); submissionDialog.current?.showModal(); }}>Suggest a profile</a><a href="#how-it-works">How it works</a></div><small>© 2026 Portrait. Photographer details are summarized for comparison and may change.</small></footer>
  </div>;
}

export default App;
