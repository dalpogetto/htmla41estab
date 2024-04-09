
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PoTableColumn } from '@po-ui/ng-components';

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)    

@Injectable({
  providedIn: 'root'
})

export class TotvsService {
  private reg!:any;
  _url = environment.totvs_url;

  constructor(private http: HttpClient ) { }

  //--------------------- INTERPRETADOR RESULTADO DE ERROS/WARNING
  public tratarErros(mensagem:any):string{
     if (mensagem.messages ==! undefined)
        return mensagem.message
      return '';
  }


//------------ Colunas Grid Saldo Terceiro
obterColunas(): Array<PoTableColumn> {
  return [
    { property: 'nomeEstabel', label: "Estab" },
    { property: 'serieEntra', label: "Série Ent" },
    { property: 'serieSai', label: "Série Sai"},
    { property: 'nomeTranspEnt', label: "Transporte Ent" },
    { property: 'nomeTranspSai', label: "Transporte Sai" },
    { property: 'codEntrega', label: "Entrega" },
    { property: 'rpw', label: "RPW" },

  ];
}

  //---------------------- COMBOBOX ESTABELECIMENTOS
  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return this.http.get<any>(`${this._url}/ObterEstab`, {params: params, headers:headersTotvs})
                 .pipe(
                  //tap(data => {console.log("Retorno API TOTVS => ", data)}),
                  map(item => { return item.items.map((item:any) =>  { return { label:item.codEstab + ' ' + item.nome, value: item.codEstab, codFilial: item.codFilial } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //---------------------- COMBOBOX TRANSPORTES
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterTransportadoras(){
    return this.http.get<any>(`${this._url}/ObterTransp`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTransp + ' ' + item.nomeAbrev, value: item.codTransp  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  //---------------------- COMBOBOX ENTREGA
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEntrega(param:any){
    return this.http.get<any>(`${this._url}/ObterEntrega?codTecnico=${param.codTecnico}&codEstabel=${param.codEstabel}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return {
                                  nrProcesso: item.nrProcesso,
                                  listaEntrega: item.listaEntrega.map((x:any) =>  { return {
                                         label: x.codEntrega,
                                         value: x.codEntrega,
                                         cidade: x.nomeAbrev
                                  }})}}),
                  take(1))
  }

  //---------------------- Eliminar por id
  public Salvar(params?: any){
    return this.http.post(`${this._url}/SalvarCalcEstab`, params, {headers:headersTotvs})
                .pipe(take(1));
  }
  

  //---------------------- GRID EXTRAKIT
  public Obter(params?: any){
    return this.http.get(`${this._url}/ObterCalcEstab`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }



}
