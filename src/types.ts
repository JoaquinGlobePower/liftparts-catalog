export interface Product {
  sku: string;
  descripcion: string;
  partNumberFabricante: string;
  codigoGlobe: string;
  subNombres: string;
  equipo: string;
  marca: string;
  imagen: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  exiting?: boolean;
}
