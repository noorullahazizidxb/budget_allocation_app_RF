import "./devminds-products.css";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { fadeUp, revealOnScroll, stagger } from "@/lib/motion";
import { DEVMINDS_PRODUCTS, LOGO_HEIGHT, productLogoSrc, type DevmindsProduct, type ProductSlug } from "@/seo/devminds-products";

interface DevmindsProductsProps {
  /** The product this app is; highlighted as "You are here". */
  current: ProductSlug;
}

/** Desktop shows every product in exactly two rows, whatever the product count. */
const DESKTOP_ROWS = 2;
const gridStyle = { "--dmp-cols": Math.ceil(DEVMINDS_PRODUCTS.length / DESKTOP_ROWS) } as CSSProperties;

function ProductIcon({ product }: { product: DevmindsProduct }) {
  return (
    <span className="dmp-icon" aria-hidden="true">
      {(["icon-light", "icon-dark"] as const).map((variant) => (
        <img
          key={variant}
          className={`dmp-img ${variant === "icon-light" ? "dmp-light" : "dmp-dark"}`}
          src={productLogoSrc(product.slug, variant)}
          alt=""
          width={product.logoWidths[variant]}
          height={LOGO_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      ))}
    </span>
  );
}

function CardBody({ product, isCurrent }: { product: DevmindsProduct; isCurrent: boolean }) {
  return (
    <>
      <ProductIcon product={product} />
      <span className="dmp-text">
        <span className="dmp-name">{product.name}</span>
        <span className="dmp-desc">{product.descriptor}</span>
        {isCurrent && <span className="dmp-badge">You are here</span>}
      </span>
    </>
  );
}

/** "More from DevMinds" footer section listing every DevMinds product. */
export function DevmindsProducts({ current }: DevmindsProductsProps) {
  return (
    <nav className="dmp" aria-labelledby="dmp-title">
      <h2 id="dmp-title" className="dmp-title">More from DevMinds</h2>
      <motion.ul className="dmp-grid" style={gridStyle} variants={stagger(0.04)} {...revealOnScroll}>
        {DEVMINDS_PRODUCTS.map((product) => {
          const isCurrent = product.slug === current;
          return (
            <motion.li key={product.slug} className="dmp-item" variants={fadeUp}>
              {isCurrent ? (
                <div className="dmp-card" aria-current="page">
                  <CardBody product={product} isCurrent />
                </div>
              ) : (
                <a
                  className="dmp-card"
                  href={product.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${product.name}: ${product.descriptor} (opens in new tab)`}
                >
                  <CardBody product={product} isCurrent={false} />
                </a>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
