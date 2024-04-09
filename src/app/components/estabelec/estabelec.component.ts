import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Subscription, delay, interval } from 'rxjs';
import { TotvsServiceMock } from 'src/app/services/totvs-service-mock.service';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-estabelec',
  templateUrl: './estabelec.component.html',
  styleUrls: ['./estabelec.component.css']
})
export class EstabelecComponent {

  //---------- Acessar a DOM
  @ViewChild('cadModal', { static: true }) cadModal: PoModalComponent | undefined;

  //---Injection
  private srvTotvs = inject(TotvsService)
  private srvNotification = inject(PoNotificationService)

  //---Variaveis
  loadTela: boolean = false
  codEstabel: string=''
  codTranspEnt: string = ''
  codTranspSai: string = ''
  codEntrega: string = ''
  serieEnt: string=''
  serieSai: string=''
  rpw:string=''

  //ListasCombo
  listaEstabelecimentos!: any[]
  listaTransp!:any[]
  
  //---Grids de Notas
  colunas!: PoTableColumn[]
  lista!: any[]
  sub!:Subscription;


  //--------- Opcoes Page Dinamic (ExtraKit - Resumo)
readonly opcoes: PoTableAction[] = [
  {label: '', icon: 'po-icon po-icon po-icon-edit', action: this.onEditar.bind(this)}
];


  acaoLogin: PoModalAction = {
    action: () => {
      this.onSalvar();
    },
    label: 'Salvar'
  };

  ngOnInit(): void {
    //Colunas do grid
    this.colunas = this.srvTotvs.obterColunas()

    //Lista
    this.listar()

    //--- Carregar combo de estabelecimentos
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
          this.listaEstabelecimentos = (response as any[]).sort(this.ordenarCampos(['label']))
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

    //--- Carregar combo transportadoras
    this.srvTotvs.ObterTransportadoras().subscribe({
        next:(response:any)=>{
          this.listaTransp = (response as any[]).sort(this.ordenarCampos(['label']))
        },
        error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    })
  }

  listar(){

    //--- Carregar combo transportadoras
    this.srvTotvs
      .Obter().subscribe({
        next:(response:any)=>{
          this.lista = response.items
        },
        error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    })

  }

  onEditar(obj:any){
    this.codEstabel = obj.codEstabel, 
    this.serieEnt = obj.serieEntra,
    this.serieSai = obj.serieSai,
    this.codTranspEnt = obj.codTranspEntra,
    this.codTranspSai = obj.codTranspSai,
    this.codEntrega = obj.codEntrega,
    this.rpw = obj.rpw

    this.cadModal?.open();
  }

  onSalvar(){

    //Parametros da Nota
    let paramsTela:any = { paramsTela:{
      codEstabel: this.codEstabel, 
      serieEntra: this.serieEnt,
      serieSai: this.serieSai,
      codTranspEntra: this.codTranspEnt,
      codTranspSai: this.codTranspSai,
      codEntrega: this.codEntrega,
      rpw: this.rpw
    }}
    
    //Salvar
    this.srvTotvs.Salvar(paramsTela).subscribe({
      next: (response: any) => {

          //if(response.senhaValida){
          if(true){
            //Fechar a tela de login
            this.cadModal?.close()
          }
          else{

               this.srvNotification.error("Erro na validação do usuário:"  + response.mensagem)
               this.loadTela = false
          }
          this.listar()
      },
      error: (e) => {
        this.srvNotification.error("Ocorreu um erro na requisição " )
        this.loadTela = false
      }
    })
  }

  //Utilize o - (menos) para indicar ordenacao descendente
  ordenarCampos = (fields: any[]) => (a: { [x: string]: number; }, b: { [x: string]: number; }) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p, n) => p ? p : n, 0);
}
