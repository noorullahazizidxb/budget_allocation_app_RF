import { describe, expect, it } from 'vitest';
import { DEVMINDS_PRODUCTS, productLogoSrc } from './devminds-products';

describe('DEVMINDS_PRODUCTS registry', () => {
  it('lists all eight products once, with absolute https URLs', () => {
    expect(DEVMINDS_PRODUCTS).toHaveLength(8);
    expect(new Set(DEVMINDS_PRODUCTS.map((p) => p.slug)).size).toBe(8);
    for (const p of DEVMINDS_PRODUCTS) expect(p.url).toMatch(/^https:\/\/([a-z-]+\.)?devminds\.net\/$/);
  });

  it('includes date-converter', () => {
    expect(DEVMINDS_PRODUCTS.find((p) => p.slug === 'date-converter')?.url).toBe('https://date-converter.devminds.net/');
  });

  it('keeps the restaurant maps domain spelling', () => {
    expect(DEVMINDS_PRODUCTS.find((p) => p.slug === 'restaurant-maps')?.url).toBe('https://resturant-maps.devminds.net/');
  });

  it('builds themed logo paths', () => {
    expect(productLogoSrc('budget-manager', 'dark')).toBe('/brand/products/budget-manager-dark.svg');
    expect(productLogoSrc('notes', 'icon-light')).toBe('/brand/products/notes-icon-light.svg');
  });
});
