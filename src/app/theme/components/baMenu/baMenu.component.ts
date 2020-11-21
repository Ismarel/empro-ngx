import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { BaMenuService } from '../../services';
import { GlobalState } from '../../../global.state';
import { UsuarioService } from 'app/servicios-backend/usuario.service';

@Component({
    selector: 'ba-menu',
    templateUrl: './baMenu.html',
    styleUrls: ['./baMenu.scss']
})
export class BaMenu {

    @Input() sidebarCollapsed: boolean = false;
    @Input() menuHeight: number;

    @Output() expandMenu = new EventEmitter<any>();

    public menuItems: any[];
    protected _menuItemsSub: Subscription;
    public showHoverElem: boolean;
    public hoverElemHeight: number;
    public hoverElemTop: number;
    protected _onRouteChange: Subscription;
    public outOfArea: number = -200;

    constructor(
        private _router: Router,
        private _service: BaMenuService,
        private _state: GlobalState,
        private _auth: UsuarioService
    ) {
    }

    private checkPath(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._auth.roleAuth(path).then((data) => {
                if (!data) {
                    resolve(false);
                }
                resolve(true);
            }).catch((error) => {
                resolve(false);
            });
        });
    }

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        /* Custom Code */
        this.menuItems.forEach((e, i) => {
            e.hidden = true;
            this.checkPath(e.route.path).then(valid => {
                if (valid)
                    e.hidden = false;
                else
                    this.menuItems.splice(this.menuItems.indexOf(e), 1);
            });
        });
        /* End Custom Code */
        this.selectMenuAndNotify();
    }

    public selectMenuAndNotify(): void {
        if (this.menuItems) {
            this.menuItems = this._service.selectMenuItem(this.menuItems);
            this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
        }
    }

    public ngOnInit(): void {
        this._onRouteChange = this._router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) {
                if (this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });

        this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
    }

    public ngOnDestroy(): void {
        this._onRouteChange.unsubscribe();
        this._menuItemsSub.unsubscribe();
    }

    public hoverItem($event): void {
        this.showHoverElem = true;
        this.hoverElemHeight = $event.currentTarget.clientHeight;
        // TODO: get rid of magic 66 constant
        this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 66;
    }

    public toggleSubMenu($event): boolean {
        let submenu = jQuery($event.currentTarget).next();

        if (this.sidebarCollapsed) {
            this.expandMenu.emit(null);
            if (!$event.item.expanded) {
                $event.item.expanded = true;
            }
        } else {
            $event.item.expanded = !$event.item.expanded;
            submenu.slideToggle();
        }

        return false;
    }
}
