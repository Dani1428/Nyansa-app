import 'dart:convert';
import 'dart:io' as io;
import 'package:crypto/crypto.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:html' as html if (dart.library.io) 'dart:io';
import 'package:encrypt/encrypt.dart' as enc;

/// Represents a queued action waiting to be synced
class QueuedItem {
  final String id;
  final String type;
  final int taskId;
  final String? filePath;
  final String? contentText;
  final double? gpsLat;
  final double? gpsLong;
  final String? deviceId;
  final String deviceModel;
  final String osVersion;
  final Map<String, dynamic>? metadata;
  String status;
  int retryCount;
  final DateTime createdAt;
  String? checksum;
  final int? languageId;
  final int? dialectId;
  final int? promptId;
  final double? duration;

  QueuedItem({
    required this.id,
    required this.type,
    required this.taskId,
    this.filePath,
    this.contentText,
    this.gpsLat,
    this.gpsLong,
    this.deviceId,
    this.deviceModel = 'unknown',
    this.osVersion = 'unknown',
    this.metadata,
    this.status = 'pending_sync',
    this.retryCount = 0,
    required this.createdAt,
    this.checksum,
    this.languageId,
    this.dialectId,
    this.promptId,
    this.duration,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'task_id': taskId,
        'file_path': filePath,
        'content_text': contentText,
        'gps_lat': gpsLat,
        'gps_long': gpsLong,
        'device_id': deviceId,
        'device_model': deviceModel,
        'os_version': osVersion,
        'metadata': metadata,
        'status': status,
        'retry_count': retryCount,
        'created_at': createdAt.toIso8601String(),
        'checksum': checksum,
        'language_id': languageId,
        'dialect_id': dialectId,
        'prompt_id': promptId,
        'duration': duration,
      };

  factory QueuedItem.fromJson(Map<String, dynamic> j) => QueuedItem(
        id: j['id'],
        type: j['type'],
        taskId: j['task_id'],
        filePath: j['file_path'],
        contentText: j['content_text'],
        gpsLat: j['gps_lat']?.toDouble(),
        gpsLong: j['gps_long']?.toDouble(),
        deviceId: j['device_id'],
        deviceModel: j['device_model'] ?? 'unknown',
        osVersion: j['os_version'] ?? 'unknown',
        metadata: j['metadata'] != null ? Map<String, dynamic>.from(j['metadata']) : null,
        status: j['status'],
        retryCount: j['retry_count'] ?? 0,
        createdAt: DateTime.parse(j['created_at']),
        checksum: j['checksum'],
        languageId: j['language_id'],
        dialectId: j['dialect_id'],
        promptId: j['prompt_id'],
        duration: j['duration']?.toDouble(),
      );
}



/// Manages the offline queue persisted as JSON file (Mobile) or LocalStorage (Web)
class OfflineQueueService {
  static const String _queueFileName = 'nyansa_queue.json';
  static const String _webQueueKey = 'nyansa_offline_queue';
  static const int _maxRetries = 3;
  final _uuid = const Uuid();

  // Encryption keys (In production these should be in SecureStorage)
  final _key = enc.Key.fromUtf8('nyansa_32char_key_for_aes_enc_!!');
  final _iv = enc.IV.fromLength(16);

  String _encrypt(String text) {
    final encrypter = enc.Encrypter(enc.AES(_key));
    return encrypter.encrypt(text, iv: _iv).base64;
  }

  String _decrypt(String base64Text) {
    final encrypter = enc.Encrypter(enc.AES(_key));
    return encrypter.decrypt64(base64Text, iv: _iv);
  }

  Future<dynamic> _getQueueFile() async {
    if (kIsWeb) return null;
    final dir = await getApplicationDocumentsDirectory();
    return io.File('${dir.path}/$_queueFileName');
  }

  Future<List<QueuedItem>> _loadQueue() async {
    try {
      String? content;
      if (kIsWeb) {
        content = html.window.localStorage[_webQueueKey];
      } else {
        final file = await _getQueueFile() as io.File;
        if (await file.exists()) {
          content = await file.readAsString();
        }
      }

      if (content == null || content.isEmpty) return [];
      
      // Decrypt
      final decrypted = _decrypt(content);
      final List<dynamic> data = jsonDecode(decrypted);
      return data.map((e) => QueuedItem.fromJson(e)).toList();
    } catch (e) {
      print('Queue load error (decryption failed?): $e');
      return [];
    }
  }

  Future<void> _saveQueue(List<QueuedItem> items) async {
    try {
      final jsonContent = jsonEncode(items.map((e) => e.toJson()).toList());
      // Encrypt
      final encrypted = _encrypt(jsonContent);
      
      if (kIsWeb) {
        html.window.localStorage[_webQueueKey] = encrypted;
      } else {
        final file = await _getQueueFile() as io.File;
        await file.writeAsString(encrypted);
      }
    } catch (e) {
      print('Queue save error: $e');
    }
  }

  /// Compute MD5 checksum of a file for validation
  Future<String?> _computeChecksum(String? filePath) async {
    if (filePath == null || kIsWeb) return null;
    try {
      final bytes = await io.File(filePath).readAsBytes();
      return md5.convert(bytes).toString();
    } catch (_) {
      return null;
    }
  }

  /// Enqueue a new submission for sync
  Future<QueuedItem> enqueue({
    required String type,
    required int taskId,
    String? filePath,
    String? contentText,
    double? gpsLat,
    double? gpsLong,
    String? deviceId,
    String deviceModel = 'unknown',
    String osVersion = 'unknown',
    Map<String, dynamic>? metadata,
    int? languageId,
    int? dialectId,
    int? promptId,
    double? duration,
  }) async {
    final checksum = await _computeChecksum(filePath);
    final item = QueuedItem(
      id: 'local_${_uuid.v4().substring(0, 8)}',
      type: type,
      taskId: taskId,
      filePath: filePath,
      contentText: contentText,
      gpsLat: gpsLat,
      gpsLong: gpsLong,
      deviceId: deviceId,
      deviceModel: deviceModel,
      osVersion: osVersion,
      metadata: metadata,
      status: 'pending_sync',
      createdAt: DateTime.now(),
      checksum: checksum,
      languageId: languageId,
      dialectId: dialectId,
      promptId: promptId,
      duration: duration,
    );

    final queue = await _loadQueue();
    queue.add(item);
    await _saveQueue(queue);
    return item;
  }

  Future<List<QueuedItem>> getPending() async {
    final queue = await _loadQueue();
    return queue.where((i) => i.status == 'pending_sync' && i.retryCount < _maxRetries).toList();
  }

  Future<List<QueuedItem>> getAllPending() async => getPending();

  Future<List<QueuedItem>> getAll() async => _loadQueue();

  Future<void> markSynced(String id) async {
    final queue = await _loadQueue();
    for (var item in queue) {
      if (item.id == id) item.status = 'synced';
    }
    await _saveQueue(queue);
  }

  Future<void> markFailed(String id) async {
    final queue = await _loadQueue();
    for (var item in queue) {
      if (item.id == id) {
        item.retryCount++;
        item.status = item.retryCount >= _maxRetries ? 'failed' : 'pending_sync';
      }
    }
    await _saveQueue(queue);
  }

  Future<int> pendingCount() async {
    final pending = await getPending();
    return pending.length;
  }
}
