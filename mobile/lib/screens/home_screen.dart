import 'package:flutter/material.dart';
import 'history_screen.dart';
import 'balance_screen.dart';
import 'audio_collection_screen.dart';
import 'image_collection_screen.dart';
import 'text_collection_screen.dart';
import 'guided_mission_screen.dart';
import 'login_screen.dart';
import '../core/queue_service.dart';
import '../core/api_service.dart';
import '../core/sync_manager.dart';
import 'notifications_screen.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'dart:async';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const _MissionsTab(),
    const HistoryScreen(),
    const BalanceScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: const Color(0xFF1F7A63),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), activeIcon: Icon(Icons.assignment), label: 'Missions'),
          BottomNavigationBarItem(icon: Icon(Icons.history_outlined), activeIcon: Icon(Icons.history), label: 'Historique'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Solde'),
        ],
      ),
    );
  }
}

class _MissionsTab extends StatefulWidget {
  const _MissionsTab();

  @override
  State<_MissionsTab> createState() => _MissionsTabState();
}

class _MissionsTabState extends State<_MissionsTab> {
  String _filter = 'Tous';
  bool _isSyncing = false;
  bool _isLoading = true;
  int _pendingCount = 0;
  int _unreadNotifications = 0;
  int _points = 0;
  int _level = 1;
  double _qualityScore = 1.0;
  StreamSubscription? _connectivitySubscription;
  final List<String> _filters = ['Tous', '🎙️ Audio', '📷 Image', '📝 Texte'];
  final OfflineQueueService _queue = OfflineQueueService();
  final ApiService _api = ApiService();

  List<Map<String, dynamic>> _missions = [];

  @override
  void initState() {
    super.initState();
    _refreshAll();
    _setupConnectivityListener();
  }

  @override
  void dispose() {
    _connectivitySubscription?.cancel();
    super.dispose();
  }

