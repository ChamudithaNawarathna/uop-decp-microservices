package com.decp.job.controller;

import com.decp.job.model.Application;
import com.decp.job.model.Job;
import com.decp.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Job> createJob(
            @RequestHeader("X-User-Role") String role,
            @RequestBody Job job) {
        if (!"ALUMNI".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Application> applyForJob(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id, 
            @RequestBody Application application) {
        if (!"STUDENT".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        application.setJobId(id);
        return ResponseEntity.ok(jobService.applyForJob(application));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getApplicationsByJobId(id));
    }

    @GetMapping("/user/{userId}/applications")
    public ResponseEntity<List<Application>> getApplicationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getApplicationsByUserId(userId));
    }
}
