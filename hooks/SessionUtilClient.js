"use client";

export const getUser = () => {
    return window.sessionStorage.getItem("user");
}

export const getCuenta = () => {
    return window.sessionStorage.getItem("external");
}

export const getRol = () => {
    return window.sessionStorage.getItem("rol");
}

export const getToken = () => {
    return window.sessionStorage.getItem("token");
}

export const borrarSesion = () => {
    window.sessionStorage.clear();
}

export const estaSesion = () => {
    var token = window.sessionStorage.getItem("token");
    return (token && (token !== 'undefined' && token !== null && token !== 'null'));

};
