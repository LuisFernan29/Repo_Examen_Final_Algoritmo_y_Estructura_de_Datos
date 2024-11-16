"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
const readline_1 = __importDefault(require("readline"));
async function obtenerCantidadRegistros(ruta) {
    try {
        const respuesta = await fetch(`https://jsonplaceholder.typicode.com${ruta}`);
        if (!respuesta.ok)
            throw new Error(`Error al consultar ${ruta}: ${respuesta.statusText} (Código: ${respuesta.status})`);
        const datos = await respuesta.json();
        if (!Array.isArray(datos))
            throw new Error(`Datos en ${ruta} no son una lista. Tipo de dato: ${typeof datos}`);
        return datos.length;
    }
    catch (error) {
        console.error(`Error en obtenerCantidadRegistros para ${ruta}: ${error}`);
        return 0;
    }
}
async function obtenerPostYComentarios(idPost) {
    try {
        const respuestaPost = await fetch(`https://jsonplaceholder.typicode.com/posts/${idPost}`);
        if (!respuestaPost.ok)
            throw new Error(`Error al obtener post ${idPost}: ${respuestaPost.statusText} (Código: ${respuestaPost.status})`);
        const post = await respuestaPost.json();
        console.log(`Post ${idPost}:`, JSON.stringify(post, null, 2));
        const respuestaComentarios = await fetch(`https://jsonplaceholder.typicode.com/posts/${idPost}/comments`);
        if (!respuestaComentarios.ok)
            throw new Error(`Error al obtener comentarios del post ${idPost}: ${respuestaComentarios.statusText} (Código: ${respuestaComentarios.status})`);
        const comentarios = await respuestaComentarios.json();
        console.log(`Comentarios del post ${idPost}:`, JSON.stringify(comentarios, null, 2));
    }
    catch (error) {
        console.error(`Error en obtenerPostYComentarios para el post ${idPost}: ${error}`);
    }
}
async function obtenerPostsUsuario(idUsuario) {
    try {
        const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${idUsuario}/posts`);
        if (!respuesta.ok)
            throw new Error(`Error al obtener posts del usuario ${idUsuario}: ${respuesta.statusText} (Código: ${respuesta.status})`);
        const posts = await respuesta.json();
        console.log(`Posts del usuario ${idUsuario}:`, JSON.stringify(posts, null, 2));
    }
    catch (error) {
        console.error(`Error en obtenerPostsUsuario para el usuario ${idUsuario}: ${error}`);
    }
}
async function main() {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const preguntar = (texto) => new Promise(resolve => rl.question(texto, resolve));
    while (true) {
        console.log("\n-- Menú --");
        console.log("1. Obtener cantidad de registros en cada endpoint");
        console.log("2. Ver un post y sus comentarios");
        console.log("3. Ver los posts de un usuario");
        console.log("4. Salir");
        const eleccion = await preguntar("Seleccione una opción: ");
        switch (eleccion.trim()) {
            case '1':
                const endpoints = [
                    { ruta: '/posts', nombre: 'posts' },
                    { ruta: '/comments', nombre: 'comments' },
                    { ruta: '/albums', nombre: 'albums' },
                    { ruta: '/photos', nombre: 'photos' },
                    { ruta: '/todos', nombre: 'todos' },
                    { ruta: '/users', nombre: 'users' },
                ];
                for (let { ruta, nombre } of endpoints) {
                    const cantidad = await obtenerCantidadRegistros(ruta);
                    console.log(`Cantidad de ${nombre}: ${cantidad}`);
                }
                break;
            case '2':
                const idPost = await preguntar("Ingrese el ID del post: ");
                await obtenerPostYComentarios(parseInt(idPost.trim()));
                break;
            case '3':
                const idUsuario = await preguntar("Ingrese el ID del usuario: ");
                await obtenerPostsUsuario(parseInt(idUsuario.trim()));
                break;
            case '4':
                console.log("Saliendo del programa...");
                rl.close();
                return;
            default:
                console.log("Opción no válida. Intente de nuevo.");
        }
    }
}
main().catch(error => console.error('Error en main:', error));
