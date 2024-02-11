"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { estaSesion } from '@/hooks/SessionUtil';
import { inicio_sesion } from '@/hooks/Autenticacion';
import mensajes from '@/componentes/Mensajes';
import { useRouter } from 'next/navigation';



export default function Login() {
    sessionStorage.clear();
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
                router.push("/principal");
            }
        })
    }

    return (
        <div className="container mx-auto">
            <div className="container px-4 py-4 px-md-4 text-center text-lg-start my-4">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <img 
                            src="https://img.freepik.com/vector-gratis/diseno-fondo-libreria_1300-47.jpg?w=740&t=st=1704505888~exp=1704506488~hmac=2a592674a4962557cca369603f21234ca703f44d54462074a087229cfe2f7dfa" 
                            alt="Censo"
                            className="img-fluid"
                            style={{ maxWidth: '100%', height: 'center' }}
                        />
                    </div>

                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                            <img src="https://siaaf.unl.edu.ec/static/img/logo.png" width={280} alt="logo" />
                                <form onSubmit={handleSubmit(sendData)}>
                                    <div className="form-outline mb-4">
                                        <input {...register('correo')} name="correo" id="correo" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} />
                                        <label className="form-label" style={{ color: 'grey' }}>Identificacion</label>
                                        <div className='alert alert-danger invalid-feedback'>{errors.correo?.message}</div>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            {...register('clave')}
                                            type="password"  // Agrega esta línea para cambiar el tipo a password
                                            name="clave"
                                            id="clave"
                                            className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                                        />
                                        <label className="form-label" style={{ color: 'grey' }} >Clave</label>
                                        <div className='alert alert-danger invalid-feedback'>{errors.clave?.message}</div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block mb-4">
                                        Acceder
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
