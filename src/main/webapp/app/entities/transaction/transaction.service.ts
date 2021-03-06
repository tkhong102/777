import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITransaction } from 'app/shared/model/transaction.model';

type EntityResponseType = HttpResponse<ITransaction>;
type EntityArrayResponseType = HttpResponse<ITransaction[]>;

@Injectable({ providedIn: 'root' })
export class TransactionService {
    public resourceUrl = SERVER_API_URL + 'api/transactions';

    constructor(protected http: HttpClient) {}

    create(transaction: ITransaction): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(transaction);
        return this.http
            .post<ITransaction>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(transaction: ITransaction): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(transaction);
        return this.http
            .put<ITransaction>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITransaction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    sortByDescription(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/by_desc', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    sortByCategory(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/by_cat', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    sortByAmount(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/by_amount', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    sortByAccount(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/by_account', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    filterDebit(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/debit', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    filterCredit(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/credit', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    getDistinctAccounts(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/accounts', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    getTransactionsByAccount(id: number): Observable<HttpResponse<any>> {
        return this.http
            .get<ITransaction[]>(`${this.resourceUrl}/moneyAccount/${id}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    search(searchQuery: string): Observable<HttpResponse<any>> {
        const options = createRequestOption(searchQuery);
        return this.http
            .get<ITransaction[]>(this.resourceUrl + '/searchQuery', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(transaction: ITransaction): ITransaction {
        const copy: ITransaction = Object.assign({}, transaction, {
            dateTime: transaction.dateTime != null && transaction.dateTime.isValid() ? transaction.dateTime.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.dateTime = res.body.dateTime != null ? moment(res.body.dateTime) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((transaction: ITransaction) => {
                transaction.dateTime = transaction.dateTime != null ? moment(transaction.dateTime) : null;
            });
        }
        return res;
    }
}
