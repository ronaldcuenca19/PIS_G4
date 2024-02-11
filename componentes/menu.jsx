import Link from "next/link";
export default function Menu() {

    return (
        <nav className="navbar navbar-expand-lg" style={{
            backgroundColor: '#85c1e9', // Fondo color verde agua
            color: "blue", // Color del texto en azul
        }}>
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link href="/" className="nav-link active" aria-current="page">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/inicio_sesion" className="nav-link active" aria-current="page">Iniciar Sesión</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}