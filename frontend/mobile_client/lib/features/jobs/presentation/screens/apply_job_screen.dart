import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/jobs_provider.dart';

class ApplyJobScreen extends ConsumerStatefulWidget {
  final int jobId;
  const ApplyJobScreen({super.key, required this.jobId});

  @override
  ConsumerState<ApplyJobScreen> createState() => _ApplyJobScreenState();
}

class _ApplyJobScreenState extends ConsumerState<ApplyJobScreen> {
  final _formKey = GlobalKey<FormState>();
  final _whyInterestedCtrl = TextEditingController();
  final _resumeUrlCtrl = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _whyInterestedCtrl.dispose();
    _resumeUrlCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);

    final ok = await ref.read(jobsProvider.notifier).applyToJob(
          widget.jobId,
          _whyInterestedCtrl.text.trim(),
          _resumeUrlCtrl.text.trim(),
        );

    if (!mounted) return;

    setState(() => _submitting = false);

    if (ok) {
      // Refresh relevant providers
      ref.invalidate(userApplicationsProvider);
      ref.invalidate(jobsProvider);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Application submitted successfully!')),
      );

      context.pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to submit application')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final jobAsync = ref.watch(singleJobProvider(widget.jobId));
    final applicationsAsync = ref.watch(userApplicationsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Apply for Job')),
      body: jobAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(e.toString())),
        data: (job) => applicationsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text(e.toString())),
          data: (applications) {
            final hasApplied =
                applications.any((app) => app.jobId == job.id);

            if (hasApplied) {
              return const Center(
                child: Text('You have already applied to this job'),
              );
            }

            if (job.status != 'OPEN') {
              return const Center(
                child: Text('Applications are closed'),
              );
            }

            return _buildForm(context);
          },
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Submit your Application',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 24),

            // Resume URL
            TextFormField(
              controller: _resumeUrlCtrl,
              decoration: const InputDecoration(
                labelText: 'Resume URL',
                hintText: 'https://example.com/your-resume.pdf',
                prefixIcon: Icon(Icons.link),
              ),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return 'Please enter resume URL';
                }
                final uri = Uri.tryParse(v.trim());
                if (uri == null || !uri.isAbsolute) {
                  return 'Enter a valid URL';
                }
                return null;
              },
            ),

            const SizedBox(height: 16),

            // Why Interested (backend-aligned)
            TextFormField(
              controller: _whyInterestedCtrl,
              maxLines: 6,
              decoration: const InputDecoration(
                labelText: 'Why are you interested?',
                hintText:
                    'Tell us about yourself and why you\'re a great fit...',
                prefixIcon: Icon(Icons.edit_note_rounded),
              ),
              validator: (v) {
                if (v == null || v.trim().length < 20) {
                  return 'Must be at least 20 characters';
                }
                return null;
              },
            ),

            const SizedBox(height: 28),

            ElevatedButton(
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Submit Application'),
            ),
          ],
        ),
      ),
    );
  }
}