  void _setupConnectivityListener() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      if (result != ConnectivityResult.none && _pendingCount > 0) {
        _triggerSync();
      }
    });
  }

  Future<void> _refreshAll() async {
    await Future.wait([
      _refreshPendingCount(),
      _loadMissions(),
      _checkAccountStatus(),
      _loadUnreadNotifications(),
    ]);
  }

  Future<void> _loadUnreadNotifications() async {
    final notifications = await _api.fetchNotifications();
    if (mounted) {
      setState(() {
        _unreadNotifications = notifications.where((n) => n['is_read'] == false).length;
      });
    }
  }

  Future<void> _loadMissions() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      final data = await _api.fetchMissions();
      if (mounted) {
        setState(() {
          _missions = List<Map<String, dynamic>>.from(data).where((m) {
            // Respect the active status set by Admin
            return m['is_active'] == true;
          }).toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur de chargement: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _refreshPendingCount() async {
    final count = await _queue.pendingCount();
    if (mounted) setState(() => _pendingCount = count);
  }

  Future<void> _triggerSync() async {
    setState(() => _isSyncing = true);
    final syncManager = SyncManager(api: _api, queue: _queue);
    final result = await syncManager.syncAll();
    await _refreshPendingCount();
    setState(() => _isSyncing = false);
    
    if (mounted) {
      if (result.errors.isNotEmpty) {
        // Show first unique error for clarity
        final firstError = result.errors.toSet().first;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Attention: $firstError (${result.failed} échecs)'),
          backgroundColor: Colors.orange,
        ));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Sync: ${result.synced} envoyés, ${result.failed} échoués'),
          backgroundColor: result.failed == 0 ? const Color(0xFF1F7A63) : Colors.orange,
        ));
      }
    }
  }

  Future<void> _checkAccountStatus() async {
    try {
      final profile = await _api.fetchProfile();
      
      if (mounted) {
        if (profile['status'] == 401) {
          await _api.clearToken();
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
          return;
        }

        setState(() {
          _points = profile['points'] ?? 0;
          _level = profile['level'] ?? 1;
          _qualityScore = profile['quality_score'] ?? 1.0;
        });
      }

      // Update telemetry
      final fp = await FraudGuard.getFingerprint();
      final gps = await FraudGuard.captureGPS();
      await _api.updateProfileTelemetry({
        'device_model': fp.deviceModel,
        'network_operator': 'Orange CI / Moov', // Note: Placeholder as carrier_info plugin not yet added
        'last_lat': gps['lat'],
        'last_long': gps['long'],
      });

      if (profile['status'] == 'suspended') {
        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (ctx) => AlertDialog(
              title: const Text('Compte Suspendu'),
              content: const Text('Votre compte a été suspendu pour non-respect des règles de qualité. Contactez l\'administrateur.'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
                  child: const Text('OK'),
                )
              ],
            ),
          );
        }
      }
    } catch (_) {}
  }

  void _showProfile() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            const CircleAvatar(radius: 36, backgroundColor: Color(0xFF1F7A63), child: Icon(Icons.person, size: 36, color: Colors.white)),
            const SizedBox(height: 12),
            const Text('Agent Nyansa', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(color: const Color(0xFF1F7A63).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
              child: const Text('Actif', style: TextStyle(color: Color(0xFF1F7A63), fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),
            ListTile(
              leading: const Icon(Icons.sync, color: Color(0xFF1F7A63)),
              title: Text('$_pendingCount soumission(s) en attente'),
              subtitle: const Text('Appuyez sur sync pour envoyer'),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title: const Text('Déconnexion', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
              onTap: () async {
                await _api.clearToken();
                if (mounted) {
                  Navigator.pop(ctx);
                  Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  String _getTypeLabel(String type) {
    switch (type) {
      case 'audio': return '🎙️ Audio';
      case 'image': return '📷 Image';
      case 'text': return '📝 Texte';
      default: return 'Task';
    }
  }

  List<Map<String, dynamic>> get _filtered {
    if (_filter == 'Tous') return _missions;
    return _missions.where((m) => _getTypeLabel(m['task_type']) == _filter).toList();
  }

  void _startMission(BuildContext context, Map<String, dynamic> mission) {
    Widget screen;
    final type = mission['task_type'];
    final id = mission['id'];
    final title = mission['title'];
    
    if (title.toString().toLowerCase().contains('terrain')) {
      screen = GuidedMissionScreen(mission: mission);
    } else {
      switch (type) {
        case 'audio':
          screen = AudioCollectionScreen(
            taskId: id, 
            taskTitle: title,
            languageId: mission['language'],
            dialectId: mission['dialect'],
            promptId: mission['prompt'],
            promptText: mission['prompt_text'],
          );
          break;
        case 'image':
          screen = ImageCollectionScreen(taskId: id, taskTitle: title);
          break;
        default:
          screen = TextCollectionScreen(taskId: id, taskTitle: title);
      }
    }
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen)).then((_) => _refreshPendingCount());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: const Text('Missions Nyansa', style: TextStyle(fontWeight: FontWeight.w800)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          Stack(
            children: [
              IconButton(
                onPressed: _isSyncing ? null : _triggerSync,
                icon: _isSyncing
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1F7A63)))
                    : const Icon(Icons.sync, color: Color(0xFF1F7A63)),
              ),
              if (_pendingCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    child: Text('$_pendingCount', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          ),
          Stack(
            children: [
              IconButton(
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())).then((_) => _loadUnreadNotifications()),
                icon: const Icon(Icons.notifications_outlined),
              ),
              if (_unreadNotifications > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text('$_unreadNotifications', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                  ),
                ),
            ],
          ),
          IconButton(onPressed: _showProfile, icon: const Icon(Icons.person_outline)),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(52),
          child: SizedBox(
            height: 52,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: _filters.map((f) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(f),
                  selected: _filter == f,
                  onSelected: (_) => setState(() => _filter = f),
                  selectedColor: const Color(0xFF1F7A63).withOpacity(0.15),
                  checkmarkColor: const Color(0xFF1F7A63),
                  labelStyle: TextStyle(
                    color: _filter == f ? const Color(0xFF1F7A63) : Colors.grey.shade600,
                    fontWeight: _filter == f ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              )).toList(),
            ),
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF1F7A63)))
          : RefreshIndicator(
              onRefresh: _refreshAll,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Gamification Header
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1F7A63), Color(0xFF165A49)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF1F7A63).withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        // Level Badge
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white.withOpacity(0.4), width: 2),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text('NIVEAU', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                                Text('$_level', style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Progress & Points
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Score Qualité: ${(_qualityScore * 100).toInt()}%', 
                                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                                  Text('$_points pts', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: LinearProgressIndicator(
                                  value: (_points % 1000) / 1000,
                                  backgroundColor: Colors.white.withOpacity(0.2),
                                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6BFE9C)),
                                  minHeight: 8,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text('Encore ${1000 - (_points % 1000)} pts pour le niveau ${_level + 1}', 
                                style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 10)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Filter Section Header
                  const Text('Missions Disponibles', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  
                  if (_filtered.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 40),
                      child: Center(child: Text('Aucune mission disponible')),
                    )
                  else
                    ..._filtered.map((mission) {
                      return Card(
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: BorderSide(color: Colors.grey.shade200),
                          ),
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1F7A63).withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(_getTypeLabel(mission['task_type']), style: const TextStyle(color: Color(0xFF1F7A63), fontWeight: FontWeight.bold, fontSize: 12)),
                                    ),
                                    Text('${mission['reward_per_entry']} FCFA', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(mission['title'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(mission['description'] ?? '', style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
                                const SizedBox(height: 16),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: () => _startMission(context, mission),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF1F7A63),
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      elevation: 0,
                                    ),
                                    child: const Text('Commencer la mission', style: TextStyle(fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                    }).toList(),
                ],
              ),
            ),
    );
  }
}
