const args = process.argv.slice(2);
const comando = args[0];
const listaProductos = args[1] ?? '';
const [recurso, idDesdeRecurso] = listaProductos.split('/');
const tamañoArray = args.slice(2);
async function obtenerDatos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        
        const productos = data.map(producto => ({
            id: producto.id,
            nombre: producto.title.slice(0, 30) + "...", // Mostrar solo los primeros 30 caracteres del título
            precio: producto.price,
            categoria: producto.category
        }));
        console.log(productos);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}
async function crearProducto(producto) {
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        console.log('Producto creado exitosamente:', data);
        
    } catch (error) {
        console.error('No se pudo crear el producto:', error);
    }
}
async function eliminarProducto(productoId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

async function buscarProducto(productoId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productoId}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        console.log('Producto encontrado:', data);
    } catch (error) {
        console.error('Error al buscar producto:', error);
    }
}
async function principal() {
    if (recurso !== 'products') {
        console.log("Usa las palabras clave. Usa 'products' o 'products/<id>'");
        return;
    }

    
    switch (comando) {
        case 'GET': {
            const productoId = idDesdeRecurso || tamañoArray[0];
            if (productoId) {
                await buscarProducto(productoId);
            } else {
                await obtenerDatos();
            }
            break;
        }
        case 'POST':
            if (tamañoArray.length < 3) {
                console.log("Ingrese los parámetros necesarios para crear un producto: <title> <price> <category>");
                console.log("Ejemplo: npm run start POST products 'Producto de prueba' 19.99 'Categoría de prueba'");
                return;
            }
            {
                const producto = {
                    title: tamañoArray[0],
                    price: parseFloat(tamañoArray[1]),
                    category: tamañoArray[2]
                };
                await crearProducto(producto);
            }
            break;
        case 'DELETE': {
            const productoId = idDesdeRecurso || tamañoArray[0];
            if (!productoId) {
                console.log("Ingrese el ID del producto a eliminar: <id>");
                console.log("Ejemplo: npm run start DELETE products/1");
                return;
            }
            await eliminarProducto(productoId);
            break;
        }
        default:
            console.log("Acción no permitida. Usa GET, POST o DELETE");
    }
}

principal();