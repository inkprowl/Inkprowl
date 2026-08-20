import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PageFrame } from "@/components/InkprowlChrome";
import { categories } from "@/data/catalog";

export default function Categories() { return <PageFrame><section className="page-hero ivory"><span className="eyebrow">THE INDEX</span><h1>Choose a<br /><em>way in.</em></h1><p>Every category is an entry point into a distinct INKPROWL visual language.</p></section><section className="category-grid section-wrap">{categories.map((category, index) => <Link href={`/gallery?category=${encodeURIComponent(category.name)}`} className="category-card" key={category.name}><span className="category-index">{String(index + 1).padStart(2, "0")}</span><span className="category-emblem">{category.icon}</span><h2>{category.name}</h2><p>{category.count} works in this study</p><ArrowUpRight size={19} className="category-arrow" /></Link>)}</section></PageFrame>; }
