import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//importar cliente axios
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';
import Producto from './Producto';

//importar el Context
import { CRMContext } from '../../context/CRMContext';

function Productos() {
	const navigate = useNavigate();

    //Productos = state, guardarProductos = función para guardar el state
    const [productos, guardarProductos] = useState([]);

    //Utilizar valores del context
	const [auth, guardarAuth] = useContext(CRMContext);

    //useEffect para consultar la API cuando cargue
    useEffect(() => {
        if (auth.token !== '') {
            //Query a la API
            const consultarAPI = async () =>{
                try {
                    const productosConsulta = await clienteAxios.get('/productos', {
                        headers:{
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    guardarProductos(productosConsulta.data);
                } catch (error) {
                    //Error con authorization
					if (error.response.status === 500) {
						navigate('/iniciar-sesion')
					}
                }
            }
            //Llamando a la API
            consultarAPI();
        } else{
			navigate('/iniciar-sesion');
		}	
    }, [productos, auth.token, navigate]);

    //Si el state está como false
	if (!auth.auth) {
		navigate('/iniciar-sesion');
	}

    //Spinner de carga
    if (!productos.length) {
        return <Spinner />
    }

    return ( 
        <Fragment>
            <h2>Productos</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map( producto => (
                    <Producto 
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>
        </Fragment>
    );
}

export default Productos;