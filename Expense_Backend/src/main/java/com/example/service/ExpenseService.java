package com.example.service;

import com.example.entity.Expense;
import com.example.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }

    public List<Expense> findAll() { return repo.findAll(); }
    public Optional<Expense> findById(Long id) { return repo.findById(id); }
    public Expense save(Expense expense) { return repo.save(expense); }
    public void deleteById(Long id) { repo.deleteById(id); }
    public boolean existsById(Long id) { return repo.existsById(id); }
}
