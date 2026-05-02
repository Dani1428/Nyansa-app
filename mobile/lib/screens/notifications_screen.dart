import 'package:flutter/material.dart';
import '../core/api_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    final data = await _apiService.fetchNotifications();
    if (mounted) {
      setState(() {
        _notifications = data;
        _isLoading = false;
      });
    }
  }

  Future<void> _markAsRead(int id) async {
    final success = await _apiService.markNotificationAsRead(id);
    if (success) {
      _loadNotifications();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text(
          'Notifications',
          style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF00604C)),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF00604C)),
        actions: [
          TextButton(
            onPressed: () {
              for (var n in _notifications) {
                if (!n['is_read']) _markAsRead(n['id']);
              }
            },
            child: const Text('Tout lire'),
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _loadNotifications,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final n = _notifications[index];
                      return _buildNotificationTile(n);
                    },
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none, size: 80, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'Aucune notification',
            style: TextStyle(fontSize: 18, color: Colors.grey[600], fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationTile(Map<String, dynamic> n) {
    final bool isUnread = !n['is_read'];
    IconData iconData;
    Color iconColor;
    Color bgColor;

    switch (n['type']) {
      case 'error':
        iconData = Icons.report;
        iconColor = Colors.red;
        bgColor = Colors.red.withOpacity(0.1);
        break;
      case 'warning':
        iconData = Icons.warning;
        iconColor = Colors.orange;
        bgColor = Colors.orange.withOpacity(0.1);
        break;
      case 'success':
        iconData = Icons.check_circle;
        iconColor = Colors.green;
        bgColor = Colors.green.withOpacity(0.1);
        break;
      default:
        iconData = Icons.info;
        iconColor = const Color(0xFF00604C);
        bgColor = const Color(0xFF00604C).withOpacity(0.1);
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      decoration: BoxDecoration(
        color: isUnread ? Colors.white : Colors.white.withOpacity(0.7),
        borderRadius: BorderRadius.circular(16),
        border: isUnread ? Border.all(color: const Color(0xFF00604C).withOpacity(0.3), width: 1) : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        onTap: () => _markAsRead(n['id']),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: bgColor,
            shape: BoxShape.circle,
          ),
          child: Icon(iconData, color: iconColor, size: 24),
        ),
        title: Text(
          n['title'],
          style: TextStyle(
            fontWeight: isUnread ? FontWeight.w800 : FontWeight.w600,
            fontSize: 15,
            color: isUnread ? Colors.black : Colors.grey[700],
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              n['message'],
              style: TextStyle(fontSize: 13, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              _formatDate(n['created_at']),
              style: TextStyle(fontSize: 11, color: Colors.grey[400]),
            ),
          ],
        ),
        trailing: isUnread
            ? Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Color(0xFF00604C),
                  shape: BoxShape.circle,
                ),
              )
            : null,
      ),
    );
  }

  String _formatDate(String dateStr) {
    final date = DateTime.parse(dateStr);
    return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
