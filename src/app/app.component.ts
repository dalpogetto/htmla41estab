import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { PoMenuItem, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { TotvsService } from './services/totvs-service.service';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

private srvTotvs = inject(TotvsService)
private srvNotification = inject(PoNotificationService)
private formBuilder = inject(FormBuilder)
private cdRef = inject(ChangeDetectorRef)


  //---------- Acessar a DOM
  @ViewChild('cadModal', { static: true }) cadModal: PoModalComponent | undefined;

  //form
  form!:UntypedFormGroup

  //---Variaveis
  loadTela: boolean = false
  
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
    action: () => { this.onSalvar()},
    label: 'Salvar'
  };

  constructor(){

      
  }

  ngOnInit(): void {
    //Colunas do grid
    this.colunas = this.srvTotvs.obterColunas()

    //form
    this.form = this.formBuilder.group({
      codEstabel: ['', Validators.required],
      codTranspEntra: [1, Validators.required],
      codTranspSai: [1, Validators.required],
      codEntrega: ['Padrão', Validators.required],
      serieEntra: ['', [Validators.required, Validators.minLength(2)]],
      serieSai: ['', Validators.required],
      rpw:['', Validators.required],
      nomeTranspEnt:[''],
      nomeTranspSai:[''],
      nomeEstabel:[''] })

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
    this.cdRef.detectChanges()
  }

  listar(){
    this.loadTela=true

    this.srvTotvs
      .Obter().subscribe({
        next:(response:any)=>{
          this.lista = response.items
          this.loadTela=false
        },
        error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    })

  }

  onNovo(){
    this.form.reset()
    this.onEditar(null)
  }

  onEditar(obj:any){

    if(obj !== null){
      this.form.setValue(obj)
    }
    this.cadModal?.open();
  }

  onSalvar(){
    if (!this.form.valid){
      
      this.srvNotification.error("Preencha todos os campos")
      return
    }

    let paramsTela:any = { paramsTela: this.form.value }
    this.cadModal?.close()
    
    //Salvar
    this.srvTotvs.Salvar(paramsTela).subscribe({
      next: (response: any) => {
          this.listar()
      },
      error: (e) => {
        this.srvNotification.error("Ocorreu um erro na requisição " )
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
