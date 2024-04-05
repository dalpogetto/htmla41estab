
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

  //--- Variavel 
  private emissorEvento$ = new Subject<any>();

  //--- Emissor 
  public EmitirParametros(valor: any) {
    this.emissorEvento$.next(valor);
  }

  //--- Observador

  public ObterParametros() {
    return this.emissorEvento$.asObservable();
  }

  //--------------------- INTERPRETADOR RESULTADO DE ERROS/WARNING
  public tratarErros(mensagem:any):string{
     if (mensagem.messages ==! undefined)
        return mensagem.message
      return '';
  }


//------------ Colunas Grid Saldo Terceiro
obterColunas(): Array<PoTableColumn> {
  return [
    { property: 'nomeEstab', label: "Estab" },
    { property: 'serieEntra', label: "Série Ent" },
    { property: 'serieSai', label: "Série Sai"},
    { property: 'nomeTranspEntra', label: "Desc Transp Ent" },
    { property: 'nomeTranspSai', label: "Desc Transp Sai" },
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

  //---------------------- COMBOBOX TECNICOS
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEmitentesDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterTecEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTec + ' ' + item.nomeAbrev, value: item.codTec  } }) }),
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
  public EliminarPorId(params?: any){
    return this.http.post(`${this._url}/EliminarPorId`, params, {headers:headersTotvs})
                .pipe(take(1));
  }
  

  //---------------------- GRID EXTRAKIT
  public ObterExtraKit(params?: any){
    return this.http.post(`${this._url}/ObterExtrakit`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Resumo
  public PrepararResumo(params?: any){
    return this.http.post(`${this._url}/PrepararCalculo`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

    //---------------------- Processar Entradas
    public ProcessarEntradas(params?: any){
      return this.http.post(`${this._url}/ProcessarEntradas`, params, {headers:headersTotvs})
                     .pipe(take(1));
    }

    //---------------------- Processar Entradas
    public ProcessarSaidasReparos(params?: any){
      return this.http.post(`${this._url}/ProcessarSaidasReparos`, params, {headers:headersTotvs})
                      .pipe(take(1));
    }
    

  //---------------------- Login
  public LoginAlmoxarifado(params?: any){
    return this.http.post(`${this._url}/LoginAlmoxa`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Variaveis Globais
  public ObterVariaveisGlobais(params?: any){
    return this.http.get(`${this._url}/ObterVariaveisGlobais`, {params, headers:headersTotvs})
                   .pipe(take(1));
  }

    //---------------------- Processo
    public ObterNrProcesso(params?: any){
      return this.http.get(`${this._url}/ObterNrProcesso`, {params, headers:headersTotvs})
                     .pipe(take(1));
    }
  

  //---------------------- Programas DDK
  public AbrirProgramaTotvs(params?: any){
    return this.http.get('/totvs-menu/rest/exec?program=pdp/pd1001.w&params=', {params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //---------------------- Login
  public ObterNotas(params?: any){
    return this.http.post(`${this._url}/ObterNotas`, params, {headers:headersTotvs})
                   .pipe(take(1));
  }


}
