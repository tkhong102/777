import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBudgetItem } from 'app/shared/model/budget-item.model';
import { AccountService } from 'app/core';
import { BudgetItemService } from './budget-item.service';
// import 'rxjs/add/operator/map';

@Component({
    selector: 'jhi-budget-item',
    templateUrl: './budget-item.component.html'
})
export class BudgetItemComponent implements OnInit, OnDestroy {
    budgetItems: IBudgetItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected budgetItemService: BudgetItemService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.budgetItemService.getCurrentMonthBudget().subscribe(console.log);
        this.budgetItemService.query().subscribe(
            (res: HttpResponse<IBudgetItem[]>) => {
                this.budgetItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBudgetItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBudgetItem) {
        return item.id;
    }

    registerChangeInBudgetItems() {
        this.eventSubscriber = this.eventManager.subscribe('budgetItemListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    filter(category: string) {
        this.budgetItemService.filter(category).subscribe(
            (res: HttpResponse<IBudgetItem[]>) => {
                this.budgetItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    sortByCategory() {
        this.budgetItemService.sortByCategory().subscribe(
            (res: HttpResponse<IBudgetItem[]>) => {
                this.budgetItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    sortByBudget() {
        this.budgetItemService.sortByBudget().subscribe(
            (res: HttpResponse<IBudgetItem[]>) => {
                this.budgetItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    getCurrentMonthBudget() {
        this.budgetItemService.getCurrentMonthBudget().subscribe(
            (res: HttpResponse<IBudgetItem[]>) => {
                this.budgetItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
}
