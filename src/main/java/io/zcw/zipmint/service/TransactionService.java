package io.zcw.zipmint.service;

import io.github.jhipster.web.util.ResponseUtil;
import io.zcw.zipmint.domain.MoneyAccount;
import io.zcw.zipmint.domain.Transaction;
import io.zcw.zipmint.domain.enumeration.TransactionType;
import io.zcw.zipmint.repository.TransactionRepository;
import io.zcw.zipmint.web.rest.errors.BadRequestAlertException;
import io.zcw.zipmint.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private static final String ENTITY_NAME = "transaction";

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public ResponseEntity<Transaction> createTransaction(Transaction transaction) throws URISyntaxException {
        if (transaction.getId() != null) {
            throw new BadRequestAlertException("A new transaction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transaction result = transactionRepository.save(transaction);
        return ResponseEntity.created(new URI("/api/transactions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    public ResponseEntity<Transaction> updateTransaction(Transaction transaction) throws URISyntaxException {
        if (transaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transaction result = transactionRepository.save(transaction);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transaction.getId().toString()))
            .body(result);
    }

    public ResponseEntity<Transaction> getTransaction(Long id) {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transaction);
    }

    public ResponseEntity<Void> deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    public Iterable<Transaction> getDebitTransactions(){
        Iterable<Transaction> transactions = getAllTransactions()
            .stream()
            .filter(this::isDebit)
            .collect(Collectors.toList());
        return transactions;
    }

    public Iterable<Transaction> getCreditTransactions(){
        Iterable<Transaction> transactions = getAllTransactions()
            .stream()
            .filter(this::isCredit)
            .collect(Collectors.toList());
        return transactions;
    }

    public Iterable<Transaction> getSortedByDate(){
        return sortByDate(getAllTransactions());
    }

    public Iterable<Transaction> getSortedByCategory(){
        return sortByCategory(getAllTransactions());
    }

    public Iterable<Transaction> getSortedByDescription(){
        return sortByDescription(getAllTransactions());
    }

    public Iterable<Transaction> getSortedByAmount(){
        return sortByAmount(getAllTransactions());
    }

    public Iterable<Transaction> getSortedByAccount(){
        return sortByAccount(getAllTransactions());
    }

    public Iterable<Transaction> getDistinctAccounts(){
        LinkedHashMap<MoneyAccount, Transaction> accounts = new LinkedHashMap<>();

        for (Transaction transaction : getAllTransactions()) {
            accounts.put(transaction.getMoneyAccount(), transaction);
        }

        return accounts.values();
    }

    public Iterable<Transaction> getTransactionsByAccount(Long id){
        Iterable<Transaction> transactions = getAllTransactions()
            .stream()
            .filter(item -> item.getMoneyAccount().getId().equals(id))
            .collect(Collectors.toList());
        return transactions;
    }

    public Iterable<Transaction> searchTransaction(String searchQuery){
        Iterable<Transaction> transactions = getAllTransactions()
            .stream()
            .filter(item -> item.toString().toUpperCase().contains(searchQuery.toUpperCase()))
            .collect(Collectors.toList());
        return transactions;
    }

    private List<Transaction> getAllTransactions(){
        return transactionRepository.findByUserIsCurrentUser();
    }

    private List<Transaction> sortByDate(List<Transaction> transactionList) {
        transactionList.sort(Comparator.comparing(Transaction::getDateTime).reversed());
        return transactionList;
    }

    private List<Transaction> sortByCategory(List<Transaction> transactionList) {
        transactionList.sort(Comparator.comparing(o -> o.getCategory().toString()));
        return transactionList;
    }

    private List<Transaction> sortByDescription(List<Transaction> transactionList) {
        transactionList.sort(Comparator.comparing(Transaction::getDescription));
        return transactionList;
    }

    private List<Transaction> sortByAmount(List<Transaction> transactionList) {
        transactionList.sort(Comparator.comparing(Transaction::getAmount));
        return transactionList;
    }

    private List<Transaction> sortByAccount(List<Transaction> transactionList) {
        transactionList.sort(Comparator.comparing(o -> o.getMoneyAccount().getBankName()));
        return transactionList;
    }

    private boolean isDebit(Transaction transaction){
        return transaction.getTransactionType().equals(TransactionType.DEBIT);
    }

    private boolean isCredit(Transaction transaction){
        return !isDebit(transaction);
    }

    public List<Transaction> getRecentTransaction(){
        List<Transaction> result = sortByDate(transactionRepository.findAll());
        return result.subList(0,3);
    }
}
