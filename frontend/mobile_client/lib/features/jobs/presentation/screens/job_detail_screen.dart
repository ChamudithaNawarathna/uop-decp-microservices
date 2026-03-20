import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/jobs_provider.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../../../shared/widgets/error_widget.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/utils/date_utils.dart';

// ─── Design Tokens (shared with jobs_screen.dart) ────────────────────────────
class _AppColors {
  static const primary = Color(0xFF0F172A);
  static const accent = Color(0xFF1565C0);
  static const accentLight = Color(0xFFEEF2FF);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceAlt = Color(0xFFF8FAFC);
  static const border = Color(0xFFE2E8F0);
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF64748B);
  static const textMuted = Color(0xFF94A3B8);
  static const success = Color(0xFF10B981);
  static const successLight = Color(0xFFD1FAE5);
  static const error = Color(0xFFEF4444);
  static const errorLight = Color(0xFFFEE2E2);
  static const applied = Color(0xFF8B5CF6);
  static const appliedLight = Color(0xFFEDE9FE);
}

// ─── Job Detail Screen ────────────────────────────────────────────────────────
class JobDetailScreen extends ConsumerWidget {
  final int jobId;
  const JobDetailScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobAsync = ref.watch(singleJobProvider(jobId));
    final user = ref.watch(currentUserProvider);
    final applicationsAsync = ref.watch(userApplicationsProvider);
    final isStudent = user?.role == 'STUDENT';

