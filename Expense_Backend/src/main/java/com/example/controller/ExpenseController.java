package com.example.controller;

import com.example.entity.Expense;
import com.example.service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*") // dev origin
public class ExpenseController {

    private static final Logger log = LoggerFactory.getLogger(ExpenseController.class);
    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // ✅ Root output when visiting http://localhost:2004/
    @GetMapping("/")
    public String home() {
        return "Welcome to Expense Tracker API! Server is running successfully 🚀";
    }

    // ✅ GET /api/expenses and /api/expenses/
    @GetMapping(path = { "", "/" }, produces = "application/json")
    public List<Expense> listAll() {
        log.info("Received GET on /api/expenses (listAll)");
        return service.findAll();
    }

    // ✅ GET /api/expenses/all
    @GetMapping(path = "/all", produces = "application/json")
    public List<Expense> getAll() {
        log.info("Received GET on /api/expenses/all");
        return service.findAll();
    }

    // ✅ GET /api/expenses/get/{id}
    @GetMapping(path = "/get/{id}", produces = "application/json")
    public ResponseEntity<Expense> getById(@PathVariable Long id) {
        log.info("Received GET on /api/expenses/get/{}", id);
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST /api/expenses , /api/expenses/ , /api/expenses/add
    @PostMapping(path = { "", "/", "/add" }, consumes = "application/json", produces = "application/json")
    public ResponseEntity<Expense> add(@RequestBody Expense expense) {
        log.info("Received POST on /api/expenses (add)");
        expense.setId(null); // always create new
        Expense saved = service.save(expense);
        return ResponseEntity.created(URI.create("/api/expenses/" + saved.getId())).body(saved);
    }

    // ✅ PUT /api/expenses/{id} or /api/expenses/update
    @PutMapping(path = { "/update", "/{id}" }, consumes = "application/json", produces = "application/json")
    public ResponseEntity<Expense> update(@PathVariable(required = false) Long id,
            @RequestBody Expense updated) {
        Long targetId = id == null ? updated.getId() : id;
        log.info("Received PUT on /api/expenses (targetId={})", targetId);
        if (targetId == null)
            return ResponseEntity.badRequest().build();

        return service.findById(targetId)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setAmount(updated.getAmount());
                    existing.setCategory(updated.getCategory());
                    existing.setDate(updated.getDate());
                    existing.setNote(updated.getNote());
                    Expense saved = service.save(existing);
                    return ResponseEntity.ok(saved);
                }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE /api/expenses/{id} or /api/expenses/delete/{id}
    @DeleteMapping(path = { "/delete/{id}", "/{id}" })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Received DELETE on /api/expenses (id={})", id);
        if (!service.existsById(id))
            return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
