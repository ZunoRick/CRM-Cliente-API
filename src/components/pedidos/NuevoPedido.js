import React, { useState, useEffect, Fragment } from 'react';
import clienteAxios from '../../config/axios';
import { useNavigate, useParams } from 'react-router-dom';

import FormBuscarProducto from './FormBuscarProductos';
import FormCantidadProducto from './FormCantidadProducto';

import Swal from 'sweetalert2';

function NuevoPedido() {
	const navigate = useNavigate();

    //Obtener el id de Cliente
	const params = useParams();
	const { id } = params;

    //state
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() =>{
        //Obtener el cliente
        const consultarAPI = async () =>{
            //consultar el cliente actual
            const resultado = await clienteAxios.get(`/clientes/${id}`);
            guardarCliente(resultado.data);
        }

        //llamar a la API
        consultarAPI();

        //Actualizarl el total a pagar
        actualizarTotal();
    }, [productos, id]);

    const buscarProducto = async e =>{
        e.preventDefault();

        //Obtener los productos de la búsqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        
        //Si no hay resultados una alerta, contrario agregarlo al state
        if (resultadoBusqueda.data[0]) {
            let pedidoResultado = resultadoBusqueda.data[0];
            //Agregar la llave "producto"(copia de id)
            pedidoResultado.producto = resultadoBusqueda.data[0]._id;
            pedidoResultado.cantidad = 0;

            //ponerlo en el state
            guardarProductos([...productos, pedidoResultado]);
        } else{
            //No hay resultados
            Swal.fire({
                icon: 'error',
                title: 'Sin Resultados',
                text: 'No hay resultados, intente con otra búsqueda',
            });
        }
    }

    //Almacenar una búsqueda en el state
    const leerDatosBusqueda = e =>{
        guardarBusqueda(e.target.value);
    }

    //Actualizar la cantidad de productos
    const restarProductos = i =>{
        //copiar el arreglo original de productos
        const todosProductos = [...productos];

        //Validar si está en 0 no puede ir más allá
        if (todosProductos[i].cantidad === 0) return;

        //decremento
        todosProductos[i].cantidad--;

        //almacenarlo en el state
        guardarProductos(todosProductos);
    }

    const aumentarProductos = i =>{
        //copiar el arreglo original de productos
        const todosProductos = [...productos];

        //incremento
        todosProductos[i].cantidad++;
        //almacenarlo en el state
        guardarProductos(todosProductos);
    }

    //Eliminar un producto del state
    const eliminarProductoPedido = id =>{
        const todosProductos = productos.filter(producto => producto.producto !== id);
        guardarProductos(todosProductos);
    }

    //Actualizar el total a pagar
    const actualizarTotal = () =>{
        //Si el arreglo de productos es igual a 0: el total es 0
        if (productos.length === 0) {
            guardarTotal(0);
            return;
        }

        //Calcular el nuevo total
        let nuevoTotal = 0;

        //recorrer todos los productos, sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        //almacenar el total
        guardarTotal(nuevoTotal);
    }

    //Almacena el pedido en la BD
    const realizarPedido = async e =>{
        e.preventDefault();

        //Construir el objeto
        const pedido = {
            "cliente": id,
            "pedido": productos,
            "total": total
        }

        //almacenarlo en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        //leer resultado
        if (resultado.status === 200) {
            //alerta de todo bien
            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje,
            });
        }else{
            //alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a intentarlo',
            });
        }
        //Redireccionar
		navigate('/pedidos');
    }
    
    const {nombre, apellido, telefono} = cliente;
    return ( 
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {nombre} {apellido}</p>
                <p>Teléfono: {telefono}</p>
            </div>

            <FormBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                {productos.map((producto, index) => (
                    <FormCantidadProducto 
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}
                    />
                ))}
            </ul>
            
            <p className='total'>Total a pagar: <span>${total}</span></p>

            { total > 0 ? (
                <form
                    onSubmit={realizarPedido}
                >
                    <input type="submit" value="Realizar Pedido" className='btn btn-verde btn-block' />
                </form>
            ) : null}
        </Fragment>
    );
}

export default NuevoPedido;