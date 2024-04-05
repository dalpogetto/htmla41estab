import { Component, OnInit, inject } from '@angular/core';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  srvTotvs = inject(TotvsService)

  ngOnInit(): void {
    //--- Informacoes iniciais tela
    this.srvTotvs.EmitirParametros({estabInfo:'', tecInfo:'', processoInfo:'', tituloTela: 'TELA PRINCIPAL'})
  }

  /*

  //FAS - pedido na tt-digita
  DEF NEW GLOBAL SHARED TEMP-TABLE tt-digita-2 
    FIELD nr-pedido  LIKE ped-venda.nr-pedido
    FIELD nome-abrev LIKE ped-venda.nome-abrev
    INDEX id IS PRIMARY UNIQUE nr-pedido.


   CREATE tt-digita-2.
   ASSIGN tt-digita-2.nr-pedido  = ped-venda.nr-pedido
          tt-digita-2.nome-abrev = ped-venda.nome-abrev.

          run esp/espd010.w -> rp.p 


  */
  onChamarESPD010() {
    
  }

  //Variavel ROWID Global
  //def new global shared var gr-ped-venda  as rowid
  //gr-ped-venda = 0x000000003f0f2186
  //run pdp/pd1001.r.
  onChamarPD1001() {
    let params={RowId: "0x000000003f0f2186"}
    this.srvTotvs.AbrirProgramaTotvs(params).subscribe({
      next: (response: any) => {
        console.log(response)
        
      }})
  
  }

  onObterVariaveisGlobais() {
    
    this.srvTotvs.ObterVariaveisGlobais().subscribe({
      next: (response: any) => {
        console.log(response)
        alert(response.UsuarioLogado)
      }})
    
  }

}