    return Scaffold(
      backgroundColor: _AppColors.surfaceAlt,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8),
          child: _CircleButton(
            icon: Icons.arrow_back_rounded,
            onTap: () => context.pop(),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: _CircleButton(
              icon: Icons.ios_share_rounded,
              onTap: () {/* share */},
            ),
          ),
        ],
      ),
      body: jobAsync.when(
        loading: () => const AppLoadingWidget(),
        error: (e, _) => AppErrorWidget(message: e.toString()),
        data: (job) => Stack(
          children: [
            // ── Scrollable Content ──
            SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Hero Header ──
                  _HeroHeader(job: job),

                  // ── Quick Stats Row ──
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                    child: _QuickStatsRow(job: job),
                  ),

                  // ── Description ──
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                    child: _SectionCard(
                      title: 'About the Role',
                      icon: Icons.description_outlined,
                      child: Text(
                        job.description,
                        style: const TextStyle(
                          fontSize: 14,
                          height: 1.7,
                          color: _AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ),

                  // ── Details ──
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
                    child: _SectionCard(
                      title: 'Job Details',
                      icon: Icons.info_outline_rounded,
                      child: Column(
                        children: [
                          _DetailTile(
                            icon: Icons.location_on_rounded,
                            label: 'Location',
                            value: job.location,
                          ),
                          _DetailTile(
                            icon: Icons.work_rounded,
                            label: 'Employment Type',
                            value: job.type,
                          ),
                          _DetailTile(
                            icon: Icons.people_alt_rounded,
                            label: 'Applicants',
                            value: '${job.applicationCount} people applied',
                          ),
                          _DetailTile(
                            icon: Icons.person_rounded,
                            label: 'Posted by',
                            value: job.posterName,
                          ),
                          if (job.createdAt != null)
                            _DetailTile(
                              icon: Icons.access_time_rounded,
                              label: 'Posted',
                              value: timeAgo(job.createdAt!),
                              isLast: true,
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Bottom CTA (floating, pinned) ──
            if (isStudent)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: _BottomCTA(
                  job: job,
                  applicationsAsync: applicationsAsync,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─── Hero Header ─────────────────────────────────────────────────────────────
class _HeroHeader extends StatelessWidget {
  final dynamic job;
  const _HeroHeader({required this.job});

  @override
  Widget build(BuildContext context) {
    final statusOpen = job.status == 'OPEN';
    final topPadding = MediaQuery.of(context).padding.top + kToolbarHeight;

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: _AppColors.surface,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 24,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.fromLTRB(20, topPadding + 12, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Logo + status
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: _AppColors.accentLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: _AppColors.border),
                  ),
                  child: const Icon(
                    Icons.business_rounded,
                    color: _AppColors.accent,
                    size: 28,
                  ),
                ),
                const Spacer(),
                _StatusBadge(isOpen: statusOpen, status: job.status),
              ],
            ),

            const SizedBox(height: 16),

            // Title
            Text(
              job.title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: _AppColors.textPrimary,
                letterSpacing: -0.6,
                height: 1.15,
              ),
            ),
            const SizedBox(height: 6),

            // Company
            Text(
              job.company,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: _AppColors.accent,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
class _StatusBadge extends StatelessWidget {
  final bool isOpen;
  final String status;
  const _StatusBadge({required this.isOpen, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
      decoration: BoxDecoration(
        color: isOpen ? _AppColors.successLight : _AppColors.errorLight,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 7,
            height: 7,
            decoration: BoxDecoration(
              color: isOpen ? _AppColors.success : _AppColors.error,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            status,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isOpen ? _AppColors.success : _AppColors.error,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Quick Stats Row ──────────────────────────────────────────────────────────
class _QuickStatsRow extends StatelessWidget {
  final dynamic job;
  const _QuickStatsRow({required this.job});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatCard(
          icon: Icons.location_on_rounded,
          label: job.location,
          flex: 2,
        ),
        const SizedBox(width: 10),
        _StatCard(
          icon: Icons.work_rounded,
          label: job.type,
          flex: 1,
        ),
        const SizedBox(width: 10),
        _StatCard(
          icon: Icons.people_alt_rounded,
          label: '${job.applicationCount}',
          sublabel: 'applied',
          flex: 1,
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? sublabel;
  final int flex;

  const _StatCard({
    required this.icon,
    required this.label,
    this.sublabel,
    required this.flex,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: flex,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: _AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 16, color: _AppColors.accent),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: _AppColors.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            if (sublabel != null)
              Text(
                sublabel!,
                style: const TextStyle(
                  fontSize: 11,
                  color: _AppColors.textMuted,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─── Section Card ──────────────────────────────────────────────────────────────
class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.icon,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: _AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Row(
              children: [
                Icon(icon, size: 16, color: _AppColors.accent),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: _AppColors.textPrimary,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: child,
          ),
        ],
      ),
    );
  }
}

// ─── Detail Tile ──────────────────────────────────────────────────────────────
class _DetailTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isLast;

  const _DetailTile({
    required this.icon,
    required this.label,
    required this.value,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: _AppColors.surfaceAlt,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 16, color: _AppColors.textSecondary),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 11,
                      color: _AppColors.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    value,
                    style: const TextStyle(
                      fontSize: 13,
                      color: _AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        if (!isLast)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(height: 1, color: _AppColors.border),
          ),
      ],
    );
  }
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
class _BottomCTA extends StatelessWidget {
  final dynamic job;
  final AsyncValue applicationsAsync;

  const _BottomCTA({required this.job, required this.applicationsAsync});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: _AppColors.surface,
        border: const Border(
          top: BorderSide(color: _AppColors.border),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x10000000),
            blurRadius: 20,
            offset: Offset(0, -8),
          ),
        ],
      ),
      padding: EdgeInsets.fromLTRB(
        20,
        14,
        20,
        MediaQuery.of(context).padding.bottom + 14,
      ),
      child: applicationsAsync.when(
        loading: () => const AppLoadingWidget(),
        error: (e, _) => AppErrorWidget(message: e.toString()),
        data: (applications) {
          final hasApplied =
              applications.any((app) => app.jobId == job.id);

          if (hasApplied) {
            return _AppliedBanner();
          } else if (job.status == 'OPEN') {
            return _ApplyButton(jobId: job.id);
          } else {
            return _ClosedBanner();
          }
        },
      ),
    );
  }
}

class _ApplyButton extends StatelessWidget {
  final int jobId;
  const _ApplyButton({required this.jobId});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton.icon(
        onPressed: () => context.push('/jobs/$jobId/apply'),
        icon: const Icon(Icons.send_rounded, size: 18),
        label: const Text(
          'Apply Now',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: _AppColors.accent,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}

class _AppliedBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(
        color: _AppColors.appliedLight,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(
            Icons.check_circle_rounded,
            color: _AppColors.applied,
            size: 18,
          ),
          SizedBox(width: 8),
          Text(
            'Application Submitted',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: _AppColors.applied,
            ),
          ),
        ],
      ),
    );
  }
}

class _ClosedBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(
        color: _AppColors.errorLight,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(
            Icons.block_rounded,
            color: _AppColors.error,
            size: 18,
          ),
          SizedBox(width: 8),
          Text(
            'This position is Closed',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: _AppColors.error,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Circle Button (AppBar action) ────────────────────────────────────────────
class _CircleButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _CircleButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: _AppColors.surface,
      shape: const CircleBorder(),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: _AppColors.border),
          ),
          child: Icon(icon, size: 18, color: _AppColors.textPrimary),
        ),
      ),
    );
  }
}