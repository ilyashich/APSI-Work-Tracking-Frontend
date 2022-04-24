import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule,
         NbOAuth2AuthStrategy,
         NbOAuth2GrantType,
         NbAuthOAuth2Token,
         NbOAuth2ClientAuthMethod } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule.forRoot({
      strategies: [
        NbOAuth2AuthStrategy.setup({
          name: 'windows_shop',
          baseEndpoint: 'https://www.fenster-henstedt.de/oauth/',
          clientId: 'my-trusted-client',
          clientSecret: 'secret',
          clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC,
          token: {
            grantType: NbOAuth2GrantType.PASSWORD,
            class: NbAuthOAuth2Token,
            requireValidToken: true,
          },
        }),
      ],
      forms: {},
    }),
  ],
  declarations: [
    LoginComponent,
  ],
})
export class NgxAuthModule {
}
