import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ComponentsModule } from "@what3words/angular-components";
import { load } from "@what3words/javascript-loader";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ComponentsModule],
  template: `
    <h2>{{ title }}</h2>
    <form method="POST" (submit)="onSubmit($event)">
      <div class="form-container">
        <label htmlFor="w3w-as-input">what3words address (optional):</label>
        <what3words-autosuggest ngModel #autosuggest>
          <input
            type="text"
            placeholder="Search for your business"
            autosuggest="off"
            autocomplete="off"
          />
        </what3words-autosuggest>
      </div>
      <button type="submit" data-testid="submit">Complete</button>
    </form>
    <router-outlet />
  `,
  styles: [
    `
      form {
        padding: 20px 0;
      }

      .form-container {
        text-align: justify;
        margin: 10px;
      }

      button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        color: white;
        cursor: pointer;
        transition: border-color 0.25s;
        background-color: #5c8387;
      }

      button:hover {
        border-color: #a0c9cd;
      }
      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  /**
   * Use reference variable to access our autosuggest element in template
   * https://stackoverflow.com/a/45921878
   * https://ultimatecourses.com/blog/element-refs-in-angular-templates
   */
  @ViewChild("autosuggest", { static: false, read: ElementRef })
  autosuggest!: ElementRef<HTMLElement>;
  title = "what3words Autosuggest Component - Angular 19 Standalone";
  attributes = load({
    lazy: true,
  });

  constructor(private renderer: Renderer2) {}

  onSubmit(e: Event) {
    e.preventDefault();
    console.log({ target: e.target });
  }

  ngAfterViewInit() {
    // Attach our attributes to the autosuggest component
    // (spread operations for component attributes are not supported in [Angular](https://github.com/angular/angular/issues/14545))
    Object.keys(this.attributes.autosuggest).forEach((key) => {
      const value = this.attributes.autosuggest[key];
      if (value.length) {
        this.renderer.setAttribute(this.autosuggest.nativeElement, key, value);
      }
    });
  }
}
