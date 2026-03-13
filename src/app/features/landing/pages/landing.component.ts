import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeroComponent } from '../components/hero/hero.component'
import { FeatureHighlightComponent } from "../components/feature-highlight/feature-highlight.component";
import { FeaturesListComponent } from "../components/features-list/features-list.component";
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, HeroComponent, FeatureHighlightComponent, FeaturesListComponent, FooterComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {

}
