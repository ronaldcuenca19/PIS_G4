'use client'

import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Menu from '@/componentes/menu';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/hooks/SessionUtilClient";
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  //obtener fecha actual
  const fecha = new Date();
  const cadena = `${fecha.getDate()} de ${fecha.toLocaleString('default', { month: 'long' })} del ${fecha.getFullYear()}, ${fecha.getHours()}:${fecha.getMinutes()}`;
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // Obtener el token desde sessionStorage
  
    // Lista de rutas que no requieren token
    const publicRoutes = ["/principal"]; // Reemplaza con las rutas que no requieren token
  
    // Obtener la ruta actual
    const currentRoute = window.location.pathname;
  
    // Verificar si la ruta actual está en la lista de rutas públicas
    const isPublicRoute = publicRoutes.includes(currentRoute);
  
    // Verificar si no hay token y no estamos en una ruta pública
    if (!token && !isPublicRoute) {
      // Si no hay token y no estamos en una ruta pública,
      // redirigir al usuario a la página de inicio de sesión
      router.push('/InicioSesion');
    } 
  }, [router.asPath]); // Agrega router.asPath como dependencia de useEffect

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Clima</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#d6eaf8' }}>
        <div className='container-fluid'>
          <header style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 1030 }}>
            <Menu />
          </header>
          <section className='container pt-5 mt-5'>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'50px', marginLeft:'-1100px', marginBottom:'30px'}}>
    <h2>{cadena}</h2>
</div>
            {children}
          </section>
        </div>
        <div>
          <footer className='py-10 d-flex justify-content-center align-items-center' style={{ color: '#205375' , marginTop: '10px'}}>
            <h6>Realizada por estudiantes de la UNL/Computación</h6>
          </footer>
        </div>
      </body>
    </html>
  )
}
