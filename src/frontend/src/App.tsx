import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllBlogPosts, useSubmitFeedback } from "@/hooks/useQueries";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  Menu,
  NotebookPen,
  Send,
  ShoppingBag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AffiliateProduct, BlogPost } from "./backend.d";

// Pinterest SVG icon
function PinterestIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pinterest"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

// ─── Static seed data ──────────────────────────────────────────────────────────

const STATIC_PRODUCTS: AffiliateProduct[] = [
  {
    productId: 4n,
    name: "Bajaj Splendid 120TS Induction Cooktop",
    description:
      "The Bajaj Splendid 120TS Induction Cooktop offers reliable everyday cooking with 1200W power, 7 preset menus, and an easy-to-use LED display. Its tempered glass surface adds a sleek look while making cleaning simple. Priced at ₹1,799, it's a practical and budget-friendly choice for quick, hassle-free meals.",
    url: "https://amzn.to/4t1TfyA",
    discount: "₹1,799",
    price: "₹1,799",
  },
];

// Product category lookup by productId (as string)
const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  "4": "Kitchen Picks",
};

// Product image map by productId (as string)
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "4": "/assets/uploads/image-019d2377-3185-700f-825b-eb958b005c2a-1.png",
};

const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    postId: 1n,
    title: "HAPPINESS",
    content:
      'Just heard a bollywood song (Tumse Milke Dilka Hai Jo Haal Kya Kahe...) and my mind started further lyrics and within seconds i was humming the tune!\n\nHappiness is often imagined as something large such as an achievement, a milestone, a moment that stands out clearly in memory. But most of the time, it does not arrive like that. It shows up quietly. In small pauses between tasks. In a familiar song playing in the background. In the comfort of doing something without urgency. These moments rarely announce themselves, which is why they are easy to overlook.\n\nIn a way, happiness is less about intensity and more about frequency. Maybe that is why we often feel it in ordinary routines rather than extraordinary events.\n\nWe keep waiting for something significant to change how we feel, while smaller moments quietly pass by, doing the same work in a less noticeable way. Perhaps happiness is not something we find. It is something we start noticing. Maybe that is why happiness is so underrated.\n\nAs Albus Dumbledore once said, "Happiness can be found even in the darkest of times, if one only remembers to turn on the light."\n\n- The thinking cat',
    excerpt:
      "Happiness is often imagined as something large. But most of the time, it shows up quietly — in a familiar song, in a small pause between tasks.",
    category: "2-Minute Thoughts",
    author: "The Thinking Cat",
    timestamp: 1742900000000000000n,
  },
];
const BLOG_CATEGORIES = [
  "All",
  "Science & Reflections",
  "2-Minute Thoughts",
] as const;
type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const PRODUCT_CATEGORIES = [
  "All",
  "Home & Living",
  "Kitchen Picks",
  "Smart Gadgets",
  "Science Finds",
  "Fashion Styles",
] as const;
type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  "Affiliate Tips": "bg-violet-100 text-violet-800",
  Strategy: "bg-amber-100 text-amber-800",
  SEO: "bg-blue-100 text-blue-800",
  "Science & Reflections": "bg-teal-100 text-teal-800",
  "2-Minute Thoughts": "bg-rose-100 text-rose-800",
};

const CATEGORY_ACTIVE_STYLES: Record<BlogCategory, string> = {
  All: "bg-navy text-white border-navy",
  "Science & Reflections": "bg-teal-600 text-white border-teal-600",
  "2-Minute Thoughts": "bg-rose-500 text-white border-rose-500",
};

const CATEGORY_INACTIVE_STYLES: Record<BlogCategory, string> = {
  All: "bg-white text-navy border-navy/30 hover:border-navy/60",
  "Science & Reflections":
    "bg-white text-teal-700 border-teal-200 hover:border-teal-400",
  "2-Minute Thoughts":
    "bg-white text-rose-600 border-rose-200 hover:border-rose-400",
};

const PRODUCT_CATEGORY_ACTIVE_STYLES: Record<ProductCategory, string> = {
  All: "bg-navy text-white border-navy",
  "Home & Living": "bg-amber-600 text-white border-amber-600",
  "Kitchen Picks": "bg-green-600 text-white border-green-600",
  "Smart Gadgets": "bg-blue-600 text-white border-blue-600",
  "Science Finds": "bg-teal-600 text-white border-teal-600",
  "Fashion Styles": "bg-pink-500 text-white border-pink-500",
};

