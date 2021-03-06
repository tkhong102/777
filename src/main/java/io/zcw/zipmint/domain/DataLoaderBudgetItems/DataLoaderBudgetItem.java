package io.zcw.zipmint.domain.DataLoaderBudgetItems;

import io.zcw.zipmint.domain.BudgetItem;
import io.zcw.zipmint.domain.enumeration.Category;
import io.zcw.zipmint.repository.BudgetItemRepository;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.LinkedHashSet;

@Component
public class DataLoaderBudgetItem {

    private BudgetItemRepository budgetItemRepository;
    private LinkedHashSet<BudgetItem> budgetItemSet = new LinkedHashSet<>();

    public DataLoaderBudgetItem(BudgetItemRepository budgetItemRepository) {
        this.budgetItemRepository = budgetItemRepository;
    }

    @PostConstruct
    private void LoadBillItems(){
        BudgetItem foodBudget = new BudgetItem();
        foodBudget.setExpectedSpending(300.00);
        foodBudget.setActualSpending(159.0);
        foodBudget.setCategory(Category.FOOD);
        budgetItemRepository.save(foodBudget);
        budgetItemSet.add(foodBudget);

        BudgetItem shopBudget = new BudgetItem();
        shopBudget.setExpectedSpending(350.00);
        shopBudget.setActualSpending(400.0);
        shopBudget.setCategory(Category.SHOPPING);
        budgetItemRepository.save(shopBudget);
        budgetItemSet.add(shopBudget);

        BudgetItem autoBudget = new BudgetItem();
        autoBudget.setExpectedSpending(175.00);
        autoBudget.setActualSpending(101.0);
        autoBudget.setCategory(Category.AUTOMOTIVE);
        budgetItemRepository.save(autoBudget);
        budgetItemSet.add(autoBudget);

        BudgetItem utilBudget = new BudgetItem();
        utilBudget.setExpectedSpending(150.00);
        utilBudget.setActualSpending(127.0);
        utilBudget.setCategory(Category.UTILITIES);
        budgetItemRepository.save(utilBudget);
        budgetItemSet.add(utilBudget);

    }

    public LinkedHashSet<BudgetItem> getBudgetItemSet() {
        return budgetItemSet;
    }
}
