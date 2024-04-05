import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PoMenuItem, PoModalAction, PoModalComponent, PoPageAction, PoRadioGroupOption, PoStepperComponent, PoTableAction, PoTableColumn, PoTableComponent, PoNotificationService, PoDialogService, PoNotification } from '@po-ui/ng-components';
import { TotvsService } from '../../services/totvs-service.service';
import { catchError, delay, elementAt } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../services/excel-service.service';
import { TotvsServiceMock } from '../../services/totvs-service-mock.service';


@Component({
  selector: 'app-calculo',
  templateUrl: './calculo.component.html',
  styleUrls: ['./calculo.component.css']
})
export class CalculoComponent {

//---------- Acessar a DOM
@ViewChild('gridDetalhe', { static: true }) gridDetalhe: PoTableComponent | undefined;
@ViewChild('gridExtrakit', { static: true }) gridExtraKit: PoTableComponent | undefined;
@ViewChild('detailsModal', { static: true }) detailsModal: PoModalComponent | undefined;
@ViewChild('loginModal', { static: true }) loginModal: PoModalComponent | undefined;
@ViewChild('stepper', { static: true }) stepper: PoStepperComponent | undefined;

//-------- Labels Stepper
lblStepProximo: string = 'Avançar';
lblStepAnterior: string = 'Voltar';
lblStepExecutar: string = 'Montar Resumo';

//------- Listas
listaEstabelecimentos!: any[]
listaTecnicos!: any[]
listaTransp!: any[]
listaEntrega!: any[]
listaExtraKit!: any[]
listaResumo!: any[]
listaSemSaldo!: any[]

//-------- Colunas Grid
colunasKit!: Array<PoTableColumn>

//--------- Variaveis Combobox
codEstabelecimento: string=''
codTecnico: string=''
codTransEnt: string = ''
codTransSai: string = ''
codEntrega: string = ''
estabNota: any='131'
serieNota: any='12'
placeHolderEstabelecimento!: string

//-------- Variaveis RadioGroud
tipoCalculo: any;

//------ Login
codUsuario:string=''
senha:string=''
usuarioLogado: boolean=false;
usuarioTecnico: any;

//----- Loadings
loadTela:boolean=false
loadLogin:boolean=false
labelLoadTela:string = ''
loadTecnico: string = ''
labelContadores:string[]=['0','0','0','0','0', '0']

//------ Label de menu principal
tecnicoInfo: string = ""
estabInfo: string = ""
processoInfo: string = ""
colAux: number=0

//------ Informacoes Dialog Grids (Resumo)
colunasDetalhe: Array<PoTableColumn> = []
tituloDetalhe!: string
itemsDetalhe!: any[]
itemsResumo!: any[]

//------ Controle Tela
mostrarDetalhe:boolean=false

acaoLogin: PoModalAction = {
  action: () => {
    this.onLogarUsuario();
  },
  label: 'Login'
};


//--------- Opcoes de Menu
 readonly menus: Array<PoMenuItem> = [
  { label: 'Cálculo Auto Atendimento', icon: 'po-icon-calculator', link:'/'},
  { label: 'Dashboard Notas Fiscais', icon: 'po-icon-device-desktop', link:'/dashboard'}
];

//--------- Opcoes Page Dinamic (ExtraKit - Resumo)
readonly opcoesGridExtraKit: PoTableAction[] = [
  {label: '', icon: 'po-icon po-icon po-icon-delete', action: this.onDeletarRegistroExtraKit.bind(this)}
];

//--------- Opcoes Page Dinamic (ExtraKit - Resumo)
opcoesGridPagto: Array<any> = [
  {label: '', icon: 'po-icon po-icon po-icon-delete', action: this.onDeletarRegistroPagto.bind(this)}
];

//--------- Opcoes de Calculo (Resumo)
readonly options: Array<PoRadioGroupOption> = [
  { label: 'Renovação Total', value: '1' },
  { label: 'Renovação Parcial', value: '2' },
  { label: 'Devolução ExtraKit', value: '3' }
];

readonly acaoLogar: PoModalAction = {
  action: () => { this.onLogarUsuario()}, label: 'Login' };

  readonly acaoDetalhe: PoPageAction = {
    action: () => { this.mostrarDetalhe=false}, label: 'Fechar'}



//------------------------------------------------------------------------------------- Constructor
  constructor(){}

  //----------------------------------------------------------------------------------- Injecao de Dependencia
 
  private srvTotvs = inject(TotvsService)
  private srvExcel = inject(ExcelService)
  private srvNotification = inject (PoNotificationService)
  private srvDialog = inject(PoDialogService)

