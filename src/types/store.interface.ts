
enum Role {
  Admin = 'admin',
  User = 'user',
}

// Interface for Category model
export interface Category {
  id: string;
  name: string;
  Product: Product[];
}

// Interface for Account model
interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User;
}

// Interface for Session model
interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

// Interface for User model
interface User {
  id: string;
  name?: string;
  password?: string;
  role: Role;
  email?: string;
  emailVerified?: Date;
  image?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  accounts: Account[];
  sessions: Session[];
  Order: Order[];
}

// Interface for VerificationToken model
interface _VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Interface for Product model
export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  tags: string[];
  category?: Category;
  categoryId: string;
  ProductImage: { url: string }[];
  OrderItem?: OrderItem[];
}

export interface ProductGrid {
  id: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  tags: string[];
  category: Category;
  categoryId: string;
  ProductImage: ProductImage[];
  OrderItem: OrderItem[];
  
  title: string;
  // to-do type: Type;
}

// Interface for ProductImage model
export interface ProductImage {
  id: number;
  url: string;
  product: Product;
  productId: string;
}

// Interface for OrderItem model
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  order: Order;
  orderId: string;
  product: Product;
  productId: string;
}

// Interface for Order model
interface Order {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  userId: string;
  OrderItem: OrderItem[];
  transactionId?: string;
}
