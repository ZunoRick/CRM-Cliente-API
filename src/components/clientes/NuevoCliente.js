import React, { Fragment, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';

//importar el Context
import { CRMContext } from '../../context/CRMContext';

const NuevoCliente = () => {
    const navigate = useNavigate();

    //Utilizar valores del context
	const [auth, guardarAuth] = useContext(CRMContext);

    //Cliente = state, guardarCliente = función para guardar el state
	const [cliente, guardarCliente] = useState({
		nombre: '',
		apellido: '',
		empresa: '',
		email: '',
		telefono: '',
	});

    //Leer los datos del formulario
    const actualizarState = e =>{
        //almacenar lo que el usaurio escribe en el state
        guardarCliente({
            //Obtener una copia del state actual
            ...cliente,
            [e.target.name]: e.target.value
        });
    }

    //Añade en la REST API un cliente nuevo
    const agregarCliente = e =>{
        e.preventDefault();
        
        //enviar petición
        clienteAxios.post('/clientes', cliente)
            .then(res => {
                //Validar si hay errores de mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: res.data.mensaje
                    });
                }else{
                    Swal.fire(
                        'Se agregó cliente',
                        res.data.mensaje,
                        'success'
                    )
                }

                //Redireccionar
                navigate('/');
            });
    }

    //Validar formulario
    const validarCliente = () =>{
        const { nombre, apellido, email, empresa, telefono } = cliente;
        
        //Revisar que las propiedades del objeto tengan contenido
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;

        //return true o false
        return valido;
    }

    //Verificar si el usuario está autenticado
    if (!auth.auth && (localStorage.getItem('token') !== auth.token) ) {
        navigate('/iniciar-sesion');
    };

	return (
		<Fragment>
			<h2>Nuevo Cliente</h2>

			<form
                onSubmit={agregarCliente}
            >
				<legend>Llena todos los campos</legend>

				<div className="campo">
					<label>Nombre:</label>
					<input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState} />
				</div>

				<div className="campo">
					<label>Apellido:</label>
					<input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState}/>
				</div>

				<div className="campo">
					<label>Empresa:</label>
					<input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState}/>
				</div>

				<div className="campo">
					<label>Email:</label>
					<input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState}/>
				</div>

				<div className="campo">
					<label>Teléfono:</label>
					<input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState}/>
				</div>

				<div className="enviar">
					<input
						type="submit"
						className="btn btn-azul"
						value="Agregar Cliente"
                        disabled={validarCliente()}
					/>
				</div>
			</form>
		</Fragment>
	);
};

export default NuevoCliente;