  //----------------------------------------------------------------------------------- Inicializar
  ngOnInit(): void {

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'PARÂMETROS DE CÁLCULO', dashboard: false})



    //--- Tempo padrao notificacao
    this.srvNotification.setDefaultDuration(3000)

    //--- Parametros iniciais da tela
    this.loadTela = false
    this.tipoCalculo = '1'
    this.colunasKit = this.srvTotvs.obterColunasExtraKit()

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

  //-------------------------------------------------------- Metodos

    //------- Stepper
    canActiveNextStep(passo: any) {

      //---------------- Consistir Passo 1
      if ((passo.label === "Técnico") && ((this.codEstabelecimento === '') || (this.codTecnico === ''))){

        this.srvNotification.error('Estabelecimento e Ténico não foram preenchidos corretamente');
        return false;
      }


      //------------- Passo 1 - OK (Atualizar informacoes de tela)
      if ((passo.label === "Técnico") && (this.codEstabelecimento !== '') && (this.codTecnico !== '')){

         //Atualizar informações do Técnico e Estabelecimento
         let estab = this.listaEstabelecimentos.find(o => o.value === this.codEstabelecimento)
         let tec = this.listaTecnicos.find(o => o.value === this.codTecnico)
         this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: tec.label, processoInfo: this.processoInfo})

         //Setar valores padrao
         this.codTransEnt = "1"
         this.codTransSai = "1"

      }


      //---------------Passo - ExtraKit - Carregar lista extrakit
      if (passo.label === "Dados NF") {

        this.gerarListaExtrakit()
        
      }

      //---------------Passo - Resumo
      if ((passo.label === "ExtraKit") && (!this.usuarioLogado)){
        this.codUsuario=''
        this.senha=''
        this.loginModal?.open()
        return false
      }
      return true;
    }

  //--------------- onChange do RadioGroud Tipo de Calculo
  onTipoCalculo(event: any) {
    if (this.listaResumo.length > 0){
       if (event === "1" )
          this.itemsResumo = this.listaResumo
        else if (event === "2")
           this.itemsResumo = this.listaResumo.filter(o => o.temPagto || o.qtExtrakit > 0)
             else
               this.itemsResumo = this.listaResumo.filter(o => o.qtExtrakit > 0)

    }
    this.AtualizarLabelsContadores()
  }

  //------------------------------------------------ Label Contadores Resumo
  private AtualizarLabelsContadores(){

      //Geral
      this.labelContadores[0] = this.itemsResumo.length.toString()
      //Pagamento
      this.labelContadores[1] = this.itemsResumo.filter(o => o.qtPagar > 0).length.toString()
      //Renovacoes
      this.labelContadores[2] = this.itemsResumo.filter(o => o.qtRenovar > 0).length.toString()
      //Somente Entrada
      this.labelContadores[3] = this.itemsResumo.filter(o => o.soEntrada).length.toString()
      //Extrakit
      this.labelContadores[4] = this.itemsResumo.filter(o => o.qtExtrakit > 0).length.toString()
      //Sem saldo
      this.labelContadores[5] = this.listaSemSaldo.length.toString()
  }

  //-------------------------------------------------- Login
  public onLogarUsuario() {
    this.loadLogin=true
    //Parametros usuario e senha
    let paramsLogin: any = { CodEstabel: this.codEstabelecimento, CodUsuario: this.codUsuario, Senha: this.senha}
    //Chamar servico de login
    this.srvTotvs.LoginAlmoxarifado(paramsLogin).subscribe({
      next: (response: any) => {
           if(response.senhaValida){

              //Montar Resumo
              this.labelLoadTela = "Preparando Resumo"
              this.loadTela = true

              //Fechar a tela de login
              this.loginModal?.close()

              //Parametros para calculo
              let paramsE: any = { CodEstab: this.codEstabelecimento, CodTecnico: this.codTecnico, NrProcess: this.processoInfo, Extrakit: this.listaExtraKit }
              this.srvTotvs.PrepararResumo(paramsE).subscribe({
                next: (response:any) => {

                    if (response !== null){
                      //Obter as listas da requisicao
                      this.listaResumo = response.items
                      this.listaSemSaldo = response.semsaldo
                      //Setar Tela para Renovacao Total
                      this.onTipoCalculo("1")
                      //Atualizar Contadores Resumo
                      this.AtualizarLabelsContadores()
                      //Setar que usuario foi logado
                      this.usuarioLogado=true
                      //Ir para o proximo passo - Resumo
                      this.stepper?.next()
                    }
                    else
                    {
                      this.srvNotification.warning("Não existem dados para cálculo do técnico ")
                    }

                },
                error: (e) => {
                    this.srvNotification.error("Ocorreu um erro na requisição " )
                    this.usuarioLogado = false;
                },
                complete: () => {
                      this.loadTela = false
                      this.loadLogin = false
                      this.usuarioLogado = false;
                }
              });
           }
           else
           {
               this.srvNotification.error("Erro na validação do usuário:"  + response.mensagem)
               this.loadLogin = false;
               this.loadTela = false
           }
      },
      error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
      complete: () => { this.loadLogin=false ; this.usuarioLogado = false}
    })
  }

  //--------------------------------------------------------------- Obter Extrakit
  gerarListaExtrakit(){
        this.labelLoadTela = "Obtendo ExtraKit"
        this.loadTela = true
        //Parametros estabelecimento e tecnico
        let paramsE: any = { CodEstab: this.codEstabelecimento, CodTecnico: this.codTecnico, NrProcess: this.processoInfo }
        //Chamar servico
        this.srvTotvs.ObterExtraKit(paramsE).subscribe({
        next:(response:any) => {
            this.listaExtraKit = response.items
        },
        error: (e) => {
              this.srvNotification.error("Ocorreu um erro na requisição " )
              return false
        },
        complete: () => { this.loadTela = false }
        });

  }

  //------------------------------------------------------------ Change Estabelecimentos - Popular técnicos
  public onEstabChange(obj: string) {
    if (obj === undefined) return

    //Popular o Combo do Emitente
    this.listaTecnicos = []
    this.listaExtraKit = []
    this.codTecnico= ''
    this.listaTecnicos.length = 0;
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`


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

  //------------------------------------------------------------- Change Tecnicos - Popular Endereco Entrega
  public onTecnicoChange(obj:string){
    if (obj === undefined) return
    //Parametros estabelecimento e tecnico
    let params: any = { codEstabel: this.codEstabelecimento, codTecnico: this.codTecnico }
    //Popular combos entrega
    this.srvTotvs
      .ObterEntrega(params).subscribe({
        next:(response:any)=>{

          this.listaExtraKit = []
          this.processoInfo = response.nrProcesso
          this.srvTotvs.EmitirParametros({processoInfo: this.processoInfo})
          this.listaEntrega = (response.listaEntrega as any[]).sort(this.ordenarCampos(['label']));
          this.codEntrega = "Padrão"

        },
        error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
    })
  }

  //------ funcao para ordenar
  //Utilize o - (menos) para indicar ordenacao descendente
  ordenarCampos = (fields: any[]) => (a: { [x: string]: number; }, b: { [x: string]: number; }) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p, n) => p ? p : n, 0);

  //--------------------------------------------------------------- Chamar Modal Detalhe Resumo
  onOpenModal(type: any) {
    switch (type) {
      case 'VisaoGeral':
          this.itemsDetalhe = this.itemsResumo.sort(this.ordenarCampos(['-qtPagar','itCodigo']))
          this.tituloDetalhe = `Visão Geral: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasTodos()
          //this.mostrarDetalhe = true
          this.opcoesGridPagto = []
          this.detailsModal?.open();
        break;

        case 'Pagamentos':
          this.itemsDetalhe = this.itemsResumo.filter(o => o.qtPagar > 0).sort(this.ordenarCampos(['-qtPagar','itCodigo']))
          this.tituloDetalhe = `Pagamentos: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasPagar()
          //this.mostrarDetalhe = true
          this.opcoesGridPagto = [{label: '', icon: 'po-icon po-icon po-icon-delete', action: this.onDeletarRegistroPagto.bind(this)} ]
          this.detailsModal?.open();
        break;

        case 'Renovacao':
          this.itemsDetalhe = this.itemsResumo.filter(o => o.qtRenovar > 0).sort(this.ordenarCampos(['-qtRenovar','itCodigo']))
          this.tituloDetalhe = `Renovações: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasRenovar();
          //this.mostrarDetalhe=true
          this.detailsModal?.open();
          this.opcoesGridPagto = []
        break;

        case 'SomenteEntrada':
          this.itemsDetalhe = this.itemsResumo.filter(o => o.soEntrada).sort(this.ordenarCampos(['-qtPagar','itCodigo']))
          this.tituloDetalhe = `Somente Entrada: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasPagar();
          //this.mostrarDetalhe=true
          this.detailsModal?.open();
          this.opcoesGridPagto = []
        break;

        case 'ExtraKit':
          this.itemsDetalhe = this.itemsResumo.filter(o => o.qtExtrakit > 0).sort(this.ordenarCampos(['-qtExtrakit','itCodigo']))
          this.tituloDetalhe = `ExtraKit: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasExtrakit();
          //this.mostrarDetalhe=true
          this.detailsModal?.open();
          this.opcoesGridPagto = []
        break;

        case 'SemSaldo':
          this.itemsDetalhe = this.listaSemSaldo.sort(this.ordenarCampos(['-qtPagar','itCodigo']))
          this.tituloDetalhe = `Sem Saldo: ${this.itemsDetalhe.length} registros`
          this.colunasDetalhe = this.srvTotvs.obterColunasSemSaldo()
          //this.mostrarDetalhe=true
          this.detailsModal?.open();
          this.opcoesGridPagto = []
        break;

    }
  }

  //---------------------------------------------------------------- Eliminar registro grid extrakit
  public onDeletarRegistroExtraKit(obj:any){

    this.srvDialog.confirm({
      title: 'ELIMINAR REGISTRO',
      message: 'Deseja eliminar registro ?',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {
        //Encontrar o indice da linha a ser excluida
        let index = this.listaExtraKit.findIndex(o=>o.rRowId === obj.rRowId)
        this.listaExtraKit.splice(index, 1);

        //Atualizar a lista para refresh de tela
        this.listaExtraKit = [...this.listaExtraKit]
        this.srvNotification.success("Registro eliminados com sucesso !")
      },
      cancel:  () => { }
    })


  }

  //---------------------------------------------------------------- Eliminar todos os registros extrakit
  public onExcluirTodosExtraKit(){
    if ((this.gridExtraKit?.getSelectedRows() as any[]).length < 1){
      this.srvNotification.error("Nenhum registro selecionado !")
      return
    }
    this.srvDialog.confirm({
      title: 'ELIMINAR EXTRAKIT',
      message: 'Deseja eliminar os registros selecionados ? \n Atenção: Registros com quantidade ruim não podem ser eliminados !',
      literals: {"cancel": "Não", "confirm": "Sim"},
      confirm: () => {

        let registrosSelecionados = this.gridExtraKit?.getSelectedRows().filter(item => item.qtRuim === 0)
        
        registrosSelecionados?.forEach((item,index) => {
          this.gridExtraKit?.removeItem(item)
        })
        this.gridExtraKit?.unselectRows()

        this.listaExtraKit = this.gridExtraKit?.items as any[]

        this.srvNotification.success("Registros eliminados com sucesso !")
      },
      cancel:  () => { }
    })

  }

    //-------------------------------------------------------------- Eliminar registro grid extrakit
    public onDeletarRegistroPagto(obj:any){

      /* Partucularidade nao contemplada aqui
      itens com dependencia precisam ser eliminados conjuntamente
      ItemA pagto  4
      itemB renova 2

      */

      this.srvDialog.confirm({
        title: 'ELIMINAR REGISTRO',
        message: 'Deseja eliminar registro ?',
        literals: {"cancel": "Não", "confirm": "Sim"},
        confirm: () => {
          //Encontrar o indice da linha a ser excluida
          let index = this.itemsDetalhe.findIndex(o => o.id === obj.id) //era o.cRowId
          let id = this.itemsDetalhe.find(o => o.id === obj.id)
          this.itemsDetalhe.splice(index, 1);

          let index2 = this.itemsResumo.findIndex(o => o.id === obj.id)
          this.itemsResumo.splice(index2, 1)

          //Atualizar a lista para refresh de tela
          this.itemsDetalhe = [...this.itemsDetalhe]

          //Atualiar label de tela
          this.tituloDetalhe = `Pagamentos: ${this.itemsDetalhe.length} registros`

          //Atualizar contadores tela de resumos
          this.AtualizarLabelsContadores();

          //Apagar na base
          this.srvTotvs.EliminarPorId(id).subscribe({
            next: (response: any) => {}
          })

          this.srvNotification.success("Registro eliminados com sucesso !")
        },
        cancel:  () => { }
      })


    }

    //---------------------------------------------------------------- Exportar lista detalhe para excel
    public onExportarExcel(){
      let titulo = this.tituloDetalhe.split(':')[0]
      let subTitulo = this.tituloDetalhe.split(':')[1]
      this.labelLoadTela = 'Gerando Planilha'
      this.loadTela = true

      this.srvExcel.exportarParaExcel('RESUMO DE ' + titulo.toUpperCase(),
                                      subTitulo.toUpperCase(),
                                      this.colunasDetalhe,
                                      this.itemsDetalhe,
                                      'Resumo',
                                      'Plan1')
    }

  //------------------------------------------------------------------- Botao Aprovar (Resumo calculo)
  public onAprovarCalculo(){
    this.srvDialog.confirm({
      title: 'EXECUÇÃO CÁLCULO',
      message: 'Confirma execução do cálculo? Serão geradas as entradas e saídas',

      confirm: () => {
        this.labelLoadTela = "Gerando execução RPW..."
        this.loadTela = true
        setTimeout(() =>
        { this.loadTela = false
          this.srvNotification.success('Execução do cálculo realizada com sucesso ! Processo RPW: 1010202000')
          this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:''})
          this.stepper?.first()
        }, 3000)
      },
      cancel: () => this.srvNotification.error("Cancelada pelo usuário")
    })}

}
