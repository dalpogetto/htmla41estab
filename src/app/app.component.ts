import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  PoMenuItem,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { TotvsService } from './services/totvs-service.service';
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private srvTotvs = inject(TotvsService);
  private srvNotification = inject(PoNotificationService);
  private formBuilder = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);

  //---------- Acessar a DOM
  @ViewChild('cadModal', { static: true }) cadModal:
    | PoModalComponent
    | undefined;

   //Formulario
   public form = this.formBuilder.group({
    codEstabel: ['', Validators.required],
    codTranspEntra: [1, Validators.required],
    codTranspSai: [1, Validators.required],
    codEntrega: ['Padrão', Validators.required],
    serieEntra: ['', [Validators.required, Validators.minLength(2)]],
    serieSai: ['', Validators.required],
    rpw: ['', Validators.required],
    nomeTranspEnt: [''],
    nomeTranspSai: [''],
    nomeEstabel: [''],
    
    
  });

  //---Variaveis
  loadTela: boolean = false;

  //ListasCombo
  listaEstabelecimentos!: any[];
  listaTransp!: any[];

  //---Grid
  colunas!: PoTableColumn[];
  lista!: any[];
  sub!: Subscription;

  //--- Actions
  readonly opcoes: PoTableAction[] = [{
      label: '',
      icon: 'po-icon po-icon po-icon-edit',
      action: this.onEditar.bind(this),
    }];

  
  readonly acaoSalvar: PoModalAction = {
    label: 'Salvar',
    action: () => { this.onSalvar() }
  }

  readonly acaoCancelar: PoModalAction = {
    label: 'Cancelar',
    action: () => { this.cadModal?.close() }
  }

  //---Inicializar
  ngOnInit(): void {
    //Colunas do grid
    this.colunas = this.srvTotvs.obterColunas()

    //Listar no grid
    this.listar()

    //Carregar combo de estabelecimentos
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        this.listaEstabelecimentos = (response as any[]).sort(
          this.srvTotvs.ordenarCampos(['label']))
      },
      error: (e) => {
        this.srvNotification.error('Ocorreu um erro na requisição')
        return
      },
    });

    //Carregar combo transportadoras
    this.srvTotvs.ObterTransportadoras().subscribe({
      next: (response: any) => {
        this.listaTransp = (response as any[]).sort(
          this.srvTotvs.ordenarCampos(['label'])
        )
      },
      error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    })
    //Aplicar changes na tela
    this.cdRef.detectChanges()
  }

  //---Listar registros grid
  listar() {
    this.loadTela = true;

    this.srvTotvs.Obter().subscribe({
      next: (response: any) => {
        this.lista = response.items
        this.loadTela = false
      },
      error: (e) => this.srvNotification.error('Ocorreu um erro na requisição'),
    });
  }

  //---Novo registro
  onNovo() {
    this.form.reset()
    
    this.onEditar(null)
  }

  //---Editar registro
  onEditar(obj: any | null) {
    
    this.cadModal?.open();

    //hashtag amamos Progress 4gl
    if ((obj !== null) && (obj['$showAction'] !== undefined))
       delete obj['$showAction']

    if (obj !== null) {
      this.form.setValue(obj)
    }
  }

  //---Salvar registro
  onSalvar() {
    if (!this.form.valid) {
      this.srvNotification.error('Preencha todos os campos');
      return
    }

    //Dados da tela
    let paramsTela: any = { paramsTela: this.form.value }
    this.cadModal?.close();

    //Chamar o servico
    this.srvTotvs.Salvar(paramsTela).subscribe({
      next: (response: any) => {
        this.listar();
      },
      error: (e) => {
        this.srvNotification.error('Ocorreu um erro na requisição ')
      },
    })
  }

 
}
