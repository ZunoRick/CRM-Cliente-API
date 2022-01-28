import React, { Fragment, useContext } from 'react';

//Routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Layaout
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';

/* * Componentes */
import Clientes from './components/clientes/Clientes';
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';

import Productos from './components/productos/Productos';
import EditarProducto from './components/productos/EditarProducto';
import NuevoProducto from './components/productos/NuevoProducto';

import Pedidos from './components/pedidos/Pedidos';
import NuevoPedido from './components/pedidos/NuevoPedido';

import Login from './components/auth/Login';

import { CRMContext, CRMProvider } from './context/CRMContext';

function App() {
	//Utilizar context en el componente
	const [auth, guardarAuth] = useContext(CRMContext);
	console.log(process.env.REACT_APP_BACKEND_URL);
	return (
		<BrowserRouter>
			<Fragment>
				<CRMProvider value={[auth, guardarAuth]}>
					<Header />
					<div className="grid contenedor contenido-principal">
						<Navegacion />

						<main className="caja-contenido col-9">
							<Routes>
								<Route path="/" element={<Clientes />} />
								<Route path="/clientes/nuevo" element={<NuevoCliente />} />
								<Route path="/clientes/editar/:id" element={<EditarCliente />} />

								<Route path="/productos" element={<Productos />} />
								<Route path="/productos/editar/:id" element={<EditarProducto />} />
								<Route path="/productos/nuevo" element={<NuevoProducto />} />

								<Route path="/pedidos" element={<Pedidos />} />
								<Route path="/pedidos/nuevo/:id" element={<NuevoPedido />} />

								<Route path="/iniciar-sesion" element={<Login />} />
							</Routes>
						</main>
					</div>
				</CRMProvider>
			</Fragment>
		</BrowserRouter>
	);
}

export default App;
