package com.decp.job.service;

import com.decp.job.model.Application;
import com.decp.job.model.Job;
import com.decp.job.repository.ApplicationRepository;
import com.decp.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Application applyForJob(Application application) {
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findAllByJobId(jobId);
    }

    public List<Application> getApplicationsByUserId(Long userId) {
        return applicationRepository.findAllByUserId(userId);
    }
}
