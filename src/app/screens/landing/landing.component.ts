import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../partials/layout/navbar/navbar.component';
import { HeroComponent } from "../../screens/landing/components/hero/hero.component";
import { FeatureHighlightComponent } from "../../screens/landing/components/feature-highlight/feature-highlight.component";
import { FeaturesListComponent } from "../../screens/landing/components/features-list/features-list.component";
import { FooterComponent } from "../../partials/layout/footer/footer.component";

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, HeroComponent, FeatureHighlightComponent, FeaturesListComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {

}