const PRODUCT_CATEGORY_INACTIVE_STYLES: Record<ProductCategory, string> = {
  All: "bg-white text-navy border-navy/30 hover:border-navy/60",
  "Home & Living":
    "bg-white text-amber-700 border-amber-200 hover:border-amber-400",
  "Kitchen Picks":
    "bg-white text-green-700 border-green-200 hover:border-green-400",
  "Smart Gadgets":
    "bg-white text-blue-700 border-blue-200 hover:border-blue-400",
  "Science Finds":
    "bg-white text-teal-700 border-teal-200 hover:border-teal-400",
  "Fashion Styles":
    "bg-white text-pink-600 border-pink-200 hover:border-pink-400",
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function filterPosts(posts: BlogPost[], category: BlogCategory): BlogPost[] {
  if (category === "All") return posts;
  return posts.filter((p) => p.category === category);
}

function filterProducts(
  products: AffiliateProduct[],
  category: ProductCategory,
): AffiliateProduct[] {
  if (category === "All") return products;
  return products.filter(
    (p) => PRODUCT_CATEGORY_MAP[String(p.productId)] === category,
  );
}

// ─── Category Filter Pills (Blog) ─────────────────────────────────────────────
function CategoryFilterPills({
  selected,
  onChange,
}: {
  selected: BlogCategory;
  onChange: (cat: BlogCategory) => void;
}) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 mb-8"
      data-ocid="blog.filter.tab"
    >
      {BLOG_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
            selected === cat
              ? CATEGORY_ACTIVE_STYLES[cat]
              : CATEGORY_INACTIVE_STYLES[cat]
          }`}
          data-ocid="blog.filter.tab"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ─── Product Category Filter Pills ───────────────────────────────────────────
function ProductCategoryFilterPills({
  selected,
  onChange,
}: {
  selected: ProductCategory;
  onChange: (cat: ProductCategory) => void;
}) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 mb-8"
      data-ocid="products.filter.tab"
    >
      {PRODUCT_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
            selected === cat
              ? PRODUCT_CATEGORY_ACTIVE_STYLES[cat]
              : PRODUCT_CATEGORY_INACTIVE_STYLES[cat]
          }`}
          data-ocid="products.filter.tab"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ─── Blog Empty State ─────────────────────────────────────────────────────────
function BlogEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-14 text-center"
      data-ocid="blog.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
        <NotebookPen size={28} className="text-violet-400" />
      </div>
      <p className="font-serif text-lg font-semibold text-foreground mb-1">
        No posts yet
      </p>
      <p className="text-muted-foreground text-sm">Check back soon.</p>
    </motion.div>
  );
}

// ─── Product Empty State ──────────────────────────────────────────────────────
function ProductEmptyState({ category }: { category: ProductCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-14 text-center"
      data-ocid="products.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <ShoppingBag size={28} className="text-amber-400" />
      </div>
      <p className="font-serif text-lg font-semibold text-foreground mb-1">
        No products in {category} yet
      </p>
      <p className="text-muted-foreground text-sm">Check back soon.</p>
    </motion.div>
  );
}

