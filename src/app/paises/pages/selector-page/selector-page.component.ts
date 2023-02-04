import { PaisLg } from './../../interface/paislg';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Pais } from '../../interface/pais';

import { PaisesService } from './../../service/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones : string[] = [];
  paises   : Pais[]   = [];
  pais     : string   = '';
  // fronteras: string [] | undefined  = [];
  fronteras: Pais[] = [];

  cargando: boolean = false;

  constructor(
    private fb           : FormBuilder,
    private paisesService: PaisesService
  ) { }
  
  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    // cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      })
    // cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.cargando = true;
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
        } ),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap( pais => this.paisesService.getPaisesPorCodigos( pais || []) )
      )
      .subscribe(paises => {
        // this.fronteras = pais? pais[0]?.borders:[];
        if (paises.length > 0) {
          this.fronteras = paises;
          this.cargando = false;
        }
        else{
          this.fronteras=[];
          this.cargando=false;
        }
      } )
  }

  guardar() {console.log(this.miFormulario.value);
  }

}
