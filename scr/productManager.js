import fs from 'fs';

 export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.productIdCounter = 1;
    this.readProducts();
  }


  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    const productAlreadyExit = this.products.find((p) => p.code === code);
    if (productAlreadyExit) {
      throw new Error("El código del producto ya está en uso");
    }

    const newProduct = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProducts();
  }

  getProduct() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    this.saveProducts();
  }

  deleteProduct(id) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts();
  }

  readProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }


  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  saveProductsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
      console.log("Datos de productos guardados en el archivo.");
    } catch (error) {
      console.error("Error al guardar los datos en el archivo:", error.message);
    }
  }
}

