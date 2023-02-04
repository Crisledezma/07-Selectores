
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais } from '../interface/pais';
import { PaisLg } from '../interface/paislg';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = [  'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ]

  get regiones(): string[] {
    return [...this._regiones];
  }

  private urlBase: string = 'https://restcountries.com/v3.1'

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(pRegion: string): Observable<Pais[]> {
    const url: string = `${this.urlBase}/region/${pRegion}?fields=cca3,translations`
    return this.http.get<Pais[]>(url)
  }

  getPaisPorCodigo(pCodigo: string): Observable<PaisLg[]|null> {
    if ( !pCodigo ) { return of(null) }
    console.log(pCodigo);
    const url: string = `${this.urlBase}/alpha/${pCodigo}`;
    return this.http.get<PaisLg[]>(url)
  }

  getPaisPorCodigoSmall(pCodigo: string): Observable<Pais> {
    const url: string = `${this.urlBase}/alpha/${pCodigo}?fields=cca3,name`;
    return this.http.get<Pais>(url)
  }

  getPaisesPorCodigos(pFronteras: PaisLg[]):Observable<Pais[]> {
    if (!pFronteras[0]?.borders) { return of([]) }
    const peticiones: Observable<Pais>[] = [];
    pFronteras[0]?.borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })
    
    return combineLatest( peticiones )

  }

}
