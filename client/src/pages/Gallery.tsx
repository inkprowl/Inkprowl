import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ArtworkCard, AdSlot } from "@/components/ArtworkCard";
import { PageFrame } from "@/components/InkprowlChrome";
import { artworks, categories } from "@/data/catalog";

export default function Gallery() {
  const [active, setActive] = useState("All works");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => artworks.filter((artwork) => (active === "All works" || artwork.category === active || (active === "Premium Art" && artwork.isPremium) || (active === "Free Art" && !artwork.isPremium)) && `${artwork.title} ${artwork.category}`.toLowerCase().includes(query.toLowerCase())), [active, query]);
  return <PageFrame><section className="page-hero ivory"><span className="eyebrow">THE COLLECTION</span><h1>Find the character<br /><em>you came for.</em></h1><p>Line art, collectible editions, and animal personalities arranged as a working archive.</p></section><section className="gallery-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></div><div className="toolbar-label"><Filter size={15} /> Filter by field</div></section><section className="filter-rail" aria-label="Gallery filters"><button className={active === "All works" ? "selected" : ""} onClick={() => setActive("All works")}>All works</button>{categories.map((category) => <button key={category.name} className={active === category.name ? "selected" : ""} onClick={() => setActive(category.name)}>{category.name}</button>)}</section><section className="gallery-grid section-wrap">{filtered.map((artwork) => <ArtworkCard key={artwork.slug} artwork={artwork} />)}</section>{filtered.length === 0 && <div className="empty-state">No editions found. Try another search or category.</div>}<AdSlot label="A framed space for your selected partner" /></PageFrame>;
}