// ─── Blog Post Modal ──────────────────────────────────────────────────────────
function BlogPostModal({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  const catColor = post
    ? (CATEGORY_COLORS[post.category] ?? "bg-violet-100 text-violet-800")
    : "";

  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-0"
        data-ocid="blog.modal"
      >
        {post && (
          <>
            <DialogHeader className="px-8 pt-8 pb-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${catColor}`}
                >
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.timestamp)}
                </span>
              </div>
              <DialogTitle className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {post.title}
              </DialogTitle>
            </DialogHeader>
            <div className="px-8 py-6">
              <p className="text-foreground text-base leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Blog", href: "#blog" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="max-w-container mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/thinking-cat-logo-transparent.dim_64x64.png"
            alt="The Thinking Cat Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="font-serif font-bold text-navy text-lg">
            The Thinking Cat
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground hover:text-violet-600 transition-colors font-sans"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search + Sign Up */}
        <div className="hidden md:flex items-center gap-3">
          <Input
            placeholder="Search..."
            className="rounded-full h-8 w-36 text-sm"
            data-ocid="nav.search_input"
          />
          <Button
            size="sm"
            className="rounded-full bg-navy hover:bg-navy-light text-white"
            data-ocid="nav.primary_button"
            onClick={() =>
              document
                .getElementById("subscribe")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-border"
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-violet-600 py-1"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Intro Section (Hero + Tabs) ──────────────────────────────────────────────
function ProductMiniCard({
  product,
  index,
}: { product: AffiliateProduct; index: number }) {
  const productImage = PRODUCT_IMAGE_MAP[String(product.productId)];
  const isAmazonProduct = product.url.includes("amzn");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      data-ocid={`intro.product.item.${index + 1}`}
    >
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300 rounded-xl h-full flex flex-col bg-white overflow-hidden">
        {productImage ? (
          <div className="w-full h-40 overflow-hidden rounded-t-xl">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
        <CardContent className={`p-5 flex-1 ${productImage ? "" : ""}`}>
          {!productImage && (
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <span className="font-serif font-bold text-navy text-base">
                  {product.name.charAt(0)}
                </span>
              </div>
              <Badge className="bg-violet-200 text-violet-900 border-none text-xs font-bold px-2">
                {product.discount}
              </Badge>
            </div>
          )}
          {productImage && (
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-green-100 text-green-800 border-none text-xs font-bold px-2">
                {product.discount}
              </Badge>
            </div>
          )}
          <h3 className="font-serif text-base font-bold text-foreground mb-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-4 whitespace-pre-line">
            {product.description}
          </p>
          {!productImage && (
            <p className="font-bold text-navy text-sm">{product.price}</p>
          )}
        </CardContent>
        <CardFooter className="px-5 pb-5 pt-0">
          <Button
            size="sm"
            className={`w-full rounded-full font-semibold text-xs ${
              isAmazonProduct
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-violet-500 hover:bg-violet-600 text-white"
            }`}
            asChild
            data-ocid={`intro.product.item.${index + 1}`}
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              {isAmazonProduct ? (
                <span className="flex items-center justify-center gap-1">
                  Buy on Amazon <ArrowRight size={12} />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  View Deal <ExternalLink size={12} />
                </span>
              )}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function IntroSection() {
  const { data: posts } = useGetAllBlogPosts();
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const [activeProductCategory, setActiveProductCategory] =
    useState<ProductCategory>("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const backendPosts = posts ?? [];
  const backendTitles = new Set(backendPosts.map((p) => p.title));
  const allPosts = [
    ...STATIC_BLOG_POSTS.filter((p) => !backendTitles.has(p.title)),
    ...backendPosts,
  ];
  const filteredPosts = filterPosts(allPosts, activeCategory);
  const filteredProducts = filterProducts(
    STATIC_PRODUCTS,
    activeProductCategory,
  );

  return (
    <section id="home" className="relative">
      {/* Blog Post Modal */}
      <BlogPostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Hero Banner */}
      <div
        className="relative min-h-[420px] md:min-h-[520px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/uploads/pexels-suzyhazelwood-1480347-019d1f05-2177-7059-bce9-9c82e707e6a8-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
        <div className="relative z-10 max-w-container mx-auto px-4 md:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              The Thinking Cat
            </h1>
            <p className="text-white/85 text-base md:text-lg font-sans leading-relaxed">
              Where life is not explained, just noticed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-violet-50 border-b border-violet-100">
        <div className="max-w-container mx-auto px-4 md:px-8 py-12">
          <Tabs defaultValue="blogs" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white shadow-card rounded-full p-1 h-auto gap-1">
                <TabsTrigger
                  value="blogs"
                  className="rounded-full px-8 py-2.5 text-sm font-semibold data-[state=active]:bg-navy data-[state=active]:text-white transition-all"
                  data-ocid="intro.tab"
                >
                  📝 Blogs
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="rounded-full px-8 py-2.5 text-sm font-semibold data-[state=active]:bg-navy data-[state=active]:text-white transition-all"
                  data-ocid="intro.tab"
                >
                  🛍️ Product Reviews & Marketing
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="blogs">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Fresh from the Blog
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                    Deep-dives, guides, and real-world observations — written
                    from lived experience, no fluff.
                  </p>
                </div>

                <CategoryFilterPills
                  selected={activeCategory}
                  onChange={setActiveCategory}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {filteredPosts.length === 0 ? (
                      <BlogEmptyState />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {filteredPosts.map((post, i) => {
                          const catColor =
                            CATEGORY_COLORS[post.category] ??
                            "bg-violet-100 text-violet-800";
                          return (
                            <Card
                              key={String(post.postId)}
                              className="overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 rounded-xl h-full flex flex-col"
                              data-ocid={`blog.item.${i + 1}`}
                            >
                              <CardContent className="p-5 flex-1">
                                <span
                                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${catColor}`}
                                >
                                  {post.category}
                                </span>
                                <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-2">
                                  {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {post.excerpt}
                                </p>
                              </CardContent>
                              <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(post.timestamp)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPost(post)}
                                  className="text-violet-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                                  data-ocid={`blog.item.${i + 1}`}
                                >
                                  Read More <ArrowRight size={14} />
                                </button>
                              </CardFooter>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            <TabsContent value="products">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Honest Product Reviews & Marketing
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                    Handpicked tools and services I personally use and
                    recommend. Each review is thorough, unbiased, and comes from
                    lived experience.
                  </p>
                </div>

                <ProductCategoryFilterPills
                  selected={activeProductCategory}
                  onChange={setActiveProductCategory}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProductCategory}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {filteredProducts.length === 0 ? (
                      <ProductEmptyState category={activeProductCategory} />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProducts.map((product, i) => (
                          <ProductMiniCard
                            key={String(product.productId)}
                            product={product}
                            index={i}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-20 bg-violet-50">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-3">
            About Me
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Hi, I'm Anuja — Researcher, Writer &amp; Affiliate Blogger
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-5 text-base">
            By profession, I work in research. By nature, I observe, question,
            and write. Over time, I realized that not everything I experience
            fits into lab notes or structured reports — some thoughts stay,
            quietly asking to be noticed.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-5 text-base">
            This space began as that outlet. A place where science meets life,
            where everyday moments are understood through a lens of curiosity,
            biology, and reflection.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            This site is my open notebook. Every idea, perspective, and
            recommendation you find here comes from lived experience — no noise,
            no unnecessary complexity. Just thoughts, observed and shared. Along
            the way, I began exploring blogging and affiliate marketing as a way
            to share what I learn and experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsPending(true);
    try {
      const response = await fetch("https://formspree.io/f/FORMSPREE_FORM_ID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        toast.success("Thanks for your message! I'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section id="contact" className="py-16 md:py-20 bg-purple-50">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Say Hello
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Get in Touch
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Have a question, partnership idea, or just want to say hi? I'd love
            to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Contact Information
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-violet-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-sans">
                    Email
                  </p>
                  <a
                    href="mailto:anujapatil04032026@gmail.com"
                    className="font-semibold text-foreground hover:text-violet-600 transition-colors"
                  >
                    anujapatil04032026@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center shrink-0 text-violet-700">
                  <PinterestIcon size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-sans">
                    Pinterest
                  </p>
                  <a
                    href="https://in.pinterest.com/anujapatil04032026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-violet-600 transition-colors"
                  >
                    @anujapatil04032026
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-white rounded-2xl shadow-card">
              <h4 className="font-serif font-bold text-foreground mb-2">
                Partnership Opportunities
              </h4>
              <p className="text-sm text-muted-foreground">
                Interested in a sponsored post, product review, or joint
                venture? Send a message and let's explore what we can build
                together.
              </p>
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="bg-white rounded-2xl shadow-card p-8"
              data-ocid="contact.panel"
            >
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Send a Message
              </h3>
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-violet-100 rounded-lg text-sm text-violet-800 font-semibold"
                    data-ocid="contact.success_state"
                  >
                    ✓ Message sent successfully!
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Full Name
                  </label>
                  <Input
                    id="contact-name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell me what's on your mind..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    data-ocid="contact.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-navy hover:bg-navy-light text-white font-semibold"
                  disabled={isPending}
                  data-ocid="contact.submit_button"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Blog", href: "#blog" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-container mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/thinking-cat-logo-transparent.dim_64x64.png"
                alt="The Thinking Cat Logo"
                className="w-16 h-16 rounded-full object-cover"
              />
              <span className="font-serif font-bold text-white text-lg">
                The Thinking Cat
              </span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">
              Your trusted companion for affiliate marketing insights, honest
              reviews, and income-building strategies.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://in.pinterest.com/anujapatil04032026/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-violet-400 hover:text-white flex items-center justify-center transition-colors"
                data-ocid="footer.link"
              >
                <PinterestIcon size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/65 text-sm hover:text-violet-300 transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div id="subscribe">
            <h4 className="font-serif font-bold text-white mb-2">
              Stay in the Loop
            </h4>
            <p className="text-white/65 text-sm mb-4">
              Get weekly blog posts and updates straight to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full"
                data-ocid="footer.input"
              />
              <Button
                size="icon"
                className="rounded-full bg-violet-500 hover:bg-violet-400 text-white shrink-0"
                onClick={() => {
                  if (email) {
                    toast.success("You're subscribed!");
                    setEmail("");
                  }
                }}
                data-ocid="footer.primary_button"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80"
            >
              caffeine.ai
            </a>
          </span>
          <div className="flex gap-4">
            <a
              href="/privacy"
              className="hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <IntroSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
