"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { estaSesion } from '@/hooks/SessionUtil';
import { inicio_sesion } from '@/hooks/Autenticacion';
import mensajes from '@/componentes/Mensajes';
import { useRouter } from 'next/navigation';
import MenuInicio from '@/componentes/menuInicio';


export default function Login() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("rol")
    sessionStorage.removeItem("external")
    sessionStorage.removeItem("user")
    //router
    const router = useRouter();
    //validaciones
    const validationShema = Yup.object().shape({
        correo: Yup.string().required('Ingrese el correo electronico'),
        clave: Yup.string().required('ingrese su clave')
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const sendData = (data) => {
        //console.log(data);
        var data = { "correo": data.correo, "clave": data.clave};
        //console.log("esto es el external:  ",data.external)


        inicio_sesion(data).then((info) => {
            if (!estaSesion()) {

                mensajes("Error en inicio de sesion", "Datos incorrectos", "error")
            } else {
                //console.log(info);
                mensajes("Has Ingresado al Sistema", "Bienvenido Usuario", "success")
                console.log(info.data);
                router.push("/principal");
                window.location.reload();
            }
        })
    }

    return (
<div className="row justify-content-center">
    <header style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 1030 }}>
    </header>
    <div className="container mx-auto">
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 style={{ color: '#205375' }}>Inicio Sesion</h1>
                    </div>
        <div className="container px-4 py-4 px-md-4 text-center text-lg-start my-4">
            <div className="row gx-lg-5 align-items-center mb- justify-content-start" style={{ marginLeft: '-300px' }}>
                <div className="col-lg-12 mb-5 mb-lg-0 position-relative">
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <div className="d-flex justify-content-between" style={{ marginLeft:'80px'}}>
                        <div className="card bg-glass mx-auto" style={{border: '8px solid rgba(27, 79, 114, 0.5)', height: '680px'}}>
                            <div className="card-body px-10 py-10 px-md-5">
                                <Image src="/icono.png" width={160} height={160} alt="logo" />
                                <form onSubmit={handleSubmit(sendData)}>
                                    <div className="form-outline mb-4"style={{ marginTop:'20px'}}>
                                        <input {...register('correo')} name="correo" id="correo" className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                                            placeholder='Ingresar correo'
                                            style={{ fontSize: '40px' }}
                                        />
                                        <label className="form-label" style={{ color: '#205375', fontSize: '30px' }}>Usuario</label>
                                        <div className='alert alert-danger invalid-feedback'>{errors.correo?.message}</div>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            {...register('clave')}
                                            type="password"
                                            name="clave"
                                            id="clave"
                                            className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                                            placeholder='Ingresar clave'
                                            style={{ fontSize: '40px' }}
                                        />
                                        <label className="form-label" style={{ color: '#205375', fontSize: '30px' }} >Clave</label>
                                        <div className='alert alert-danger invalid-feedback'>{errors.clave?.message}</div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block mb-4" style={{ background: '#1b4f72',  fontSize: '30px' }}>
                                        INICIAR SESIÓN
                                    </button>
                                </form>
                            </div>
                        </div>
                        <MenuInicio />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    );
}
