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
  @ViewChild('loginModal', { static: true }) loginModal: PoModalComponent | undefined;

  //---Injection
  private srvTotvs = inject(TotvsService)
  private srvNotification = inject(PoNotificationService)

  //---Variaveis
  codEstabel:string=''
  codUsuario:string=''
  nrProcess:number=0
  statusProcess:number=0
  tempoProcess:number=0
  senha:string=''
  loadLogin:boolean=false
  labelLoadTela:string = ''
  loadTela: boolean = false
  usuarioLogado: boolean=false
  loadTecnico: string = ''
  placeHolderEstabelecimento:string=''


  //ListasCombo
  listaEstabelecimentos!: any[]
  listaTecnicos!: any[]



  //---Grids de Notas
  colunasNFS!: PoTableColumn[]
  colunasNFE!: PoTableColumn[]
  listaNFS!: any[]
  listaNFE!: any[]
  sub!:Subscription;

  acaoLogin: PoModalAction = {
    action: () => {
      this.onLogarUsuario();
    },
    label: 'Selecionar'
  };

  ngOnInit(): void {

    //--- Informacoes iniciais tela
     this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'DASHBOARD NOTA FISCAL', dashboard: true})

     //--- Selecionar usuario para mostrar notas no dashboard
     this.loginModal?.open()

     //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...'
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
          this.listaEstabelecimentos = (response as any[]).sort(this.ordenarCampos(['label']))
          this.placeHolderEstabelecimento = 'Selecione um estabelecimento'
      },
      error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
    })

     //--- Obter colunas grid
     
   //  this.colunasNFS = this.srvTotvs.obterColunasNotas();

  }

  ngOnDestroy():void{
    this.sub.unsubscribe()
  }

  onRefresh(){

  }

  onLogarUsuario(){

    if(this.codEstabel === '' || this.codUsuario === ''){
      this.srvNotification.error("Seleção inválida, verifique !")
      return
    }

    this.loadLogin=true
    //Parametros usuario e senha
    let paramsLogin: any = { CodEstabel: this.codEstabel, CodUsuario: this.codUsuario, Senha: this.senha}
    //Chamar servico de login
    this.srvTotvs.LoginAlmoxarifado(paramsLogin).subscribe({
      next: (response: any) => {

          //if(response.senhaValida){
          if(true){

            //Parametros da Nota
            let paramsTec:any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario}
          
            //Fechar a tela de login
            this.loginModal?.close()

            //Setar usuario como logado
            this.usuarioLogado = true;

            //Chamar Método 
            this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
              next: (response: any) => {
                  this.nrProcess = response.nrProcesso
                  this.statusProcess = response.statusProcesso
                  this.tempoProcess = response.tempoProcesso

                  //Atualizar Informacoes Tela
                  this.srvTotvs.EmitirParametros({estabInfo:this.codEstabel, tecInfo:this.codUsuario, processoInfo:this.nrProcess})

                  //Colunas do grid
                  if (this.statusProcess === 1)
                    this.colunasNFE = this.srvTotvs.obterColunasEntradas()
                  else
                    this.colunasNFE = this.srvTotvs.obterColunasEntradasEstoque();  

                  //Chamar o programa de verificacao
                  this.verificarNotas()

                  //Setar o tempo para o relogio 
                  this.sub = interval(this.tempoProcess).subscribe(execucao=> this.verificarNotas())
              },
              error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
            })
          }
          else{

               this.srvNotification.error("Erro na validação do usuário:"  + response.mensagem)
               this.loadLogin = false
               this.loadTela = false
               this.usuarioLogado=false
          }

      },
      error: (e) => {
        this.srvNotification.error("Ocorreu um erro na requisição " )
        this.loadLogin = false
        this.loadTela = false
        this.usuarioLogado=false
      }
    })
  }


verificarNotas(){
    if (!this.usuarioLogado){
      this.loginModal?.open()
    }
    else{
      //TODO: Preciso saber qual status do processo
      //      Passo 1: Gerar NFE
      //      Passo 2: Reprocessar Notas no RE1005
      //      Passo 3: Reparos e Saídas

      if (this.statusProcess < 3){
        
        this.labelLoadTela = "Verificando notas..."
        this.loadTela = true
        let paramsNota:any = {CodEstab: this.codEstabel, CodTecnico: this.codUsuario, NrProcess: this.nrProcess}
        this.srvTotvs.ObterNotas(paramsNota).subscribe({
          next: (response: any) => {
              this.listaNFS = response.items
              console.log(this.statusProcess)

              //Se todas as notas ja foram atualizadas enviar as entradas para atualizar estoque
              if (this.statusProcess === 1){
                 if (this.listaNFS.filter(nota => nota["idi-sit"] !== 3).length > 0) {
                 }
                 else{
                    //Processar Notas no re1005 pela segunda vez
                    this.srvTotvs.ProcessarEntradas(paramsNota).subscribe({
                        next: (response:any) => {},
                        error: (e) => {}

                    })
                 }
              }

              //Se as notas de entrada estiverem atualizadas no of gerar as saídas e os reparos
              if (this.statusProcess === 2){
                if (this.listaNFS.filter(nota => nota["idi-sit"] !== 1).length > 0) {
                } 
                else {
                  //Processar as notas de saida e reparos
                }
              }


              this.loadTela = false
          },
          error: (e) => { this.srvNotification.error("Ocorreu um erro na requisição"); return}
        })
      }
    }
  }

  public onEstabChange(obj: string) {
    if (obj === undefined) return

    //Popular o Combo do Emitente
    this.listaTecnicos = []
    this.codUsuario= ''
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`

    //Chamar servico
    this.srvTotvs
      .ObterEmitentesDoEstabelecimento(obj)
      .subscribe({
        next: (response:any) => {
            delay(200)
            this.listaTecnicos = response
            this.loadTecnico = 'Selecione o técnico'
        },
        error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
      });
  }

  //------ funcao para ordenar
  //Utilize o - (menos) para indicar ordenacao descendente
  ordenarCampos = (fields: any[]) => (a: { [x: string]: number; }, b: { [x: string]: number; }) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p, n) => p ? p : n, 0);
}
