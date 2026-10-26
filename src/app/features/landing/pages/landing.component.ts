import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeroComponent } from '../components/hero/hero.component';
import { FeatureHighlightComponent } from "../components/feature-highlight/feature-highlight.component";
import { FeaturesListComponent } from "../components/features-list/features-list.component";
import { FooterComponent } from "../components/footer/footer.component";
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, FeatureHighlightComponent, FeaturesListComponent, FooterComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.setLandingContext(true);
  }

  ngOnDestroy(): void {
    this.themeService.setLandingContext(false);
  }
}
