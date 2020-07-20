class usuarioPersona{
    constructor(pNombre,pApellido,pCorreo,pCiudad,pPais,pFoto,pContraseña){
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.correo = pCorreo;
        this.ciudad = pCiudad;
        this.pais = pPais;
        this.foto = pFoto;
        this.contraseña = pContraseña;
        this.denuncia = 0;
        this.activo = true;
        this.tipo = true; // true es igual a Persona, false es Admin
        this.contactos = new Array();
        this.solicitudAmistad = new Array();
        //this.amigosSugeridos = new Array();
    }
} 
//usuarioPersona
// agregarusuario(pNombre,pApellido,pCiudad,pPais,pFoto,pContraseña,listaUsuarios[pos],listaUsuarios[]);
class usuarioAdm{
    constructor(pNombre,pContraseña,pCorreo){
        this.nombre = pNombre;
        this.contraseña = pContraseña;
        this.correo = pCorreo;
        this.tipo = false; // true es igual a Persona, false es Admin
        this.activo = true;  
        this._10mas = new Array();      
    }
}
class publicacion{
    constructor(ptitulo,ptexto,pImagen,pPublica,pUsuario,){
        this.titulo = ptitulo;
        this.texto = ptexto;
        this.imagen = pImagen;
        this.publica = pPublica;
        this.activa = true;
        this.posicion = 0;
        this.aprobacion = 0;
        this.aprobadaPor = new Array();        
        this.denunciadaPor = new Array();
        this.usuarioAutor = pUsuario;
    }
}