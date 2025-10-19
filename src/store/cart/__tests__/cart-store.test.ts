import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cart-store';
import type { CartProduct } from '@/types/store.interface';

describe('Cart Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useCartStore.setState({ cart: [] });
  });

  describe('getTotalItems', () => {
    it('should return 0 when cart is empty', () => {
      const { getTotalItems } = useCartStore.getState();
      expect(getTotalItems()).toBe(0);
    });

    it('should return correct total of items', () => {
      const product1: CartProduct = {
        id: '1',
        title: 'Product 1',
        price: 10,
        quantity: 2,
        image: '/test.jpg',
      };
      const product2: CartProduct = {
        id: '2',
        title: 'Product 2',
        price: 20,
        quantity: 3,
      };

      useCartStore.setState({ cart: [product1, product2] });

      const { getTotalItems } = useCartStore.getState();
      expect(getTotalItems()).toBe(5); // 2 + 3
    });
  });

  describe('addProductToCart', () => {
    it('should add a new product to cart', () => {
      const product: CartProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
      };

      const { addProductToCart } = useCartStore.getState();
      addProductToCart(product);

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(1);
      expect(cart[0]).toEqual(product);
    });

    it('should increment quantity if product already exists', () => {
      const product: CartProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
      };

      const { addProductToCart } = useCartStore.getState();
      addProductToCart(product);
      addProductToCart({ ...product, quantity: 2 });

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3); // 1 + 2
    });
  });

  describe('getSummaryInformation', () => {
    it('should calculate correct summary', () => {
      const product: CartProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
        quantity: 2,
      };

      useCartStore.setState({ cart: [product] });

      const { getSummaryInformation } = useCartStore.getState();
      const summary = getSummaryInformation();

      expect(summary.subTotal).toBe(200); // 100 * 2
      expect(summary.tax).toBe(20); // 200 * 0.10
      expect(summary.total).toBe(220); // 200 + 20
      expect(summary.itemsInCart).toBe(2);
    });
  });

  describe('removeProduct', () => {
    it('should remove product from cart', () => {
      const product: CartProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
      };

      useCartStore.setState({ cart: [product] });

      const { removeProduct } = useCartStore.getState();
      removeProduct(product);

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all products from cart', () => {
      const products: CartProduct[] = [
        { id: '1', title: 'Product 1', price: 10, quantity: 1 },
        { id: '2', title: 'Product 2', price: 20, quantity: 2 },
      ];

      useCartStore.setState({ cart: products });

      const { clearCart } = useCartStore.getState();
      clearCart();

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(0);
    });
  });
});
