import {
    Component, EventEmitter, OnDestroy, OnInit, Output
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";

import { ItemsService } from "../../services/items.service";
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { loadItems } from "src/app/store/actions/actions";
import { selectYoutubeItems } from "src/app/store/selectors/selectors";
import { AppState } from "src/app/store/reducers/reducers";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
    username = this.authService.username$;
    showHideSettings = false;

    value = '';

    hideOrShowLogOut = false;
    logoutSub!: Subscription;

    @Output() shareToggleSettings = new EventEmitter<boolean>();

    constructor(
        private itemsService: ItemsService,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.logoutSub = this.authService.showLogOut.subscribe((value) => {
            this.hideOrShowLogOut = value;
        });
    }

    getInput(e: any) {
        this.itemsService.searchItemText.next(e.target.value);
        const value = e.target as HTMLInputElement;

    }

    onClick(){
      this.store.dispatch(loadItems({ searchInput: this.value }))
      // this.store.select(selectYoutubeItems).subscribe(data => console.log(data));
}

    onLogOut() {
        this.authService.logout();
        this.router.navigate(["/login"]);
    }

    toggleSettings() {
        if (this.authService.isAuthenticated()) {
            this.showHideSettings = !this.showHideSettings;
            this.shareToggleSettings.emit(this.showHideSettings);
        }
    }

    // onClick(){
    //   this.store.dispatch(loadItems());
    // }

    ngOnDestroy() {
        this.logoutSub.unsubscribe();
    }
}
