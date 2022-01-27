import React, { Fragment, useContext, useEffect, useState } from 'react';

//importar cliente axios
import clienteAxios from '../../config/axios';
import Cliente from './Cliente';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../layout/Spinner';

//importar el Context
import { CRMContext } from '../../context/CRMContext';

function Clientes() {
	const navigate = useNavigate();

	//Trabajar con el state
	//clientes = state,  guardarClientes = función para guardar el state
	const [clientes, guardarClientes] = useState([]);

	//Utilizar valores del context
	const [auth, guardarAuth] = useContext(CRMContext);

    //useEffect es similar a componentdidmount y willmount
	useEffect(() => {
		if (auth.token !== '') {
			//Query a la API
			const consultarAPI = async () => {
				try {
					const clientesConsulta = await clienteAxios.get('/clientes', {
						headers:{
							Authorization: `Bearer ${auth.token}`
						}
					});
	
					//colocar el resultado en el state
					guardarClientes(clientesConsulta.data);
				} catch (error) {
					//Error con authorization
					if (error.response.status === 500) {
						navigate('/iniciar-sesion')
					}
				}
			};
			consultarAPI();
		} else{
			navigate('/iniciar-sesion');
		}		
	}, [clientes, auth.token, navigate]);

	//Si el state está como false
	if (!auth.auth) {
		navigate('/iniciar-sesion');
	}

	if (!clientes.length) {
        return <Spinner />
    }

	return (
		<Fragment>
			<h2>Clientes</h2>

			<Link to={'/clientes/nuevo'} className="btn btn-verde nvo-cliente">
				<i className="fas fa-plus-circle"></i>
				Nuevo Cliente
			</Link>

			<ul className="listado-clientes">
				{clientes.map((cliente) => (
					<Cliente key={cliente._id} cliente={cliente} />
				))}
			</ul>
		</Fragment>
	);
}

export default Clientes;
