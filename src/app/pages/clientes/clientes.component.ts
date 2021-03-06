import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public role: string = localStorage.getItem('role');

  constructor( private usuarioService: UsuarioService,
              private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

      });
  }
  cambiarPagina( valor: number){
    this.desde += valor;
    if(this.desde < 0 ){
      this.desde = 0;
    }else if ( this.desde > this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }
  // Buscar clientes
  buscar (termino: string){
    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp; 
    }
    this.busquedasService.buscar ('usuarios', termino)
        .subscribe( (resp: Usuario[]) => {
          this.usuarios = resp;

        });
  }
  eliminarUsuario (usuario: Usuario){

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: '¿Borrar cliente?',
      text: `Esta a punto de borrar a  ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
        .subscribe(resp=> {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${ usuario.nombre } fue eliminado correctamente`,
            'success'
          
          
          );
        });
              
      }
    })
  }
  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario( usuario)
      .subscribe( resp => {
        console.log(resp);
      });
  }

}
