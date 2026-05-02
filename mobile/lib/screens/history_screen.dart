import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/api_service.dart';
import '../core/queue_service.dart';
import 'dart:io';

class HistoryScreen extends StatefulWidget {
  final String? token;
  const HistoryScreen({super.key, this.token});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ApiService _api = ApiService();
  final OfflineQueueService _queue = OfflineQueueService();
  List<dynamic> _history = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      final apiData = await _api.fetchSubmissions();
      final localData = await _queue.getAllPending();
      
      final List<dynamic> pendingItems = localData.map((item) => {
        'id': 'local_${item.id}',
        'task_title': 'Mission Terrain (Locale)',
        'status': 'pending_sync',
        'created_at': item.createdAt.toIso8601String(),
        'data_type': item.type,
      }).toList();

      if (mounted) {
        setState(() {
          _history = [...pendingItems, ...apiData];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        final localData = await _queue.getAllPending();
        setState(() {
          _history = localData.map((item) => {
            'id': 'local_${item.id}',
            'task_title': 'Mission Terrain (Locale)',
            'status': 'pending_sync',
            'created_at': item.createdAt.toIso8601String(),
            'data_type': item.type,
          }).toList();
          _isLoading = false;
        });
      }
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'approved': return const Color(0xFF2ECC71);
      case 'rejected': return const Color(0xFFE74C3C);
      case 'pending_sync': return Colors.orange;
      default: return const Color(0xFFF39C12);
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'approved': return 'Approuvé ✓';
      case 'rejected': return 'Rejeté ✗';
      case 'pending_sync': return 'Sync. en cours';
      default: return 'En attente…';
    }
  }

  String _typeIcon(String type) {
    switch (type) {
      case 'audio': return '🎙️';
      case 'image': return '📷';
      default: return '📝';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFB),
      appBar: AppBar(
        title: Text('Historique', 
          style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 24)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Color(0xFF1F7A63)),
            onPressed: _loadHistory,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF1F7A63)))
          : RefreshIndicator(
              onRefresh: _loadHistory,
              color: const Color(0xFF1F7A63),
              child: CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: _buildSummaryHeader(),
                    ),
                  ),
                  if (_history.isEmpty)
                    SliverFillRemaining(
                      hasScrollBody: false,
                      child: _buildEmptyState(),
                    )
                  else
                    SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (ctx, i) => _buildHistoryCard(_history[i]),
                          childCount: _history.length,
                        ),
                      ),
                    ),
                  const SliverToBoxAdapter(child: SizedBox(height: 100)),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryHeader() {
    int pending = _history.where((m) => m['status'] == 'pending_sync' || m['status'] == 'pending').length;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1F7A63), Color(0xFF2EAB8A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1F7A63).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildStatItem('Total', '${_history.length}', Colors.white),
          Container(width: 1, height: 40, color: Colors.white.withOpacity(0.2)),
          _buildStatItem('En attente', '$pending', Colors.white),
          Container(width: 1, height: 40, color: Colors.white.withOpacity(0.2)),
          _buildStatItem('Terminé', '${_history.length - pending}', Colors.white),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: GoogleFonts.outfit(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
        Text(label, style: GoogleFonts.outfit(color: color.withOpacity(0.8), fontSize: 12, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: const Color(0xFF1F7A63).withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.history_toggle_off, size: 80, color: Color(0xFF1F7A63)),
          ),
          const SizedBox(height: 24),
          Text('Aucun historique', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Commencez une mission pour voir vos collectes ici.', 
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(color: Colors.grey, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(dynamic item) {
    String type = item['data_type'] ?? item['task_type'] ?? 'text';
    String title = item['task_title'] ?? 'Mission Terrain';
    String status = item['status'] ?? 'pending';
    
    DateTime? date;
    try {
      date = DateTime.parse(item['created_at']);
    } catch (_) {}
    
    String formattedDate = date != null 
      ? '${date.day}/${date.month}/${date.year} à ${date.hour}:${date.minute.toString().padLeft(2, '0')}'
      : 'Date inconnue';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0F0F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: IntrinsicHeight(
          child: Row(
            children: [
              Container(width: 6, color: _statusColor(status)),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: Text(_typeIcon(type), style: const TextStyle(fontSize: 16)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(title,
                                  style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(formattedDate,
                                  style: GoogleFonts.outfit(color: Colors.grey, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: _statusColor(status).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Text(
                              _statusLabel(status).toUpperCase(),
                              style: GoogleFonts.outfit(
                                color: _statusColor(status),
                                fontWeight: FontWeight.w800,
                                fontSize: 10,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          if (status == 'approved')
                             Text('+${item['reward'] ?? 0} FCFA', 
                               style: GoogleFonts.outfit(color: const Color(0xFF2ECC71), fontWeight: FontWeight.bold, fontSize: 14))
                          else
                            const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
