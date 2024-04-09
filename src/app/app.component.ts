import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { TotvsServiceMock } from './services/totvs-service-mock.service';
import { Subscription } from 'rxjs';
import { TotvsService } from './services/totvs-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

private srvTotvs = inject(TotvsService)


  //--------- Opcoes de Menu
 readonly menus: Array<PoMenuItem> = [
  // { label: 'Tela Principal', icon:'po-icon-home', link:'/'},
  { label: 'Cálculo Auto Atendimento', icon: 'po-icon-calculator', link:'/'},
  { label: 'Dashboard Notas Fiscais', icon: 'po-icon-device-desktop', link:'/dashboard'},
  { label: 'Finalizar Processo', icon: 'po-icon-edit', link:'/reparos'}
];

//------ Label de menu principal
tecnicoInfo!: string
estabInfo!: string
processoInfo!: string
tituloTela!:string
dashboard:boolean=false


constructor(private cdRef : ChangeDetectorRef){

}

ngOnInit(): void {
}



}
