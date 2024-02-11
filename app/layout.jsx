import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css';
import Menu from '@/componentes/menu';
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  //obtener fecha actual
  const fecha = new Date();
  const cadena = `${fecha.getDate()} de ${fecha.toLocaleString('default', { month: 'long' })} del ${fecha.getFullYear()}, ${fecha.getHours()}:${fecha.getMinutes()}`;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Clima</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#85c1e9' }}>
        <div className='container-fluid'>
          <header>
            <Menu />
          </header>
          <section className='container'>
            <div className="row">
              <div className="col">
                <Image src="/public/clima.png" alt="Icono de clima" width={200} height={200} />
                <h5 style={{ color: 'blue' }}>Sistema para la predicción del clima</h5>
              </div>
              <div className="col">
                <Image src="/public/clima_pre.jpeg" alt="Imagen relacionada con el clima" width={500} height={300} />
                <h2>{cadena}</h2>
                <h4>Este sistema predice el clima a partir de los siguientes datos:</h4>
                <ul>
                  <li>Humedad</li>
                  <li>Presión</li>
                  <li>Temperatura</li>
                </ul>
              </div>
            </div>
            {children}
          </section>
        </div>
        <div>
          <footer className='py-10 flex justify-center items-center' style={{ color: 'blue' }}>
            <h6>Realizada por estudiantes de la UNL/Computación</h6>
          </footer>
        </div>
      </body>
    </html>
  )
}

