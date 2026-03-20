import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/jobs_provider.dart';
import '../../data/models/job_model.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../../../shared/widgets/error_widget.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/utils/date_utils.dart';

// ─── Design Tokens ────────────────────────────────────────────────────────────
class _AppColors {
  static const primary = Color(0xFF0F172A);      // Slate-900
  static const accent = Color(0xFF1565C0);        // Indigo-500
  static const accentLight = Color(0xFFEEF2FF);   // Indigo-50
  static const surface = Color(0xFFFFFFFF);
  static const surfaceAlt = Color(0xFFF8FAFC);    // Slate-50
  static const border = Color(0xFFE2E8F0);        // Slate-200
  static const textPrimary = Color(0xFF0F172A);   // Slate-900
  static const textSecondary = Color(0xFF64748B); // Slate-500
  static const textMuted = Color(0xFF94A3B8);     // Slate-400
  static const success = Color(0xFF10B981);       // Emerald-500
  static const successLight = Color(0xFFD1FAE5);  // Emerald-100
  static const warning = Color(0xFFF59E0B);       // Amber-500
  static const warningLight = Color(0xFFFEF3C7);  // Amber-100
  static const error = Color(0xFFEF4444);         // Red-500
  static const errorLight = Color(0xFFFEE2E2);    // Red-100
  static const applied = Color(0xFF8B5CF6);       // Violet-500
  static const appliedLight = Color(0xFFEDE9FE);  // Violet-100
}

// ─── Jobs Screen ──────────────────────────────────────────────────────────────
class JobsScreen extends ConsumerStatefulWidget {
  const JobsScreen({super.key});

  @override
  ConsumerState<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends ConsumerState<JobsScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _fabController;

  @override
  void initState() {
    super.initState();
    _fabController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    Future.microtask(() {
      ref.read(jobsProvider.notifier).loadJobs();
      _fabController.forward();
    });
  }

  @override
  void dispose() {
    _fabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(jobsProvider);
    final user = ref.watch(currentUserProvider);
    final applicationsAsync = ref.watch(userApplicationsProvider);
    final canCreate = user?.role == 'ALUMNI' || user?.role == 'ADMIN';

    return Scaffold(
      backgroundColor: _AppColors.surfaceAlt,
      floatingActionButton: canCreate
          ? ScaleTransition(
              scale: CurvedAnimation(
                parent: _fabController,
                curve: Curves.elasticOut,
              ),
              child: FloatingActionButton.extended(
                onPressed: () => context.push('/jobs/create'),
                backgroundColor: _AppColors.accent,
                foregroundColor: Colors.white,
                elevation: 4,
                icon: const Icon(Icons.add_rounded, size: 20),
                label: const Text(
                  'Post Job',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                  ),
                ),
              ),
            )
          : null,
      body: Builder(
        builder: (_) {
          if (state.isLoading && state.jobs.isEmpty) {
            return const AppLoadingWidget(message: 'Loading jobs...');
          }
          if (state.error != null && state.jobs.isEmpty) {
            return AppErrorWidget(
              message: state.error!,
              onRetry: () => ref.read(jobsProvider.notifier).loadJobs(),
            );
          }

          return RefreshIndicator(
            color: _AppColors.accent,
            backgroundColor: _AppColors.surface,
            onRefresh: () => ref.read(jobsProvider.notifier).loadJobs(),
            child: state.jobs.isEmpty
                ? _EmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
                    itemCount: state.jobs.length,
                    itemBuilder: (_, i) {
                      final job = state.jobs[i];
                      return applicationsAsync.when(
                        loading: () => _JobCard(job: job, index: i),
                        error: (_, __) => _JobCard(job: job, index: i),
                        data: (applications) {
                          final hasApplied =
                              applications.any((a) => a.jobId == job.id);
                          return _JobCard(
                            job: job,
                            hasApplied: hasApplied,
                            index: i,
                          );
                        },
                      );
                    },
                  ),
          );
        },
      ),
    );
  }
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
class _JobCard extends StatefulWidget {
  final JobModel job;
  final bool hasApplied;
  final int index;

  const _JobCard({
    required this.job,
    this.hasApplied = false,
    required this.index,
  });

  @override
  State<_JobCard> createState() => _JobCardState();
}

class _JobCardState extends State<_JobCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 400 + (widget.index * 60).clamp(0, 400)),
    );
    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.12),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    Future.delayed(Duration(milliseconds: widget.index * 60), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final job = widget.job;

    return FadeTransition(
      opacity: _fadeAnim,
      child: SlideTransition(
        position: _slideAnim,
        child: Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Material(
            color: _AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => context.push('/jobs/${job.id}'),
              splashColor: _AppColors.accentLight,
              highlightColor: _AppColors.accentLight.withValues(alpha: 0.5),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: _AppColors.border, width: 1),
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── Top Row ──
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(width: 12),
                        // Title & company
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                job.title,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: _AppColors.textPrimary,
                                  letterSpacing: -0.2,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                job.company,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: _AppColors.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Status chip
                        _StatusChip(status: job.status),
                      ],
                    ),

                    const SizedBox(height: 14),
                    const Divider(color: _AppColors.border, height: 1),
                    const SizedBox(height: 12),

                    // ── Bottom Row ──
                    Row(
                      children: [
                        // Location
                        const Icon(
                          Icons.location_on_rounded,
                          size: 14,
                          color: _AppColors.textMuted,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            job.location,
                            style: const TextStyle(
                              fontSize: 12,
                              color: _AppColors.textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),

                        // Type chip
                        _TypeChip(type: job.type),
                        const SizedBox(width: 8),

                        // Time
                        if (job.createdAt != null)
                          Text(
                            timeAgo(job.createdAt!),
                            style: const TextStyle(
                              fontSize: 12,
                              color: _AppColors.textMuted,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                      ],
                    ),

                    // ── Applied Badge ──
                    if (widget.hasApplied) ...[
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: _AppColors.appliedLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.check_circle_rounded,
                              size: 13,
                              color: _AppColors.applied,
                            ),
                            const SizedBox(width: 5),
                            const Text(
                              'You applied',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: _AppColors.applied,
                                letterSpacing: 0.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    final isOpen = status == 'OPEN';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isOpen ? _AppColors.successLight : _AppColors.errorLight,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: isOpen ? _AppColors.success : _AppColors.error,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 5),
          Text(
            status,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: isOpen ? _AppColors.success : _AppColors.error,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Type Chip ────────────────────────────────────────────────────────────────
class _TypeChip extends StatelessWidget {
  final String type;
  const _TypeChip({required this.type});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: _AppColors.border),
      ),
      child: Text(
        type,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: _AppColors.textSecondary,
        ),
      ),
    );
  }
}

// ─── Empty State ──────────────────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: _AppColors.accentLight,
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(
              Icons.work_off_rounded,
              size: 36,
              color: _AppColors.accent,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'No jobs available',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: _AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Check back later for new opportunities',
            style: TextStyle(
              fontSize: 14,
              color: _AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}