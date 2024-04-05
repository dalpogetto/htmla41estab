
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
obterColunasExtraKit(): Array<PoTableColumn> {
  return [
    { property: 'tipo', label: 'Kit' },
    { property: 'nroDocto', label: "Docto" },
    { property: 'serieDocto', label: "Série" },
    { property: 'itCodigo', label: "Item"},
    { property: 'qtSaldo', label: 'Qtde', type: 'number', color:"color-10"},
    { property: 'qtRuim', label: 'QtRuim', type: 'number', color:"color-07", visible:true},
    { property: 'descItem', label: "Descrição", width: '300px'}

  ];
}

//------------ Coluna Grid Detalhe
obterColunasTodos(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara.', type: 'number'},
    { property: 'qtPagar', label: 'Entregar', type: 'number', width: '10%', color:"color-07", visible:true},
    { property: 'qtRenovar', label: 'Renovar', type: 'number', width: '10%', color:"color-10", visible:true},
    { property: 'qtExtrakit', label: 'ET', type: 'number', width: '10%', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasPagar(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtPagar', label: 'Entregar', type: 'number', color:"color-07", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasRenovar(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtRenovar', label: 'Renovar', type: 'number', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasExtrakit(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtExtrakit', label: 'ExtraKit', type: 'number', color:"color-10", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'codLocaliza', label: "Local"},
    { property: 'kit', label: "Kit"},
    { property: 'itPrincipal', label: "Principal"},
    { property: 'seqOrdem', label: "Ordem"},
  ];
}

obterColunasSemSaldo(): Array<PoTableColumn> {
  return [
    { property: 'itCodigo', label: "Item"},
    { property: 'descItem', label: "Descrição", width: '300px'},
    { property: 'qtMascara', label: 'Máscara', type: 'number'},
    { property: 'qtPagar', label: 'Não Atendida', type: 'number', color:"color-08", visible:true},
    { property: 'qtSaldo', label: 'Saldo', type: 'number'},
    { property: 'kit', label: "Kit"},
  ];
}

obterColunasEntradas(): Array<PoTableColumn> {
  return [
    { property: 'idi-sit', label: 'Sefaz', type: 'label',
    labels: [
      { value: 1,  color: 'color-08', label: 'NFe não autorizada' },
      { value: 2,  color: 'color-08', label: 'Em Processamento' },
      { value: 3,  color: 'color-10', label: 'Autorizada' },
      { value: 4,  color: 'color-07', label: 'Uso denegado' },
      { value: 5,  color: 'color-07', label: 'Docto Rejeitado' },
      { value: 6,  color: 'color-07', label: 'Docto Cancelado' },
      { value: 7,  color: 'color-07', label: 'Docto Inutilizado' },
      { value: 8,  color: 'color-08', label: 'Em processamento no Aplicativo de Transmissão' },
      { value: 9,  color: 'color-08', label: 'Em processamento na SEFAZ' },
      { value: 10, color: 'color-08', label: 'Em processamento no SCAN' },
      { value: 11, color: 'color-10', label: 'NF-e Gerada' },
      { value: 12, color: 'color-08', label: 'NF-e em Processo de Cancelamento' },
      { value: 13, color: 'color-08', label: 'NF-e em Processo de Inutilizacao' },
      { value: 14, color: 'color-08', label: 'NF-e Pendente de Retorno' },
      { value: 15, color: 'color-07', label: 'DPEC recebido pelo SCE' },
    ]},
    { property: 'cod-estabel', label:"Estab"},
    { property: 'cod-emitente', label:"Emitente"},
    { property: 'serie-docto', label:"Serie"},
    { property: 'nro-docto', label:"Docto"},
    { property: 'nat-operacao', label:"Nat.Oper"}
  ]
}

obterColunasEntradasEstoque(): Array<PoTableColumn> {
  return [
    { property: 'idi-sit', label: 'Estoque', type: 'label',
    labels: [
      { value: 0,  color: 'color-07', label: 'Não atualizada' },
      { value: 1,  color: 'color-10', label: 'Atualizada' },
    ]},
    { property: 'cod-estabel', label:"Estab"},
    { property: 'cod-emitente', label:"Emitente"},
    { property: 'serie-docto', label:"Serie"},
    { property: 'nro-docto', label:"Docto"},
    { property: 'nat-operacao', label:"Nat.Oper"}
  ]
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
