import express from "express";
import { ProductManager } from './productManager.js'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

const port = 8080;

const productManager = new ProductManager(`C:/Users/user1/Desktop/entrega_tres/scr/productos.json`);


app.get('/', (req, res) => {
   res.send("server on")
})

app.get('/products', async (req, res) => { 
  try {
    const limit = req.query.limit;
    const products = await productManager.getProduct();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit, 10));
      return res.json(limitedProducts);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto agregado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const updatedFields = req.body;
    await productManager.updateProduct(pid, updatedFields);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando http://localhost:${port}`);
});
