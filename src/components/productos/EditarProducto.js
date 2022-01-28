import React, { useState, useEffect, Fragment } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate, useParams  } from 'react-router-dom';
import Spinner from '../layout/Spinner';


function EditarProducto() {
    const navigate = useNavigate();

	//Obtener el id
	const params = useParams();
	const { id } = params;

    //producto = state, y función para actualizar
    const [ producto, guardarProducto ] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    //Archivo = state, guardarArchivo = setstate
    const [archivo, guardarArchivo] = useState('');

    //Cuando el componente carga
    useEffect(() =>{
        //consultar la api para traer el producto a editar
        async function consultarAPI(){
            const productoConsulta = await clienteAxios.get(`/productos/${id}`);
            guardarProducto(productoConsulta.data);
        }
        consultarAPI();
    }, [id]);

    //Edita un producto en la BD
    const editarProducto = async e =>{
        e.preventDefault();
        //Crear un form data
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        //almacenarlo en la BD
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            //Lanzar una alerta
            if (res.status === 200) {
                Swal.fire(
                    'Editado correctamente',
                    'El producto se actualizó correctamente',
                    'success'
                );
                //Redireccionar
                navigate('/productos');
            }
        } catch (error) {
            console.log(error);
            //Lanzar alerta
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Errro',
                text: 'Vuelva a intentarlo'
            });
        }
    }

    //leer los datos del formulario
    const leerInformacionProducto = e =>{
        guardarProducto({
            //Obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name]: e.target.value
        })
    }

    //Coloca la imagen en el state
    const leerArchivo = e =>{
        guardarArchivo( e.target.files[0] );
    }

    //extraer los valores del state
    const {nombre, precio, imagen} = producto;
    if(!nombre) return <Spinner />
    return ( 
        <Fragment>
            <h2>Editar Producto</h2>
            <form
                onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" min="0.00" 
                        step="0.01" 
                        placeholder="Precio" 
                        onChange={leerInformacionProducto}
                        defaultValue={precio}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${imagen}`} alt='imagen' width="300" />
                    ) : null }
                    <input 
                        type="file"  
                        name="imagen" 
                        onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Editar Producto" />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarProducto;