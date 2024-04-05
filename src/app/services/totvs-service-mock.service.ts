import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, take, tap } from 'rxjs';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PoTableColumn } from '@po-ui/ng-components';


@Injectable({
  providedIn: 'root'
})

export class TotvsServiceMock {

  private emissorEvento$ = new Subject<any>();

  EmitirParametros(valor: any) {
    this.emissorEvento$.next(valor);
  }


  public ObterParametros() {
    return this.emissorEvento$.asObservable();
  }

  constructor( ) { }

//------------ Colunas Grid Saldo Terceiro
obterColunasExtraKit(): Array<PoTableColumn> {
  return [
    { property: 'tipo', label: 'Kit' },
    { property: 'nroDocto', label: "Docto" },
    { property: 'serieDocto', label: "Série" },
    { property: 'itCodigo', label: "Item"},
    { property: 'qtSaldo', label: 'Qtde', type: 'number', color:"color-10"},
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

obterColunasNFE(): Array<PoTableColumn>{
  return [
    { property: 'statusEnvio', label: 'Status', type: 'label',
          labels: [
            { value: 1, color: 'color-08', label: 'Aguardando SEFAZ' },
            { value: 9, color: 'color-07', label: 'Nota Cancelada' },
            { value: 3, color: 'color-10', label: 'Nota Atualizada' }

          ]
      },
      { property: 'id', label:"PedidoID"},
      { property: 'datainc', label: 'Data', type: 'date' },
      { property: 'estabel', label: 'Estab' },
      { property: 'tecnico', label: 'Técnico' },
      { property: 'chavePedido', label: 'ChavePedido' },
      { property: 'chaveNFS', label: 'ChaveNFS' }

  ]
}

obterColunasNFS(): Array<PoTableColumn>{
  return [
    { property: 'statusEnvio', label: 'Status', type: 'label',
          labels: [
            { value: 1, color: 'color-08', label: 'Aguardando SEFAZ' },
            { value: 9, color: 'color-07', label: 'Nota Cancelada' },
            { value: 3, color: 'color-10', label: 'Nota Atualizada' }

          ]
      },
      { property: 'id', label:"PedidoID"},
      { property: 'datainc', label: 'Data', type: 'date' },
      { property: 'estabel', label: 'Estab' },
      { property: 'tecnico', label: 'Técnico' },
      { property: 'chavePedido', label: 'ChavePedido' },
      { property: 'chaveNFS', label: 'ChaveNFS' }

  ]
}

obterNFS(){
  return of([
    {
      "id": "199",
      "estabel": "101",
      "datainc": "2022-11-01T00:00:00-00:00",
      "status": 9,
      "tecnico": 1230,
      "chavePedido": "10.516.000",
      "chaveNFS": "101-1-2450009999",
      "retornoAPI": "IdPedido:209",
      "statusEnvio": 1},
      {
        "id": "199",
        "estabel": "101",
        "datainc": "2022-11-01T00:00:00-00:00",
        "status": 9,
        "tecnico": 1230,
        "chavePedido": "10.516.000",
        "chaveNFS": "101-1-2450009999",
        "retornoAPI": "IdPedido:209",
        "statusEnvio": 9},
        {
          "id": "199",
          "estabel": "101",
          "datainc": "2022-11-01T00:00:00-00:00",
          "status": 9,
          "tecnico": 1230,
          "chavePedido": "10.516.000",
          "chaveNFS": "101-1-2450009999",
          "retornoAPI": "IdPedido:209",
          "statusEnvio": 3}
  ])
}


  //---------------------- COMBOBOX ESTABELECIMENTOS
  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return of ([
      {label: '131-CAMPINAS', value: '131', codFilial: '08'},
      {label: '101-SAO PAULO', value: '101', codFilial: '01'}
    ])
  }

  //---------------------- COMBOBOX TECNICOS
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEmitentesDoEstabelecimento(id:string){
    return of ([
      {label: '1435-PAULO ROBERTO', value: '1435'},
      {label: '2747-RAUL GIL', value: '2747'}
    ])
  }

  //---------------------- COMBOBOX TRANSPORTES
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterTransportadoras(){
    return of ([
      {label: '2-RODOMEU', value: '2'},
      {label: '1-PROPRIO', value: '1'},
      {label: '1222-PROPRIO', value: '3'},
      {label: '1333-PROPRIO', value: '4'},
    ])
  }

  //---------------------- COMBOBOX ENTREGA
  /*Retorno transformado no formato {label: xxx, value: yyyy}*/
  public ObterEntrega(id:string){
    return of ({nrProcesso:'100200300', listaEntrega:[
                                        {label: '2-RUA DO PAI, PIRACICABA', value: '2'},
                                        {label: '1-Padrão', value: 'Padrão'}
    ]})
  }


  //---------------------- GRID EXTRAKIT
  public ObterExtraKit(params?: any){
    return of (
       {items:[
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},
        {tipo: 'estab1', nroDocto: '101', serieDocto:'a', itCodigo:'codigo item', qtSaldo:1, descItem:'desc item'},


      ]
       })
  }

  //---------------------- Resumo
  public PrepararResumo(params?: any){
    return of (
      { items:
          [ {cGUID: 'a1', itCodigo: 'A0102', descItem: 'GitHub - po-ui/po-angular: Biblioteca de componentes Angular.', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a2', itCodigo: 'A0103', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:1, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a3', itCodigo: 'A0104', descItem: 'descricao item A', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a4', itCodigo: 'A0105', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:2, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a5', itCodigo: 'A0106', descItem: 'descricao item A', qtMascara:1, qtPagar:2, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a6', itCodigo: 'A0000', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:3, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a7', itCodigo: 'A0002', descItem: 'descricao item A', qtMascara:1, qtPagar:4, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a1', itCodigo: 'A0102', descItem: 'descricao item A', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a2', itCodigo: 'A0103', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:1, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a3', itCodigo: 'A0104', descItem: 'descricao item A', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a4', itCodigo: 'A0105', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:2, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a5', itCodigo: 'A0106', descItem: 'descricao item A', qtMascara:1, qtPagar:2, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a6', itCodigo: 'A0000', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:3, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a1', itCodigo: 'A0102', descItem: 'descricao item A', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a2', itCodigo: 'A0103', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:1, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a3', itCodigo: 'A0104', descItem: 'descricao item A', qtMascara:1, qtPagar:1, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a4', itCodigo: 'A0105', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:2, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},
            {cGUID: 'a5', itCodigo: 'A0106', descItem: 'descricao item A', qtMascara:1, qtPagar:2, qtRenovar:0, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:true},
            {cGUID: 'a6', itCodigo: 'A0000', descItem: 'descricao item B', qtMascara:1, qtPagar:0, qtRenovar:3, qtExtrakit:0, qtSaldo:1, codLocaliza:'localA', kit:'101-TODOS-123', itPrincipal:'item principal', seqOrdem:1, temPagto:false},


          ],
        semsaldo:[]
      }

    )}

  //---------------------- Login
  public LoginAlmoxarifado(params?: any){
    return of ({senhaValida: true, mensagem: 'erro de login'})
  }
}


