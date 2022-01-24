import React, { Fragment, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';

const EditarCliente = () => {
	const navigate = useNavigate();

	//Obtener el id
	const params = useParams();
	const { id } = params;

	//Cliente = state, guardarCliente = función para guardar el state
	const [cliente, datosCliente] = useState({
		nombre: '',
		apellido: '',
		empresa: '',
		email: '',
		telefono: '',
	});

	//useEffect, cuando el componente carga
	useEffect(() => {
		//Query a la API
		async function consultarAPI() {
			const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);
			//colocar en el state
			datosCliente(clienteConsulta.data);
		};
		consultarAPI();
	}, [id]);

	//Leer los datos del formulario
	const actualizarState = (e) => {
		//almacenar lo que el usaurio escribe en el state
		datosCliente({
			//Obtener una copia del state actual
			...cliente,
			[e.target.name]: e.target.value,
		});
	};

	//Envia una petición por axios para actualizar el cliente
	const actualizarCliente = (e) => {
		e.preventDefault();

		//Enviar petición por axios
		clienteAxios.put(`/clientes/${cliente._id}`, cliente).then((res) => {
			//Validar si hay errores de mongo
			if (res.data.code === 11000) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: res.data.mensaje,
				});
			} else {
				Swal.fire('Correcto', 'Cliente actualizado correctamente', 'success');
			}

			//Redireccionar
			navigate('/');
		});
	};

	//Validar formulario
	const validarCliente = () => {
		const { nombre, apellido, email, empresa, telefono } = cliente;

		//Revisar que las propiedades del objeto tengan contenido
		let valido =
			!nombre.length ||
			!apellido.length ||
			!email.length ||
			!empresa.length ||
			!telefono.length;

		//return true o false
		return valido;
	};

	return (
		<Fragment>
			<h2>Editar Cliente</h2>

			<form onSubmit={actualizarCliente}>
				<legend>Llena todos los campos</legend>

				<div className="campo">
					<label>Nombre:</label>
					<input
						type="text"
						placeholder="Nombre Cliente"
						name="nombre"
						onChange={actualizarState}
						value={cliente.nombre}
					/>
				</div>

				<div className="campo">
					<label>Apellido:</label>
					<input
						type="text"
						placeholder="Apellido Cliente"
						name="apellido"
						onChange={actualizarState}
						value={cliente.apellido}
					/>
				</div>

				<div className="campo">
					<label>Empresa:</label>
					<input
						type="text"
						placeholder="Empresa Cliente"
						name="empresa"
						onChange={actualizarState}
						value={cliente.empresa}
					/>
				</div>

				<div className="campo">
					<label>Email:</label>
					<input
						type="email"
						placeholder="Email Cliente"
						name="email"
						onChange={actualizarState}
						value={cliente.email}
					/>
				</div>

				<div className="campo">
					<label>Teléfono:</label>
					<input
						type="tel"
						placeholder="Teléfono Cliente"
						name="telefono"
						onChange={actualizarState}
						value={cliente.telefono}
					/>
				</div>

				<div className="enviar">
					<input
						type="submit"
						className="btn btn-azul"
						value="Guardar Cambios"
						disabled={validarCliente()}
					/>
				</div>
			</form>
		</Fragment>
	);
};

export default EditarCliente;
