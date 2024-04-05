import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { Subscription, delay, interval } from 'rxjs';
import { TotvsServiceMock } from 'src/app/services/totvs-service-mock.service';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  //---------- Acessar a DOM
  @ViewChild('cadModal', { static: true }) cadModal: PoModalComponent | undefined;

  //---Injection
  private srvTotvs = inject(TotvsService)
  private srvNotification = inject(PoNotificationService)

  //---Variaveis
  loadLogin:boolean=false
  loadTela: boolean = false
  codEstabel: string=''
  codTransEnt: string = ''
  codTransSai: string = ''
  codEntrega: string = ''
  serieEnt: string=''
  serieSai: string=''
  rpw:string=''


  //ListasCombo
  placeHolderEstabelecimento:string=''
  listaEstabelecimentos!: any[]
  listaTransp!:any[]
  


  //---Grids de Notas
  colunas!: PoTableColumn[]
  lista!: any[]
  sub!:Subscription;

  acaoLogin: PoModalAction = {
    action: () => {
      this.onSalvar();
    },
    label: 'Salvar'
  };

  ngOnInit(): void {
    //Colunas do grid
    this.colunas = this.srvTotvs.obterColunas()

    //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...'
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
          this.listaEstabelecimentos = (response as any[]).sort(this.ordenarCampos(['label']))
          this.placeHolderEstabelecimento = 'Selecione um estabelecimento'
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

    //--- Carregar combo transportadoras
    this.srvTotvs
      .ObterTransportadoras().subscribe({
        next:(response:any)=>{
          this.listaTransp = (response as any[]).sort(this.ordenarCampos(['label']))
        },
        error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    })

    

  }

  
  onSalvar(){
    this.cadModal?.close()

  }

  onLogarUsuario(){


    this.loadLogin=true
    //Parametros usuario e senha
    
    //Chamar servico de login
    this.srvTotvs.LoginAlmoxarifado().subscribe({
      next: (response: any) => {

          //if(response.senhaValida){
          if(true){

            //Parametros da Nota
            let paramsTela:any = {
              codEstabel: this.codEstabel, 
              serieEnt: this.serieEnt,
              serieSai: this.serieSai,
              codTranspEnt: this.codTransEnt,
              codTranspSai: this.codTransSai,
              codEntrega: this.codEntrega,
              rpw: this.rpw
            }
          
            //Fechar a tela de login
            this.cadModal?.close()

            //Chamar Método 
            this.srvTotvs.ObterNrProcesso(paramsTela).subscribe({
              next: (response: any) => {
                  

              },
              error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
            })
          }
          else{

               this.srvNotification.error("Erro na validação do usuário:"  + response.mensagem)
               this.loadTela = false
          }

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
